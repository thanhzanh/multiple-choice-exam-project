import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Row, Col, Form, Card } from "react-bootstrap";
import TinyMCEEditor from "../components/TinyMCEEditor";

const CreateQuestion = () => {
  const [question, setQuestion] = useState("");

  return (
    <MainLayout>
      <h3 className="mb-4">Tạo câu hỏi</h3>

      <div className="mt-4">
        <Row>
          {/* Danh sách phần thi */}
          <Col className="" md={4}>
            <Card>
              <Card.Body>
                <h5>Danh sách phần thi</h5>
                <Form>
                  <Form.Group>
                    <Form.Label></Form.Label>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Thêm câu hỏi */}
          <Col className="" md={8}>
            <Card>
                <Card.Body>
                  <h5>Thêm câu hỏi</h5>
                  <Form>
                    <Form.Group className="mb-2">
                      <Form.Label>Loại câu hỏi</Form.Label>
                      <Form.Select name="type" >
                        <option>Một đáp án</option>
                        <option>Nhiều đáp án</option>
                        <option>Điền từ</option>
                        <option>Đúng sai</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Soạn câu hỏi</Form.Label>
                      <TinyMCEEditor value={question} onChange={setQuestion} />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CreateQuestion;
