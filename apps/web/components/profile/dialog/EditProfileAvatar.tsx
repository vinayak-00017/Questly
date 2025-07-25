import React from "react";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import { AlertTriangle, Crown } from "lucide-react";

interface EditProfileAvatarProps {
  name: string;
  image: string;
  imagePublicId: string;
  level: number;
  hasUnsavedImageChanges: boolean;
  onImageUpload: (imageUrl: string, publicId: string) => void;
  onTempImageUpload: (publicId: string) => void;
  onImageRemove: () => void;
}

export const EditProfileAvatar: React.FC<EditProfileAvatarProps> = ({
  name,
  image,
  imagePublicId,
  level,
  hasUnsavedImageChanges,
  onImageUpload,
  onTempImageUpload,
  onImageRemove,
}) => (
  <div className="space-y-3">
    <div>
      <h3 className="text-white font-semibold mb-1">Profile Avatar</h3>
      <p className="text-zinc-400 text-sm">
        Upload or change your profile picture
      </p>
    </div>
    <div className="relative">
      <CloudinaryUpload
        currentImage={image}
        currentImagePublicId={imagePublicId}
        onImageUpload={onImageUpload}
        onTempImageUpload={onTempImageUpload}
        onImageRemove={onImageRemove}
        size={80}
        fallbackText={name?.charAt(0).toUpperCase() || "A"}
        className="flex items-center gap-4"
      />
      <div className="z-50 absolute top-0 left-[60px] bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-amber-500/50">
        Lv.{level}
      </div>
    </div>
    {hasUnsavedImageChanges && (
      <div className="flex items-center gap-2 text-amber-400 text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>You have unsaved image changes</span>
      </div>
    )}
  </div>
);
