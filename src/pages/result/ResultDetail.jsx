import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import moment from "moment";
import "moment-timezone";
import { getResultExam } from "../../services/ResultService";

const ResultDetail = () => {
  const [result, setResult] = useState(null);
  const { resultId } = useParams();

  useEffect(() => {
    const fetchResultExam = async () => {
      try {
        const response = await getResultExam(resultId);
        setResult(response.data);
        
      } catch (error) {
        console.error("Lỗi khi hiển thị kết quả đề thi". error);
      }
    };

    fetchResultExam();
  }, [resultId]); // useEffect sẽ chạy khi có resultId thay đổi (tránh gọi API nhìu lần => lặp vô tận)

  if (!result) return null;

  // Format thời gian làm bài (giả sử duration là số phút)
  const formatDuration = (minutes) => {
  if (!minutes) return "00 : 00 : 00";
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);
  return `${hrs.toString().padStart(2, "0")} : ${mins
    .toString()
    .padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  // Format thời gian làm bài (giây)
  const formatSeconds = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")} : ${mins
      .toString()
      .padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };
  

  // Số câu bỏ
  const blankAnswers = result.answers.filter(
    (answer) => !answer.selectedOption
  ).length;

  // Hoàn thành
  const completionRate = Math.round(
    ((result.totalQuestions - blankAnswers) / result.totalQuestions) * 100
  );

  // Danh sách câu hỏi để điều hướng
  const questionNumbers = result.answers.map((_, index) => (index + 1).toString());

  // Xếp loại
  let ratingText = "Yếu";
  let ratingColor = "danger";

  if (result.scores >= 9) {
    ratingText = "Xuất sắc";
    ratingColor = "primary";
  } else if (result.scores >= 8) {
    ratingText = "Giỏi";
    ratingColor = "success";
  } else if (result.scores >= 6.5) {
    ratingText = "Khá";
    ratingColor = "info";
  } else if (result.scores >= 5) {
    ratingText = "Trung bình";
    ratingColor = "warning";
  }

  return (
    <Container className="py-4 bg-light" fluid>
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-4">Kết quả đề thi: {result.examId.title}</h5>

          {/* Thông tin học viên */}
          <Row className="mb-4">
            <Col md={6}>
              <h5 className="text-uppercase text-muted small">Thông tin học viên</h5>
              <p className="mb-1"><strong>Họ tên:</strong></p>
              <p className="mb-3">{result.userId.fullName}</p>
              <p className="mb-1"><strong>Email:</strong></p>
              <p className="mb-3">{result.userId.email}</p>
            </Col>

            <Col md={3} className="text-center">
              <h5 className="mb-3">Điểm số</h5>
              <div className="position-relative d-inline-block">
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "8px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="h3">{result.scores}</span>
                </div>
              </div>
            </Col>

            <Col md={3} className="text-end">
              <h5 className="mb-3">Xếp loại</h5>
              <Badge bg={ratingColor} className="p-2 fs-6">
                {ratingText}
              </Badge>
              <p className="mt-4">Hoàn thành {result.correctAnswers + (result.totalQuestions - result.correctAnswers - blankAnswers)} / {result.totalQuestions} câu</p>
            </Col>
          </Row>

          <hr />

          {/* Thông tin kết quả */}
          <Row className="mb-3">
            <Col md={12}>
              <h5 className="text-uppercase text-muted small">Thông tin</h5>
              <div className="d-flex">
                <div className="me-5">
                  <p className="mb-1">Thời gian làm bài: {formatSeconds(result.durationReal)}</p>
                </div>
                <div className="mb-1">
                  <p>Thời gian nộp bài thi: {moment(result.submittedAt).format("DD/MM/YYYY, h:mm:ss a")}</p>
                </div>
              </div>

              <ProgressBar className="mt-2 mb-3">
                <ProgressBar variant="success" now={completionRate} key={1}/>
                <ProgressBar variant="warning" now={100 - completionRate} key={2}/>
              </ProgressBar>

              <Row className="text-center">
                <Col md={3}>
                  <p className="mb-1">Hoàn thành</p>
                  <p className="fw-bold">{completionRate}%</p>
                </Col>
                <Col md={3}>
                  <p className="mb-1">Số câu đúng</p>
                  <p className="fw-bold">{result.correctAnswers}</p>
                </Col>
                <Col md={3}>
                  <p className="mb-1">Số câu sai</p>
                  <p className="fw-bold">{result.totalQuestions - result.correctAnswers - blankAnswers}</p>
                </Col>
                <Col md={3}>
                  <p className="mb-1">Số câu bỏ trống</p>
                  <p className="fw-bold">{blankAnswers}</p>
                </Col>
              </Row>
            </Col>        
          </Row>

          <hr />

          <h5 className="text-uppercase text-muted small">Chi tiết phần thi</h5>
          {/* Mục lục câu hỏi */}
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              {
                questionNumbers.map((num) => {
                  const questionIndex = parseInt(num) - 1;
                  const answer = result.answers[questionIndex];

                  let variant = "outline-secondary";
                  if (answer) {
                    if (!answer.selectedOption) {
                      variant = "outline-secondary"; // chưa trả lời
                    } else if (answer.isCorrect) {
                      variant = "outline-success"; // đúng
                    } else {
                      variant = "outline-danger"; // sai
                    }
                  }

                  return (
                    <Button
                      key={num}
                      variant={variant}
                      size="sm"
                      className="px-3"
                      href={`#question-${num}`}
                    >
                      {num}
                    </Button>
                  )
                })
              }
            </div>
          </div>
          {/* Câu hỏi, đáp án đúng, đáp án sai */}
          {
            result.answers.map((answer, index) => {
              if (!answer.questionId) return null;

              return (
                <div key={index} className="mb-4" id={`question-${index + 1}`}>
                  <div className="d-flex justify-content-between mb-2">
                    <p><strong>Câu {index + 1}</strong></p>
                    {
                      answer.isCorrect !== undefined && (
                        <Badge style={{ width: "100px", textAlign: "center", alignItems: "center", lineHeight: "32px" }} bg={
                          answer.isCorrect ? "success" : !answer.selectedOption ? "secondary" : "danger"
                        }>
                          { answer.isCorrect ? "ĐÚNG" : !answer.selectedOption ? "CHƯA TRẢ LỜI" : "SAI" }
                        </Badge>
                    )}
                  </div>
                  <div style={{ paddingBottom: "0px" }} dangerouslySetInnerHTML={{ __html:answer.questionId.questionText }} />
                  {
                      answer.questionId.options && (
                        <div className="mt-3 mb-3">
                          {
                            answer.questionId.options.map((option, optionIndex) => (
                              <div key={optionIndex}
                                className={`p-2 mb-2 rounded ${
                                  answer.questionId.correctAnswer.includes(option) 
                                  ? "bg-success bg-opacity-10 border border-success"
                                  : option === answer.selectedOption && !answer.isCorrect
                                  ? "bg-danger bg-opacity-10 border border-danger"
                                  : "border"
                                }`}
                              >
                                {/* A, B, C, D */}
                                <span className="me-2">
                                  { String.fromCharCode(65 + optionIndex) }.
                                </span>
                                {/* Đáp án đúng */}
                                <span dangerouslySetInnerHTML={{ __html:option }}/>
                                {
                                  answer.questionId.correctAnswer.includes(option) && (
                                    <Badge bg="success" className="ms-2">
                                      Đáp án đúng
                                    </Badge>
                                )}
                                {/* Đáp án của bạn */}
                                {
                                  !answer.isCorrect && option === answer.selectedOption && (
                                    <Badge bg="danger" className="ms-2">
                                      Đáp án của bạn
                                    </Badge>
                                )}
                              </div>
                            ))
                          }
                        </div>
                        
                      )
                    }
                </div>
              )
            })
          }
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResultDetail;
