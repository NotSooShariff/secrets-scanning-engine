"use client"
import React from "react";
import { CChart } from "@coreui/react-chartjs";

const DistributionGraph = () => {
  return (
    <div >
      <CChart
        className="p-2 lg:p-10"
        type="doughnut"
        data={{
          labels: ["High", "Medium", "Low"],
          datasets: [
            {
              backgroundColor: ["#b73229", "#dbb445", "#357858"],
              data: [39, 39, 12],
            },
          ],
        }}
      />
    </div>
  );
};

export default DistributionGraph;
