import Accordion from "@/components/Accordion";
import DistributionGraph from "@/components/DistributionGraph";
import LineGraph from "@/components/LineGraph";
import { CChart } from "@coreui/react-chartjs";

export default function Home() {
  return (
    <div className="h-full w-full px-24 bg-[#121826]">
      <h1 className="text-2xl py-10">
        <strong>Statistics</strong>
      </h1>
      <div class="flex">
        <div class="w-1/3 ml-1 border focus:ring-4 focus:ring-gray-800 border-gray-700 text-gray-300 hover:bg-gray-800 gap-3">
          <DistributionGraph />
        </div>
        <div class="w-2/3 p-5 border focus:ring-4 focus:ring-gray-800 border-gray-700 text-gray-300 hover:bg-gray-800 gap-3">
          <LineGraph/>
        </div>
      </div>
      <h1 className="text-2xl pt-10">
        <strong>Findings</strong>
      </h1>
      <Accordion />
    </div>
  );
}
