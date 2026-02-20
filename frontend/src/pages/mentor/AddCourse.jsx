import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./AddCourse.css";

const AddCourse = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Thumbnail must be under 5MB");
      return;
    }

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      alert("Video must be under 200MB");
      return;
    }

    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail || !video) {
      alert("Please select thumbnail and video");
      return;
    }

    // Create optimistic course object and navigate immediately
    const tempId = `temp-${Date.now()}`;
    const optimisticCourse = {
      _id: tempId,
      title: formData.title,
      price: formData.price,
      totalEnrollments: 0,
      averageRating: 0,
      thumbnailUrl: thumbnailPreview,
      _optimistic: true,
    };

    // Navigate to dashboard immediately and pass optimistic course
    navigate('/mentor/dashboard', { state: { optimisticCourse } });

    // Continue upload in background (non-blocking)
    setUploadProgress(0);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("thumbnail", thumbnail);
    data.append("video", video);

    try {
      const response = await axios.post('/courses', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      // After successful upload, notify dashboard to replace optimistic item
      // We'll use sessionStorage event to signal update (simple cross-route approach)
      try {
        sessionStorage.setItem('latestCreatedCourse', JSON.stringify(response.data.course));
        // small timestamp to trigger storage event even if same data
        sessionStorage.setItem('latestCreatedAt', Date.now().toString());
      } catch (e) {
        // ignore storage errors
      }
    } catch (error) {
      console.error('Background upload failed:', error);
      // Inform user via alert but don't block navigation
      alert('Upload failed in background. Please check your courses later.');
    }
  };

  return (
    <div className="add-course-container">
      <div className="add-course-card">
        <h2>Create New Course</h2>

        <form onSubmit={handleSubmit} className="course-form">

          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
          </select>

          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />

          {/* Thumbnail */}
          <div className="file-upload">
            <label>Thumbnail Image</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} required />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="thumbnail-preview"
              />
            )}
          </div>

          {/* Video */}
          <div className="file-upload">
            <label>Course Video</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} required />
            {video && (
              <p className="file-info">
                {video.name} ({(video.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="progress-wrapper">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span>{uploadProgress}%</span>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
