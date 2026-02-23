import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const enrollmentsRes = await axios.get('/enrollments/my-courses');

      const enrollmentData = enrollmentsRes.data.enrollments || [];
      setEnrollments(enrollmentData);

      const totalCourses = enrollmentData.length;
      const hoursCompleted = totalCourses * 12;

      setStats({
        totalCourses,
        hoursCompleted,
        averageRating: 4.8,
        completionRate: 65,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">

      {/* HERO SECTION */}
      <section className="welcome-section">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Continue learning and build your future 🚀</p>
        </div>

        <Link to="/courses" className="explore-btn">
          Explore Courses
        </Link>
      </section>

      {/* STATS SECTION */}
      {stats && (
        <section className="stats-section">
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <h3>{stats.totalCourses}</h3>
              <p>Courses Enrolled</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <h3>{stats.hoursCompleted}+</h3>
              <p>Hours Completed</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <h3>{stats.averageRating}</h3>
              <p>Average Rating</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <h3>{stats.completionRate}%</h3>
              <p>Completion Rate</p>
            </div>

          </div>
        </section>
      )}

      {/* COURSES SECTION */}
      <section className="dashboard-content">

        <div className="section-header">
          <h2>📘 Currently Learning</h2>
          <Link to="/my-courses" className="view-all">
            View All →
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No courses enrolled yet</h3>
            <Link to="/courses" className="explore-btn">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollments.slice(0, 3).map((enrollment) => (
              <div key={enrollment._id} className="course-card">

                <img
                  src={enrollment.courseId.thumbnailUrl}
                  alt={enrollment.courseId.title}
                />

                <div className="course-content">
                  <h3>{enrollment.courseId.title}</h3>

                  <button
                    onClick={() => navigate('/my-courses')}
                    className="details-btn"
                  >
                    Continue →
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

    </div>
  );
};

export default StudentDashboard;
