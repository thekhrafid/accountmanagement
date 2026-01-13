import AddTransaction from "@/components/AddTransaction";
import Charts from "@/components/Charts";
import TopCards from "@/components/TopCards";
import TransactionList from "@/components/TransactionList";

export default function Dashboard() {
  return (
    <div className="flex">
      <main className="p-6 w-full">
        <AddTransaction/>
        <TopCards />
        <Charts />
        <TransactionList/>
      </main>
    </div>
  );
}
