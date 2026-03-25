import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Slider } from "@/shared/components/ui/slider";
import { X, Search, Award } from "lucide-react";
import { searchSkillsApi } from "@/shared/api/searchSkillsApi";
import { skillProficiencies } from "@/features/onboarding/api/UpdateUserSkillProfile";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCurrentUserSkillProfile } from "@/shared/hooks/useCurrentUserSkillProfile";

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
  const { data: skillProfileData } = useCurrentUserSkillProfile();

  // Update offered skills from skill profile query
  useEffect(() => {
    if (skillProfileData?.offered && onUpdate) {
      const currentOfferedSkills = skillProfileData.offered.map((item) => ({
        skill: {
          ...item.skill,
          alternateNames: [],
        },
        proficiency: (typeof item.proficiency === "string"
          ? item.proficiency
          : item.proficiency[0]) as (typeof skillProficiencies)[number],
      }));
      onUpdate(currentOfferedSkills);
    }
  }, [skillProfileData, onUpdate]);

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Search and selection */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Add Your Skills
              </h3>
              <p className="text-muted-foreground text-sm">
                Search and select the skills you're proficient in
              </p>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" strokeWidth={1.5} />
              <Input
                placeholder="Search for a skill..."
                value={currentSkillSearch}
                onChange={(e) => setCurrentSkillSearch(e.target.value)}
                className="h-11 pl-10"
              />
              {/* Dropdown results */}
              {searchResults.length > 0 && (
                <div className="bg-popover border-border absolute top-full left-0 right-0 z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border shadow-md">
                  {searchResults.map((skill) => {
                    const isAlreadySelected = offeredSkills.some(
                      (selected) => selected.skill.id === skill.id,
                    );
                    return (
                      <div
                        key={skill.id}
                          className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
                            isAlreadySelected
                              ? "bg-secondary/50 cursor-not-allowed opacity-50"
                              : "hover:bg-secondary cursor-pointer"
                          }`}
                        onClick={() =>
                          !isAlreadySelected && handleSelectSkill(skill)
                        }
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">
                            {skill.name}
                          </div>
                          {skill.alternateNames.length > 0 && (
                            <div className="text-muted-foreground text-xs">
                              Also known as: {skill.alternateNames.join(", ")}
                            </div>
                          )}
                        </div>
                        {isAlreadySelected && (
                          <Award className="text-warning w-4 h-4" strokeWidth={1.5} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected skill detail card - animated */}
            {selectedSkill && (
              <div className="border-border bg-card space-y-4 rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {selectedSkill.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSkill(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>

                {/* Proficiency Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Proficiency Level
                    </label>
                    <span className="bg-secondary text-secondary-foreground rounded-sm px-2 py-1 text-xs font-medium">
                      {skillProficiencies[currentProficiency[0]]}
                    </span>
                  </div>
                  <Slider
                    value={currentProficiency}
                    onValueChange={setCurrentProficiency}
                    min={0}
                    max={skillProficiencies.length - 1}
                    step={1}
                    className="mb-2"
                  />
                  <div className="text-muted-foreground flex justify-between px-1 text-xs">
                    <span>Beginner</span>
                    <span>Expert</span>
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

          {/* Right side - Selected skills list */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Selected Skills ({offeredSkills.length})
              </h3>
              <p className="text-muted-foreground text-sm">
                Your current skill profile
              </p>
            </div>

            {offeredSkills.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {offeredSkills.map((item) => (
                  <div
                    key={item.skill.id}
                    className="bg-card border-border hover:border-primary group flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {item.skill.name}
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        <span className="bg-secondary text-secondary-foreground inline-block rounded-sm px-2 py-1 font-medium">
                          {item.proficiency}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOfferedSkill(item.skill.id)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-destructive h-4 w-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border-border flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-12">
                <Award className="text-muted-foreground mb-2 h-10 w-10" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm">
                  No skills added yet. Search and add your skills to get
                  started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons at bottom */}
      <div className="bg-card border-border flex shrink-0 justify-between gap-4 border-t px-8 py-4">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Back
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled className="px-6">
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleNext}
          disabled={offeredSkills.length === 0}
          className="px-8"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
