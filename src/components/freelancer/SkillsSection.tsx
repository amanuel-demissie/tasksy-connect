import { Label } from "@/components/ui/label";
import SkillsList from "./SkillsList";

interface SkillsSectionProps {
  skills: string[];
  newSkill: string;
  setNewSkill: (skill: string) => void;
  addSkill: () => void;
  onRemoveSkill?: (index: number) => void;
}

/**
 * Component for managing freelancer skills in the profile form
 * 
 * This component:
 * 1. Displays existing skills
 * 2. Provides interface for adding new skills
 * 3. Manages skill input, validation, and removal
 * 
 * @component
 * @param {SkillsSectionProps} props - Component properties
 * @returns {JSX.Element} Rendered skills section
 */
export default function SkillsSection({
  skills,
  newSkill,
  setNewSkill,
  addSkill,
  onRemoveSkill
}: SkillsSectionProps) {
  return (
    <div className="space-y-4">
      <Label>Skills</Label>
      <SkillsList
        skills={skills}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        addSkill={addSkill}
        onRemoveSkill={onRemoveSkill}
      />
    </div>
  );
}