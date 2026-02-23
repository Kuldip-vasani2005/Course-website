import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        axios.get("/admin/stats"),
        axios.get("/admin/users"),
        axios.get("/admin/courses"),
      ]);

      setStats(statsRes.data?.stats || {});
      setUsers(usersRes.data?.users || []);
      setCourses(coursesRes.data?.courses || []);
    } catch (error) {
      console.error("Error fetching data:", error);

      // Prevent crash if API fails
      setStats({});
      setUsers([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/admin/users/${id}`);
      alert("User deleted successfully");
      fetchData();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`/courses/${id}`);
      alert("Course deleted successfully");
      fetchData();
    } catch (error) {
      alert("Failed to delete course");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Total Mentors</h3>
          <p className="stat-number">{stats.totalMentors}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{stats.totalCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "users" ? "tab active" : "tab"}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
        <button
          className={activeTab === "courses" ? "tab active" : "tab"}
          onClick={() => setActiveTab("courses")}
        >
          Manage Courses
        </button>
      </div>

      {activeTab === "users" && (
        <div className="table-container">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="table-container">
          <h2>Courses</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Mentor</th>
                <th>Price</th>
                <th>Enrollments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.mentorId?.name}</td>
                  <td>${course.price}</td>
                  <td>{course.totalEnrollments}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
