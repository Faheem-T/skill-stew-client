import { useState, useEffect } from "react";
import { CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { X, Search } from "lucide-react";
import { searchSkillsApi } from "@/shared/api/searchSkillsApi";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  skillsSchema,
  type SkillsFormValues,
} from "@/features/profile/schemas";
import {
  updateUserSkillProfileRequest,
  skillProficiencies,
} from "@/features/profile/api/UpdateUserSkillProfile";

interface Skill {
  id: string;
  name: string;
  alternateNames: string[];
}

interface SkillWithProficiency {
  skill: Skill;
  proficiency: (typeof skillProficiencies)[number];
}

interface WantedSkillsStepProps {
  onComplete?: () => void;
  onBack?: () => void;
  offeredSkills: SkillWithProficiency[];
  initialWantedSkills?: Skill[];
  wantedSkills?: Skill[];
  onUpdate?: (skills: Skill[]) => void;
}

export const WantedSkillsStep: React.FC<WantedSkillsStepProps> = ({
  onComplete,
  onBack,
  offeredSkills,
  initialWantedSkills = [],
  wantedSkills = initialWantedSkills,
  onUpdate,
}) => {
  const [wantedSkillSearch, setWantedSkillSearch] = useState("");
  const [wantedSearchResults, setWantedSearchResults] = useState<Skill[]>([]);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      offered: offeredSkills.map((item) => ({
        skillId: item.skill.id,
        skillName: item.skill.name,
        proficiency: item.proficiency,
      })),
      wanted: initialWantedSkills.map((item) => ({
        skillId: item.id,
        skillName: item.name,
      })),
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

  const debouncedWantedSkillSearch = useDebounce(wantedSkillSearch, 300);

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

    // Update parent state if onUpdate is provided
    if (onUpdate) {
      onUpdate(newWantedSkills);
    }

    // Update form values with correct structure
    const formWantedSkills = newWantedSkills.map((item) => ({
      skillId: item.id,
      skillName: item.name,
    }));

    form.setValue("wanted", formWantedSkills);
    setWantedSkillSearch("");
    setWantedSearchResults([]);
  };

  const handleRemoveWantedSkill = (skillId: string) => {
    const newWantedSkills = wantedSkills.filter(
      (skill) => skill.id !== skillId,
    );

    // Update parent state if onUpdate is provided
    if (onUpdate) {
      onUpdate(newWantedSkills);
    }

    // Update form values
    const formWantedSkills = newWantedSkills.map((item) => ({
      skillId: item.id,
      skillName: item.name,
    }));
    form.setValue("wanted", formWantedSkills);
  };

  const onSubmit = (data: SkillsFormValues) => {
    const requestData = {
      offered: data.offered,
      wanted: data.wanted || [],
    };
    mutation.mutate(requestData);
  };

  return (
    <CardContent className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
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
            {/* Dropdown results using SelectContent styling */}
            {wantedSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-40 overflow-y-auto">
                {wantedSearchResults.map((skill) => {
                  const isAlreadyWanted = wantedSkills.some(
                    (selected) => selected.id === skill.id,
                  );
                  const isAlreadyOffered = offeredSkills.some(
                    (offered) => offered.skill.id === skill.id,
                  );
                  const isDisabled = isAlreadyWanted || isAlreadyOffered;

                  return (
                    <div
                      key={skill.id}
                      className={`p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm flex items-center gap-2 ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed bg-gray-50"
                          : "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      }`}
                      onClick={() => !isDisabled && handleAddWantedSkill(skill)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{skill.name}</div>
                        {skill.alternateNames.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Also known as: {skill.alternateNames.join(", ")}
                          </div>
                        )}
                        {isAlreadyWanted && (
                          <div className="text-xs text-orange-600 font-medium">
                            Already selected as a skill to learn
                          </div>
                        )}
                        {isAlreadyOffered && (
                          <div className="text-xs text-blue-600 font-medium">
                            Already selected as a skill you can offer
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

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
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Complete"}
        </Button>
      </div>
    </CardContent>
  );
};
