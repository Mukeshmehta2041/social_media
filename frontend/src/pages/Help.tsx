import { useState } from 'react';
import SEOHead from '../components/seo/SEOHead';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I post an advertisement?',
    answer:
      'To post an advertisement, first create an account or log in. Then click on "Post Ad" in the navigation menu. Fill out the multi-step form with your advertisement details, upload images, and submit. Your ad will be reviewed and published once approved.',
  },
  {
    question: 'How long does it take for my ad to be approved?',
    answer:
      'Most advertisements are reviewed and approved within 24-48 hours. Premium or featured ads may be processed faster. You will receive a notification once your ad is approved or if any changes are needed.',
  },
  {
    question: 'Can I edit my advertisement after posting?',
    answer:
      'Yes! You can edit your advertisements at any time. Go to your Dashboard, find the ad you want to edit, and click the edit icon. Make your changes and save. Note that edited ads may need to be re-approved.',
  },
  {
    question: 'How do I delete my advertisement?',
    answer:
      'To delete an advertisement, go to your Dashboard, find the ad you want to delete, and click the delete icon. Confirm the deletion. Once deleted, the ad cannot be recovered.',
  },
  {
    question: 'How do I contact a seller?',
    answer:
      'On any advertisement detail page, you will find the seller\'s contact information including phone number and email. You can also use the "Contact via WhatsApp" button for instant messaging.',
  },
  {
    question: 'What should I do if I see inappropriate content?',
    answer:
      'If you encounter inappropriate content, please use the "Report" button on the advertisement page. Our moderation team will review the report and take appropriate action.',
  },
  {
    question: 'How do I search for specific items?',
    answer:
      'Use the search bar on the homepage or search page. You can filter by category, city, price range, and sort by various criteria. Advanced filters help you find exactly what you\'re looking for.',
  },
  {
    question: 'Can I promote my advertisement?',
    answer:
      'Yes! Premium advertisements get featured placement and more visibility. Click the "Promote" button on your ad in the Dashboard to learn more about promotion options.',
  },
  {
    question: 'Is my personal information safe?',
    answer:
      'We take your privacy seriously. Your contact information is only visible to users viewing your advertisements. We never sell your personal information. Read our Privacy Policy for more details.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Currently, transactions are handled directly between buyers and sellers. We recommend using secure payment methods and meeting in safe, public places for in-person transactions.',
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <SEOHead
        title="Help Center"
        description="Find answers to frequently asked questions about using YourSite. Get help with posting ads, searching, and more."
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Help Center</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-indigo-900">Getting Started</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Create an account</li>
              <li>• Complete your profile</li>
              <li>• Browse categories and cities</li>
              <li>• Post your first advertisement</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-900">Best Practices</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Use clear, descriptive titles</li>
              <li>• Upload high-quality images</li>
              <li>• Provide accurate contact information</li>
              <li>• Respond promptly to inquiries</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-gray-700 mb-4">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </>
  );
};

export default Help;
