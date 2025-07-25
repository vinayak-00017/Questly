import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "@/services/user-api";

export function useEditProfileForm(
  session: any,
  userStats: any,
  onProfileUpdate?: () => void,
  onClose?: () => void
) {
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

  useEffect(() => {
    setFormData({
      name: session.user?.name || "",
      image: session.user?.image || "",
      imagePublicId: session.user?.imagePublicId || "",
      timezone: userStats?.timezone || "UTC",
    });
    setTempUploadedImages([]);
    setHasUnsavedImageChanges(false);
  }, [session.user, userStats]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (updates.image && updates.image !== session.user?.image) {
        const oldImagePublicId = session.user?.imagePublicId;
        if (oldImagePublicId && oldImagePublicId !== updates.imagePublicId) {
          try {
            await userApi.deleteImage(oldImagePublicId);
          } catch (error) {
            // Don't fail the entire operation if old image deletion fails
          }
        }
      }
      return userApi.updateProfile(updates);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setTempUploadedImages([]);
      setHasUnsavedImageChanges(false);
      onProfileUpdate?.();
      onClose?.();
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
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
    setFormData({ ...formData, image: imageUrl, imagePublicId: publicId });
    setHasUnsavedImageChanges(true);
  };

  const handleTempImageUpload = (publicId: string) => {
    setTempUploadedImages((prev) => [...prev, publicId]);
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: "", imagePublicId: "" });
    setHasUnsavedImageChanges(true);
  };

  const cleanupTempImages = async () => {
    if (tempUploadedImages.length > 0) {
      try {
        await Promise.all(
          tempUploadedImages.map((publicId) => userApi.deleteImage(publicId))
        );
      } catch (error) {}
    }
  };

  const handleClose = async () => {
    if (hasUnsavedImageChanges && tempUploadedImages.length > 0) {
      await cleanupTempImages();
      toast.info("Unsaved image changes discarded");
    }
    setTempUploadedImages([]);
    setHasUnsavedImageChanges(false);
    onClose?.();
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
    if (Object.keys(updates).length > 0) {
      updateProfileMutation.mutate(updates);
    } else {
      toast.info("No changes to save");
      handleClose();
    }
  };

  return {
    formData,
    setFormData,
    showTimezoneWarning,
    pendingTimezone,
    hasUnsavedImageChanges,
    updateProfileMutation,
    handleTimezoneChange,
    confirmTimezoneChange,
    cancelTimezoneChange,
    handleImageUpload,
    handleTempImageUpload,
    handleImageRemove,
    handleClose,
    handleSubmit,
  };
}
