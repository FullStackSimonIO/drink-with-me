import useSWR from "swr";

export type User = {
  id: string;
  name: string;
  balance: number;
  currScore: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    "/api/users",
    fetcher,
    {
      refreshInterval: 5000, // optional: alle 5 Sekunden automatisch refetchen
      revalidateOnFocus: true, // optional: wenn der Tab in den Vordergrund kommt
    }
  );
  return { users: data, error, isLoading, mutate };
}
