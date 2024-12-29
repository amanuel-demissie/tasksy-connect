import SearchBar from "@/components/home/SearchBar";
import ServiceCategories from "@/components/home/ServiceCategories";
import FeaturedServices from "@/components/home/FeaturedServices";
import UpcomingAppointments from "@/components/home/UpcomingAppointments";
import RecommendedServices from "@/components/home/RecommendedServices";

const Index = () => {
  const scrollToSection = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-4">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-primary">
            Create, Find & Book Services
          </h1>
          <p className="text-neutral-600">
            Connect with customers and services with ease
          </p>
        </div>

        <SearchBar />
        <ServiceCategories onCategoryClick={scrollToSection} />
        <FeaturedServices />
        <UpcomingAppointments />
        <RecommendedServices />
      </div>
    </div>
  );
};

export default Index;