import type { ApexOptions } from "apexcharts";
import ApexCharts from "react-apexcharts";

type BoxPlot = {
  category: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  average?: number;
};

const BoxPlot = ({ boxplot }: { boxplot: BoxPlot[] }) => {
  const series = [
    {
      type: "boxPlot",
      data: boxplot.map((v) => ({
        x: v.category,
        y: [v.min, v.q1, v.median, v.q3, v.max],
      })),
    },
  ];

  const options : ApexOptions = {
    chart: {
      type: "boxPlot",
      height: 350,
      toolbar: {
        show: false,
        tools: {
          zoomin: false,
          zoom: false, 
          zoomout: false,
        },
      }
    },
    title: {
      text: "",
      align: "left",
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: "#8884d8",
          lower: "#82ca9d",
        },
      },
    },
    xaxis: {
      categories: boxplot.map((v) => v.category),
    },
  };

  return (
    <div>
      <ApexCharts options={options} series={series} type="boxPlot" height={300} />
    </div>
  );
};

export default BoxPlot;
