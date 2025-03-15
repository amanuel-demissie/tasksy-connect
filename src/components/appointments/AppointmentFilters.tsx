
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface AppointmentFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onResetFilters: () => void;
}

export const AppointmentFilters = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  dateRange,
  setDateRange,
  onResetFilters
}: AppointmentFiltersProps) => {
  const { from, to } = dateRange;
  const displayDate = from && to 
    ? `${format(from, "MMM d")} - ${format(to, "MMM d")}`
    : from
    ? `From ${format(from, "MMM d")}`
    : "Select dates";

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px] bg-[#1A1F2C] text-white border-[#403E43]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1F2C] border-[#403E43] text-white">
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[140px] bg-[#1A1F2C] text-white border-[#403E43]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1F2C] border-[#403E43] text-white">
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Beauty">Beauty</SelectItem>
          <SelectItem value="Dining">Dining</SelectItem>
          <SelectItem value="Professional">Professional</SelectItem>
          <SelectItem value="Home">Home</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-start text-left font-normal bg-[#1A1F2C] text-white border-[#403E43]">
            <Calendar className="mr-2 h-4 w-4" />
            {displayDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#1A1F2C] border-[#403E43]" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{ from, to }}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="bg-[#1A1F2C] text-white"
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onResetFilters}
        className="text-[#C8C8C9] hover:text-white"
      >
        Clear filters
      </Button>
    </div>
  );
};
