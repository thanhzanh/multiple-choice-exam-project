import React, { useState } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import ExamTabs from "../components/ExamTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateExam = () => {
  const [activeTab, setActiveTab] = useState("info"); // State để lưu tab đang chọn

  return (
    <MainLayout>
      <h3 className="mb-4">Tạo đề thi mới</h3>

      <div className="mt-4">
        <Row>
          {/* Ảnh đề thi */}
          <Col md={3}>
            <Card className="p-3 text-center">
              <Card.Body>
                <h5>Ảnh đề thi</h5>
                <Form.Group>
                  <Form.Control
                    type="file"
                    name="image"
                     />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Thông tin cơ bản */}
          <Col md={5}>
            <Card className="p-3">
              <Card.Body>
                <h5>Thông tin cơ bản</h5>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Tên đề thi</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Nhập tên đề thi" />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Trình độ</Form.Label>
                    <Form.Select name="level">
                      <option>Chọn trình độ</option>
                      <option value="Tiểu học">Tiểu học</option>
                      <option value="THCS">THCS</option>
                      <option value="THPT">THPT</option>
                      <option value="Cao đẳng">Cao đẳng</option>
                      <option value="Đại học">Đại học</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Môn học</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="subject"
                      placeholder="Nhập tên môn học" />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Chủ đề</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="topic"
                      placeholder="Nhập tên chủ đề" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      placeholder="Mô tả bổ sung"
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Cấu hình truy cập */}
          <Col md={4}>
            <Card className="p-3">
              <Card.Body>
                <h5>Cấu hình truy cập</h5>
                <Form.Group className="mb-2">
                  <Form.Label>Phạm vi chia sẻ</Form.Label>
                  <Form.Select>
                    <option>Riêng tư</option>
                    <option>Công khai</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Nút tạo đề thi */}
      <div className="mt-4 text-end">
        <Button variant="secondary" className="me-2">
          Trở về
        </Button>
        <Button variant="primary">Tạo đề thi</Button>
      </div>
    </MainLayout>
  );
};

export default CreateExam;
