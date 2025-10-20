import React, { useState, useEffect } from "react";
import { Card, Button, List, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";

const MyCharts: React.FC = () => {
  const [presets, setPresets] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPresetName, setSelectedPresetName] = useState<string>("");

  useEffect(() => {
    const savedPresets = JSON.parse(localStorage.getItem("chartPresets") || "[]");
    setPresets(savedPresets);
  }, []);

  const handleLoadPreset = (preset: Record<string, string>) => {
    const toSet = new URLSearchParams()
    for (const [key, value] of Object.entries(preset.config)) {
      toSet.set(key, value)
    }
    navigate(`/build-chart?${toSet}`, { state: { preset } });
};

  const handleDeletePreset = (presetName: string) => {
    const updatedPresets = presets.filter((preset) => preset.name !== presetName);
    setPresets(updatedPresets);
    localStorage.setItem("chartPresets", JSON.stringify(updatedPresets));
    setShowModal(false);
    message.success("preset deleted successfully!");
    }

  return (
    <Card title="My Charts" style={{ marginBottom: 16 }}>
      <Modal
        title="Confirm Delete?"
        open={showModal}
        onOk={() => {
          handleDeletePreset(selectedPresetName);
        }}
        onCancel={() => setShowModal(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true
        }}
      ></Modal>
      <List
        bordered
        dataSource={presets}
        renderItem={(preset) => (
          <List.Item
            actions={[
              <Button onClick={() => handleLoadPreset(preset)}>Load</Button>,
              <Button danger onClick={() => {
                setShowModal(true);
                setSelectedPresetName(preset.name);
              }}>Delete</Button>,
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
