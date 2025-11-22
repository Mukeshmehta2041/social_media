import { generateWhatsAppUrl } from '../../utils/whatsapp';
import type { PaymentRequest } from '../../types';

interface PaymentStatusProps {
  paymentRequest: PaymentRequest;
}

const PaymentStatus = ({ paymentRequest }: PaymentStatusProps) => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+1234567890';
  const message = `Hello, I have a payment request (ID: ${paymentRequest.id}) for ₹${paymentRequest.amount} that is ${paymentRequest.status}. Please verify.`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <div className="mt-1">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(paymentRequest.status)}`}>
              {getStatusLabel(paymentRequest.status)}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Plan</label>
          <p className="mt-1 text-gray-900">{paymentRequest.subscriptionPlan.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Amount</label>
          <p className="mt-1 text-gray-900 font-semibold">₹{paymentRequest.amount.toLocaleString()}</p>
        </div>

        {paymentRequest.paymentMethod && (
          <div>
            <label className="text-sm font-medium text-gray-600">Payment Method</label>
            <p className="mt-1 text-gray-900">{paymentRequest.paymentMethod}</p>
          </div>
        )}

        {paymentRequest.transactionId && (
          <div>
            <label className="text-sm font-medium text-gray-600">Transaction ID</label>
            <p className="mt-1 text-gray-900 font-mono text-sm">{paymentRequest.transactionId}</p>
          </div>
        )}

        {paymentRequest.paidAt && (
          <div>
            <label className="text-sm font-medium text-gray-600">Paid At</label>
            <p className="mt-1 text-gray-900">
              {new Date(paymentRequest.paidAt).toLocaleString()}
            </p>
          </div>
        )}

        {paymentRequest.adminNotes && (
          <div>
            <label className="text-sm font-medium text-gray-600">Admin Notes</label>
            <p className="mt-1 text-gray-900">{paymentRequest.adminNotes}</p>
          </div>
        )}

        {paymentRequest.status === 'pending' && (
          <div className="pt-4 border-t">
            <a
              href={generateWhatsAppUrl(whatsappNumber, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Admin
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;

