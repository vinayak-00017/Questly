import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TaskInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isPending: boolean;
}

const TaskInput = ({
  value,
  onChange,
  onSubmit,
  isPending,
}: TaskInputProps) => {
  return (
    <div className="flex gap-2 w-full max-w-md">
      <Input
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder="Add a new task..."
        disabled={isPending}
      />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Top">Top</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onSubmit} disabled={isPending}>
        {isPending ? "Adding..." : "Add Task"}
      </Button>
    </div>
  );
};

export default TaskInput;
