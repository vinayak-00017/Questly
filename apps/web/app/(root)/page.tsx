"use client";

import MainQuestCard from "@/components/main-quest/main-quest-card";
import QuestCard from "@/components/quest-card";

import TaskProgress from "@/components/task/task-progress";
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

  if (isLoading) return <p>loading...</p>;

  return (
    <div>
      <Button onClick={signIn}>signIn</Button>
      {/* <div>hi{isPending}</div>
      <div>{session?.user.name}</div> */}
      <div className="flex flex-col w-full justify-center ">
        <QuestCard></QuestCard>
        <MainQuestCard></MainQuestCard>
        {/* <TaskList></TaskList> */}
        {/* <TaskProgress></TaskProgress> */}
      </div>
    </div>
  );
}
