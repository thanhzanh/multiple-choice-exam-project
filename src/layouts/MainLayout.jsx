import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0 d-none d-md-block">
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-0">
          <Header />
          <div className="p-4">{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainLayout;
