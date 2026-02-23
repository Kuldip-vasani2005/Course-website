import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import "./ProfileSettings.css";

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: "", text: "" });

  try {
    const response = await axios.put("/auth/updatedetails", {
      name: formData.name,
    });

    if (response.data.success) {
      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    }
  } catch (error) {
    setMessage({
      type: "error",
      text: error.response?.data?.message || "Update failed",
    });
  } finally {
    setLoading(false);
  }
};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage({ type: "", text: "" });

  //   try {
  //     // ✅ Updated API endpoint name
  //     const response = await axios.put("/users/update-profile", {
  //       name: formData.name,
  //     });

  //     if (response.data.success) {
  //       setMessage({
  //         type: "success",
  //         text: "Profile updated successfully!",
  //       });
  //     }
  //   } catch (error) {
  //     setMessage({
  //       type: "error",
  //       text: error.response?.data?.message || "Failed to update profile",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="profile-settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Account Settings</h1>
          <p>Manage your personal information and security preferences.</p>
        </div>

        <div className="settings-content">
          <div className="settings-card">
            <div className="card-header">
              <h2>Profile Information</h2>
            </div>

            {message.text && (
              <div className={`alert ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email (Disabled) */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed.</small>
              </div>

              {/* Change Password Section */}
              <div className="form-group">
                <label>Password</label>
                <button
                  type="button"
                  className="change-password-btn"
                  onClick={() => navigate("/forgot-password")}
                >
                  Change Password
                </button>
                <small>
                  You will be redirected to password reset page.
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
