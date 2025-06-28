// lib/hooks/useUsers.ts
import useSWR from "swr";

export type User = {
  id: string;
  name: string;
  balance: number;
  currScore: number;
};

export function useUsers() {
  interface UseUsersResult {
    users: User[] | undefined;
    error: any;
    isLoading: boolean;
  }

  const {
    data,
    error,
    isLoading,
  }: {
    data: User[] | undefined;
    error: any;
    isLoading: boolean;
  } = useSWR<User[]>(
    "/api/users",
    (url: string): Promise<User[]> =>
      fetch(url).then((res: Response) => res.json())
  );
  return { users: data, error, isLoading };
}
