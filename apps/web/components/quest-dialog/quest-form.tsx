import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DatePickerWithPresets } from "@/components/ui/date-picker";
import { QuestFormProps, QuestFormData } from "./types";
import { QuestFormFields } from "./form-fields";
import { AlertCircle } from "lucide-react";
import { createQuestTemplateSchema } from "@questly/types";

// Form validation schema based on the types definition
const formValidationSchema = createQuestTemplateSchema.extend({
  dateValue: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
});

export function QuestForm({
  formData: initialFormData,
  onSubmit,
  onCancel,
  questType,
  themeColor,
  mainQuestsIds,
  InfoIcon,
  infoTitle,
  infoText,
  submitButtonText,
  buttonColor,
  buttonHoverColor,
}: QuestFormProps) {
  const [formData, setFormData] = useState<QuestFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    try {
      // First, ensure the title is a string
      const processedData = {
        ...formData,
        type: questType,
        title: String(formData.title || ""), // Convert to string or use empty string if null/undefined
      };

      formValidationSchema.parse(processedData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        console.log("Validation errors:", newErrors); // Add logging for debugging
      } else {
        // Handle non-Zod errors
        console.error("Non-Zod validation error:", error);
        setErrors({ form: "An unexpected error occurred" });
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleUpdateForm = (field: keyof QuestFormData, value: any) => {
    // For title field, ensure it's always stored as a string
    if (field === "title" && value !== undefined && value !== null) {
      value = String(value);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {errors.form && (
        <div className="px-6 py-2 bg-red-900/20 border border-red-800 text-red-400 text-sm">
          {errors.form}
        </div>
      )}

      <QuestFormFields
        formData={formData}
        onUpdateForm={handleUpdateForm}
        themeColor={themeColor}
        renderDateField={({ onChange, value, className }) => (
          <div>
            <DatePickerWithPresets
              date={value}
              setDate={onChange}
              className={className}
            />
            {errors.dateValue && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.dateValue}
              </p>
            )}
          </div>
        )}
        mainQuestsIds={mainQuestsIds}
        InfoIcon={InfoIcon}
        infoTitle={infoTitle}
        infoText={infoText}
        errors={errors}
      />

      <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className={`${buttonColor} ${buttonHoverColor} text-white`}
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
}
