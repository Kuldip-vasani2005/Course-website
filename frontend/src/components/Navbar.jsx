import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📚</span>
          <h2>EduPlatform</h2>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/courses" className="navbar-link">Courses</Link>
          
          {user && user.role === 'student' && (
            <>
              {/* <Link to="/student/dashboard" className="navbar-link">Dashboard</Link> */}
              <Link to="/my-courses" className="navbar-link">My Courses</Link>

            </>
          )}

          {user && user.role === 'mentor' && (
            <>
              <Link to="/mentor/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/mentor/add-course" className="navbar-link">Add Course</Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="navbar-link">Admin Panel</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {!user && (
            <>
              <Link to="/login" className="navbar-link-auth">Login</Link>
              <Link to="/register" className="navbar-btn-primary">Sign Up</Link>
            </>
          )}

          {user && (
            <div className="navbar-user">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <Link to="/profile-settings" className="navbar-settings-link" title="Settings">
                <FiUser />
              </Link>
              <button onClick={logout} className="navbar-btn-logout" title="Logout">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
