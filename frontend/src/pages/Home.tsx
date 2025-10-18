import React from "react";
import { Typography, Button, Layout } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Title
          level={3}
          style={{ margin: 0, color: "#1bc47d", fontSize: "45px", textAlign: "center" }}
        >
          Coffee Data Dashboard
        </Title>
        <Paragraph style={{ color: "#555", fontSize: "20px", marginBottom: "2rem", textAlign: "center", paddingTop: "0.5rem" }}>
          Brewing data, one chart at a time
        </Paragraph>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button type="primary" size="large" onClick={() => navigate("/build-chart")} style={{ background: "#1bc47d", borderColor: "#1bc47d" }}>
            Build your chart
          </Button>
          <Button type="default" size="large" onClick={() => navigate("/raw-data")}>
            View Raw Data
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
