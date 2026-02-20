import './Terms.css';

const Terms = () => {
  return (
    <div className="policy-container">
      {/* Header */}
      <section className="policy-header">
        <h1>Terms of Service</h1>
        <p>Last updated: February 2026</p>
      </section>

      {/* Content */}
      <section className="policy-content">
        <div className="policy-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using EduHub, you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to abide by the above, please do 
            not use this service.
          </p>
        </div>

        <div className="policy-section">
          <h2>2. License to Use Website</h2>
          <p>
            EduHub grants you a limited license to access and use our website and services for 
            educational purposes. This license is non-exclusive, non-transferable, and subject 
            to these terms.
          </p>
        </div>

        <div className="policy-section">
          <h2>3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Use the platform only for lawful purposes</li>
            <li>Not engage in any form of harassment or abuse</li>
            <li>Not attempt to gain unauthorized access</li>
            <li>Respect intellectual property rights</li>
            <li>Not upload malicious or harmful content</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>4. Course Content</h2>
          <p>
            All course materials, including videos, texts, and exercises, are provided "as is" 
            for educational purposes. EduHub does not guarantee specific results or outcomes. 
            The success of your learning depends on your effort and dedication.
          </p>
        </div>

        <div className="policy-section">
          <h2>5. Enrollment and Refunds</h2>
          <p>
            <strong>Enrollment:</strong> When you enroll in a course, you gain access for the 
            duration specified. Access may be revoked if you violate these terms.<br/><br/>
            <strong>Refunds:</strong> Refunds are available within 7 days of purchase if the 
            course has not been substantially accessed.
          </p>
        </div>

        <div className="policy-section">
          <h2>6. Intellectual Property Rights</h2>
          <p>
            All content on EduHub, including course materials, is the property of EduHub or 
            our instructors. You may not reproduce, distribute, or transmit any content without 
            explicit permission. Unauthorized use may result in legal action.
          </p>
        </div>

        <div className="policy-section">
          <h2>7. User-Generated Content</h2>
          <p>
            By posting content (comments, reviews, etc.) on our platform, you grant EduHub 
            a royalty-free, perpetual license to use and display such content. You remain 
            responsible for any content you post.
          </p>
        </div>

        <div className="policy-section">
          <h2>8. Limitation of Liability</h2>
          <p>
            EduHub shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising from your use of or inability to use the service, 
            even if we have been advised of the possibility of such damages.
          </p>
        </div>

        <div className="policy-section">
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            The service is provided on an "as is" basis. EduHub makes no representations or 
            warranties of any kind, express or implied, as to the operation of the website or 
            the information, content, or materials included on the website.
          </p>
        </div>

        <div className="policy-section">
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless EduHub, its officers, directors, employees, 
            and agents from any claims, damages, losses, and expenses arising from your violation 
            of these terms or your use of the platform.
          </p>
        </div>

        <div className="policy-section">
          <h2>11. Termination</h2>
          <p>
            EduHub may terminate or suspend your access to the platform at any time for violations 
            of these terms or for any reason at our sole discretion.
          </p>
        </div>

        <div className="policy-section">
          <h2>12. Modifications to Terms</h2>
          <p>
            EduHub reserves the right to modify these terms at any time. Changes become effective 
            immediately upon posting. Your continued use constitutes acceptance of modified terms.
          </p>
        </div>

        <div className="policy-section">
          <h2>13. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the 
            United States, and you irrevocably submit to the exclusive jurisdiction of the 
            courts in that location.
          </p>
        </div>

        <div className="policy-section">
          <h2>14. Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us at:<br/>
            <strong>Email:</strong> legal@eduhub.com<br/>
            <strong>Address:</strong> 123 Learning Street, Education City, EC 12345
          </p>
        </div>
      </section>
    </div>
  );
};

export default Terms;
