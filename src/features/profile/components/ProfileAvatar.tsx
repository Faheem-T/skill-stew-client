import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import type { UserProfile } from "@/shared/hooks/useUserProfile";
import type { ChangeEvent } from "react";

interface ProfileAvatarProps {
  profile: UserProfile | null | undefined;
  avatarPreviewUrl: string | null;
  selectedAvatarFile: File | null;
  onPickAvatar: () => void;
  handleAvatarSelected: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUndoAvatarSelection: () => void;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileAvatar = ({
  profile,
  avatarPreviewUrl,
  selectedAvatarFile,
  onPickAvatar,
  handleAvatarSelected,
  handleUndoAvatarSelection,
  isUploading,
  fileInputRef,
}: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="mb-4">
        <div
          className="relative inline-block"
          onClick={selectedAvatarFile ? undefined : onPickAvatar}
          role="button"
          aria-label="Change avatar"
          title="Change avatar"
        >
          <Avatar className="w-24 h-24 cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center overflow-hidden">
            {avatarPreviewUrl ? (
              <AvatarImage
                src={avatarPreviewUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : profile?.avatarUrl ? (
              <AvatarImage
                src={profile.avatarUrl}
                alt={profile.name ?? profile.username ?? "User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback>U</AvatarFallback>
            )}
          </Avatar>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleAvatarSelected}
        />
        {selectedAvatarFile && (
          <div className="mt-2 flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUndoAvatarSelection}
              className="w-full"
            >
              Undo Selection
            </Button>
          </div>
        )}
        {isUploading && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Uploading...
          </p>
        )}
      </div>
    </div>
  );
};
