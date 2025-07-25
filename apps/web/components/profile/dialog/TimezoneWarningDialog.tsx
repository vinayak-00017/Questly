import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface TimezoneWarningDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const TimezoneWarningDialog: React.FC<TimezoneWarningDialogProps> = ({
  onCancel,
  onConfirm,
}) => (
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
          Please be aware before changing your timezone, only do it if you
          really want to do it. It may cause some complications with your quests
          and time alignments.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 bg-zinc-900/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold"
          >
            Continue Anyway
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
