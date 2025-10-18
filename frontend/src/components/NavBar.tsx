import React from "react";
import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Header style={{ background: "#1bc47d", display: "flex", alignItems: "center" }}>
      <div
        style={{ color: "white", fontWeight: "bold", fontSize: "20px", marginRight: "2rem", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        Coffee Dashboard
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        selectable={false}
        onClick={(e) => {
          if (e.key === "rawData") navigate("/raw-data");
          else if (e.key === "buildChart") navigate("/build-chart");
          else if (e.key === "myCharts") navigate("/my-charts");
        }}
        style={{ background: "#1bc47d", flex: 1 }}
      >
        <Menu.Item key="rawData">View Raw Data</Menu.Item>
        <Menu.Item key="buildChart">Build Your Chart</Menu.Item>
        <Menu.Item key="myCharts">My Charts</Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
