import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => (
  <div className="relative">
    <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
    <Input
      placeholder="Search for services..."
      className="pl-10 bg-white/80 backdrop-blur-sm border-neutral-200"
    />
  </div>
);

export default SearchBar;