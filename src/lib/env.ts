export const getInPhoneNumber = () => {
  const number = process.env.NEXT_PUBLIC_IN_PHONE_NUMBER || '';
  return number;
};
