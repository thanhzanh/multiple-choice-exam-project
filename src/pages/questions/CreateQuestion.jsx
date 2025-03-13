import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Row, Col, Form, Card } from "react-bootstrap";
import TinyMCEEditor from "../../components/TinyMCEEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { saveQuestion, getQuestionsByExam } from "../../services/QuestionService";

import { useParams, useLocation } from "react-router-dom"; // lấy id từ API phản hồi


const CreateQuestion = () => {

  const navigate = useNavigate(); // Điều hướng

  const location = useLocation(); // Dùng để nhận data từ trang trước

  const [questionType, setQuestionType] = useState("single"); // Loại câu hỏi
  const [questionText, setQuestionText] = useState(""); // Nội dung câu hỏi
  const [options, setOptions] = useState(["", ""]); // Danh sách đáp án (mặc định có 2 đáp án)
  const [correctAnswer, setCorrectAnswer] = useState([]); // Đáp án đúng
  const [questionsList, setQuestionsList] = useState(location.state?.questionsList || []); // Danh sách câu hỏi

  // examId truyền từ params về từ phản hồi API
  const { examId } = useParams(); // Lấy examId từ URL

  // lấy ra danh sách câu hỏi
  const getListQuestions = async () => {
    if (!examId) return;
    try {
      const response = await getQuestionsByExam(examId); // API lấy danh sách câu hỏi theo đề thi
      setQuestionsList(response.data); // cập nhật danh sách câu hỏi
    } catch (error) {
      console.error("Lỗi khi tải câu hỏi:", error);
    }
  };

  useEffect(() => {
    getListQuestions(); // gọi hàm để thực hiện

  }, [examId]); // chạy khi examId thay đổi

  // Cập nhật nội dung đáp án
  const handleOptionChange = (index, content) => {
    const newOptions = [...options];
    newOptions[index] = content;
    setOptions(newOptions);
  };

  // Thêm một đáp án mới
  const addOptions = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleSaveQuestion = async () => {
    if (!questionText.trim()) {
      toast.info("Vui lòng nhập câu hỏi");
      return;
    }

    // nếu đáp án là true_false, fill_in_the_blank thì lưu null (không cần lưu options)
    const optionToSave = (questionType === "true_false" || questionType === "fill_in_the_blank" ) ? null : options;

    const formData = {
      examId,
      questionText,
      type: questionType,
      options: optionToSave,
      correctAnswer
    }

    try {
      // gửi lên server lưu vào database
      const response = await saveQuestion(formData);

      // Cập nhật danh sách bằng cách gọi lại API
      await getListQuestions();  

      toast.success("Lưu thành công");

      // reset lại để tạo câu hỏi mới
      setQuestionType("single");
      setQuestionText("");
      setOptions(["",""]);
      setCorrectAnswer([]);

    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error);    }
  }

  // Quay về trang chỉnh sửa
  const handleBackToEdit = () => {
    navigate(`/workspace/exams/edit-question/${examId}`);
  };

  return (
    <MainLayout>
      <Row className="d-flex justify-content-between align-items-center">
        <Col><h3 className="mb-4">Tạo câu hỏi</h3></Col>
        <Col className="text-end">
        <button type="button" onClick={handleBackToEdit} className="btn-save">Quay lại chỉnh sửa</button>
        <button type="button" onClick={handleSaveQuestion} className="btn-save">Lưu câu hỏi</button>
        </Col>
      </Row>

      <div className="mt-2">
        <Row>
          {/* Danh sách phần thi */}
          <Col className="card-sticky-list" md={4}>
            <Card className="card-list-part-exam" style={{ height:200 }}>
              <Card.Body>
                <h4>Danh sách câu hỏi</h4>
                {questionsList.map((_, i) => (
                <button key={i} type="button" className="btn-stt-questions">
                  {i + 1}
                </button>
              ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Thêm câu hỏi */}
          <Col md={8}>
            <Card>
              <Card.Body>
                <h5>Thêm câu hỏi</h5>
                <Form>
                  {/* Loại câu hỏi */}
                  <Form.Group className="mb-2">
                    <Form.Label>Loại câu hỏi</Form.Label>
                    <Form.Select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      style={{ width: 500 }}
                    >
                      <option value="single">Một đáp án</option>
                      <option value="multiple">Nhiều đáp án</option>
                      <option value="fill_in_the_blank">Điền từ</option>
                      <option value="true_false">Đúng sai</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Soạn câu hỏi */}
                  <Form.Group className="mb-2">
                    <Form.Label>Soạn câu hỏi</Form.Label>
                    <TinyMCEEditor value={questionText} onChange={setQuestionText} />
                  </Form.Group>

                  {/* Loại câu hỏi: một đáp án */}
                  {questionType === "single" && (
                    <>
                      {options.map((option, index) => (
                        <Form.Group
                          className="mb-2 align-items-center"
                          key={index}
                        >
                          <Form.Group className="d-flex">
                            <Form.Check
                              type="radio"
                              name="correctAnswer"
                              checked={correctAnswer.includes(option)}
                              onChange={() => setCorrectAnswer([option])}
                            />
                            <Form.Label className="label-answer">
                              Đáp án {index + 1}
                            </Form.Label>
                          </Form.Group>

                          <TinyMCEEditor
                            value={option}
                            onChange={(content) =>
                              handleOptionChange(index, content)
                            }
                          />
                        </Form.Group>
                      ))}

                      <button
                        type="button"
                        onClick={addOptions}
                        className="btn-add-answer"
                      >
                        <FontAwesomeIcon className="nav-icon" icon={faAdd} />
                        Thêm đáp án
                      </button>
                    </>
                  )}

                  {/* Loại câu hỏi: nhiều đáp án */}
                  {questionType === "multiple" && (
                    <>
                      {options.map((option, index) => (
                        <Form.Group className="mb-2" key={index}>
                          <Form.Group className="d-flex">
                            <Form.Check 
                              type="checkbox"
                              checked={correctAnswer.includes(option)}
                            />
                            <Form.Label className="label-answer">
                              Đáp án {index + 1}
                            </Form.Label>
                          </Form.Group>
                          <TinyMCEEditor
                            value={option}
                            onChange={(content) =>
                              handleOptionChange(index, content)
                            }
                          />
                        </Form.Group>
                      ))}
                      <button
                        type="button"
                        onClick={addOptions}
                        className="btn-add-answer"
                      >
                        Thêm đáp án
                      </button>
                    </>
                  )}

                  {/* Loại câu hỏi: điền từ */}
                  {questionType === "fill_in_the_blank" && (
                    <Form.Group className="mb-2">
                      <Form.Label>Câu trả lời</Form.Label>
                      <TinyMCEEditor
                        value={correctAnswer.join(", ")}
                        onChange={(content) => setCorrectAnswer([content])}
                      />
                    </Form.Group>
                  )}

                  {/* Loại câu hỏi: đúng sai */}
                  {questionType === "true_false" && (
                    <Form.Group className="mb-2">
                      <Form.Label>Câu trả lời</Form.Label>
                      <Form.Check
                          type="radio"
                          name="trueFalse"
                          label="Đúng"
                          checked={correctAnswer.includes("true")}
                          onChange={() => setCorrectAnswer("true")}
                        />
                        <Form.Check
                          type="radio"
                          name="trueFalse"
                          label="Sai"
                          checked={correctAnswer.includes("false")}
                          onChange={() => setCorrectAnswer("false")}
                        />
                    </Form.Group>
                  )}
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
