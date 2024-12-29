import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturedServices = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-neutral-800">Featured Services</h2>
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="flex-shrink-0 w-72 bg-[#1A1F2C] backdrop-blur-sm border-neutral-200">
            <CardContent className="flex items-center p-4">
              <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-neutral-800">
                  Service Provider {i}
                </h3>
                <p className="text-sm text-neutral-600">⭐️ 4.9 (120 reviews)</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default FeaturedServices;