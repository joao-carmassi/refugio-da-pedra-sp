#!/usr/bin/env node
/**
 * Pings the IndexNow API (shared by Bing and Yandex) so recently changed
 * pages get re-crawled quickly, instead of waiting for the next organic
 * crawl pass.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs
 *   npm run indexnow
 *
 * Requires the following env vars (see .env.example):
 *   NEXT_PUBLIC_SITE_URL  - e.g. https://refugiodapedrasp.com.br
 *   INDEXNOW_KEY          - must match public/<INDEXNOW_KEY>.txt
 *
 * The URL list is reconstructed statically (no running server required) by
 * mirroring the same data sources used in src/app/sitemap.ts: the chalés
 * dataset and the blog post markdown files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import slugify from 'slugify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

function fail(message) {
  console.error(`[indexnow] ${message}`);
  process.exit(1);
}

if (!SITE_URL) {
  fail('NEXT_PUBLIC_SITE_URL is not set. Add it to your environment or .env file.');
}

if (!INDEXNOW_KEY) {
  fail('INDEXNOW_KEY is not set. Add it to your environment or .env file.');
}

const baseUrl = SITE_URL.replace(/\/$/, '');
const host = new URL(baseUrl).host;

function getChaleUrls() {
  const chalesPath = path.join(rootDir, 'src', 'data', 'chales.json');
  const chales = JSON.parse(fs.readFileSync(chalesPath, 'utf8'));

  return chales.map(
    (chale) =>
      `${baseUrl}/chales/${slugify(chale.nome, { lower: true, strict: true })}/`
  );
}

function getPostUrls() {
  const postsDirectory = path.join(rootDir, 'src', 'data', 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => `${baseUrl}/blog/${fileName.replace(/\.md$/, '')}/`);
}

// Must stay in sync with src/app/sitemap.ts. Every URL carries a trailing slash
// because next.config.ts sets `trailingSlash: true` — a slash-less URL 308s.
function buildUrlList() {
  return [
    `${baseUrl}/`,
    `${baseUrl}/chales/`,
    ...getChaleUrls(),
    `${baseUrl}/reservar/`,
    `${baseUrl}/sobre/`,
    `${baseUrl}/mapa-turistico/`,
    `${baseUrl}/mapa/`,
    `${baseUrl}/blog/`,
    ...getPostUrls(),
    `${baseUrl}/politica-de-privacidade/`,
  ];
}

async function submit() {
  const urlList = buildUrlList();

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  console.log(
    `[indexnow] Submitting ${urlList.length} URLs for host "${host}" to IndexNow...`
  );

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    console.log(
      `[indexnow] Success (${response.status}). URLs submitted for fast reindexing.`
    );
    return;
  }

  const responseText = await response.text().catch(() => '');
  fail(
    `Submission failed with status ${response.status} ${response.statusText}. ${responseText}`
  );
}

submit().catch((error) => {
  fail(`Unexpected error: ${error.message}`);
});
