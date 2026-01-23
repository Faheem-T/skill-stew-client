import { useState, useEffect } from "react";
import { CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Slider } from "@/shared/components/ui/slider";
import { X, Search } from "lucide-react";
import { searchSkillsApi } from "@/shared/api/searchSkillsApi";
import { skillProficiencies } from "@/features/profile/api/UpdateUserSkillProfile";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface Skill {
  id: string;
  name: string;
  alternateNames: string[];
}

interface SkillWithProficiency {
  skill: Skill;
  proficiency: (typeof skillProficiencies)[number];
}

interface OfferedSkillsStepProps {
  onComplete?: (offeredSkills: SkillWithProficiency[]) => void;
  onBack?: () => void;
  initialData?: SkillWithProficiency[];
  offeredSkills?: SkillWithProficiency[];
  onUpdate?: (skills: SkillWithProficiency[]) => void;
}

export const OfferedSkillsStep: React.FC<OfferedSkillsStepProps> = ({
  onComplete,
  onBack,
  initialData = [],
  offeredSkills = initialData,
  onUpdate,
}) => {
  const [currentSkillSearch, setCurrentSkillSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [currentProficiency, setCurrentProficiency] = useState([2]); // Intermediate index as array
  const [searchResults, setSearchResults] = useState<Skill[]>([]);

  const debouncedSkillSearch = useDebounce(currentSkillSearch, 300);

  // Search for skills when debounced search changes
  useEffect(() => {
    if (!debouncedSkillSearch.trim()) {
      setSearchResults([]);
      return;
    }

    const searchSkills = async () => {
      try {
        const response = await searchSkillsApi({ query: debouncedSkillSearch });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching skills:", error);
        setSearchResults([]);
      }
    };

    searchSkills();
  }, [debouncedSkillSearch]);

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setCurrentSkillSearch("");
    setSearchResults([]);
    setCurrentProficiency([2]); // Reset to Intermediate
  };

  const handleAddSkillWithProficiency = () => {
    if (!selectedSkill) return;

    // Check if skill already exists in offered skills
    if (offeredSkills.some((item) => item.skill.id === selectedSkill.id)) {
      return;
    }

    const proficiency = skillProficiencies[currentProficiency[0]];
    const newOfferedSkills = [
      ...offeredSkills,
      { skill: selectedSkill, proficiency },
    ];

    // Update parent state if onUpdate is provided
    if (onUpdate) {
      onUpdate(newOfferedSkills);
    }

    // Reset to initial state
    setSelectedSkill(null);
    setCurrentProficiency([2]);
  };

  const handleRemoveOfferedSkill = (skillId: string) => {
    const newOfferedSkills = offeredSkills.filter(
      (item) => item.skill.id !== skillId,
    );

    // Update parent state if onUpdate is provided
    if (onUpdate) {
      onUpdate(newOfferedSkills);
    }
  };

  const handleNext = () => {
    if (onComplete) {
      onComplete(offeredSkills);
    }
  };

  return (
    <CardContent className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-lg font-semibold">
          Select the skills you can offer
        </h3>

        <div className="flex gap-4">
          {/* Left side - Search input and selected skill */}
          <div className="flex-1 space-y-4">
            {/* Search input - always visible */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for a skill..."
                value={currentSkillSearch}
                onChange={(e) => setCurrentSkillSearch(e.target.value)}
                className="pl-10"
              />
              {/* Dropdown results using SelectContent styling */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-40 overflow-y-auto">
                  {searchResults.map((skill) => {
                    const isAlreadySelected = offeredSkills.some(
                      (selected) => selected.skill.id === skill.id,
                    );
                    return (
                      <div
                        key={skill.id}
                        className={`p-2 rounded-sm flex items-center gap-2 ${
                          isAlreadySelected
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        }`}
                        onClick={() =>
                          !isAlreadySelected && handleSelectSkill(skill)
                        }
                      >
                        <div className="flex-1">
                          <div className="font-medium">{skill.name}</div>
                          {skill.alternateNames.length > 0 && (
                            <div className="text-xs text-gray-500">
                              Also known as: {skill.alternateNames.join(", ")}
                            </div>
                          )}
                          {isAlreadySelected && (
                            <div className="text-xs text-orange-600 font-medium">
                              Already selected as an offered skill
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected skill and proficiency slider - animated slide down */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                selectedSkill ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {selectedSkill && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">
                      {selectedSkill.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSkill(null)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Proficiency Slider */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      How proficient are you at this skill?
                    </label>
                    <Slider
                      value={currentProficiency}
                      onValueChange={setCurrentProficiency}
                      min={0}
                      max={skillProficiencies.length - 1}
                      step={1}
                      className="mb-8"
                    />
                    <div className="text-center text-sm text-gray-600">
                      {skillProficiencies[currentProficiency[0]]}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddSkillWithProficiency}
                    className="w-full"
                  >
                    Add Skill
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Selected skills list */}
          <div className="w-80">
            {offeredSkills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Skills:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {offeredSkills.map((item) => (
                    <div
                      key={item.skill.id}
                      className="flex items-center justify-between p-2 bg-gray-50 border rounded-md"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {item.skill.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.proficiency}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOfferedSkill(item.skill.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons at bottom */}
      <div className="flex justify-between mt-auto">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled>
            Back
          </Button>
        )}
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </CardContent>
  );
};
