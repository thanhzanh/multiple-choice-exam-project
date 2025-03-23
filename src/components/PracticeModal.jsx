import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PracticeTestModal = ({ show, handleClose }) => {

  return (
    <>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chọn chế độ luyện thi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="d-flex" style={{ justifyContent: "space-around" }}>
                <Form.Check type="radio" label="Ôn thi" name="mode" />
                <Form.Check type="radio" label="Thi thử" name="mode" defaultChecked />
            </Form.Group>

            <hr />

            <Form.Check label="Giới hạn thời gian làm đề thi" defaultChecked readOnly/>
            <Form.Check label="Không hiển thị ngay đáp án" defaultChecked readOnly/>
            <Form.Check label="Kết quả sẽ hiển thị ngay sau khi nộp bài" defaultChecked readOnly/>

            <hr />

            <h6>Cài đặt đề thi</h6>
            <Form.Group>
              <Form.Label>Thời gian làm bài thi</Form.Label>
                <Form.Select>
                    <option value={5}>5 phút</option>
                    <option value={10}>10 phút</option>
                    <option value={15}>15 phút</option>
                    <option value={30}>30 phút</option>
                    <option value={45}>45 phút</option>
                    <option value={60}>60 phút</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Số câu hỏi thi</Form.Label>
              <Form.Control type="number" defaultValue={50} min={0} readOnly/>
            </Form.Group>

            {/* <Form.Check label="Đảo câu hỏi" className="mt-2" />
            <Form.Check label="Đảo đáp án" /> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Xác nhận vào thi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PracticeTestModal;
