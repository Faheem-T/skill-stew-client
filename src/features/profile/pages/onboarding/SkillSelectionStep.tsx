import { useState, useEffect } from "react";
import { CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Slider } from "@/shared/components/ui/slider";
import { X, Search } from "lucide-react";
import { searchSkillsApi } from "@/shared/api/searchSkillsApi";
import {
  updateUserSkillProfileRequest,
  skillProficiencies,
} from "@/features/profile/api/UpdateUserSkillProfile";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  skillsSchema,
  type SkillsFormValues,
} from "@/features/profile/schemas";

interface Skill {
  id: string;
  name: string;
  alternateNames: string[];
}

interface SkillWithProficiency {
  skill: Skill;
  proficiency: (typeof skillProficiencies)[number];
}

interface SkillSelectionStepProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export const SkillSelectionStep: React.FC<SkillSelectionStepProps> = ({
  onComplete,
  onBack,
}) => {
  const [offeredSkills, setOfferedSkills] = useState<SkillWithProficiency[]>(
    [],
  );
  const [wantedSkills, setWantedSkills] = useState<Skill[]>([]);
  const [currentSkillSearch, setCurrentSkillSearch] = useState("");
  const [wantedSkillSearch, setWantedSkillSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [currentProficiency, setCurrentProficiency] = useState([2]); // Intermediate index as array
  const [searchResults, setSearchResults] = useState<Skill[]>([]);
  const [wantedSearchResults, setWantedSearchResults] = useState<Skill[]>([]);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      offered: [],
      wanted: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SkillsFormValues) => {
      const requestData = {
        offered: data.offered,
        wanted: data.wanted || [],
      };
      await updateUserSkillProfileRequest(requestData);
    },
    onSuccess: () => {
      toast.success("Skills updated successfully!");
      if (onComplete) {
        onComplete();
      }
    },
    onError: () => {
      toast.error("Failed to update skills. Please try again.");
    },
  });

  const debouncedSkillSearch = useDebounce(currentSkillSearch, 300);
  const debouncedWantedSkillSearch = useDebounce(wantedSkillSearch, 300);

  // Search for offered skills when debounced search changes
  useEffect(() => {
    if (!debouncedSkillSearch.trim()) {
      setSearchResults([]);
      return;
    }

    const searchSkills = async () => {
      try {
        const response = await searchSkillsApi({ query: debouncedSkillSearch });
        console.log(response);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching skills:", error);
        setSearchResults([]);
      }
    };

    searchSkills();
  }, [debouncedSkillSearch]);

  // Search for wanted skills when debounced search changes
  useEffect(() => {
    if (!debouncedWantedSkillSearch.trim()) {
      setWantedSearchResults([]);
      return;
    }

    const searchWantedSkills = async () => {
      try {
        const response = await searchSkillsApi({
          query: debouncedWantedSkillSearch,
        });
        setWantedSearchResults(response.data);
      } catch (error) {
        console.error("Error searching wanted skills:", error);
        setWantedSearchResults([]);
      }
    };

    searchWantedSkills();
  }, [debouncedWantedSkillSearch]);

  const handleAddWantedSkill = (skill: Skill) => {
    // Check if skill already exists in wanted skills
    if (wantedSkills.some((item) => item.id === skill.id)) {
      return;
    }
    const newWantedSkills = [...wantedSkills, skill];
    setWantedSkills(newWantedSkills);
    // Update form values with correct structure
    const formWantedSkills = newWantedSkills.map((item) => ({
      skillId: item.id,
    }));
    form.setValue("wanted", formWantedSkills);
    setWantedSkillSearch("");
    setWantedSearchResults([]);
  };

  const handleRemoveOfferedSkill = (skillId: string) => {
    setOfferedSkills(offeredSkills.filter((item) => item.skill.id !== skillId));
  };

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
    setOfferedSkills(newOfferedSkills);
    // Update form values with correct structure
    const formOfferedSkills = newOfferedSkills.map((item) => ({
      skillId: item.skill.id,
      proficiency: item.proficiency,
    }));
    form.setValue("offered", formOfferedSkills);
    // Reset to initial state
    setSelectedSkill(null);
    setCurrentProficiency([2]);
  };

  const handleRemoveWantedSkill = (skillId: string) => {
    setWantedSkills(wantedSkills.filter((skill) => skill.id !== skillId));
  };

  const onSubmit = (data: SkillsFormValues) => {
    const requestData = {
      offered: data.offered,
      wanted: data.wanted || [],
    };
    mutation.mutate(requestData);
  };

  return (
    <CardContent>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Field Group - Skills I Can Offer */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Skills I Can Offer</h3>

          {!selectedSkill ? (
            /* Initial state: Skill search input */
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for a skill..."
                value={currentSkillSearch}
                onChange={(e) => setCurrentSkillSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          ) : (
            /* Skill selected state: Show skill name and proficiency slider */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
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

          {/* Search Results - only show when not in selected state */}
          {!selectedSkill && searchResults.length > 0 && (
            <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
              {searchResults.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                  onClick={() => handleSelectSkill(skill)}
                >
                  <div className="font-medium">{skill.name}</div>
                  {skill.alternateNames.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Also known as: {skill.alternateNames.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Selected Skills */}
          {offeredSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Skills:</h4>
              <div className="space-y-2">
                {offeredSkills.map((item) => (
                  <div
                    key={item.skill.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div>
                      <div className="font-medium">{item.skill.name}</div>
                      <div className="text-xs text-gray-600">
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

        {/* Separator */}
        <Separator orientation="vertical" className="hidden md:block" />

        {/* Right Field Group - Skills I Want to Learn */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Skills I Want to Learn</h3>

          {/* Search input for interested skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              What skills are you interested in learning?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for skills to learn..."
                value={wantedSkillSearch}
                onChange={(e) => setWantedSkillSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Search Results */}
          {wantedSearchResults.length > 0 && (
            <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
              {wantedSearchResults.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                  onClick={() => handleAddWantedSkill(skill)}
                >
                  <div className="font-medium">{skill.name}</div>
                  {skill.alternateNames.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Also known as: {skill.alternateNames.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Selected Interested Skills */}
          {wantedSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Skills to Learn:</h4>
              <div className="flex flex-wrap gap-2">
                {wantedSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWantedSkill(skill.id)}
                      className="h-3 w-3 p-0 hover:bg-transparent"
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled>
            Back
          </Button>
        )}
        <Button type="button" onClick={form.handleSubmit(onSubmit)}>
          Next
        </Button>
      </div>
    </CardContent>
  );
};
