import { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const faqItems = [
    {
      id: 1,
      category: 'General',
      question: 'What is EduHub?',
      answer: 'EduHub is an online learning platform that offers a wide range of courses taught by industry experts. Our mission is to make quality education accessible to everyone worldwide.'
    },
    {
      id: 2,
      category: 'General',
      question: 'How do I get started?',
      answer: 'Simply create an account, browse our course catalog, and enroll in the courses that interest you. You can start learning immediately after enrollment.'
    },
    {
      id: 3,
      category: 'Courses',
      question: 'How long do I have access to a course?',
      answer: 'Once you enroll, you have lifetime access to the course materials. You can learn at your own pace and revisit lessons whenever you need.'
    },
    {
      id: 4,
      category: 'Courses',
      question: 'What if I don\'t like a course?',
      answer: 'We offer a 7-day refund guarantee. If the course doesn\'t meet your expectations, you can request a full refund within 7 days of purchase.'
    },
    {
      id: 5,
      category: 'Courses',
      question: 'Are there certificates?',
      answer: 'Yes! Upon completing a course, you receive a professional certificate that you can share on LinkedIn and add to your resume.'
    },
    {
      id: 6,
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and digital payment methods through our secure payment gateway.'
    },
    {
      id: 7,
      category: 'Payment',
      question: 'Are there any discounts available?',
      answer: 'Yes! We offer seasonal promotions, bundle discounts, and special pricing for students. Subscribe to our newsletter for exclusive deals.'
    },
    {
      id: 8,
      category: 'Account',
      question: 'Can I change my email or password?',
      answer: 'Yes, you can update your email and password anytime in your account settings. Go to Account Settings and make the necessary changes.'
    },
    {
      id: 9,
      category: 'Account',
      question: 'How do I delete my account?',
      answer: 'You can request account deletion from your account settings. Please note that this action is permanent and cannot be undone.'
    },
    {
      id: 10,
      category: 'Technical',
      question: 'What are the system requirements?',
      answer: 'You need a modern web browser and an internet connection. EduHub works on desktop, tablet, and mobile devices.'
    },
    {
      id: 11,
      category: 'Technical',
      question: 'Do you have a mobile app?',
      answer: 'Yes! Download our mobile app from the App Store or Google Play to learn on the go.'
    },
    {
      id: 12,
      category: 'Support',
      question: 'How can I contact support?',
      answer: 'You can reach our support team via email at support@eduhub.com or use the contact form on our website. We typically respond within 24-48 hours.'
    }
  ];

  const categories = ['All', ...new Set(faqItems.map(item => item.category))];

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="faq-container">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="hero-content">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about EduHub</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="faq-wrapper">
          {/* Accordion */}
          <div className="accordion">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className={`accordion-item ${openAccordion === item.id ? 'active' : ''}`}
              >
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(item.id)}
                >
                  <span className="question">{item.question}</span>
                  <span className="toggle-icon">
                    {openAccordion === item.id ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === item.id && (
                  <div className="accordion-body">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="still-questions">
        <div className="questions-content">
          <h2>Still Have Questions?</h2>
          <p>Can't find the answer you're looking for? Please contact our support team.</p>
          <a href="/contact" className="contact-btn">Get in Touch</a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
