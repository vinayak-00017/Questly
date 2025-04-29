// import { Decrease, Increase } from "@/utils/Icons";

// import React, { useState } from "react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { Label } from "../ui/label";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// const PointSelect = ({
//   points,
//   onPointsChange,
// }: {
//   points: number;
//   onPointsChange: (points: number) => void;
// }) => {
//   const [customValue, setCustomValue] = useState(points.toString());

//   const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCustomValue(value);

//     // Parse as integer and update if valid
//     const num = parseInt(value, 10);
//     if (!isNaN(num) && num > 0) {
//       onPointsChange(Math.min(10, num));
//     }
//   };
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <div className="flex gap-2 items-center">
//           <label className="text-sm font-medium">Priority:</label>
//           <Button variant="outline" size="sm" className="h-8">
//             {points} points
//           </Button>
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="w-[280px] p-4">
//         <Tabs defaultValue="preset">
//           <TabsList className="grid w-full grid-cols-2 mb-4">
//             <TabsTrigger value="preset">Preset Values</TabsTrigger>
//             <TabsTrigger value="custom">Custom Value</TabsTrigger>
//           </TabsList>

//           <TabsContent value="preset" className="space-y-4">
//             <div className="flex flex-col gap-2">
//               {[
//                 { value: "5", label: "Top Priority (5)" },
//                 { value: "3", label: "High Priority (3)" },
//                 { value: "2", label: "Medium Priority (2)" },
//                 { value: "1", label: "Low Priority (1)" },
//               ].map((option) => (
//                 <Button
//                   key={option.value}
//                   variant={
//                     points === parseInt(option.value) ? "default" : "outline"
//                   }
//                   className="w-full justify-start"
//                   onClick={() => onPointsChange(parseInt(option.value, 10))}
//                 >
//                   {option.label}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="custom">
//             <div className="space-y-2">
//               <Label htmlFor="custom-points">Custom Points Value</Label>
//               <div className="flex items-center rounded-md border border-input overflow-hidden">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 rounded-none border-r border-input px-2 flex-shrink-0"
//                   onClick={() => {
//                     const newValue = Math.max(1, parseInt(customValue, 10) - 1);
//                     setCustomValue(newValue.toString());
//                     onPointsChange(newValue);
//                   }}
//                   disabled={
//                     parseInt(customValue, 10) <= 1 ||
//                     parseInt(customValue, 10) > 10
//                   }
//                 >
//                   <span className="sr-only">Decrease</span>
//                   <Decrease />
//                 </Button>
//                 <Input
//                   id="custom-points"
//                   type="text"
//                   inputMode="numeric" // Ensures numeric keyboard on mobile
//                   pattern="[0-9]*" // Validates only digits
//                   min="1"
//                   max="10"
//                   value={customValue}
//                   onChange={handleCustomValueChange}
//                   className="border-0 rounded-none text-center focus-visible:ring-0"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 rounded-none border-l border-input px-2 flex-shrink-0"
//                   onClick={() => {
//                     const newValue = parseInt(customValue, 10) + 1;
//                     setCustomValue(newValue.toString());
//                     onPointsChange(newValue);
//                   }}
//                   disabled={
//                     parseInt(customValue, 10) < 1 ||
//                     parseInt(customValue, 10) >= 10
//                   }
//                 >
//                   <span className="sr-only">Increase</span>
//                   <Increase />
//                 </Button>
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Enter a value between 1 and 10
//               </p>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default PointSelect;
