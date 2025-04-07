"use client";

import TaskList from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: session, isPending } = useSession();

  const fetchTodos = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    return response.json();
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      //   idToken: {
      //     token:
      //     accessToken:
      // }
    });
  };
  console.log(isPending);
  console.log(session?.user.name);

  if (isLoading) return <p>loading...</p>;

  return (
    <div>
      <Button onClick={signIn}>signIn</Button>
      {/* <div>hi{isPending}</div>
      <div>{session?.user.name}</div> */}
      <div className="flex justify-center">
        <TaskList></TaskList>
      </div>
    </div>
  );
}
