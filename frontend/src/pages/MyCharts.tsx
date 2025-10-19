import React, { useState, useEffect } from "react";
import { Card, Button, List, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";

const MyCharts: React.FC = () => {
  const [presets, setPresets] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPresets = JSON.parse(localStorage.getItem("chartPresets") || "[]");
    setPresets(savedPresets);
  }, []);

  const handleLoadPreset = (preset: any) => {
    navigate("/build-chart", { state: { preset } });

  };

  const handleDeletePreset = (presetName: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this preset?",
      onOk: () => {
        const updatedPresets = presets.filter((preset) => preset.name !== presetName);
        setPresets(updatedPresets);
        localStorage.setItem("chartPresets", JSON.stringify(updatedPresets));
        message.success("Preset deleted successfully");
      },
    });
  };

  return (
    <Card title="My Charts" style={{ marginBottom: 16 }}>
      <List
        bordered
        dataSource={presets}
        renderItem={(preset) => (
          <List.Item
            actions={[
              <Button onClick={() => handleLoadPreset(preset)}>Load</Button>,
              <Button danger onClick={() => handleDeletePreset(preset.name)}>Delete</Button>,
            ]}
          >
            {preset.name}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MyCharts;
