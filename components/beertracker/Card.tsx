"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getUsers } from "@/app/actions/getUsers";
import {
  decrementUserScore,
  incrementUserScore,
} from "@/app/actions/updateCount";

type User = {
  id: string;
  name: string;
  currScore: number | null;
  yearlyScore: number | null;
  monthlyScore: number | null;
  avatarUrl: string | null;
};

export default function UserScoreList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, []);

  const incrementScore = async (userId: string) => {
    try {
      const updatedUser = await incrementUserScore(userId); // Server Action aufrufen
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, currScore: updatedUser.currScore }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to increment score:", error);
    }
  };

  const decrementScore = async (userId: string) => {
    try {
      const updatedUser = await decrementUserScore(userId); // Server Action aufrufen
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, currScore: updatedUser.currScore }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to decrement score:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary-500">
        User Scores
      </h1>
      <div className="space-y-4">
        {users.map((user) => (
          <Card
            key={user.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user.avatarUrl ?? undefined}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-primary-500">
                    {user.name}
                  </CardTitle>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-primary-500">
                <span className="text-2xl font-bold">{user.currScore}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => incrementScore(user.id)}
                  className="rounded-full hover:bg-primary hover:text-primary-foreground text-primary-500"
                >
                  <ChevronUp className="h-4 w-4 text-primary-500" />
                  <span className="sr-only">Increment score</span>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => decrementScore(user.id)}
                  className="rounded-full hover:bg-primary hover:text-primary-foreground text-primary-500"
                >
                  <ChevronDown className="h-4 w-4 text-primary-500" />
                  <span className="sr-only">Decrement score</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
