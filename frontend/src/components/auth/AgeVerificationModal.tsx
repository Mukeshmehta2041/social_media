import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Check if user has already confirmed age
    const hasConfirmed = localStorage.getItem('ageVerified');
    if (!hasConfirmed) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (ageConfirmed && termsAccepted) {
      localStorage.setItem('ageVerified', 'true');
      setIsOpen(false);
    }
  };

  const handleDecline = () => {
    // Redirect to a safe page or show message
    window.location.href = 'https://www.google.com';
  };

  return (
    <Dialog open={isOpen} onClose={() => { }} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-2xl font-bold mb-4 text-center">
            18+
          </Dialog.Title>

          <div className="mb-6">
            <p className="text-gray-700 mb-4 text-center font-semibold">
              Please read the following notice before you continue
            </p>
            <p className="text-gray-600 mb-4">
              <strong>I confirm that I am 18</strong> or above and acknowledge my consent to access mature content, including explicit texts and images.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700">
                I confirm that I am 18 or above
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700">
                I have reviewed and agree to abide by the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline"
                >
                  Terms and Conditions
                </a>
              </span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!ageConfirmed || !termsAccepted}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AgeVerificationModal;

