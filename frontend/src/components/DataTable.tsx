import React from "react";
import { Table, Spin, Alert } from "antd";

interface DataTableProps {
  data: any[];
  loading: boolean;
  error?: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, loading, error }) => {
  if (loading) return <Spin tip="Loading data..." style={{ display: 'block', marginTop: 20 }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!data.length) return <Alert message="No data found." type="info" showIcon />;

  const columns = Object.keys(data[0]).map((key) => ({
    title: key,
    dataIndex: key,
    key,
  }));

  return (
    <div style={{ marginTop: 16 }}>
      <Table
      dataSource={data.map((row, index) => ({ ...row, key: index }))}
      columns={columns}
      bordered
      style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    />
    </div>
  );
};

export default DataTable;
