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

const ChartPreview: React.FC<Props> = ({ chartType, chartData, params, error }) => {
  if (error) return <Alert type="error" message={error} />;
  if (!chartData || chartData.length === 0) return <Empty description="No chart data" />;

  if (chartType === "pie") {
    // format: { name: 'Latte', value: 10 }
    return (
      <Card title="Pie Chart Preview">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey={params?.y} nameKey={params?.x} outerRadius={100} label>
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
  }

  if (chartType === "bar") {
    const firstRow = chartData[0];
    if (!firstRow) return <Empty description="Invalid chart data" />;

    const xKey = params?.x;
    const yKey = params?.y;

    return (
        <Card title="Bar Chart Preview">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill={COLORS[0]} />
            </BarChart>
        </ResponsiveContainer>
        </Card>
    );
    }

  if (chartType === "line") {
    const xKey = Object.keys(chartData[0])[0];
    const yKey = Object.keys(chartData[0])[1] ?? "value";
    return (
      <Card title="Line Chart Preview">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yKey} stroke={COLORS[0]} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    );
  }

  if (chartType === "multiline") {
    // format: { x: '2025-01', series: [{ name: 'A', value: 1 }, { name: 'B', value: 2 } ] }
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
  }

  if (chartType === "boxplot") {
    return (
      <Card title="Boxplot Summary (fallback)">
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(chartData, null, 2)}</pre>
      </Card>
    );
  }

  return <div>Unsupported chart type</div>;
};

export default ChartPreview;
