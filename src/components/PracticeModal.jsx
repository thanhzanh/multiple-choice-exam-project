import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PracticeModal = ({ show, handleClose, questions, exam }) => {
  
  const navigate = useNavigate();
  // Thời gian làm bài
  const [duration, setDuration] = useState(30);

  // Hàm xử lý khi bấm vào "Xác nhận vào thi"
  const handleConfirm = () => {
    navigate('/exams/practice-exam', {
      state: {
        duration: duration,
        questions: questions,
        title: exam.title,
        examId: exam._id,
      }
    });
  };

  return (
    <>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chọn chế độ luyện thi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <Form.Check label="Giới hạn thời gian làm đề thi" defaultChecked readOnly/>
            <Form.Check label="Không hiển thị ngay đáp án" defaultChecked readOnly/>
            <Form.Check label="Kết quả sẽ hiển thị ngay sau khi nộp bài" defaultChecked readOnly/>

            <hr />

            <h6>Cài đặt đề thi</h6>
            <Form.Group>
              <Form.Label>Thời gian làm bài thi</Form.Label>
                <Form.Select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
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
              <Form.Control type="number" value={questions.length} min={0} readOnly/>
            </Form.Group>

            <Form.Check label="Đảo câu hỏi" className="mt-2" />
            <Form.Check label="Đảo đáp án" />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Xác nhận vào thi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PracticeModal;
