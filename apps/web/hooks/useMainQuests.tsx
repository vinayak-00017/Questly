// import { mainQuestApi } from "@/services/main-quest-api";
// import { useMutation } from "@tanstack/react-query";
// import { useState } from "react";

// export function useMainQuests(){
//     const [title, setTitle] = useState("");
//       const [description, setDescription] = useState("");
//       const [importance, setImportance] = useState<MainQuestImportance>(MainMedium);
//       const [dueDate, setDueDate] = useState<Date>();
//       const [dailyQuests, setDailyQuests] = useState<CreateQuestTemplate[]>([]);
//       const [dailyQuestPriority, setDailyQuestPriority] =
//         useState<TaskPriority>(Medium);
//       const [dailyQuestTitle, setDailyQuestTitle] = useState("");
// }
//   const addMainQuestMutation = useMutation({
//     mutationFn: mainQuestApi.addMainQuest,
//     onSuccess: () => {
//       toast.success("Main quest created successfully!");
//       onSuccess?.();
//       onOpenChange(false);
//       // Reset form
//       setTitle("");
//       setDescription("");
//       setImportance(MainMedium);
//       setDueDate(undefined);
//       setDailyQuests([]);
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to create quest");
//     },
//   });
