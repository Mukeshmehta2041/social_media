import type { Advertisement } from '../../types';
import { generateWhatsAppUrl } from '../../utils/whatsapp';

interface ContactSectionProps {
  ad: Advertisement;
}

const ContactSection = ({ ad }: ContactSectionProps) => {
  // Use contactPhone or whatsappNumber
  const phoneNumber = ad.contactPhone || ad.whatsappNumber;
  const email = ad.contactEmail || ad.user?.email;

  const handleWhatsApp = () => {
    if (phoneNumber) {
      const message = `Hi, I'm interested in your ad: ${ad.title}`;
      const url = generateWhatsAppUrl(phoneNumber, message);
      window.open(url, '_blank');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>

      {phoneNumber ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Phone</p>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${phoneNumber}`}
              className="text-lg font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {phoneNumber}
            </a>
            <button
              onClick={() => copyToClipboard(phoneNumber)}
              className="text-indigo-600 hover:text-indigo-700"
              title="Copy phone number"
            >
              📋
            </button>
          </div>
          <button
            onClick={handleWhatsApp}
            className="w-full mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
          >
            <span>💬</span>
            Contact via WhatsApp
          </button>
        </div>
      ) : null}

      {email ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Email</p>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${email}`}
              className="text-lg text-indigo-600 hover:text-indigo-800 break-all"
            >
              {email}
            </a>
            <button
              onClick={() => copyToClipboard(email)}
              className="text-indigo-600 hover:text-indigo-700 flex-shrink-0"
              title="Copy email"
            >
              📋
            </button>
          </div>
        </div>
      ) : null}

      {!phoneNumber && !email && (
        <p className="text-gray-500 text-sm">No contact information available</p>
      )}
    </div>
  );
};

export default ContactSection;

