import React from "react";
import { Nav } from "react-bootstrap";

const ExamTabs = ({ activeTab, setActiveTab }) => {
  return (
    <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
      <Nav.Item>
        <Nav.Link eventKey="info">Thông tin cơ bản</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="questions">Soạn câu hỏi</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="settings">Cài đặt nâng cao</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default ExamTabs;
