import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import MainLayout from "../../layouts/MainLayout";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faClock,
  faQuestionCircle,
  faBookOpen,
  faPlay,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

import { listFavoriteExam } from "../../services/ExamService";
import { countQuestionByExam } from "../../services/QuestionService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FavoriteExam = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [countQuestion, setCountQuestion] = useState({});
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const getFavoriteExams = async () => {
      try {
        const response = await listFavoriteExam(keyword);

        const examsList = response;

        // gọi API đếm số câu hỏi cho từng bài thi
        const questionCounts = await Promise.all(
          examsList.map(async (exam) => {
            const response = await countQuestionByExam(exam._id);
            return { examId: exam._id, totalQuestion: response.totalQuestion };
          })
        );

        // Cập nhật state danh sách bài thi
        setExams(examsList);

        // Chuyển danh sách số câu hỏi thành Object
        const countMap = questionCounts.reduce((acc, item) => {
          acc[item.examId] = { totalQuestion: item.totalQuestion };
          return acc;
        }, {});

        setCountQuestion(countMap);
      } catch (error) {
        console.error("Lỗi khi đếm số câu hỏi");
      }
    };

    getFavoriteExams();
  }, [keyword]);

  return (
    <MainLayout>
      <h4 className="mb-4">Bài thi yêu thích</h4>

      <div className="main-list-exam">
        <Card className="shadow-sm rounded">
          <Card.Header className="d-flex">
            <p className="count-exam">
              <strong>{exams.length}</strong> đề thi
            </p>
            <Form.Group className="d-flex header-search-exam">
              <Form.Control
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="me-2 header-search-input"
              />
              <FontAwesomeIcon className="icon-search" icon={faSearch} />
            </Form.Group>
          </Card.Header>

          <div className="d-flex flex-wrap">
            {exams && exams.map((exam) => (
              <div key={exam._id} style={{ width: "25%" }}>
                <Card className="shadow-sm item-exam">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3000/uploads/${exam.image}`}
                    alt="Exam Image"
                    className="item-exam-img"
                    onClick={() => window.open(`/exams/${exam.slug}`)}
                  />
                  <Card.Body className="">
                    <p className="item-exam-title">{exam.title}</p>
                    <p className="text-muted item-exam-create">
                      <FontAwesomeIcon
                        icon={faClock}
                        title="Ngày tạo"
                        className="item-exam-icon"
                      />
                      {moment(exam.createdAt).format("DD/MM/YYYY")}
                    </p>

                    {/* Thống kê*/}
                    <div className="d-flex gap-3">
                      <span>
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                          className="text-warning item-exam-icon"
                          title="Số câu hỏi"
                        />
                        {countQuestion[exam._id]?.totalQuestion ?? 0}
                      </span>
                      <span>
                        <FontAwesomeIcon
                          icon={faChartSimple}
                          className="text-primary item-exam-icon"
                          title="Lượt xem"
                        />
                        0
                      </span>
                      <span>
                        <FontAwesomeIcon
                          icon={faBookOpen}
                          className="text-success item-exam-icon"
                          title="Số lượt thi"
                        />
                        0
                      </span>
                    </div>
                  </Card.Body>
                  {/* Chức năng */}
                  <Card.Footer className="bg-white">
                    <p style={{ marginBottom: "0px" }}>
                      <img
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "20px",
                          marginRight: "10px",
                          objectFit: "cover",
                        }}
                        referrerPolicy="no-referrer"
                        src={exam ? exam.createdBy?.avatar : ""} 
                        alt={exam.createdBy?.fullName} 
                      />
                      <span>{exam?.createdBy.fullName}</span>
                    </p>

                    {/* Nút "Vào ôn thi" */}
                    <Button
                      variant="primary"
                      className="w-100 mt-3"
                    >
                      <FontAwesomeIcon icon={faPlay} onClick={() => window.open(`/exams/${exam.slug}`)}/> Vào ôn thi
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            ))}
            { exams && exams.length === 0 && (
              <p className="m-3 text-danger">Không có đề thi yêu thích</p>
            )
            }
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FavoriteExam;
