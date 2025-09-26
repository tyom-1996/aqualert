# Avatar Uploader Component

This component now includes automatic file upload functionality using the upload API.

## Features

- Automatic file upload to the server
- Loading state indicator
- Error handling
- Success callback with upload data
- Preview generation
- Disabled state during upload

## Usage

```tsx
import AvatarUploader from './AvatarUploader';

function ProfilePage() {
  const handleUploadSuccess = (uploadData: { filename: string; path: string; folder: string }) => {
    console.log('File uploaded successfully:', uploadData);
    // uploadData.file.path contains the server path to the uploaded file
    // You can save this path to your user profile
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
    // Handle upload error (show notification, etc.)
  };

  const handleImageChange = (file: File) => {
    console.log('File selected:', file);
    // This is called immediately when a file is selected
  };

  return (
    <AvatarUploader
      name="John Doe"
      initialAvatar="https://example.com/avatar.jpg"
      onImageChange={handleImageChange}
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
    />
  );
}
```

## Props

- `name`: User's name (used for fallback avatar)
- `initialAvatar`: Initial avatar URL (optional)
- `onImageChange`: Callback when a file is selected (optional)
- `onUploadSuccess`: Callback when upload succeeds (optional)
- `onUploadError`: Callback when upload fails (optional)

## Upload Response

The upload API returns:

```json
{
  "success": true,
  "file": {
    "filename": "file-1627890123456.jpg",
    "path": "uploads/avatars/file-1627890123456.jpg",
    "folder": "avatars"
  }
}
```

## API Endpoint

The component uses the `/upload/{folder}` endpoint:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Folder: `avatars` (hardcoded for this component) 