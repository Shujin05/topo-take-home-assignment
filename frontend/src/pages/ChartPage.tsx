import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Button, message, Modal, Input} from "antd";
import ChartBuilder from "../components/ChartBuilder";
import ChartPreview from "../components/ChartPreview";
import { getRawData } from "../api/apiService";

const { Content } = Layout;

const ChartPage: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chartParams, setChartParams] = useState<Record<string, string>>({});
  const [chartError, setChartError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [presetName, setPresetName] = useState("");

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
    if (!presetName) {
      message.error("Please enter a name for the preset.");
      return;
    }
    
    // save to local storage
    const savedPresets = JSON.parse(localStorage.getItem("chartPresets") || "[]");
    savedPresets.push({ name: presetName, config: chartParams });
    localStorage.setItem("chartPresets", JSON.stringify(savedPresets));

    setPresetName("");
    setShowModal(false);
    message.success("Preset saved successfully.");
  };

  const handleModalCancel = () => {
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
              <Button style={{ marginBottom: "1rem" }} onClick={handleSavePreset}>Save Preset</Button>
              <Modal
                title="Save Chart Preset"
                visible={showModal}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Save"
                cancelText="Cancel"
              >
                <Input
                  placeholder="Enter preset name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                />
              </Modal>
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
