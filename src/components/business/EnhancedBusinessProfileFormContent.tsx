/**
 * EnhancedBusinessProfileFormContent Component
 * 
 * Enhanced version with accordion sections, progress tracking, and improved UX
 */
import { useState, useEffect, useMemo } from "react";
import { ServiceCategory } from "@/types/profile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Copy, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Form sections
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import AvailabilitySection from "@/components/business/AvailabilitySection";
import EmployeeManagement from "@/components/business/EmployeeManagement";

// Enhanced components
import { FormProgressTracker } from "./FormProgressTracker";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { PreviewProfileDialog } from "./PreviewProfileDialog";

interface EnhancedBusinessProfileFormContentProps {
  register: any;
  errors: any;
  selectedCategory: ServiceCategory;
  setSelectedCategory: (category: ServiceCategory) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
  onCapturePhoto: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentImageUrl?: string | null;
  services: any[];
  newService: any;
  setNewService: (service: any) => void;
  addService: () => void;
  deleteService: (index: number, serviceId?: string) => void;
  onAvailabilityChange: (availability: any[]) => void;
  onBlockedDatesChange: (blockedDates: any[]) => void;
  initialAvailability?: any[];
  initialBlockedDates?: any[];
  businessId?: string;
  // New props for enhanced functionality
  formData?: any;
  autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  hasUnsavedChanges?: boolean;
}

export function EnhancedBusinessProfileFormContent({
  register,
  errors,
  selectedCategory,
  setSelectedCategory,
  imageFile,
  setImageFile,
  showCamera,
  setShowCamera,
  onCapturePhoto,
  videoRef,
  currentImageUrl,
  services,
  newService,
  setNewService,
  addService,
  deleteService,
  onAvailabilityChange,
  onBlockedDatesChange,
  initialAvailability,
  initialBlockedDates,
  businessId,
  formData,
  autoSaveStatus = 'idle',
  lastSaved,
  hasUnsavedChanges = false,
}: EnhancedBusinessProfileFormContentProps) {
  const [activeSection, setActiveSection] = useState<string>("profile-details");
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useIsMobile();

  // Calculate section completion status
  const sections = useMemo(() => [
    {
      id: "profile-details",
      title: "Profile Details",
      isComplete: !!(formData?.name && formData?.category && (currentImageUrl || imageFile)),
      isActive: activeSection === "profile-details"
    },
    {
      id: "services",
      title: "Services",
      isComplete: services.length > 0,
      isActive: activeSection === "services"
    },
    {
      id: "availability",
      title: "Availability",
      isComplete: !!(initialAvailability?.length),
      isActive: activeSection === "availability"
    },
    {
      id: "team",
      title: "Team Management",
      isComplete: false, // Could be enhanced to check if employees exist
      isActive: activeSection === "team"
    }
  ], [formData, currentImageUrl, imageFile, services, initialAvailability]);

  // Auto-expand first incomplete section only on initial load
  useEffect(() => {
    if (!activeSection) {
      const firstIncomplete = sections.find(section => !section.isComplete);
      if (firstIncomplete) {
        setActiveSection(firstIncomplete.id);
      } else {
        setActiveSection("profile-details");
      }
    }
  }, []); // Empty dependency array - only run on mount

  // Prepare preview data
  const previewData = {
    name: formData?.name || "",
    description: formData?.description || "",
    address: formData?.address || "",
    category: selectedCategory,
    imageUrl: currentImageUrl || undefined,
    services: services.map(service => ({
      name: service.name || "",
      description: service.description || "",
      price: service.price || 0,
      duration: service.duration || 0
    })),
    employees: [] // Would need to fetch from EmployeeManagement if needed
  };

  // Quick actions
  const handleDuplicateService = (index: number) => {
    const serviceToDuplicate = services[index];
    if (serviceToDuplicate) {
      setNewService({
        ...serviceToDuplicate,
        name: `${serviceToDuplicate.name} (Copy)`,
        id: undefined
      });
      addService();
    }
  };

  const handleBulkEditHours = () => {
    // This would open a dialog for bulk editing availability
    console.log("Bulk edit hours - to be implemented");
  };

  return (
    <div className="space-y-6">
      {/* Progress Tracker - Sticky on desktop */}
      <div className={cn(
        "bg-background/95 backdrop-blur-sm border-b z-20",
        !isMobile && "sticky top-0 py-4"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Edit Business Profile</h2>
            <AutoSaveIndicator 
              status={autoSaveStatus} 
              lastSaved={lastSaved}
              className="hidden sm:flex"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Preview Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="hidden sm:flex"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            {/* Quick Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkEditHours}>
                  <Clock className="h-4 w-4 mr-2" />
                  Bulk Edit Hours
                </DropdownMenuItem>
                {services.length > 0 && (
                  <DropdownMenuItem onClick={() => handleDuplicateService(0)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Service
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Tracker */}
        <FormProgressTracker sections={sections} />
      </div>

      {/* Form Sections with Accordion */}
      <Accordion 
        type="single" 
        collapsible
        value={activeSection} 
        onValueChange={(value) => setActiveSection(value || "")}
        className="space-y-4"
      >
        {/* Profile Details Section */}
        <AccordionItem value="profile-details" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                sections[0].isComplete ? "bg-primary" : "bg-muted-foreground"
              )} />
              <span>Profile Details</span>
              {sections[0].isComplete && (
                <span className="text-xs text-primary">✓ Complete</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-6">
            <ImageUploadSection
              imageFile={imageFile}
              setImageFile={setImageFile}
              showCamera={showCamera}
              setShowCamera={setShowCamera}
              onCapturePhoto={onCapturePhoto}
              videoRef={videoRef}
              currentImageUrl={currentImageUrl}
            />
            <BusinessDetailsSection
              register={register}
              errors={errors}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Services Section */}
        <AccordionItem value="services" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                sections[1].isComplete ? "bg-primary" : "bg-muted-foreground"
              )} />
              <span>Services ({services.length})</span>
              {sections[1].isComplete && (
                <span className="text-xs text-primary">✓ Complete</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ServicesSection
              services={services}
              newService={newService}
              setNewService={setNewService}
              addService={addService}
              onDeleteService={deleteService}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Availability Section */}
        <AccordionItem value="availability" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                sections[2].isComplete ? "bg-primary" : "bg-muted-foreground"
              )} />
              <span>Availability & Schedule</span>
              {sections[2].isComplete && (
                <span className="text-xs text-primary">✓ Complete</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <AvailabilitySection
              onAvailabilityChange={onAvailabilityChange}
              onBlockedDatesChange={onBlockedDatesChange}
              initialAvailability={initialAvailability}
              initialBlockedDates={initialBlockedDates}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Team Management Section - Only in edit mode */}
        {businessId && (
          <AccordionItem value="team" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  sections[3].isComplete ? "bg-primary" : "bg-muted-foreground"
                )} />
                <span>Team Management</span>
                {sections[3].isComplete && (
                  <span className="text-xs text-primary">✓ Complete</span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <EmployeeManagement businessId={businessId} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Mobile Auto-save Indicator */}
      {isMobile && (
        <div className="flex justify-center">
          <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          You have unsaved changes. They will be lost if you leave this page.
        </div>
      )}

      {/* Preview Dialog */}
      <PreviewProfileDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        profileData={previewData}
      />
    </div>
  );
}