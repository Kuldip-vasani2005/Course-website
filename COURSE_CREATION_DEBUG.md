# Course Creation Debugging Guide

## Issues Fixed ✅

### 1. React Key Warning (Home.jsx)
**Problem**: "Each child in a list should have a unique 'key' prop"
**Solution**: Changed from array index keys to unique identifiers
- Testimonials: `key={idx}` → `key={`testimonial-${testimonial.name}-${idx}`}`
- Stars in ratings: `key={i}` → `key={`star-${idx}-${i}`}`

### 2. Course Creation Not Working (AddCourse.jsx)
**Problems Fixed**:
✅ Added comprehensive form validation
✅ Better error handling with console logging
✅ File size validation (Images: 10MB max, Videos: 100MB max)
✅ Form reset after successful submission
✅ Proper FormData construction
✅ Better error messages

---

## Testing Course Creation

### Step 1: Login as Mentor
1. Go to `/login`
2. Login with mentor account
3. Navigate to `/mentor/add-course`

### Step 2: Fill Form with Sample Data
```
Title:       Python Programming for Beginners
Price:       $49
Category:    Programming
Description: Learn Python basics with practical examples and projects
Thumbnail:   Select a .jpg, .png, or .gif image (max 10MB)
Video:       Select a .mp4 or .webm video (max 100MB)
```

### Step 3: Monitor Console
Open browser console (F12) and check for:

✅ **Successful Request**:
```
POST /api/courses 201
Course created: {course object}
```

❌ **Common Errors**:

#### Error: "Please upload both thumbnail and video"
- Solution: Ensure both files are selected before clicking Create Course

#### Error: File size exceeds limit
- Solution: Compress your files
  - Images: Use tools like TinyPNG
  - Videos: Use HandBrake or FFmpeg

#### Error: "Content-Type not handled"
- Solution: The axios instance should automatically set Content-Type to multipart/form-data

#### Error: 500 Internal Server Error
- Check backend console for Cloudinary upload errors
- Verify Cloudinary credentials in .env

---

## Backend Validation Checklist

### 1. Check Middleware (upload.js)
```
✅ Multer configured for thumbnail and video fields
✅ Image MIME type validation
✅ Video MIME type validation
✅ 100MB file size limit
```

### 2. Check Route Handler (courseRoutes.js)
```
POST /api/courses
✅ Protected by auth middleware
✅ Check role is 'mentor'
✅ Multer fields middleware applied
```

### 3. Check Controller (courseController.js)
```
✅ Validate all required fields
✅ Upload to Cloudinary
✅ Create course in MongoDB
✅ Return course data
```

---

## Network Request Debugging

### Using Developer Tools (F12)

1. **Go to Network Tab**
2. **Filter by XHR/Fetch**
3. **Submit Course Form**
4. **Check POST /courses request**:

**Request Headers Should Include**:
```
Content-Type: multipart/form-data; boundary=----...
```

**Request Payload Should Include**:
```
title: Python Programming for Beginners
price: 49
category: Programming
description: Learn Python basics...
thumbnail: [File]
video: [File]
```

**Response Should Be**:
```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "...",
    "title": "Python Programming for Beginners",
    "price": 49,
    "category": "Programming",
    "description": "Learn Python basics...",
    "thumbnailUrl": "https://cloudinary.com/...",
    "videoUrl": "https://cloudinary.com/...",
    "mentorId": "..."
  }
}
```

---

## File Upload Verification

### Frontend
✅ `AddCourse.jsx`:
- Reads files from input elements
- Validates file types and sizes
- Shows file info after selection
- Creates FormData with all fields
- Sends POST request with multipart/form-data

### Backend
✅ `upload.js`:
- Multer stores files temporarily in `/uploads`
- Validates MIME types

✅ `cloudinaryUpload.js`:
- Uploads to Cloudinary
- Returns URL and public ID
- Should delete local files after upload

---

## Cloudinary Configuration

Make sure your `.env` file has:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Test Cloudinary upload with:
```bash
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@yourimage.jpg" \
  -F "upload_preset=your_preset"
```

---

## Step-by-Step Troubleshooting

### Issue: Form shows "Creating Course..." but never completes

**1. Check Backend Server**
```bash
cd backend
npm start
# Should see: Server running on port 5000
```

**2. Check Network Tab**
- Look for pending/stalled requests
- Check response time

**3. Monitor Backend Console**
- Look for upload progress
- Check Cloudinary upload logs

### Issue: "Failed to create course" with no message

**1. Check Browser Console (F12)**
- Look for detailed error

**2. Check Backend Console**
- Multer errors?
- Cloudinary upload errors?
- MongoDB connection issues?

**3. Check .env Files**
- All Cloudinary variables set?
- API keys valid?
- MongoDB URI correct?

### Issue: Course shows as created but not visible in dashboard

**1. Check Dashboard Fetch**
- Go to `/mentor/dashboard`
- Open Network tab
- Check GET `/courses` request

**2. Check MongoDB**
```bash
# Connect to MongoDB and check:
db.courses.findOne({})
```

**3. Refresh Page**
- Sometimes just needs refresh to show new data

---

## Production Checklist

Before deploying:

- [ ] All Cloudinary credentials configured
- [ ] File size limits set appropriately
- [ ] Error handling works properly
- [ ] Console shows helpful error messages
- [ ] Form validation prevents bad requests
- [ ] File upload progress visible
- [ ] Success message shown to user
- [ ] Redirect after creation works

---

## Support

If course still doesn't create:

1. **Check browser console** for error details
2. **Check backend console** for server errors
3. **Verify network request** in DevTools
4. **Test Cloudinary** separately
5. **Check MongoDB** connection

Common causes:
- 🔴 Invalid Cloudinary credentials
- 🔴 File too large
- 🔴 Wrong MIME type
- 🔴 Missing required fields
- 🔴 Backend not running
- 🔴 MongoDB connection down
