"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { userApi } from "@/services/user-api";

interface CloudinaryUploadProps {
  currentImage?: string;
  currentImagePublicId?: string;
  onImageUpload: (imageUrl: string, publicId: string) => void;
  onImageRemove?: () => void;
  onTempImageUpload?: (publicId: string) => void;
  className?: string;
  size?: number;
  uploadPreset?: string;
  folder?: string;
  maxFileSize?: number;
  allowedFormats?: string[];
  showRemoveButton?: boolean;
  fallbackText?: string;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  currentImage,
  currentImagePublicId,
  onImageUpload,
  onImageRemove,
  onTempImageUpload,
  className = "",
  size = 80,
  uploadPreset = "profile_images",
  folder = "questly/avatars",
  maxFileSize = 5000000, // 5MB
  allowedFormats = ["jpg", "jpeg", "png", "webp"],
  showRemoveButton = true,
  fallbackText = "A",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUploadSuccess = async (result: any) => {
    setIsUploading(false);
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      const publicId = result.info.public_id;
      
      console.log("Upload successful:", { imageUrl, publicId });
      
      // Notify parent about temporary upload
      onTempImageUpload?.(publicId);
      
      onImageUpload(imageUrl, publicId);
      toast.success("Image uploaded successfully!");
    }
  };

  const handleUploadError = (error: any) => {
    setIsUploading(false);
    console.error("Upload error:", error);
    toast.error("Failed to upload image. Please try again.");
  };

  const handleRemoveImage = async () => {
    if (!currentImagePublicId) {
      onImageRemove?.();
      return;
    }

    setIsDeleting(true);
    try {
      await userApi.deleteImage(currentImagePublicId);
      onImageRemove?.();
      toast.success("Image removed successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove image. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Avatar Preview */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-full blur-xl"></div>
        <Avatar 
          className={`border-4 border-purple-500/50 shadow-xl relative z-10`}
          style={{ width: size, height: size }}
        >
          <AvatarImage
            src={currentImage || ""}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-amber-600 text-white font-bold">
            {fallbackText}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload/Delete overlay when processing */}
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-20">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex flex-col gap-2">
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            // Basic configuration only - let Cloudinary handle everything else
            folder,
            maxFileSize,
            clientAllowedFormats: allowedFormats,
            maxImageFileSize: maxFileSize,
            
            // UI settings
            showUploadMoreButton: false,
            showPoweredBy: false,
            
            // Sources
            sources: ["local", "url", "camera"],
            multiple: false,
            resourceType: "image",
            
            // Clean minimal theme
            theme: "minimal",
          }}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          onOpen={() => {
            console.log("Upload widget opened");
            setIsUploading(true);
          }}
          onClose={() => {
            console.log("Upload widget closed");
            setIsUploading(false);
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Opening upload widget...");
                open();
              }}
              disabled={isUploading || isDeleting}
              className="bg-zinc-900/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  {currentImage ? "Change" : "Upload"}
                </>
              )}
            </Button>
          )}
        </CldUploadWidget>

        {/* Remove Button */}
        {currentImage && showRemoveButton && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={isUploading || isDeleting}
            className="bg-red-900/50 border-red-700/50 text-red-300 hover:bg-red-800/50 hover:text-red-200"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Remove
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};