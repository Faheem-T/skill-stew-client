import type { UserProfile } from "@/shared/hooks/useUserProfile";
import {
  NameField,
  UsernameField,
  LocationField,
  LanguagesField,
} from "./FormFields";

interface ProfileFormFieldsProps {
  profile: UserProfile | null | undefined;
}

export const ProfileFormFields = ({ profile }: ProfileFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <NameField />
        <UsernameField currentUsername={profile?.username} />
      </div>

      <LocationField profile={profile} />
      <LanguagesField />
    </div>
  );
};
