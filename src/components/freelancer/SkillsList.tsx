import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SkillsListProps {
  skills: string[];
  newSkill: string;
  setNewSkill: (skill: string) => void;
  addSkill: () => void;
}

export default function SkillsList({
  skills,
  newSkill,
  setNewSkill,
  addSkill
}: SkillsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div key={index} className="bg-secondary px-3 py-1 rounded-full">
            {skill}
          </div>
        ))}
      </div>

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