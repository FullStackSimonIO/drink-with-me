// components/FridgeCounterServer.tsx
import { getBeerCount } from "@/app/actions/fridgeActions";
import FridgeCounter from "./FridgeCounter";

export default async function FridgeCounterServer({ fridgeId }: any) {
  const initialCount = await getBeerCount(fridgeId);
  return <FridgeCounter initialCount={initialCount} fridgeId={fridgeId} />;
}
