import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
}

/**
 * Component for managing a list of freelancer skills
 * 
 * Features:
 * 1. Displays existing skills as tags
 * 2. Provides input for adding new skills
 * 3. Manages skill creation
 */
export default function SkillsList({
  skills,
  newSkill,
  setNewSkill,
  addSkill
}: SkillsListProps) {
  return (
    <div className="space-y-4">
      {/* Display existing skills as tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div key={index} className="bg-secondary px-3 py-1 rounded-full">
            {skill}
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