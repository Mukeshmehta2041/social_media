import SEOHead from '../components/seo/SEOHead';

const Terms = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service"
        description="Read our Terms of Service to understand the rules and guidelines for using YourSite platform."
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using YourSite, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above,
              please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily access the materials on YourSite for
              personal, non-commercial transitory viewing only. This is the grant of a license,
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Accept all responsibility for activity under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Prohibited Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to post content that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Is illegal, harmful, or violates any laws</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains false or misleading information</li>
              <li>Is spam, unsolicited, or promotional</li>
              <li>Contains viruses or malicious code</li>
              <li>Is discriminatory, hateful, or offensive</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Content Moderation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to review, edit, or remove any content at our sole
              discretion. We may suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              YourSite acts as a platform connecting buyers and sellers. We are not
              responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>The accuracy of listings or user-provided information</li>
              <li>The quality, safety, or legality of items listed</li>
              <li>The ability of sellers to complete transactions</li>
              <li>Disputes between buyers and sellers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Your continued use of
              the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms of Service, please contact us through
              our <a href="/contact" className="text-indigo-600 hover:underline">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Terms;
