import FridgeCounter from "@/components/fridge/FridgeCounter";

export default function Home() {
  const fridgeId = 1; // Replace with your fridge's ID

  return (
    <div>
      <h1>Beer Tracker</h1>
      <FridgeCounter fridgeId={fridgeId} />
    </div>
  );
}
