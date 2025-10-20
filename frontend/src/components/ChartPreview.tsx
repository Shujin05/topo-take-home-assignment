import React from "react";
import { Card, Empty, Alert } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import BoxPlot from "./BoxPLot";


type Props = {
  chartType?: string | null;
  chartData: any[];
  params?: Record<string, string>;
  error?: string | null;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a4de6c",
  "#d0ed57",
  "#8dd1e1",
];


const renderPieChart = (chartData: any[], params: Record<string, string> | undefined) => (
  <Card title="Pie Chart Preview">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} dataKey={params?.aggregationType} nameKey={params?.x} outerRadius={100} label>
          {chartData.map((_, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

const renderBarChart = (chartData: any[], params: Record<string, string> | undefined) => {
  const xKey = params?.x;
  const aggregationType = params?.aggregationType;

  return (
    <Card title="Bar Chart Preview">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={aggregationType} fill={COLORS[0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

const renderLineChart = (chartData: any[], params: Record<string, string> | undefined) => {
  const xKey = params?.x;
  const aggregationType = params?.aggregationType;

  return (
    <Card title="Line Chart Preview">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={aggregationType} stroke={COLORS[0]} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

const renderMultilineChart = (chartData: any[]) => {
  const keys = Object.keys(chartData[0]);
  const xKey = keys[0];
  const valueKeys = keys.slice(1);

  return (
    <Card title="Multiline Chart Preview">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {valueKeys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} />
          ))}
        </LineChart> 
      </ResponsiveContainer>
    </Card>
  );
};

const ChartPreview: React.FC<Props> = ({ chartType, chartData, params, error }) => {
  if (error) return <Alert type="error" message={error} />;
  if (!chartData || chartData.length === 0) return <Empty description="No chart data" />;

  switch (chartType) {
    case "pie":
      return renderPieChart(chartData, params);
    case "bar":
      return renderBarChart(chartData, params);
    case "line":
      return renderLineChart(chartData, params);
    case "multiline":
      return renderMultilineChart(chartData);
    case "boxplot":
      return (
      <Card title="Boxplot Preview" style={{ height: "400px" }}> 
          <BoxPlot boxplot={chartData} />
      </Card>
      );
    default:
      return <div>Unsupported chart type</div>;
  }
};

export default ChartPreview;
