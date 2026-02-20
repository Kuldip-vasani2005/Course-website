import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import './MyCourses.css';

const MyCourses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('/enrollments/my-courses');
      setEnrollments(response.data.enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/reviews', {
        courseId: selectedCourse._id,
        rating: review.rating,
        comment: review.comment,
      });
      alert('Review submitted successfully!');
      setSelectedCourse(null);
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-courses">
      <h1>My Courses</h1>
      {enrollments.length === 0 ? (
        <p>You haven't enrolled in any courses yet.</p>
      ) : (
        <div className="courses-grid">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="enrolled-course-card">
              <img src={enrollment.courseId.thumbnailUrl} alt={enrollment.courseId.title} />
              <div className="course-info">
                <h3>{enrollment.courseId.title}</h3>
                <p>By {enrollment.courseId.mentorId.name}</p>
                <div className="course-actions">
                  <a href={enrollment.courseId.videoUrl} target="_blank" rel="noopener noreferrer" className="watch-btn">
                    Watch Course
                  </a>
                  <button onClick={() => setSelectedCourse(enrollment.courseId)} className="review-btn">
                    Leave Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Review: {selectedCourse.title}</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating</label>
                <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  required
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Submit Review</button>
                <button type="button" onClick={() => setSelectedCourse(null)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
