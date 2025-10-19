import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Button, Modal, Input, Typography } from "antd";
import ChartBuilder from "../components/ChartBuilder";
import ChartPreview from "../components/ChartPreview";
import { getRawData } from "../api/apiService";

const { Content } = Layout;
const { Text } = Typography;

const ChartPage: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chartParams, setChartParams] = useState<Record<string, string>>({});
  const [chartError, setChartError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [presetName, setPresetName] = useState("");
  const [presetExist, setPresetExist] = useState<boolean>(false);

  const dataColumns = Object.keys(rawData[0] || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRawData();
        setRawData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSavePreset = () => {
    setShowModal(true);
  };

  const handleModalOk = () => {
    const savedPresets = JSON.parse(localStorage.getItem("chartPresets") || "[]");
    const existingPreset = savedPresets.find((preset: { name: string }) => preset.name === presetName);

    if (existingPreset) {
      setPresetExist(true);
      return;
    }

    savedPresets.push({ name: presetName, config: chartParams });
    localStorage.setItem("chartPresets", JSON.stringify(savedPresets));

    setPresetName("");
    setShowModal(false);
    setPresetExist(false);
    setShowSuccess(true);
  };

  const handleModalCancel = () => {
    setPresetExist(false);
    setPresetName("");
    setShowModal(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Content style={{ padding: "2rem" }}>
        <Row gutter={16}>
          <Col xs={24} md={10}>
            <ChartBuilder
              columns={dataColumns}
              onResult={(data, meta) => {
                setChartData(data);
                setChartParams(meta.params);
                setChartError(
                  data.length === 0
                    ? "No data returned for this configuration."
                    : null
                );
              }}
            />
          </Col>
          <Col xs={24} md={14}>
            <Button style={{ marginBottom: "1rem" }} onClick={handleSavePreset} disabled={Object.keys(chartParams).length === 0}>Save Preset</Button>
            <Modal
              title="Save Chart Preset"
              open={showModal}
              onOk={handleModalOk}
              onCancel={handleModalCancel}
              okText="Save"
              cancelText="Cancel"
              okButtonProps={{
                disabled: !presetName,
              }}
            >
              <Input
                placeholder="Enter preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
              {presetExist && (
                <Text type="danger" style={{ marginTop: "8px" }}>
                  A preset with this name already exists.
                </Text>
              )}
            </Modal>
            <Modal
              title="Preset saved successfully"
              open={showSuccess}
            ></Modal>

            <Modal
              title={<span style={{ color: "#1bc47d" }}>Preset saved successfully</span>}
              open={showSuccess}
              onCancel={() => setShowSuccess(false)}
              onOk={() => setShowSuccess(false)}
            ></Modal>
            <ChartPreview
              chartType={chartParams.chartType}
              chartData={chartData}
              params={chartParams}
              error={chartError}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ChartPage;
