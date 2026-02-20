import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import "./CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stripeBlocked, setStripeBlocked] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, reviewsRes] = await Promise.all([
        axios.get(`/courses/${id}`),
        axios.get(`/reviews/${id}`),
      ]);

      setCourse(courseRes.data.course);
      setReviews(reviewsRes.data.reviews);

      if (user?.role === "student") {
        const enrollRes = await axios.get(`/enrollments/check/${id}`);
        setIsEnrolled(enrollRes.data.isEnrolled);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) return navigate("/login");

    setEnrolling(true);
    try {
      const res = await axios.post("/enrollments/checkout", {
        courseId: id,
      });

      const url = res.data.url;

      if (url) {
        window.location.href = url;
      } else {
        alert("Checkout session failed");
      }
    } catch (err) {
      console.error(err);
      setStripeBlocked(true);
      alert("Payment blocked. Disable ad-blocker.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="loading">Loading course...</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="course-details">
      {/* HERO SECTION */}
      <div className="course-hero">
        <div className="hero-container">
          {/* LEFT CONTENT */}
          <div className="hero-left">
            <div className="breadcrumb">
              Home / Courses / {course.title}
            </div>

            <h1 className="course-title">{course.title}</h1>

            {/* STATS */}
            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-value">4.8</span>
                <span className="stat-label">({reviews.length} reviews)</span>
              </div>

              <div className="stat-box">
                <span className="stat-value">{course.totalEnrollments || 0}</span>
                <span className="stat-label">Students</span>
              </div>

              <div className="stat-box">
                <span className="stat-value">12 Weeks</span>
                <span className="stat-label">Duration</span>
              </div>
            </div>

            {/* PRICE AND BUTTON */}
            <div className="price-section">
              <div className="price-container">
                <span className="current-price">${course.price}</span>
                <span className="original-price">$199.99</span>
                <span className="discount-badge">Save 50%</span>
              </div>
              
              <button 
                onClick={handleEnroll} 
                className="enroll-btn"
                disabled={enrolling}
              >
                {enrolling ? "Processing..." : "Enroll Now →"}
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-right">
            <img 
              src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f4f68e0b9a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"} 
              alt={course.title} 
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="course-main">
        <div className="main-container">
          {/* TABS */}
          <div className="content-tabs">
            <button 
              className={`tab-btn ${activeTab === "overview" ? 'active' : ''}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === "curriculum" ? 'active' : ''}`}
              onClick={() => setActiveTab("curriculum")}
            >
              Curriculum
            </button>
            <button 
              className={`tab-btn ${activeTab === "instructor" ? 'active' : ''}`}
              onClick={() => setActiveTab("instructor")}
            >
              Instructor
            </button>
            <button 
              className={`tab-btn ${activeTab === "reviews" ? 'active' : ''}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            {activeTab === "overview" && (
              <div className="overview-tab">
                <div className="about-section">
                  <h2>About This Course</h2>
                  <p>{course.description}</p>
                </div>

                <div className="learning-section">
                  <h2>What You'll Learn</h2>
                  <div className="learning-grid">
                    {[
                      "Build real-world applications",
                      "Master modern development practices",
                      "Implement authentication & authorization",
                      "Deploy applications to production",
                      "Optimize performance & security",
                      "Work with databases & APIs"
                    ].map((item, index) => (
                      <div key={index} className="learning-item">
                        <span className="check-icon">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="requirements-section">
                  <h2>Requirements</h2>
                  <ul className="requirements-list">
                    <li>Basic programming knowledge</li>
                    <li>Familiarity with JavaScript</li>
                    <li>A computer with internet connection</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="curriculum-tab">
                <h2>Course Content</h2>
                <div className="modules-list">
                  {[1, 2, 3, 4].map((module, index) => (
                    <div key={index} className="module-card">
                      <div className="module-header">
                        <span className="module-icon">📘</span>
                        <h3>Module {index + 1}: {index === 0 ? "Getting Started" : index === 1 ? "Core Concepts" : index === 2 ? "Advanced Topics" : "Project Deployment"}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="instructor-tab">
                <div className="instructor-profile">
                  <div className="profile-avatar">
                    {course.mentorId?.name?.charAt(0) || "M"}
                  </div>
                  <div className="profile-info">
                    <h2>{course.mentorId?.name || "Expert Instructor"}</h2>
                    <p className="profile-title">Senior Developer & Tech Educator</p>
                    <p className="profile-bio">Passionate educator with over a decade of experience in software development. Specializes in full-stack JavaScript and cloud architecture.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-tab">
                <h2>Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet</p>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review._id} className="review-card">
                        <div className="review-header">
                          <span className="reviewer-name">{review.studentId?.name || "Anonymous"}</span>
                          <span className="review-rating">⭐⭐⭐⭐⭐</span>
                        </div>
                        <p className="review-comment">{review.comment || "Great course!"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="course-sidebar">
            <div className="sidebar-card">
              <h3>This Course Includes</h3>
              <div className="highlights-list">
                <div className="highlight">📹 23 Videos</div>
                <div className="highlight">📝 15 Exercises</div>
                <div className="highlight">🏆 Certificate</div>
                <div className="highlight">📱 Mobile Access</div>
                <div className="highlight">♾️ Lifetime Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;