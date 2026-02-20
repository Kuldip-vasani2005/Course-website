import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, category, sortBy, priceRange]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      if (sortBy) params.sort = sortBy;

      const response = await axios.get('/courses', { params });
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Design',
    'Business',
    'Marketing',
    'Other'
  ];

  return (
    <div className="courses-page">
      {/* Header */}
      <div className="courses-header">
        <div className="header-content">
          <h1>Explore Courses</h1>
          {/* <p>Discover thousands of high-quality courses from industry experts</p> */}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>🔍 Search Courses</label>
            <input
              type="text"
              placeholder="Search by title, topic..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>📂 Category</label>
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>⭐ Sort By</label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>💰 Price Range</label>
            <select
              className="filter-select"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="no-courses">
              <div className="no-courses-icon">🔍</div>
              <p>No courses found matching your criteria.</p>
              <Link to="/courses" className="reset-btn">Reset Filters</Link>
            </div>
          ) : (
            <>
              <div className="courses-count">
                <p>Found <strong>{courses.length}</strong> course{courses.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="courses-grid">
                {courses.map((course) => (
                  <Link to={`/courses/${course._id}`} key={course._id} className="course-card">
                    <div className="course-image">
                      <img src={course.thumbnailUrl} alt={course.title} />
                      <div className="course-overlay">
                        <span className="view-course">View Course →</span>
                      </div>
                      <div className="price-badge">${course.price}</div>
                    </div>
                    <div className="course-content">
                      <div className="course-category">{course.category}</div>
                      <h3>{course.title}</h3>
                      <p className="mentor-name">by {course.mentorId?.name}</p>
                      <div className="course-stats">
                        <span className="rating">⭐ 4.8</span>
                        <span className="students">👥 {course.totalEnrollments || 0}</span>
                      </div>
                      <div className="course-footer">
                        <span className="course-level">Intermediate</span>
                        <span className="course-duration">12 weeks</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
