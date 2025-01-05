import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory } from "@/types/profile";
import ImageUpload from "@/components/shared/ImageUpload";
import ServicesList from "@/components/business/ServicesList";

interface BusinessService {
  name: string;
  description: string;
  price: number;
}

interface BusinessProfileFormData {
  name: string;
  description: string;
  category: ServiceCategory;
  address: string;
  services: BusinessService[];
  image?: File;
}

export default function BusinessProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessProfileFormData>();
  const { toast } = useToast();
  const [services, setServices] = useState<BusinessService[]>([]);
  const [newService, setNewService] = useState<BusinessService>({ name: "", description: "", price: 0 });
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const addService = () => {
    if (newService.name && newService.price > 0) {
      setServices([...services, newService]);
      setNewService({ name: "", description: "", price: 0 });
    }
  };

  const onSubmit = async (data: BusinessProfileFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`business-profiles/${Date.now()}-${imageFile.name}`, imageFile);

        if (uploadError) throw uploadError;
        imageUrl = uploadData.path;
      }

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

      if (profileError) throw profileError;

      if (services.length > 0) {
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

        if (servicesError) throw servicesError;
      }

      toast({
        title: "Success",
        description: "Business profile created successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create business profile",
      });
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Profile Image</Label>
        <ImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          onCapturePhoto={capturePhoto}
          videoRef={videoRef}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input
          id="name"
          {...register("name", { required: true })}
          className={errors.name ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={(value: ServiceCategory) => setSelectedCategory(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beauty">Beauty</SelectItem>
            <SelectItem value="dining">Dining</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="home">Home</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register("address", { required: true })}
          className={errors.address ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-4">
        <Label>Services</Label>
        <ServicesList
          services={services}
          newService={newService}
          setNewService={setNewService}
          addService={addService}
        />
      </div>

      <Button 
        type="submit"
        className="w-full bg-accent text-white hover:bg-accent/90"
      >
        Create Business Profile
      </Button>
    </form>
  );
}