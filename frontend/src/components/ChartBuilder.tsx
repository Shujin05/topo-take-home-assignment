import React, { useEffect, useMemo, useState } from "react";
import { Card, Form, Select, Button, Radio, Alert } from "antd";
import { getChartData } from "../api/apiService";

const { Option } = Select;

export type ChartType = "bar" | "line" | "pie" | "multiline" | "boxplot";
export type AggType = "count" | "sum" | "average";

type Props = {
  columns: string[];
  onResult: (chartData: any[], meta: { params: Record<string, string> }) => void;
};

const ChartBuilder: React.FC<Props> = ({ columns, onResult }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const chartType: ChartType | undefined = Form.useWatch("chartType", form);
  const aggregationType: AggType | undefined = Form.useWatch("aggregationType", form);
  const x = Form.useWatch("x", form);
  const y = Form.useWatch("y", form);
  const z = Form.useWatch("z", form);

  const isPieChart = chartType === "pie";
  const requiresY = (( aggregationType === "sum") || (aggregationType === "average"));
  const usesZ = (chartType === "multiline");

  const optionsFor = (field: "x" | "y" | "z") =>
    columns.filter((c) => {
      if (field === "x") return c !== y && c !== z;
      if (field === "y") return c !== x && c !== y;
      if (field === "z") return c !== x && c !== y;
      return true;
    });

  const isValid = useMemo(() => {
    if (!chartType) return false;
    if (!aggregationType) return false;
    if (!x) return false;
    if (aggregationType === "sum" || aggregationType === "average") {
      if (!y) return false;
    }
    return true;
  }, [chartType, aggregationType, x, y]);

  useEffect(() => {
    if (aggregationType === "count") {
      form.setFieldsValue({ y: undefined });
    }
    if (chartType !== "multiline") {
      form.setFieldsValue({ z: undefined });
    }
  }, [chartType, aggregationType, form]);

  const aggregateData = (data: any[], groupByKey: string, aggregationType: AggType) => {
    const aggregated: Record<string, { sum: number, count: number }> = {};

    data.forEach((item) => {
      const key = item[groupByKey];
      const amount = parseFloat(item.amount);

      if (!isNaN(amount)) {
        if (aggregated[key]) {
          aggregated[key].sum += amount;
          aggregated[key].count += 1;
        } else {
          aggregated[key] = { sum: amount, count: 1 };
        }
      } else {
        aggregated[key] = { sum: NaN, count: 0 };
      }
    });

    return Object.keys(aggregated).map((key) => {
      const { sum, count } = aggregated[key];
      const average = count > 0 ? sum / count : NaN;
      return {
        [groupByKey]: key,
        sum: sum,
        average: average,
      };
    });
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const previousConfig = history[history.length - 2];
      form.setFieldsValue(previousConfig);
      handleGenerate()
      setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    }
  };


  const handleGenerate = async () => {
    setError(null);
    const values = form.getFieldsValue(true);

    const params: Record<string, string> = {
      chartType: values.chartType,
      aggregationType: values.aggregationType,
      x: values.x,
    };

    if (values.y) params.y = values.y;
    if (values.z) params.z = values.z;

    setLoading(true);

    try {
      const data = await getChartData(params);
      console.log("chart-data response:", data.data); // Debugging

      if ((values.aggregationType === "sum" || values.aggregationType === "average") && values.x) {
        const aggregatedData = aggregateData(data.data, values.x, values.aggregationType);
        console.log("Aggregated Data:", aggregatedData); // Debugging

        const isInvalidData = aggregatedData.some(item => isNaN(item.sum));

        if (isInvalidData) {
          setError("Please select a numerical column for the Y-axis.");
          onResult([], { params });
          return;
        } 
        onResult(aggregatedData, { params });
      } else {
        onResult(data.data, { params });
      }
      setHistory((prevHistory) => [...prevHistory, values]);

    } catch (err: any) {
      console.error("chart-data error:", err);
      setError(
        err?.response?.data?.message ?? "Failed to fetch chart data. Please try a different configuration."
      );
      onResult([], { params });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Chart Builder" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          chartType: "bar",
          aggregationType: "count",
        }}
      >
        <Form.Item name="chartType" label="Chart type" rules={[{ required: true }]}>
        <Radio.Group buttonStyle="solid">
            <Radio.Button value="bar">Bar</Radio.Button>
            <Radio.Button value="line">Line</Radio.Button>
            <Radio.Button value="pie">Pie</Radio.Button>
            <Radio.Button value="multiline">Multiline</Radio.Button>
            <Radio.Button value="boxplot">Boxplot</Radio.Button>
        </Radio.Group>
        </Form.Item>
        <Form.Item name="aggregationType" label="Aggregation" rules={[{ required: true }]}>
          <Select>
            <Option value="count">count</Option>
            <Option value="sum">sum</Option>
            <Option value="average">average</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="x"
          label={chartType === "pie" ? "Categorical column (for pie slices)" : "X axis (column)"}
          rules={[{ required: true, message: "Please select X column" }]}
        >
          <Select placeholder="Select column for X">
            {optionsFor("x").map((col) => (
              <Option key={col} value={col}>
                {col}
              </Option>
            ))}
          </Select>
        </Form.Item>

          <Form.Item
            name="y"
            label="Y axis (column)"
            rules={
              aggregationType !== "count" && requiresY
                ? [{ required: true, message: "Y is required for sum/average" }]
                : undefined
            }
          >
            <Select
              placeholder={aggregationType === "count" ? "Y column not required for aggregation type 'count'" : isPieChart? "Select optional numerical column" : requiresY ? "Select Y column (required)" : "Select Y column (optional)"}
              allowClear
              disabled={aggregationType === "count"}
            >
              {optionsFor("y").map((col) => (
                <Option key={col} value={col}>
                  {col}
                </Option>
              ))}
            </Select>
          </Form.Item>

        {usesZ && (
          <Form.Item name="z" label="Z axis (group by - optional)">
            <Select placeholder="Optional Z column for grouping" allowClear>
              {optionsFor("z").map((col) => (
                <Option key={col} value={col}>
                  {col}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {error && <Alert type="error" message={error} style={{ marginBottom: 8 }} />}

        <Form.Item>
          <Button type="primary" onClick={handleGenerate} disabled={!isValid || loading} loading={loading}>
            Generate Chart
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => {
              form.resetFields(["x", "y", "z"]);
              setError(null);
              onResult([], { params: {} });
            }}
          >
            Reset
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleUndo} disabled={history.length < 1}>
            Undo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChartBuilder;
