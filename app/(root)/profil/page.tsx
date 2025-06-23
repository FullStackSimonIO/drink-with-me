import { getUsers } from "@/app/actions/getUsers";
import UserScoreList from "@/components/beertracker/Card";
import { ProfileCard } from "@/components/ProfileCard";
import React from "react";

const page = async () => {
  const users = await getUsers();

  return (
    <div className="flex items-center justify-center w-full h-screen background-light800_dark300">
      <ProfileCard />
    </div>
  );
};

export default page;
