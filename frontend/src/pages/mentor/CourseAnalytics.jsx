import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import './CourseAnalytics.css';

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrollments');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // If this is an optimistic temporary course id (created client-side),
      // skip backend calls that expect a real DB id to avoid 500 errors.
      if (courseId && courseId.startsWith('temp-')) {
        // Try to load any optimistic data from sessionStorage, otherwise show placeholder
        let tempCourse = null;
        try {
          const raw = sessionStorage.getItem('latestCreatedCourse');
          if (raw) tempCourse = JSON.parse(raw);
        } catch (e) {
          tempCourse = null;
        }

        setCourse(
          tempCourse || {
            title: 'Uploading course...',
            averageRating: 0,
          }
        );
        setEnrollments([]);
        setReviews([]);
        return;
      }

      const [courseRes, enrollmentsRes, reviewsRes] = await Promise.all([
        axios.get(`/courses/${courseId}`),
        axios.get(`/mentor/courses/${courseId}/enrollments`),
        axios.get(`/mentor/courses/${courseId}/reviews`),
      ]);

      setCourse(courseRes.data.course);
      setEnrollments(enrollmentsRes.data.enrollments);
      setReviews(reviewsRes.data.reviews);
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      alert(error.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="course-analytics">
      <div className="analytics-header">
        <Link to="/mentor/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>{course.title}</h1>
        <div className="course-stats">
          <div className="stat">
            <span className="stat-label">Total Enrollments</span>
            <span className="stat-value">{enrollments.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{reviews.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average Rating</span>
            <span className="stat-value">⭐ {course.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'enrollments' ? 'active' : ''}`}
          onClick={() => setActiveTab('enrollments')}
        >
          Students Enrolled ({enrollments.length})
        </button>
        <button
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'enrollments' && (
          <div className="enrollments-section">
            {enrollments.length === 0 ? (
              <div className="empty-state">
                <p>No students enrolled yet</p>
              </div>
            ) : (
              <div className="enrollments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.student.name}</td>
                        <td>{enrollment.student.email}</td>
                        <td>{formatDate(enrollment.purchaseDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {reviews.length === 0 ? (
              <div className="empty-state">
                <p>No reviews yet</p>
              </div>
            ) : (
              <div className="reviews-grid">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="student-info">
                        <div className="student-avatar">
                          {review.student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4>{review.student.name}</h4>
                          <p className="review-date">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseAnalytics;
