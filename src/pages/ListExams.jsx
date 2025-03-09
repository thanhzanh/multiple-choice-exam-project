import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import MainLayout from "../layouts/MainLayout";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faClock,
  faQuestionCircle,
  faBookOpen,
  faHistory,
  faEdit,
  faTrash,
  faPlay,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

import { listExams } from "../services/ExamService";
import { countQuestionByExam } from "../services/QuestionService";

const ListExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [countQuestion, setCountQuestion] = useState({});

  useEffect(() => {
    const getListExams = async () => {
      try {
        const data = await listExams();
        const examsList = data.exam;

        // gọi API đếm số câu hỏi cho từng bài thi
        const questionCounts = await Promise.all(
          examsList.map(async (exam) => {
            const response  = await countQuestionByExam(exam._id);
            return {  examId: exam._id, totalQuestion: response.totalQuestion };
          })
        )

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

    getListExams();
  }, []);

  

  return (
    <MainLayout>
      <h4 className="mb-4">Danh sách bài viết</h4>

      <div className="main-list-exam">
        <Card className="shadow-sm rounded">
          <Card.Header className="d-flex">
            <p className="count-exam">{ exams.length } đề thi</p>
            <Form.Group className="d-flex header-search-exam">
              <Form.Control
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="me-2 header-search-input"
              />
              <FontAwesomeIcon className="icon-search" icon={faSearch} />
            </Form.Group>
          </Card.Header>

          <div className="d-flex flex-wrap">
            {exams.map((exam) => (
              <div key={exam._id} style={{ width: "25%" }}>
                <Card className="shadow-sm item-exam">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3000/uploads/${exam.image}`} 
                    alt="Exam Image"
                    className="item-exam-img"
                  />
                  <Card.Body className="">
                    <p className="item-exam-title">{ exam.title }</p>
                    <p className="text-muted item-exam-create">
                      <FontAwesomeIcon
                        icon={faClock}
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
                    <div className="d-flex justify-content-around mb-2 mt-2">
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-primary fs-5"
                        onClick={() => navigate(`/workspace/exams/edit-exam/${exam._id}`)}
                        title="Chỉnh sửa"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-danger fs-5"
                        title="Xóa"
                      />
                      <FontAwesomeIcon
                        icon={faHistory}
                        className="text-pink fs-5"
                        title="Lịch sử truy cập"
                      />
                    </div>

                    {/* Nút "Vào ôn thi" */}
                    <Button variant="primary" className="w-100 mt-3">
                      <FontAwesomeIcon icon={faPlay} /> Vào ôn thi
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ListExams;
