import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About EduHub</h1>
          <p>Empowering learners worldwide with quality education</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="section-content">
          <div className="section-text">
            <h2>Our Mission</h2>
            <p>
              At EduHub, we believe that education is the key to unlocking human potential. 
              Our mission is to make high-quality education accessible to everyone, everywhere, 
              at any time. We're committed to breaking down barriers and creating opportunities 
              for learners of all backgrounds.
            </p>
          </div>
          <div className="section-image">
            <div className="image-placeholder">🎯</div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-section alternate">
        <div className="section-content">
          <div className="section-image">
            <div className="image-placeholder">🚀</div>
          </div>
          <div className="section-text">
            <h2>Our Vision</h2>
            <p>
              We envision a world where anyone can learn anything they want to become 
              the best version of themselves. Through innovative learning methods and expert 
              instruction, we're building a global community of lifelong learners.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>We continuously evolve our platform to deliver the best learning experience</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Community</h3>
            <p>We foster a supportive environment where learners help each other grow</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⭐</div>
            <h3>Excellence</h3>
            <p>We maintain the highest standards in course content and instruction</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Accessibility</h3>
            <p>We make quality education affordable and available to all</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>50K+</h3>
            <p>Active Learners</p>
          </div>
          <div className="stat-card">
            <h3>500+</h3>
            <p>Courses</p>
          </div>
          <div className="stat-card">
            <h3>1K+</h3>
            <p>Expert Mentors</p>
          </div>
          <div className="stat-card">
            <h3>95%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join thousands of students who have transformed their careers with EduHub</p>
        <Link to="/courses" className="cta-btn">Explore Courses</Link>
      </section>
    </div>
  );
};

export default About;
