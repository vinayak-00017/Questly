// "use client";
// import React from "react";

// import TaskElement from "./task-element";
// import { useTasks } from "@/hooks/useTasks";
// import TaskInput from "./task-input";
// import { AnimatedList, AnimatedListItem } from "../magicui/animated-list";
// import { UserTask } from "../../../../packages/types/src/task";

// const TaskList = () => {
//   const {
//     tasks,
//     isLoading,
//     title,
//     setTitle,
//     addTask,
//     updateCompletedState,
//     isPending,
//     points,
//     setPoints,
//     isTimeTracked,
//     setIsTimeTracked,
//     plannedDuration,
//     setPlannedDuration,
//   } = useTasks();

//   if (isLoading) {
//     return <div className="text-center p-4">Loading tasks...</div>;
//   }

//   return (
//     <div className="flex flex-col w-3/5 items-center  gap-6 mx-20">
//       <TaskInput
//         points={points}
//         onPointsChange={setPoints}
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         onSubmit={addTask}
//         isPending={isPending}
//         isTimeTracked={isTimeTracked}
//         onTimeTrackChange={setIsTimeTracked}
//         plannedDuration={plannedDuration}
//         onDurationChange={setPlannedDuration}
//       />

//       {tasks.length === 0 ? (
//         <div className="text-center text-muted-foreground">
//           No tasks yet. Add your first task above!
//         </div>
//       ) : (
//         <AnimatedList delay={300} className="w-full max-w-md space-y-2">
//           {[...tasks]
//             .sort((a, b) => {
//               // First factor: completed status (incomplete tasks first)
//               if (a.completed !== b.completed) {
//                 return a.completed ? -1 : 1; // Incomplete tasks first
//               }

//               // Second factor: points value (higher points first)
//               const pointsA = a.points || a.basePoints || 0;
//               const pointsB = b.points || b.basePoints || 0;

//               if (pointsA !== pointsB) {
//                 return pointsA - pointsB; // Higher points first (descending order)
//               }

//               // Third factor: most recently updated first
//               const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
//               const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
//               return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
//             })
//             .map((taskItem: UserTask, index: number) => (
//               <AnimatedListItem key={taskItem.id || `task-${index}`}>
//                 <TaskElement
//                   points={
//                     taskItem.isTimeTracked && taskItem.plannedDuration
//                       ? Math.round(
//                           taskItem.basePoints *
//                             (taskItem.plannedDuration / 60) *
//                             100
//                         ) / 100
//                       : taskItem.basePoints
//                   }
//                   task={taskItem.title}
//                   isChecked={!!taskItem.completed}
//                   setIsChecked={(e) => updateCompletedState(taskItem.id, e)}
//                 />
//               </AnimatedListItem>
//             ))}
//         </AnimatedList>
//       )}
//     </div>
//   );
// };

// export default TaskList;
