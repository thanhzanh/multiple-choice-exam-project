import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout";
import { toast } from "react-toastify";
import { createExam, getListEnumExam } from "../../services/ExamService";

const CreateExam = () => {
  //
  const navigate = useNavigate();
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

  const [levels, setLevels] = useState([]);

  const getLevels = async () => {
    try {
      const response = await getListEnumExam();

      setLevels(response.levels);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trình độ:", error);
    }
  };

  const [errors, setErrors] = useState({}); // Lưu lỗi

  const [imagePreview, setImagePreview] = useState(null); // hiển thị ảnh xem trước

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

  const handleCreateExam = async () => {
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
    console.log(exam.image)
    if (exam.image) {
      formData.append("image", exam.image);
    }

    const response = await createExam(formData); // gọi API tạo đề thi

    const examId = response.data._id;

    try {
      // phản hồi về data và id để chuyển sang tạo câu hỏi
      if (response && response.data && examId) {
        toast.success("Tạo đề thi thành công");
        navigate(`/workspace/exams/create-question/${examId}`); // Chuyển hướng sang tạo câu hỏi cho đề thi vừa tạo
      } else {
        toast.error("Lỗi khi tạo đề thi");
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/auth/login");
      }
    }
  };

  return (
    <MainLayout>
      <h4 className="mb-4">Tạo đề thi mới</h4>

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
                      onClick={getLevels}
                      isInvalid={!!errors.level}
                    >
                      <option>Chọn trình độ</option>
                      {Array.isArray(levels) &&
                        levels.map((level, index) => (
                          <option key={index} value={level}>
                            {level}
                          </option>
                        ))}
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

      {/* Nút tạo đề thi */}
      <div className="mt-4 text-end">
        <Button variant="secondary" className="me-2">
          Trở về
        </Button>
        <Button variant="primary" onClick={handleCreateExam}>
          Tạo đề thi
        </Button>
      </div>
    </MainLayout>
  );
};

export default CreateExam;
