import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import type { UserProfile } from "@/shared/hooks/useUserProfile";
import type { ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { DefaultAvatarIllustration } from "./DefaultAvatarIllustration";

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
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <div
          className="relative inline-block group"
          onClick={onPickAvatar}
          role="button"
          aria-label="Change avatar"
          title="Click to upload avatar"
        >
          {avatarPreviewUrl || profile?.avatarUrl ? (
            <Avatar className="w-32 h-32 cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-primary/30 group-hover:ring-primary/60">
              {avatarPreviewUrl && (
                <AvatarImage
                  src={avatarPreviewUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
              {!avatarPreviewUrl && profile?.avatarUrl && (
                <AvatarImage
                  src={profile.avatarUrl}
                  alt={profile.name ?? profile.username ?? "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </Avatar>
          ) : (
            <div className="w-32 h-32 cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-primary/30 group-hover:ring-primary/60 rounded-full bg-white">
              <DefaultAvatarIllustration />
            </div>
          )}
          
          {/* Upload icon overlay - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="flex flex-col items-center gap-1">
              <Upload className="w-6 h-6 text-white" />
              <span className="text-xs text-white font-medium">
                {selectedAvatarFile || avatarPreviewUrl ? "Change" : "Upload"}
              </span>
            </div>
          </div>
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
