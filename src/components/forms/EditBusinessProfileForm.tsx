
/**
 * @file EditBusinessProfileForm.tsx
 * @description Form component for editing an existing business profile.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useBusinessServices } from "@/hooks/use-business-services";
import { useBusinessProfileForm } from "@/hooks/use-business-profile-form";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useIsMobile } from "@/hooks/use-mobile";
import { EnhancedBusinessProfileFormContent } from "@/components/business/EnhancedBusinessProfileFormContent";
import { FormBreadcrumbs } from "@/components/business/FormBreadcrumbs";
import { NotFoundState } from "./NotFoundState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/**
 * EditBusinessProfileForm Component
 * 
 * @component
 * @description
 * Provides a form interface for editing an existing business profile.
 * Handles loading existing profile data, image management, services,
 * availability, and form submission. Uses several custom hooks for
 * managing different aspects of the form state and operations.
 * 
 * Key features:
 * - Loads and displays existing profile data
 * - Handles image upload and camera capture
 * - Manages services list
 * - Handles availability settings
 * - Provides form validation
 * - Handles profile updates
 * - Manages employees
 * 
 * @returns {JSX.Element} Rendered edit form
 */
export default function EditBusinessProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    selectedCategory,
    setSelectedCategory,
    imageFile,
    setImageFile,
    currentImageUrl,
    isSubmitting,
    notFound,
    handleExit,
    fetchProfile,
    setAvailability,
    setBlockedDates,
    availability,
    blockedDates,
    services: formServices,
    setServices: setFormServices,
    formData,
  } = useBusinessProfileForm(id!);

  const { 
    showCamera, 
    setShowCamera, 
    videoRef, 
    capturePhoto 
  } = useCameraCapture();

  const { 
    services: hookServices,
    newService, 
    setNewService, 
    addService,
    deleteService,
    fetchServices
  } = useBusinessServices(id!);

  // Auto-save functionality
  const autoSaveData = {
    ...formData,
    services: formServices,
    availability,
    blockedDates,
  };

  const { status: autoSaveStatus, lastSaved, hasUnsavedChanges } = useAutoSave({
    data: autoSaveData,
    onSave: async (data) => {
      // Auto-save implementation - save draft without full validation
      console.log('Auto-saving:', data);
      // Could implement a lightweight save here
    },
    delay: 3000, // Auto-save after 3 seconds of inactivity
    enabled: true
  });

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchServices();
    };

    fetchData();
  }, [id]);

  // Synchronize services between hooks
  useEffect(() => {
    console.log("Synchronizing services from useBusinessServices to form:", hookServices);
    setFormServices(hookServices);
  }, [hookServices, setFormServices]);

  const handleCameraCapture = async () => {
    try {
      const file = await capturePhoto();
      setImageFile(file);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleServiceDelete = (index: number, serviceId?: string) => {
    deleteService(index, serviceId, true);
  };

  const handleServiceAdd = () => {
    addService(formServices.length, undefined, true);
  };

  const handleAvailabilityChange = (newAvailability: any[]) => {
    setAvailability(newAvailability);
  };

  const handleBlockedDatesChange = (newBlockedDates: any[]) => {
    setBlockedDates(newBlockedDates);
  };

  const handleExitClick = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      handleExit();
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    handleExit();
  };

  if (notFound) {
    return <NotFoundState onExit={handleExit} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <FormBreadcrumbs businessName={formData?.name} />
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleExitClick}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {isMobile ? "Back" : "Back to Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="relative">
          <form id="business-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <EnhancedBusinessProfileFormContent
              register={register}
              errors={errors}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              imageFile={imageFile}
              setImageFile={setImageFile}
              showCamera={showCamera}
              setShowCamera={setShowCamera}
              onCapturePhoto={handleCameraCapture}
              videoRef={videoRef}
              currentImageUrl={currentImageUrl}
              services={formServices}
              newService={newService}
              setNewService={setNewService}
              addService={handleServiceAdd}
              deleteService={handleServiceDelete}
              onAvailabilityChange={handleAvailabilityChange}
              onBlockedDatesChange={handleBlockedDatesChange}
              initialAvailability={availability}
              initialBlockedDates={blockedDates}
              businessId={id}
              formData={formData}
              autoSaveStatus={autoSaveStatus}
              lastSaved={lastSaved}
              hasUnsavedChanges={hasUnsavedChanges}
            />

            {/* Sticky Submit Button */}
            <div className={cn(
              "bg-background/95 backdrop-blur-sm border-t p-4 -mx-4",
              !isMobile && "sticky bottom-0"
            )}>
              <div className="flex gap-3">
                <Button 
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Business Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Mobile Floating Action Button */}
          {isMobile && (
            <Button
              type="submit"
              form="business-profile-form"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Save className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you leave this page. 
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Page</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit} className="bg-destructive hover:bg-destructive/90">
              Leave Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
