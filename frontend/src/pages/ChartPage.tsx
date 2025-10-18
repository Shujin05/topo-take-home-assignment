import React, { useEffect, useState } from "react";
import { Layout, Row, Col } from "antd";
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
