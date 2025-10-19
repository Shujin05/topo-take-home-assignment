import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Scatter,
} from "recharts";

type BoxPlot = {
  min: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  max: number;
  average?: number;
};

type BoxPlotData = {
  min: number;
  bottomWhisker: number;
  bottomBox: number;
  topBox: number;
  topWhisker: number;
  average?: number;
  size: number;
};

const HorizonBar = ({ x, y, width, height }: any) => {
  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return (
    <line x1={x} y1={y} x2={x + width} y2={y} stroke={"#000"} strokeWidth={3} />
  );
};

const DotBar = ({ x, y, width, height }: any) => {
  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return (
    <line
      x1={x + width / 2}
      y1={y + height}
      x2={x + width / 2}
      y2={y}
      stroke={"#000"}
      strokeWidth={2}
      strokeDasharray={"4"}
    />
  );
};

const useBoxPlot = (boxPlots: BoxPlot[]): BoxPlotData[] => {
  const data = useMemo(
    () =>
      boxPlots.map((v) => {
        return {
          min: v.min,
          bottomWhisker: v.lowerQuartile - v.min,
          bottomBox: v.median - v.lowerQuartile,
          topBox: v.upperQuartile - v.median,
          topWhisker: v.max - v.upperQuartile,
          average: v.average,
          size: 100,
        };
      }),
    [boxPlots]
  );

  return data;
};

export default function BoxPlotChart({ boxplot }: { boxplot: BoxPlot[] }) {
  const data = useBoxPlot(boxplot);

  return (
    <ResponsiveContainer height={300} width="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <Bar stackId={"a"} dataKey={"min"} fill={"none"} />
        <Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />
        <Bar stackId={"a"} dataKey={"bottomWhisker"} shape={<DotBar />} />
        <Bar stackId={"a"} dataKey={"bottomBox"} fill={"#8884d8"} />
        <Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />
        <Bar stackId={"a"} dataKey={"topBox"} fill={"#8884d8"} />
        <Bar stackId={"a"} dataKey={"topWhisker"} shape={<DotBar />} />
        <Bar stackId={"a"} dataKey={"bar"} shape={<HorizonBar />} />
        <ZAxis type="number" dataKey="size" range={[0, 250]} />
        <Scatter dataKey="average" fill={"red"} stroke={"#FFF"} />
        <XAxis />
        <YAxis />
      </ComposedChart>
    </ResponsiveContainer>
  );
}