
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SLOT_DURATIONS = [15, 30, 45, 60];

interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

interface BlockedDate {
  date: Date;
  reason?: string;
}

interface AvailabilitySectionProps {
  businessId?: string;
  onAvailabilityChange: (availability: TimeSlot[]) => void;
  onBlockedDatesChange: (blockedDates: BlockedDate[]) => void;
}

export default function AvailabilitySection({
  businessId,
  onAvailabilityChange,
  onBlockedDatesChange,
}: AvailabilitySectionProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("0");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState<string>("30");
  const [showBlockDateInput, setShowBlockDateInput] = useState(false);
  const [selectedBlockedDate, setSelectedBlockedDate] = useState<Date>();
  const [blockReason, setBlockReason] = useState("");

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      dayOfWeek: parseInt(selectedDay),
      startTime,
      endTime,
      slotDuration: parseInt(slotDuration),
    };

    const updatedSlots = [...timeSlots, newSlot];
    setTimeSlots(updatedSlots);
    onAvailabilityChange(updatedSlots);
  };

  const removeTimeSlot = (index: number) => {
    const updatedSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(updatedSlots);
    onAvailabilityChange(updatedSlots);
  };

  const addBlockedDate = () => {
    if (!selectedBlockedDate) return;

    const newBlockedDate: BlockedDate = {
      date: selectedBlockedDate,
      reason: blockReason,
    };

    const updatedBlockedDates = [...blockedDates, newBlockedDate];
    setBlockedDates(updatedBlockedDates);
    onBlockedDatesChange(updatedBlockedDates);
    setShowBlockDateInput(false);
    setSelectedBlockedDate(undefined);
    setBlockReason("");
  };

  const removeBlockedDate = (index: number) => {
    const updatedBlockedDates = blockedDates.filter((_, i) => i !== index);
    setBlockedDates(updatedBlockedDates);
    onBlockedDatesChange(updatedBlockedDates);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Weekly Availability</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Day of Week</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Slot Duration (minutes)</Label>
            <Select 
              value={slotDuration.toString()} 
              onValueChange={setSlotDuration}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {SLOT_DURATIONS.map((duration) => (
                  <SelectItem key={duration} value={duration.toString()}>
                    {duration} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={addTimeSlot}
          className="w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>

        {timeSlots.length > 0 && (
          <div className="space-y-2">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>
                      {DAYS_OF_WEEK[slot.dayOfWeek]}: {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({slot.slotDuration}min slots)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTimeSlot(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Blocked Dates</h3>
        <Button
          variant="outline"
          onClick={() => setShowBlockDateInput(true)}
          className="w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Block Date
        </Button>

        {showBlockDateInput && (
          <div className="space-y-4 p-4 border rounded-lg">
            <Calendar
              mode="single"
              selected={selectedBlockedDate}
              onSelect={setSelectedBlockedDate}
              className="rounded-md border"
            />
            <Textarea
              placeholder="Reason (optional)"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={addBlockedDate}>Add Blocked Date</Button>
              <Button
                variant="ghost"
                onClick={() => setShowBlockDateInput(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {blockedDates.length > 0 && (
          <div className="space-y-2">
            {blockedDates.map((blockedDate, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card rounded-lg border"
              >
                <div>
                  <p className="font-medium">
                    {blockedDate.date.toLocaleDateString()}
                  </p>
                  {blockedDate.reason && (
                    <p className="text-sm text-muted-foreground">
                      {blockedDate.reason}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBlockedDate(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
