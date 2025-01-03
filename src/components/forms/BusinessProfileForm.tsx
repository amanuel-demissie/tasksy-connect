import { useState } from "react";
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

interface BusinessService {
  name: string;
  description: string;
  price: number;
}

interface BusinessProfileFormData {
  name: string;
  description: string;
  category: "beauty" | "dining" | "professional" | "home";
  address: string;
  services: BusinessService[];
  image?: File;
}

export default function BusinessProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessProfileFormData>();
  const { toast } = useToast();
  const [services, setServices] = useState<BusinessService[]>([]);
  const [newService, setNewService] = useState<BusinessService>({ name: "", description: "", price: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

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

      // Insert services
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
        <Label htmlFor="image">Profile Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
        <Select onValueChange={setSelectedCategory}>
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
        {services.map((service, index) => (
          <div key={index} className="p-4 border rounded">
            <p><strong>Name:</strong> {service.name}</p>
            <p><strong>Description:</strong> {service.description}</p>
            <p><strong>Price:</strong> ${service.price}</p>
          </div>
        ))}

        <div className="space-y-2">
          <Input
            placeholder="Service name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <Input
            placeholder="Service description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
          />
          <Button type="button" onClick={addService}>Add Service</Button>
        </div>
      </div>

      <Button type="submit">Create Business Profile</Button>
    </form>
  );
}