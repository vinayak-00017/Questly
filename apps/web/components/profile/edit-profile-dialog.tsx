"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  User,
  MapPin,
  Loader2,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import { userApi } from "@/services/user-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TIMEZONES } from "@questly/utils";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  userStats: any;
  onProfileUpdate?: () => void;
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
  session,
  userStats,
  onProfileUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: session.user?.name || "",
    image: session.user?.image || "",
    imagePublicId: session.user?.imagePublicId || "",
    timezone: userStats?.timezone || "UTC",
  });

  const [showTimezoneWarning, setShowTimezoneWarning] = useState(false);
  const [pendingTimezone, setPendingTimezone] = useState<string>("");
  const [tempUploadedImages, setTempUploadedImages] = useState<string[]>([]);
  const [hasUnsavedImageChanges, setHasUnsavedImageChanges] = useState(false);

  const queryClient = useQueryClient();

  // Reset form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: session.user?.name || "",
        image: session.user?.image || "",
        imagePublicId: session.user?.imagePublicId || "",
        timezone: userStats?.timezone || "UTC",
      });
      setTempUploadedImages([]);
      setHasUnsavedImageChanges(false);
    }
  }, [isOpen, session.user, userStats]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      console.log("Starting profile update with:", updates);
      
      // Delete old image BEFORE updating profile if there's a new image
      if (updates.image && updates.image !== session.user?.image) {
        const oldImagePublicId = session.user?.imagePublicId;
        if (oldImagePublicId && oldImagePublicId !== updates.imagePublicId) {
          try {
            console.log("Deleting old image:", oldImagePublicId);
            await userApi.deleteImage(oldImagePublicId);
            console.log("Old image deleted successfully");
          } catch (error) {
            console.warn("Failed to delete old image:", error);
            // Don't fail the entire operation if old image deletion fails
          }
        }
      }
      
      // Now update the profile
      return userApi.updateProfile(updates);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userStats"] });

      // Clear temp uploads since they're now saved
      setTempUploadedImages([]);
      setHasUnsavedImageChanges(false);

      onProfileUpdate?.();
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    },
  });

  const handleTimezoneChange = (value: string) => {
    if (value !== userStats?.timezone) {
      setPendingTimezone(value);
      setShowTimezoneWarning(true);
    } else {
      setFormData({ ...formData, timezone: value });
    }
  };

  const confirmTimezoneChange = () => {
    setFormData({ ...formData, timezone: pendingTimezone });
    setShowTimezoneWarning(false);
    setPendingTimezone("");
  };

  const cancelTimezoneChange = () => {
    setShowTimezoneWarning(false);
    setPendingTimezone("");
  };

  const handleImageUpload = (imageUrl: string, publicId: string) => {
    console.log("Image uploaded:", { imageUrl, publicId });
    setFormData({
      ...formData,
      image: imageUrl,
      imagePublicId: publicId,
    });
    setHasUnsavedImageChanges(true);
  };

  const handleTempImageUpload = (publicId: string) => {
    console.log("Temporary image uploaded:", publicId);
    setTempUploadedImages((prev) => [...prev, publicId]);
  };

  const handleImageRemove = () => {
    setFormData({
      ...formData,
      image: "",
      imagePublicId: "",
    });
    setHasUnsavedImageChanges(true);
  };

  const cleanupTempImages = async () => {
    if (tempUploadedImages.length > 0) {
      try {
        console.log("Cleaning up temporary images:", tempUploadedImages);
        await Promise.all(
          tempUploadedImages.map((publicId) => userApi.deleteImage(publicId))
        );
        console.log(`Cleaned up ${tempUploadedImages.length} temporary images`);
      } catch (error) {
        console.warn("Failed to cleanup some temporary images:", error);
      }
    }
  };

  const handleClose = async () => {
    // If there are unsaved image changes, cleanup temp uploads
    if (hasUnsavedImageChanges && tempUploadedImages.length > 0) {
      await cleanupTempImages();
      toast.info("Unsaved image changes discarded");
    }

    setTempUploadedImages([]);
    setHasUnsavedImageChanges(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: {
      name?: string;
      image?: string;
      imagePublicId?: string;
      timezone?: string;
    } = {};

    if (formData.name !== session.user?.name && formData.name.trim()) {
      updates.name = formData.name.trim();
    }

    if (formData.image !== session.user?.image) {
      updates.image = formData.image;
      updates.imagePublicId = formData.imagePublicId;
    }

    if (formData.timezone !== userStats?.timezone) {
      updates.timezone = formData.timezone;
    }

    console.log("Submitting updates:", updates);

    if (Object.keys(updates).length > 0) {
      updateProfileMutation.mutate(updates);
    } else {
      toast.info("No changes to save");
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Timezone Warning Dialog */}
        <AnimatePresence>
          {showTimezoneWarning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-10 flex items-center justify-center p-4"
            >
              <Card className="bg-gradient-to-br from-red-900/90 to-orange-900/70 border border-red-600/50 shadow-2xl max-w-md w-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medieval text-white">
                        Timezone Change Warning
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-200 mb-6 leading-relaxed">
                    Please be aware before changing your timezone, only do it if
                    you really want to do it. It may cause some complications
                    with your quests and time alignments.
                  </p>

                  <div className="flex gap-3">
                    <Button
                      onClick={cancelTimezoneChange}
                      variant="outline"
                      className="flex-1 bg-zinc-900/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmTimezoneChange}
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold"
                    >
                      Continue Anyway
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-2xl"
        >
          <Card className="bg-gradient-to-br from-black/90 to-black/70 border border-purple-800/50 shadow-2xl overflow-hidden">
            {/* Decorative header */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500"></div>

            <CardContent className="p-0">
              {/* Header */}
              <div className="p-6 border-b border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-amber-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medieval text-white">
                        Edit Profile
                      </h2>
                      <p className="text-zinc-400 text-sm">
                        Customize your adventurer details
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Avatar Section */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Profile Avatar
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Upload or change your profile picture
                    </p>
                  </div>

                  <div className="relative">
                    <CloudinaryUpload
                      currentImage={formData.image}
                      currentImagePublicId={formData.imagePublicId}
                      onImageUpload={handleImageUpload}
                      onTempImageUpload={handleTempImageUpload}
                      onImageRemove={handleImageRemove}
                      size={80}
                      fallbackText={
                        (formData.name || session.user?.name)
                          ?.charAt(0)
                          .toUpperCase() || "A"
                      }
                      className="flex items-center gap-4"
                    />

                    {/* Level Badge */}
                    <div className="z-50 absolute top-0 left-[60px] bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-amber-500/50">
                      Lv.{userStats?.levelStats?.level || 1}
                    </div>
                  </div>

                  {/* Unsaved changes warning */}
                  {hasUnsavedImageChanges && (
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>You have unsaved image changes</span>
                    </div>
                  )}
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300 font-medium">
                    Adventurer Name
                  </Label>
                  <div className="relative">
                    <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10 bg-zinc-900/50 border-zinc-700/50 text-white placeholder-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                      placeholder="Enter your adventurer name"
                    />
                  </div>
                  <p className="text-xs text-zinc-500">
                    Choose a name that represents your adventuring spirit
                  </p>
                </div>

                {/* Timezone Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="timezone"
                    className="text-zinc-300 font-medium"
                  >
                    Timezone
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 z-10" />
                    <Select
                      value={formData.timezone}
                      onValueChange={handleTimezoneChange}
                    >
                      <SelectTrigger className="pl-10 bg-zinc-900/50 border-zinc-700/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20">
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {TIMEZONES.map((tz) => (
                          <SelectItem
                            key={tz.value}
                            value={tz.value}
                            className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                          >
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-zinc-500">
                    This affects your quest daily generation and xp calculation
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 bg-zinc-900/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold shadow-lg"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};