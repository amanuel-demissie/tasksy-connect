import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

/**
 * Props for the SkillsList component
 */
interface SkillsListProps {
  /** Array of existing skills */
  skills: string[];
  /** New skill being added */
  newSkill: string;
  /** Function to update the new skill state */
  setNewSkill: (skill: string) => void;
  /** Function to add the new skill to the list */
  addSkill: () => void;
  /** Function to remove a skill from the list */
  onRemoveSkill?: (index: number) => void;
}

/**
 * Component for managing a list of freelancer skills
 * 
 * Features:
 * 1. Displays existing skills as tags
 * 2. Provides input for adding new skills
 * 3. Manages skill creation and deletion
 */
export default function SkillsList({
  skills,
  newSkill,
  setNewSkill,
  addSkill,
  onRemoveSkill
}: SkillsListProps) {
  return (
    <div className="space-y-4">
      {/* Display existing skills as tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div key={index} className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2">
            {skill}
            {onRemoveSkill && (
              <button
                type="button" // Add this to prevent form submission
                onClick={(e) => {
                  e.preventDefault(); // Prevent any form submission
                  onRemoveSkill(index);
                }}
                className="hover:text-destructive transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Form for adding new skills */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <Button 
          type="button" 
          onClick={addSkill}
          className="bg-accent text-white hover:bg-accent/90"
        >
          Add
        </Button>
      </div>
    </div>
  );
}