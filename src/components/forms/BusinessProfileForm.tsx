import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory, BusinessService, BusinessProfileFormData } from "@/types/profile";
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";

/**
 * Form component for creating a business profile
 * 
 * This component:
 * 1. Handles image upload and camera capture
 * 2. Collects business details (name, description, category, address)
 * 3. Manages services offered by the business
 * 4. Submits data to Supabase and handles success/error states
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Callback function called after successful profile creation
 */
export default function BusinessProfileForm({ onSuccess }: { onSuccess: () => void }) {
  // Form state management using react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessProfileFormData>();
  const { toast } = useToast();

  // State for managing services
  const [services, setServices] = useState<BusinessService[]>([]);
  const [newService, setNewService] = useState<BusinessService>({ name: "", description: "", price: 0 });

  // State for managing category selection
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");

  // State and refs for image upload and camera functionality
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * Initializes the device camera for photo capture
   */
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

  /**
   * Captures a photo from the camera stream
   */
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImageFile(file);
            setShowCamera(false);
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
          }
        }, 'image/jpeg');
      }
    }
  };

  /**
   * Adds a new service to the services list
   */
  const addService = () => {
    if (newService.name && newService.price > 0) {
      setServices([...services, newService]);
      setNewService({ name: "", description: "", price: 0 });
    }
  };

  /**
   * Handles form submission
   * Creates business profile and associated services in Supabase
   */
  const onSubmit = async (data: BusinessProfileFormData) => {
    try {
      console.log("Starting business profile creation...");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      console.log("Authenticated user:", user.id);

      let imageUrl = null;
      if (imageFile) {
        console.log("Uploading image...");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`business-profiles/${Date.now()}-${imageFile.name}`, imageFile);

        if (uploadError) throw uploadError;
        imageUrl = uploadData.path;
        console.log("Image uploaded successfully:", imageUrl);
      }

      console.log("Creating business profile with data:", {
        owner_id: user.id,
        name: data.name,
        description: data.description,
        category: selectedCategory,
        address: data.address,
        image_url: imageUrl,
      });

      const { data: profile, error: profileError } = await supabase
        .from("business_profiles")
        .insert({
          owner_id: user.id,
          name: data.name,
          description: data.description,
          category: selectedCategory,
          address: data.address,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (profileError) {
        console.error("Error creating business profile:", profileError);
        throw profileError;
      }
      
      console.log("Business profile created successfully:", profile);

      if (services.length > 0) {
        console.log("Creating services:", services);
        const { error: servicesError } = await supabase
          .from("business_services")
          .insert(
            services.map(service => ({
              business_id: profile.id,
              name: service.name,
              description: service.description,
              price: service.price,
            }))
          );

        if (servicesError) {
          console.error("Error creating services:", servicesError);
          throw servicesError;
        }
        console.log("Services created successfully");
      }

      toast({
        title: "Success",
        description: "Business profile created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Final error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create business profile",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ImageUploadSection
        imageFile={imageFile}
        setImageFile={setImageFile}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        onCapturePhoto={capturePhoto}
        videoRef={videoRef}
      />

      <BusinessDetailsSection
        register={register}
        errors={errors}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ServicesSection
        services={services}
        newService={newService}
        setNewService={setNewService}
        addService={addService}
      />

      <Button 
        type="submit"
        className="w-full bg-accent text-white hover:bg-accent/90"
      >
        Create Business Profile
      </Button>
    </form>
  );
}