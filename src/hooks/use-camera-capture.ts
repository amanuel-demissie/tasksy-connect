import { useRef, useState } from 'react';

/**
 * Custom hook for managing device camera capture functionality
 * 
 * This hook provides functionality to:
 * - Access device camera
 * - Start and stop camera stream
 * - Capture photos from camera feed
 * - Handle camera permissions and errors
 * 
 * @example
 * ```tsx
 * const {
 *   showCamera,
 *   setShowCamera,
 *   videoRef,
 *   startCamera,
 *   capturePhoto,
 *   stopCamera
 * } = useCameraCapture();
 * 
 * // Later in your component:
 * const handleCapture = async () => {
 *   const photo = await capturePhoto();
 *   console.log('Captured photo:', photo);
 * };
 * ```
 * 
 * @returns {Object} Hook methods and state
 * @returns {boolean} showCamera - Whether camera feed is visible
 * @returns {Function} setShowCamera - Function to toggle camera visibility
 * @returns {React.RefObject<HTMLVideoElement>} videoRef - Reference to video element
 * @returns {Function} startCamera - Function to initialize camera
 * @returns {Function} capturePhoto - Function to take photo
 * @returns {Function} stopCamera - Function to stop camera feed
 */
export const useCameraCapture = () => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Initializes the device camera and starts the video stream
   * @throws {Error} If camera access is denied or unavailable
   */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw error;
    }
  };

  /**
   * Captures a photo from the current camera feed
   * @returns {Promise<File>} The captured photo as a File object
   * @throws {Error} If camera is not active or capture fails
   */
  const capturePhoto = async (): Promise<File> => {
    if (!videoRef.current) {
      throw new Error('Camera not initialized');
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    context.drawImage(videoRef.current, 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          resolve(file);
        } else {
          reject(new Error('Failed to capture photo'));
        }
      }, 'image/jpeg');
    });
  };

  /**
   * Stops the camera stream and cleans up resources
   */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return {
    showCamera,
    setShowCamera,
    videoRef,
    startCamera,
    capturePhoto,
    stopCamera
  };
};