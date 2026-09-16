import fs from 'fs';
import path from 'path';

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Dimensões reais de uma imagem em `public/`, lidas do cabeçalho do arquivo no
 * build (sem dependência nova: WebP, PNG e JPEG).
 * Retorna `null` quando o arquivo não existe ou o formato não é reconhecido —
 * quem consome omite `width`/`height`, porque valor errado é pior que ausente.
 */
export function getPublicImageSize(publicPath: string): ImageSize | null {
  const filePath = path.join(process.cwd(), 'public', publicPath);

  let buffer: Buffer;
  try {
    buffer = fs.readFileSync(filePath);
  } catch {
    return null;
  }

  // PNG: assinatura de 8 bytes, depois o chunk IHDR com largura e altura.
  if (
    buffer.length >= 24 &&
    buffer.readUInt32BE(0) === 0x89504e47 &&
    buffer.toString('ascii', 12, 16) === 'IHDR'
  ) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // JPEG (alguns `.webp` do site são JPEG renomeado): percorre os marcadores
  // até um SOF, que guarda altura e largura em 16 bits big-endian.
  if (buffer.length >= 4 && buffer.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) return null;
      const marker = buffer[offset + 1];
      if (marker === 0xff) {
        offset += 1;
        continue;
      }
      const isSof =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isSof) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
    return null;
  }

  if (
    buffer.length < 30 ||
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return null;
  }

  const chunk = buffer.toString('ascii', 12, 16);

  // VP8X (formato estendido): largura-1 e altura-1 em 24 bits little-endian.
  if (chunk === 'VP8X') {
    return {
      width: buffer.readUIntLE(24, 3) + 1,
      height: buffer.readUIntLE(27, 3) + 1,
    };
  }

  // VP8 (lossy): 14 bits de largura e altura depois do start code do quadro.
  if (chunk === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  // VP8L (lossless): 14 bits cada, largura-1 e altura-1, após o byte 0x2f.
  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}
