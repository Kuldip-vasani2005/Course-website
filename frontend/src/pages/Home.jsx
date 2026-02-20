import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [popularMentors, setPopularMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, mentorsRes] = await Promise.all([
        axios.get('/courses/popular/list'),
        axios.get('/student/popular-mentors'),
      ]);
      setPopularCourses(coursesRes.data.courses);
      setPopularMentors(mentorsRes.data.mentors);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { number: '50K+', label: 'Active Learners', icon: '👥' },
    { number: '500+', label: 'Courses', icon: '📚' },
    { number: '1K+', label: 'Expert Mentors', icon: '👨‍🏫' },
    { number: '95%', label: 'Satisfaction', icon: '⭐' },
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Learn at Your Pace',
      description: 'Complete courses at your own speed with lifetime access to course materials.',
    },
    {
      icon: '🏆',
      title: 'Expert Instructors',
      description: 'Learn from industry experts with years of practical experience.',
    },
    {
      icon: '💡',
      title: 'Practical Projects',
      description: 'Work on real-world projects to build your portfolio.',
    },
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'Connect with fellow learners and get support from mentors.',
    },
  ];

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Software Developer',
      text: 'This platform helped me transition into tech. The courses are well-structured and mentors are supportive.',
      rating: 5,
    },
    {
      name: 'Sarah Smith',
      role: 'Product Manager',
      text: 'Great platform for upskilling! The content is current and the instructors are knowledgeable.',
      rating: 5,
    },
    {
      name: 'Mike Johnson',
      role: 'Data Scientist',
      text: 'Excellent courses with practical applications. Highly recommended for anyone serious about learning.',
      rating: 5,
    },
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Welcome back, {user?.name}! 👋</span>
            <h1>Master New Skills with Expert Guidance</h1>
            <p>Access hundreds of courses from industry experts. Learn anything, anytime, anywhere.</p>
            <div className="hero-buttons">
              <Link to="/courses" className="hero-btn primary">Start Learning Now</Link>
              <Link to="/courses" className="hero-btn secondary">Explore Courses</Link>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-box">📚</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="section-header">
          <h2>Why Choose EduPlatform?</h2>
          <p>Everything you need to achieve your learning goals</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="section popular-courses-section">
        <div className="section-header">
          <h2>Popular Courses</h2>
          <p>Discover the most trending courses this month</p>
        </div>
        <div className="courses-grid">
          {popularCourses.map((course) => (
            <Link to={`/courses/${course._id}`} key={course._id} className="course-card">
              <div className="course-image">
                <img src={course.thumbnailUrl} alt={course.title} />
                <div className="course-badge">${course.price}</div>
              </div>
              <div className="course-info">
                <h3>{course.title}</h3>
                <p className="mentor-name">by {course.mentorId?.name}</p>
                <div className="course-meta">
                  <span className="rating">⭐ 4.8</span>
                  <span className="students">{course.enrollments?.length || 0} enrolled</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-center">
          <Link to="/courses" className="view-more-btn">View All Courses →</Link>
        </div>
      </section>

      {/* Popular Mentors Section */}
      <section className="section mentors-section">
        <div className="section-header">
          <h2>Expert Mentors</h2>
          <p>Learn from the best instructors in the industry</p>
        </div>
        <div className="mentors-grid">
          {popularMentors.map((mentor) => (
            <div key={mentor._id} className="mentor-card">
              <div className="mentor-avatar">{mentor.name.charAt(0).toUpperCase()}</div>
              <h3>{mentor.name}</h3>
              <p className="mentor-courses">{mentor.courses?.length || 0} Courses</p>
              <p className="mentor-students">{mentor.studentCount || 0}+ Students</p>
              <div className="mentor-rating">⭐ 4.9</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="section-header">
          <h2>What Our Students Say</h2>
          <p>Join thousands of satisfied learners</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={`testimonial-${testimonial.name}-${idx}`} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={`star-${idx}-${i}`}>⭐</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.name.charAt(0)}</div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Only show if not logged in */}
      {!user && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students learning something new every day.</p>
            <Link to="/register" className="cta-btn">Get Started Free</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
 