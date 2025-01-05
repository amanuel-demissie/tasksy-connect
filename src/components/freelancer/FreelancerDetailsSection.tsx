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
import { ServiceCategory } from "@/types/profile";

interface FreelancerDetailsSectionProps {
  register: any; // Replace with proper type from react-hook-form
  errors: any; // Replace with proper type from react-hook-form
  selectedCategory: ServiceCategory;
  setSelectedCategory: (category: ServiceCategory) => void;
}

/**
 * Component for collecting basic freelancer details in the profile form
 * 
 * This component handles:
 * 1. Full name input
 * 2. Professional title input
 * 3. Bio text area
 * 4. Service category selection
 * 5. Hourly rate input
 * 
 * @component
 * @param {FreelancerDetailsSectionProps} props - Component properties
 * @returns {JSX.Element} Rendered freelancer details section
 */
export default function FreelancerDetailsSection({
  register,
  errors,
  selectedCategory,
  setSelectedCategory
}: FreelancerDetailsSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...register("fullName", { required: true })}
          className={errors.fullName ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Professional Title</Label>
        <Input
          id="title"
          {...register("title", { required: true })}
          className={errors.title ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register("bio")}
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
        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
        <Input
          id="hourlyRate"
          type="number"
          {...register("hourlyRate", { required: true, min: 0 })}
          className={errors.hourlyRate ? "border-red-500" : ""}
        />
      </div>
    </>
  );
}