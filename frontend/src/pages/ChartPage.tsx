import React, { useState } from "react";
import { Layout, Row, Col, Button, Modal, Input, Typography, Table } from "antd";
import ChartBuilder from "../components/ChartBuilder";
import ChartPreview from "../components/ChartPreview";

const { Content } = Layout;
const { Text } = Typography;

const ChartPage: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartParams, setChartParams] = useState<Record<string, string>>({});
  const [chartError, setChartError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [presetName, setPresetName] = useState("");
  const [presetExist, setPresetExist] = useState<boolean>(false);
  
  const [showTable, setShowTable] = useState(false);

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

  const handleToggleTable = () => {
    setShowTable(!showTable);
  };

  const getTableCols = (chartData: any[]) => {
    const tableColumns = Object.keys(chartData[0] || {}).map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key,
    }));
    return tableColumns;
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Content style={{ padding: "2rem" }}>
        <Row gutter={16}>
          <Col xs={24} md={10}>
            <ChartBuilder
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
            <Button style={{ marginBottom: "1rem" }} onClick={handleSavePreset} disabled={Object.keys(chartParams).length === 0}>Save Chart</Button>
            <Button style={{
              marginLeft: "1rem",
              backgroundColor: showTable ? "#1bc47d" : "white",
              color: showTable ? "white" : "black",
            }} onClick={handleToggleTable} disabled={Object.keys(chartData).length === 0}>
              {showTable ? "Hide Table" : "Show Table"}
            </Button>
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
            {showTable && (
              <Table
                dataSource={chartData}
                columns={getTableCols(chartData)}
                rowKey={(index) => index.toString()}
                style={{ marginTop: "1rem" }}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ChartPage;
