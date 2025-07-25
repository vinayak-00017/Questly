"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditProfileAvatar } from "./dialog/EditProfileAvatar";
import { EditProfileNameField } from "./dialog/EditProfileNameField";
import { EditProfileTimezoneField } from "./dialog/EditProfileTimezoneField";
import { TimezoneWarningDialog } from "./dialog/TimezoneWarningDialog";
import { useEditProfileForm } from "./dialog/useEditProfileForm";

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
  const {
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
  } = useEditProfileForm(session, userStats, onProfileUpdate, onClose);

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
            <TimezoneWarningDialog
              onCancel={cancelTimezoneChange}
              onConfirm={confirmTimezoneChange}
            />
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
                <EditProfileAvatar
                  name={formData.name || session.user?.name || ""}
                  image={formData.image}
                  imagePublicId={formData.imagePublicId}
                  level={userStats?.levelStats?.level || 1}
                  hasUnsavedImageChanges={hasUnsavedImageChanges}
                  onImageUpload={handleImageUpload}
                  onTempImageUpload={handleTempImageUpload}
                  onImageRemove={handleImageRemove}
                />

                {/* Name Field */}
                <EditProfileNameField
                  name={formData.name}
                  onChange={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                />

                {/* Timezone Field */}
                <EditProfileTimezoneField
                  timezone={formData.timezone}
                  onChange={handleTimezoneChange}
                />

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
