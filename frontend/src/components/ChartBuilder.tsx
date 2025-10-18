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

  const chartType: ChartType | undefined = Form.useWatch("chartType", form);
  const aggregationType: AggType | undefined = Form.useWatch("aggregationType", form);
  const x = Form.useWatch("x", form);
  const y = Form.useWatch("y", form);
  const z = Form.useWatch("z", form);

  const usesAxes = chartType !== "pie";
  const requiresX = true;
  const requiresY = aggregationType === "sum" || aggregationType === "average";
  const usesZ = chartType === "multiline";

  const optionsFor = (field: "x" | "y" | "z") =>
    columns.filter((c) => {
      if (field === "x") return true;
      if (field === "y") return c !== x;
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
    if (chartType === "pie") {
      form.setFieldsValue({ y: undefined, z: undefined });
    }
    if (aggregationType === "count") {
      form.setFieldsValue({ y: undefined });
    }
    // if multiline disabled, clear z
    if (chartType !== "multiline") {
      form.setFieldsValue({ z: undefined });
    }
  }, [chartType, aggregationType, form]);

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
        console.log("chart-data response:", data.data);
        onResult(data.data, { params });
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

        {usesAxes && (
          <Form.Item
            name="y"
            label="Y axis (column)"
            rules={
              requiresY
                ? [{ required: true, message: "Y is required for sum/average" }]
                : undefined
            }
          >
            <Select
            placeholder={requiresY ? "Select Y column (required)" : "Select Y column (optional)"}
            allowClear
            disabled={chartType === 'pie'}
            >
            {optionsFor("y").map((col) => (
                <Option key={col} value={col}>
                {col}
                </Option>
            ))}
            </Select>
          </Form.Item>
        )}

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
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChartBuilder;
