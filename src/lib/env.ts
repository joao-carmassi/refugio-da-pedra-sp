export const getInPhoneNumber = () => {
  const number = process.env.NEXT_PUBLIC_IN_PHONE_NUMBER || '';
  return number;
};

export const getSiteUrl = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (!url && process.env.NODE_ENV === 'production') {
    console.warn(
      'NEXT_PUBLIC_SITE_URL is not set — canonical URLs, sitemap, and OG tags will be broken.',
    );
  }
  return url;
};
