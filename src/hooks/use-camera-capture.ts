import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useCameraCapture = () => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        return new Promise<File>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
              const stream = videoRef.current?.srcObject as MediaStream;
              stream?.getTracks().forEach(track => track.stop());
              setShowCamera(false);
              resolve(file);
            }
          }, 'image/jpeg');
        });
      }
    }
    return Promise.reject("No video stream available");
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
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