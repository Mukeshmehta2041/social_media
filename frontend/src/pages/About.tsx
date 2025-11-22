import SEOHead from '../components/seo/SEOHead';

const About = () => {
  return (
    <>
      <SEOHead
        title="About Us"
        description="Learn about YourSite - your trusted platform for classified advertisements. Our mission, values, and commitment to connecting buyers and sellers."
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At YourSite, we believe in making buying and selling simple, safe, and accessible
              to everyone. Our platform connects buyers and sellers in a trusted environment,
              enabling seamless transactions and meaningful connections.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you're looking to sell items you no longer need, find great deals, or
              discover services in your area, we're here to help you every step of the way.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Easy-to-use platform for posting and browsing advertisements</li>
              <li>Advanced search and filtering options to find exactly what you need</li>
              <li>Location-based listings to discover local opportunities</li>
              <li>Secure communication channels between buyers and sellers</li>
              <li>Mobile-responsive design for access anywhere, anytime</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">Trust & Safety</h3>
                <p className="text-gray-700">
                  We prioritize the safety and security of our users, implementing robust
                  verification and moderation systems.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">User Experience</h3>
                <p className="text-gray-700">
                  We continuously improve our platform to provide the best possible experience
                  for both buyers and sellers.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">Community</h3>
                <p className="text-gray-700">
                  We foster a strong community where users can connect, share, and help each
                  other succeed.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">Innovation</h3>
                <p className="text-gray-700">
                  We embrace new technologies and features to stay ahead and serve our users
                  better.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <a
              href="/contact"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Get in Touch
            </a>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
