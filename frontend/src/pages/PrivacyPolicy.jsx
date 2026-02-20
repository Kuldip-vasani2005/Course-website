import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      {/* Header */}
      <section className="policy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: February 2026</p>
      </section>

      {/* Content */}
      <section className="policy-content">
        <div className="policy-section">
          <h2>1. Introduction</h2>
          <p>
            EduHub ("we," "us," "our," or "Company") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website and use our services.
          </p>
        </div>

        <div className="policy-section">
          <h2>2. Information We Collect</h2>
          <p>We collect information in the following ways:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, password, phone number, and profile information</li>
            <li><strong>Course Information:</strong> Courses you enroll in, progress, and completion status</li>
            <li><strong>Payment Information:</strong> Billing address and transaction history (processed securely)</li>
            <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, and time spent</li>
            <li><strong>Cookies and Tracking:</strong> We use cookies to enhance user experience</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions and send you related information</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect and prevent fraud and other illegal activities</li>
            <li>Personalize your learning experience</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>4. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share your 
            information only in the following cases:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To service providers who help us operate our platform</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With instructors for course purposes</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the Internet is 100% secure.
          </p>
        </div>

        <div className="policy-section">
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request data portability</li>
            <li>Lodge a complaint with authorities</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>7. Retention of Information</h2>
          <p>
            We retain personal information for as long as necessary to provide our services and 
            fulfill the purposes outlined in this policy. You may request deletion of your account 
            at any time.
          </p>
        </div>

        <div className="policy-section">
          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly collect personal 
            information from children under 13. If we become aware of such collection, we will take 
            immediate action to delete the information.
          </p>
        </div>

        <div className="policy-section">
          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for their 
            privacy practices. We encourage you to review their privacy policies before sharing information.
          </p>
        </div>

        <div className="policy-section">
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant 
            changes via email or by posting a notice on our website.
          </p>
        </div>

        <div className="policy-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:<br/>
            <strong>Email:</strong> privacy@eduhub.com<br/>
            <strong>Address:</strong> 123 Learning Street, Education City, EC 12345
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
