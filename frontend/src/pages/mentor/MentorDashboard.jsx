import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';
import './MentorDashboard.css';

const MentorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  // Listen for background creation events (from AddCourse)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'latestCreatedCourse' || e.key === 'latestCreatedAt') {
        try {
          const raw = sessionStorage.getItem('latestCreatedCourse');
          if (!raw) return;
          const created = JSON.parse(raw);
          // replace optimistic item if exists
          setCourses((curr) => {
            const hasTemp = curr.some((c) => c._id && c._id.startsWith('temp-'));
            if (!hasTemp) return [created, ...curr];
            return curr.map((c) => (c._id && c._id.startsWith('temp-') ? created : c));
          });
        } catch (err) {
          // ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    // also check once on mount in case storage set before listener
    try {
      const raw = sessionStorage.getItem('latestCreatedCourse');
      if (raw) {
        const created = JSON.parse(raw);
        setCourses((curr) => {
          const hasTemp = curr.some((c) => c._id && c._id.startsWith('temp-'));
          if (!hasTemp) return [created, ...curr];
          return curr.map((c) => (c._id && c._id.startsWith('temp-') ? created : c));
        });
      }
    } catch (err) {}

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        axios.get('/mentor/stats'),
        axios.get('/mentor/courses'),
      ]);
      setStats(statsRes.data.stats);
      // Merge any optimistic course passed via navigation state
      const navOptimistic = location.state?.optimisticCourse;
      if (navOptimistic) {
        // prepend optimistic course and then the real list without duplicates
        const exists = coursesRes.data.courses.find((c) => c._id === navOptimistic._id);
        setCourses([navOptimistic, ...coursesRes.data.courses.filter((c) => !exists || c._id !== navOptimistic._id)]);
      } else {
        setCourses(coursesRes.data.courses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    // Optimistic delete: remove immediately then call API
    const prev = courses;
    setCourses((curr) => curr.filter((c) => c._id !== id));

    try {
      await axios.delete(`/courses/${id}`);
      // success - optionally show toast
    } catch (error) {
      // rollback on error
      setCourses(prev);
      alert('Failed to delete course');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="mentor-dashboard">
      <h1>Mentor Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{stats.totalCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <p className="stat-number">{stats.totalEnrollments}</p>
        </div>
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-number">${stats.totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="courses-section">
        <h2>My Courses</h2>
        <div className="courses-table">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Price</th>
                <th>Enrollments</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>${course.price}</td>
                  <td>{course.totalEnrollments}</td>
                  <td>⭐ {course.averageRating.toFixed(1)}</td>
                  <td className="action-buttons">
                    <Link to={`/mentor/courses/${course._id}/analytics`} className="analytics-btn">
                      View Analytics
                    </Link>
                    <button onClick={() => handleDelete(course._id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
