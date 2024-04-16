"use client"
import React from "react";
import { CChart } from "@coreui/react-chartjs";

const LineGraph = () => {
  return (
    <div>
        <CChart
          type="line" 
          data={{
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
              {
                label: "PIIs",
                backgroundColor: "rgba(220, 220, 220, 0.2)",
                borderColor: "rgba(220, 220, 220, 1)",
                pointBackgroundColor: "rgba(220, 220, 220, 1)",
                pointBorderColor: "#fff",
                
                // TODO: Mock data to be replaced 
                data: [40, 20, 12, 39, 10, 40, 39, 80, 40]
            },
            {
                label: "API Keys",
                backgroundColor: "rgba(151, 187, 205, 0.2)",
                borderColor: "rgba(151, 187, 205, 1)",
                pointBackgroundColor: "rgba(151, 187, 205, 1)",
                pointBorderColor: "#fff",

                // TODO: Mock data to be replaced 
                data: [50, 12, 28, 29, 7, 25, 12, 70, 60]
              },
            ],
          }}
        />
    </div>
  );
};

export default LineGraph;
