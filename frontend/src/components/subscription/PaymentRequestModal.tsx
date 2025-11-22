import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { generateWhatsAppUrl } from '../../utils/whatsapp';
import type { SubscriptionPlan, Advertisement, PaymentRequest } from '../../types';

interface PaymentRequestModalProps {
  plan: SubscriptionPlan;
  advertisement: Advertisement;
  onClose: () => void;
  onSuccess: (paymentRequest: PaymentRequest) => void;
}

const PaymentRequestModal = ({ plan, advertisement, onClose, onSuccess }: PaymentRequestModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+1234567890';
  const message = `Hello, I want to pay for subscription plan: ${plan.name} (₹${plan.price}) for my advertisement: ${advertisement.title} (ID: ${advertisement.id})`;

  const createPaymentRequestMutation = useMutation({
    mutationFn: async (data: {
      advertisement: number;
      subscriptionPlan: number;
      amount: number;
      paymentMethod?: string;
      transactionId?: string;
      paymentProof?: number;
    }) => {
      let proofFileId: number | undefined;

      // Upload payment proof if provided
      if (paymentProof) {
        const formData = new FormData();
        formData.append('files', paymentProof);

        const uploadResponse = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        proofFileId = uploadResponse.data[0]?.id;
      }

      const paymentData = {
        data: {
          advertisement: data.advertisement,
          subscriptionPlan: data.subscriptionPlan,
          amount: data.amount,
          paymentMethod: data.paymentMethod || undefined,
          transactionId: data.transactionId || undefined,
          paymentProof: proofFileId || undefined,
        },
      };

      const response = await api.post('/payment-requests', paymentData);
      return response.data;
    },
    onSuccess: (data) => {
      onSuccess(data.data);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to create payment request');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    await createPaymentRequestMutation.mutateAsync({
      advertisement: advertisement.id,
      subscriptionPlan: plan.id,
      amount: plan.price,
      paymentMethod: paymentMethod || undefined,
      transactionId: transactionId || undefined,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Selected Plan</h3>
            <p className="text-lg font-bold text-indigo-600">{plan.name}</p>
            <p className="text-gray-700">
              ₹{plan.price.toLocaleString()} - {plan.postLimit} posts
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method (Optional)
              </label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., UPI, Bank Transfer, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter transaction ID if available"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Proof (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {paymentProof && (
                <p className="mt-2 text-sm text-gray-600">Selected: {paymentProof.name}</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> After submitting, please contact the admin via WhatsApp to complete the payment verification process.
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href={generateWhatsAppUrl(whatsappNumber, message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-center font-semibold"
              >
                Contact Admin via WhatsApp
              </a>
              <button
                type="submit"
                disabled={createPaymentRequestMutation.isPending}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {createPaymentRequestMutation.isPending ? 'Submitting...' : 'Submit Payment Request'}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequestModal;

