import React, { useEffect, useState } from "react";
import { Table, Card, Spin, Alert, Layout } from "antd";
import { getRawData } from "../api/apiService";

const { Content } = Layout;

const RawDataPage: React.FC = () => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

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

  const columns =
    rawData.length > 0
      ? Object.keys(rawData[0]).map((key) => ({
          title: key,
          dataIndex: key,
          key,
        }))
      : [];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Content style={{ padding: "2rem" }}>
        <Card>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Spin tip="Loading data..." />
            </div>
          ) : error ? (
            <Alert message={error} type="error" />
          ) : (
            <Table
              dataSource={rawData}
              columns={columns}
              rowKey={(index) => index.toString()}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default RawDataPage;
