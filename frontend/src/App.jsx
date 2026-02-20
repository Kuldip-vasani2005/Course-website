import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import ProfileSettings from './pages/ProfileSettings';

// Student pages
import MyCourses from './pages/student/MyCourses';
import StudentDashboard from './pages/student/StudentDashboard';

// Mentor pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import AddCourse from './pages/mentor/AddCourse';
import CourseAnalytics from './pages/mentor/CourseAnalytics';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <Navbar />
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute requiredRole="student">
                <MyCourses />
              </ProtectedRoute>
            }
          />

          {/* Mentor routes */}
          <Route
            path="/mentor/dashboard"
            element={
              <ProtectedRoute requiredRole="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/add-course"
            element={
              <ProtectedRoute requiredRole="mentor">
                <AddCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/courses/:courseId/analytics"
            element={
              <ProtectedRoute requiredRole="mentor">
                <CourseAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
</Routes>
          <Toast />
          <Footer />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
