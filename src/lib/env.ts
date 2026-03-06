export const getInPhoneNumber = () => {
  const number = process.env.NEXT_PUBLIC_IN_PHONE_NUMBER || '';
  return number;
};

export const getSiteUrl = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || '';
  return url;
};
