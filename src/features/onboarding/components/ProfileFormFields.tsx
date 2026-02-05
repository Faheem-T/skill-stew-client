import type { UserProfile } from "@/shared/hooks/useUserProfile";
import {
  NameField,
  UsernameField,
  LocationField,
  LanguagesField,
} from "./FormFields";

interface ProfileFormFieldsProps {
  username: string | undefined;
  location: UserProfile["location"] | undefined;
}

export const ProfileFormFields = ({
  username,
  location,
}: ProfileFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <NameField />
        <UsernameField currentUsername={username} />
      </div>

      <LocationField location={location} />
      <LanguagesField />
    </div>
  );
};
