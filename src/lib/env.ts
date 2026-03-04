export const getInPhoneNumber = () => {
  const number = process.env.IN_PHONE_NUMBER || '';
  return number;
};
