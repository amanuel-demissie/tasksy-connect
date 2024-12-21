import ServiceSection from "./ServiceSection";

const recommendedServices = {
  beauty: [
    { 
      id: 1, 
      name: "Luxe Hair Salon", 
      rating: "4.9", 
      reviews: 120, 
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=60",
      provider: "Sarah Williams",
      service: "Haircut & Styling",
      address: "123 Beauty Lane, Suite 100"
    },
    { 
      id: 2, 
      name: "Zen Spa & Wellness", 
      rating: "4.8", 
      reviews: 95,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=60",
      provider: "Emily Spa",
      service: "Full Body Massage",
      address: "234 Relax Rd"
    },
    { 
      id: 3, 
      name: "Glow Beauty Studio", 
      rating: "4.7", 
      reviews: 88,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=60",
      provider: "Anna Glow",
      service: "Facial Treatment",
      address: "345 Beauty Blvd"
    },
    { 
      id: 4, 
      name: "Elite Nails", 
      rating: "4.6", 
      reviews: 75,
      image: "https://images.unsplash.com/photo-1610992015732-2449b0bb0a86?w=800&auto=format&fit=crop&q=60",
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
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      provider: "Chef Michael Brown",
      service: "Fine Dining",
      address: "456 Culinary Ave"
    },
    { 
      id: 2, 
      name: "Sushi Master", 
      rating: "4.8", 
      reviews: 180,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
      provider: "Sushi Chef",
      service: "Sushi & Sashimi",
      address: "567 Sushi St"
    },
    { 
      id: 3, 
      name: "Bistro Central", 
      rating: "4.7", 
      reviews: 150,
      image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&auto=format&fit=crop&q=60",
      provider: "Bistro Chef",
      service: "Casual Dining",
      address: "678 Bistro Blvd"
    },
    { 
      id: 4, 
      name: "Garden Cafe", 
      rating: "4.6", 
      reviews: 120,
      image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&auto=format&fit=crop&q=60",
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
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=60",
      provider: "John Tech",
      service: "IT Consulting",
      address: "789 Tech Boulevard"
    },
    { 
      id: 2, 
      name: "Legal Advisors", 
      rating: "4.8", 
      reviews: 76,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60",
      provider: "Lawyer Jane",
      service: "Legal Consulting",
      address: "890 Law St"
    },
    { 
      id: 3, 
      name: "Financial Experts", 
      rating: "4.7", 
      reviews: 65,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
      provider: "Finance Guru",
      service: "Financial Planning",
      address: "901 Finance Ave"
    },
    { 
      id: 4, 
      name: "Business Consultants", 
      rating: "4.6", 
      reviews: 54,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=60",
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
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60",
      provider: "Mary Clean",
      service: "Home Cleaning",
      address: "321 Home Street"
    },
    { 
      id: 2, 
      name: "HandyFix Pro", 
      rating: "4.8", 
      reviews: 132,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60",
      provider: "Handy Man",
      service: "Home Repairs",
      address: "432 Fix It Rd"
    },
    { 
      id: 3, 
      name: "Garden Masters", 
      rating: "4.7", 
      reviews: 98,
      image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&auto=format&fit=crop&q=60",
      provider: "Gardener Joe",
      service: "Landscaping",
      address: "543 Garden Ave"
    },
    { 
      id: 4, 
      name: "Home Security Experts", 
      rating: "4.6", 
      reviews: 87,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=60",
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