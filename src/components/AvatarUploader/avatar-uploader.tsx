import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import CameraIcon from '../../assets/icons/profileSideBarsIcons/cameraIcon'; // Replace with your actual camera icon path
import { useUpload } from '../../hooks/useUpload';
import '../../assets/css/profile_sidebar.css'; // Optional: move styles here
import CameraMobileIcon from '../../assets/icons/profileSideBarsIcons/cameraIconMobile';

interface AvatarUploaderProps {
    name: string;
    initialAvatar?: string | null;
    onImageChange?: (file: File) => void;
    onUploadSuccess?: (uploadData: { filename: string; path: string; folder: string }) => void;
    onUploadError?: (error: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ 
    name, 
    initialAvatar = null, 
    onImageChange, 
    onUploadSuccess, 
    onUploadError 
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar);
    const { uploadFile, loading, error, data, reset } = useUpload();

    // Update avatarPreview when initialAvatar changes
    useEffect(() => {
        setAvatarPreview(initialAvatar);
    }, [initialAvatar]);

    const handleAvatarClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Call the original onImageChange callback
            onImageChange?.(file);

            try {
                // Upload the file to the 'avatars' folder
                await uploadFile('avatars', file);
            } catch (uploadError) {
                // Error is already handled by the hook
                console.error('Upload failed:', uploadError);
            }
        }
    };

    // Handle upload success
    useEffect(() => {
        if (data && data.success) {
            onUploadSuccess?.(data.file);
        }
    }, [data]);

    // Handle upload error
    useEffect(() => {
        if (error) {
            onUploadError?.(error);
        }
    }, [error]);


    return (
        <div className='avatar-uploader-box'>
            <div className="avatar-camera-icon" onClick={handleAvatarClick}>
                <CameraMobileIcon />
            </div>
            <div className="avatar-uploader" onClick={handleAvatarClick} aria-label="Загрузить аватар" role="button">
                {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="avatar-image" />
                ) : (
                    <div className="avatar-fallback">
                        {name[0].toUpperCase()}
                    </div>
                )}

                {loading && (
                    <div className="avatar-upload-overlay">
                        <div className="avatar-upload-spinner">Uploading...</div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="avatar-file-input"
                    onChange={handleFileChange}
                    disabled={loading}
                />
            </div>
        </div>

    );
};

export default AvatarUploader;
