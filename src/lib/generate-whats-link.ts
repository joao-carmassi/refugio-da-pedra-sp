import { getInPhoneNumber } from './env';

const generateWhatsLink = (message?: string) => {
  const link = `https://api.whatsapp.com/send?phone=${getInPhoneNumber()}${message ? `&text=${encodeURIComponent(message)}` : ''}`;

  return link;
};

export default generateWhatsLink;
