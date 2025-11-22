export const generateWhatsAppUrl = (phone: string, message: string): string => {
  // Remove all non-numeric characters except +
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

