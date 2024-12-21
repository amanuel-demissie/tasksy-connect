import ServiceSection from "./ServiceSection";
import hairSalonImg from "@/assets/services/hair-salon.jpg";
import spaImg from "@/assets/services/spa.jpg";
import beautyStudioImg from "@/assets/services/beauty-studio.jpg";
import nailsImg from "@/assets/services/nails.jpg";
import fineDiningImg from "@/assets/services/fine-dining.jpg";
import sushiImg from "@/assets/services/sushi.jpg";
import bistroImg from "@/assets/services/bistro.jpg";
import cafeImg from "@/assets/services/cafe.jpg";
import techImg from "@/assets/services/tech.jpg";
import legalImg from "@/assets/services/legal.jpg";
import financeImg from "@/assets/services/finance.jpg";
import businessImg from "@/assets/services/business.jpg";
import cleaningImg from "@/assets/services/cleaning.jpg";
import handymanImg from "@/assets/services/handyman.jpg";
import gardeningImg from "@/assets/services/gardening.jpg";
import securityImg from "@/assets/services/security.jpg";

const recommendedServices = {
  beauty: [
    { 
      id: 1, 
      name: "Luxe Hair Salon", 
      rating: "4.9", 
      reviews: 120, 
      image: hairSalonImg,
      provider: "Sarah Williams",
      service: "Haircut & Styling",
      address: "123 Beauty Lane, Suite 100"
    },
    { 
      id: 2, 
      name: "Zen Spa & Wellness", 
      rating: "4.8", 
      reviews: 95,
      image: spaImg,
      provider: "Emily Spa",
      service: "Full Body Massage",
      address: "234 Relax Rd"
    },
    { 
      id: 3, 
      name: "Glow Beauty Studio", 
      rating: "4.7", 
      reviews: 88,
      image: beautyStudioImg,
      provider: "Anna Glow",
      service: "Facial Treatment",
      address: "345 Beauty Blvd"
    },
    { 
      id: 4, 
      name: "Elite Nails", 
      rating: "4.6", 
      reviews: 75,
      image: nailsImg,
      provider: "Nail Expert",
      service: "Manicure & Pedicure",
      address: "456 Nail St"
    },
  ],
  dining: [
    { 
      id: 1, 
      name: "The Fine Palate", 
      rating: "4.9", 
      reviews: 230,
      image: fineDiningImg,
      provider: "Chef Michael Brown",
      service: "Fine Dining",
      address: "456 Culinary Ave"
    },
    { 
      id: 2, 
      name: "Sushi Master", 
      rating: "4.8", 
      reviews: 180,
      image: sushiImg,
      provider: "Sushi Chef",
      service: "Sushi & Sashimi",
      address: "567 Sushi St"
    },
    { 
      id: 3, 
      name: "Bistro Central", 
      rating: "4.7", 
      reviews: 150,
      image: bistroImg,
      provider: "Bistro Chef",
      service: "Casual Dining",
      address: "678 Bistro Blvd"
    },
    { 
      id: 4, 
      name: "Garden Cafe", 
      rating: "4.6", 
      reviews: 120,
      image: cafeImg,
      provider: "Cafe Owner",
      service: "Coffee & Snacks",
      address: "789 Garden St"
    },
  ],
  professional: [
    { 
      id: 1, 
      name: "Tech Solutions Pro", 
      rating: "4.9", 
      reviews: 89,
      image: techImg,
      provider: "John Tech",
      service: "IT Consulting",
      address: "789 Tech Boulevard"
    },
    { 
      id: 2, 
      name: "Legal Advisors", 
      rating: "4.8", 
      reviews: 76,
      image: legalImg,
      provider: "Lawyer Jane",
      service: "Legal Consulting",
      address: "890 Law St"
    },
    { 
      id: 3, 
      name: "Financial Experts", 
      rating: "4.7", 
      reviews: 65,
      image: financeImg,
      provider: "Finance Guru",
      service: "Financial Planning",
      address: "901 Finance Ave"
    },
    { 
      id: 4, 
      name: "Business Consultants", 
      rating: "4.6", 
      reviews: 54,
      image: businessImg,
      provider: "Consultant Pro",
      service: "Business Strategy",
      address: "123 Business Rd"
    },
  ],
  home: [
    { 
      id: 1, 
      name: "Premium Cleaners", 
      rating: "4.9", 
      reviews: 145,
      image: cleaningImg,
      provider: "Mary Clean",
      service: "Home Cleaning",
      address: "321 Home Street"
    },
    { 
      id: 2, 
      name: "HandyFix Pro", 
      rating: "4.8", 
      reviews: 132,
      image: handymanImg,
      provider: "Handy Man",
      service: "Home Repairs",
      address: "432 Fix It Rd"
    },
    { 
      id: 3, 
      name: "Garden Masters", 
      rating: "4.7", 
      reviews: 98,
      image: gardeningImg,
      provider: "Gardener Joe",
      service: "Landscaping",
      address: "543 Garden Ave"
    },
    { 
      id: 4, 
      name: "Home Security Experts", 
      rating: "4.6", 
      reviews: 87,
      image: securityImg,
      provider: "Security Pro",
      service: "Security Systems",
      address: "654 Security Blvd"
    },
  ],
};

const RecommendedServices = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold text-primary">Recommended Services</h2>
    {Object.entries(recommendedServices).map(([category, services]) => (
      <ServiceSection key={category} category={category} services={services} />
    ))}
  </div>
);

export default RecommendedServices;