
import { ServiceCategory } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AvailabilitySection from "./AvailabilitySection";

interface BusinessDetailsSectionProps {
  register: any;
  errors: any;
  selectedCategory: ServiceCategory;
  setSelectedCategory: (category: ServiceCategory) => void;
  onAvailabilityChange?: (availability: any[]) => void;
  onBlockedDatesChange?: (blockedDates: any[]) => void;
}

export default function BusinessDetailsSection({
  register,
  errors,
  selectedCategory,
  setSelectedCategory,
  onAvailabilityChange,
  onBlockedDatesChange,
}: BusinessDetailsSectionProps) {
  return (
    <div className="space-y-6">
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

      {onAvailabilityChange && onBlockedDatesChange && (
        <AvailabilitySection
          onAvailabilityChange={onAvailabilityChange}
          onBlockedDatesChange={onBlockedDatesChange}
        />
      )}
    </div>
  );
}
