"use client"; // Markiere die gesamte Datei als Client-kompatibel

import { createUser } from "../../actions/createUser";
import { updateCount } from "../../actions/updateCount";
import { useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  const handleCreateUser = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const response = await createUser({ name });

    if (response.success) {
      setUser(response.user);
    } else {
      console.error("Failed to create user:", response.error);
    }
  };

  const handleUpdateCount = async (increment: boolean) => {
    if (!user) return;

    const response = await updateCount({ userId: user.id, increment });

    if (response.success) {
      setUser(response.user);
    } else {
      console.error("Failed to update counts:", response.error);
    }
  };

  return (
    <div>
      {!user ? (
        <form action={handleCreateUser}>
          <input name="name" type="text" placeholder="Name" required />
          <button type="submit">Create User</button>
        </form>
      ) : (
        <div>
          <h1>User: {user.name}</h1>
          <div>
            <p>Current Count: {user.currCount}</p>
            <p>Monthly Count: {user.monthlyCount}</p>
            <p>Yearly Count: {user.yearlyCount}</p>
            <button onClick={() => handleUpdateCount(true)}>
              Increment All
            </button>
            <button onClick={() => handleUpdateCount(false)}>
              Decrement All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
