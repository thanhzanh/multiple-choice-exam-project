import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-toastify";
import { editExam, getExamById } from "../services/ExamService";
import { useParams } from "react-router-dom";

const EditExam = () => {
  const navigate = useNavigate();

  const { examId } = useParams(); // lấy examId gửi lên  
  console.log(examId);
  
  const [errors, setErrors] = useState({}); // Lưu lỗi

  const [imagePreview, setImagePreview] = useState(null); // hiển thị ảnh xem trước

  useEffect(() => {
    if (examId) {
        getExamById(examId).then((response) => {
            
            setExam({
                title: response.title,
                description: response.description,
                level: response.level,
                subject: response.subject,
                topic: response.topic,
                privacy: response.privacy,
                status: response.status,
                image: null
            });

            if (response.image) {
                setImagePreview(`http://localhost:3000/uploads/${response.image}`)
            } else {
                setImagePreview(null);
            }                       
        });
    }
  }, [examId]);

  const [exam, setExam] = useState({
    title: "",
    description: "",
    level: "",
    subject: "",
    topic: "",
    privacy: "",
    status: "",
    image: null,
  });

  const handleChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  // xử lý hình ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExam({ ...exam, image: file });

      // Hiển thị ảnh xem trước
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // validate form khi gửi lên server
  const validateForm = () => {
    let newErrors = {};

    if (!exam.title.trim()) newErrors.title = "Tên đề thi không được để trống!";
    if (!exam.level) newErrors.level = "Vui lòng chọn trình độ!";
    if (!exam.subject.trim())
      newErrors.subject = "Môn học không được để trống!";
    if (!exam.topic.trim()) newErrors.topic = "Chủ đề không được để trống!";
    if (!exam.description.trim())
      newErrors.description = "Mô tả không được để trống!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Nếu không có lỗi, trả về true
  };

  const handleEditExam = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("title", exam.title);
    formData.append("description", exam.description);
    formData.append("level", exam.level);
    formData.append("subject", exam.subject);
    formData.append("topic", exam.topic);
    formData.append("privacy", exam.privacy);
    formData.append("status", exam.status);

    // Kiểm tra nếu có ảnh thì mới gửi
    if (exam.image && exam.image instanceof File) {
        formData.append("image", exam.image);
    }      

    try {
      await editExam(examId, formData); // gọi API chỉnh sửa

      toast.success("Chỉnh sửa thành công");
      navigate("/workspace/exams/list");
    } catch (error) {
      toast.error("Lỗi khi chỉnh sửa đề thi");
    }
  };

  return (
    <MainLayout>
      <h4 className="mb-4">Chỉnh sửa đề thi</h4>

      <div className="mt-2">
        <Row>
          {/* Ảnh đề thi */}
          <Col md={3}>
            <Card className="p-3 text-center" style={{ height: 350 }}>
              <Card.Body>
                <h5>Ảnh đề thi</h5>
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    border: "2px dashed #ccc", // Viền nét đứt khi chưa có ảnh
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "#f8f9fa", // Màu nền xám nhẹ
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Ảnh xem trước"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#aaa" }}>Chưa chọn ảnh</span> // Hiển thị khi chưa có ảnh
                  )}
                </div>

                <Form.Group className="mt-3">
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
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
                      value={exam.title}
                      onChange={handleChange}
                      isInvalid={!!errors.title}
                      placeholder="Nhập tên đề thi"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Trình độ</Form.Label>
                    <Form.Select
                      name="level"
                      value={exam.level}
                      onChange={handleChange}
                      isInvalid={!!errors.level}
                    >
                      <option>Chọn trình độ</option>
                      <option value="Tiểu học">Tiểu học</option>
                      <option value="THCS">THCS</option>
                      <option value="THPT">THPT</option>
                      <option value="Cao đẳng">Cao đẳng</option>
                      <option value="Đại học">Đại học</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.level}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Môn học</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={exam.subject}
                      onChange={handleChange}
                      isInvalid={!!errors.subject}
                      placeholder="Nhập tên môn học"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.subject}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Chủ đề</Form.Label>
                    <Form.Control
                      type="text"
                      name="topic"
                      value={exam.topic}
                      onChange={handleChange}
                      isInvalid={!!errors.topic}
                      placeholder="Nhập tên chủ đề"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.topic}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={exam.description}
                      onChange={handleChange}
                      placeholder="Mô tả bổ sung"
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
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
                  <Form.Select
                    name="privacy"
                    value={exam.privacy}
                    onChange={handleChange}
                  >
                    <option>Chọn phạm vi</option>
                    <option value="private">Riêng tư</option>
                    <option value="public">Công khai</option>
                  </Form.Select>
                </Form.Group>

                {/* Trạng thái */}
                <Form.Group>
                  <Form.Label>Trạng thái đề thi</Form.Label>
                  <Form.Select
                    name="status"
                    value={exam.status}
                    onChange={handleChange}
                  >
                    <option>Chọn trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Dừng hoạt động</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Nút cập nhât đề thi */}
      <div className="mt-4 text-end">
        <Button variant="secondary" className="me-2">
          Trở về
        </Button>
        <Button variant="primary" onClick={handleEditExam}>
          Cập nhật đề thi
        </Button>
      </div>
    </MainLayout>
  );
};

export default EditExam;
