import type { Advertisement } from '../../types';
import { generateWhatsAppUrl } from '../../utils/whatsapp';

interface ContactSectionProps {
  ad: Advertisement;
}

const ContactSection = ({ ad }: ContactSectionProps) => {
  const handleWhatsApp = () => {
    if (ad.contactPhone) {
      const message = `Hi, I'm interested in your ad: ${ad.title}`;
      const url = generateWhatsAppUrl(ad.contactPhone, message);
      window.open(url, '_blank');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>

      {ad.contactPhone && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Phone</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{ad.contactPhone}</span>
            <button
              onClick={() => copyToClipboard(ad.contactPhone!)}
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
      )}

      {ad.contactEmail && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Email</p>
          <div className="flex items-center gap-2">
            <span className="text-lg">{ad.contactEmail}</span>
            <button
              onClick={() => copyToClipboard(ad.contactEmail!)}
              className="text-indigo-600 hover:text-indigo-700"
              title="Copy email"
            >
              📋
            </button>
          </div>
        </div>
      )}

      {!ad.contactPhone && !ad.contactEmail && (
        <p className="text-gray-500 text-sm">No contact information available</p>
      )}
    </div>
  );
};

export default ContactSection;

