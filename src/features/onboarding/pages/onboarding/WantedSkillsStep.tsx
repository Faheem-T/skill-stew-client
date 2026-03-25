import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { X, Search, Lightbulb } from "lucide-react";
import { searchSkillsApi } from "@/shared/api/searchSkillsApi";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  skillsSchema,
  type SkillsFormValues,
} from "@/features/onboarding/schemas";
import { skillProficiencies } from "@/features/onboarding/api/UpdateUserSkillProfile";
import {
  useCurrentUserSkillProfile,
  useUpdateUserSkillProfile,
} from "@/shared/hooks/useCurrentUserSkillProfile";

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

  const { data: skillProfileData } = useCurrentUserSkillProfile();
  const mutation = useUpdateUserSkillProfile();

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

  const debouncedWantedSkillSearch = useDebounce(wantedSkillSearch, 300);

  // Update wanted skills from skill profile query
  useEffect(() => {
    if (skillProfileData?.wanted && onUpdate) {
      const currentWantedSkills = skillProfileData.wanted.map((item) => ({
        ...item.skill,
        alternateNames: [],
      }));
      onUpdate(currentWantedSkills);

      // Also update the form values
      const formWantedSkills = currentWantedSkills.map((item) => ({
        skillId: item.id,
        skillName: item.name,
      }));
      form.setValue("wanted", formWantedSkills);
    }
  }, [skillProfileData, onUpdate, form]);

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
    mutation.mutate(requestData, {
      onSuccess: () => {
        if (onComplete) {
          onComplete();
        }
      },
      onError: () => {
        toast.error("Failed to update skills. Please try again.");
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Search and adding */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                What Do You Want to Learn?
              </h3>
              <p className="text-muted-foreground text-sm">
                Select skills you're interested in acquiring through exchanges
              </p>
            </div>

            {/* Search input for interested skills */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" strokeWidth={1.5} />
                <Input
                  placeholder="Search for skills to learn..."
                  value={wantedSkillSearch}
                  onChange={(e) => setWantedSkillSearch(e.target.value)}
                  className="h-11 pl-10"
                />
                {/* Dropdown results */}
                {wantedSearchResults.length > 0 && (
                  <div className="bg-popover border-border absolute top-full left-0 right-0 z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border shadow-md">
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
                          className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
                            isDisabled
                              ? "bg-secondary/50 cursor-not-allowed opacity-50"
                              : "hover:bg-secondary cursor-pointer"
                          }`}
                          onClick={() =>
                            !isDisabled && handleAddWantedSkill(skill)
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
                            {isAlreadyWanted && (
                              <div className="text-warning text-xs font-medium">
                                Already selected to learn
                              </div>
                            )}
                            {isAlreadyOffered && (
                              <div className="text-xs text-primary font-medium">
                                Already a skill you offer
                              </div>
                            )}
                          </div>
                          {isDisabled && (
                            <X className="text-muted-foreground w-4 h-4" strokeWidth={1.5} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Info box */}
            <div className="bg-info-muted border-border flex gap-3 rounded-lg border p-4">
              <Lightbulb className="text-info mt-0.5 w-5 h-5 shrink-0" strokeWidth={1.5} />
              <div className="text-sm text-foreground">
                <p className="font-medium">Pro tip:</p>
                <p>
                  You can't select a skill you're already offering as a wanted
                  skill
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Selected skills display */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Learning Goals ({wantedSkills.length})
              </h3>
              <p className="text-muted-foreground text-sm">
                Skills you want to acquire
              </p>
            </div>

            {wantedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {wantedSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="border-border bg-secondary text-secondary-foreground flex items-center gap-2 px-3 py-2"
                  >
                    <Lightbulb className="w-3 h-3" strokeWidth={1.5} />
                    {skill.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWantedSkill(skill.id)}
                      className="ml-1 h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" strokeWidth={1.5} />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="bg-card border-border flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-12">
                <Lightbulb className="text-muted-foreground mb-2 h-10 w-10" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm">
                  No learning goals yet. Add skills you'd like to learn!
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
          onClick={form.handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          className="px-8"
        >
          {mutation.isPending ? "Saving..." : "Complete"}
        </Button>
      </div>
    </div>
  );
};
