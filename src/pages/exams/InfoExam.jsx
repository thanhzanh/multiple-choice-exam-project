import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import "moment-timezone";
import {
  Navbar,
  Container,
  Button,
  Row,
  Col,
  Image,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faClock,
  faQuestionCircle,
  faChartSimple,
  faPlay,
  faFile,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import image from "../../assets/exam-02.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { logoutAccount, getUser } from "../../services/AccountService";
// import { getExamBySlug } from "../../services/ExamService";
import axios from "axios";
import parse from "html-react-parser";

const API_URL = "http://localhost:3000/api/v1/exams";

const InfoExam = () => {
  const navigate = useNavigate(); // hooks để điều hướng

  const [showMenu, setShowMenu] = useState(false);

  const [user, setUser] = useState(null);

  const { slug } = useParams(); // Lấy slug từ url
  const [exam, setExam] = useState(null);

  const [questions, setQuestions] = useState([]);

  const answerLabels = ["A", "B", "C", "D"]; // Danh sách ký hiệu đáp án

  // Hàm lấy ra đề thi và câu hỏi
  useEffect(() => {
    const getExamData = async () => {
      try {
        const response = await axios.get(`${API_URL}/${slug}`);

        console.log("Câu hỏi", response.data.questions);

        setExam(response.data.exam);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài thi:", error);
      }
    };

    getExamData();
  }, [slug]);

  // Hàm lấy thông tin người dùng
  useEffect(() => {
    const getInfoUser = async () => {
      try {
        const infoUser = await getUser(); // Phản hồi từ gọi API

        setUser(infoUser);
      } catch (error) {
        console.error("Lỗi khi thấy thông tin người dùng:", error);
      }
    };

    getInfoUser();
  }, []);

  // Xử lý đăng xuất
  const handleLogoutAccount = async () => {
    try {
      await logoutAccount();
      toast.success("Đăng xuất thành công");

      // Chuyển hướng về trang đăng nhập
      navigate("/auth/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất");
    }
  };

  return (
    <div>
      <div className="header-search">
        <Navbar bg="light" expand="lg" className="px-3 inner-header">
          <Container fluid>
            <Row className="align-items-center header">
              <Col xs={12} md={4} className="header-info">
                <Image
                  src={user?.avatar}
                  roundedCircle
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  className="header-info-img"
                />
                <div className="header-info-user">
                  <span className="ml-2 font-weight-bold">
                    {user ? user.fullName : "Đang tải..."}
                  </span>
                  <p>Kênh đề thi</p>
                </div>
              </Col>
              <Col
                xs={12}
                md={8}
                className="header-add-img d-flex justify-content-end align-items-center"
              >
                <div className="inner-profile">
                  <Image
                    className="btn-img-user-right"
                    src={user ? user.avatar : "Đang tải"}
                    roundedCircle
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowMenu(!showMenu)} // Toggle menu khi click
                  />
                  {showMenu && (
                    <motion.ul
                      className="list-menu-profile"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: showMenu ? 1 : 0,
                        y: showMenu ? 0 : -10,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <li>Thông tin tài khoản</li>
                      <li
                        onClick={() => {
                          handleLogoutAccount();
                          setShowMenu(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất
                      </li>
                    </motion.ul>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </Navbar>
      </div>

      <div className="container mt-4">
        <Card className="p-3">
          <Row>
            <Col md={4}>
              <img
                src={image}
                alt="Exam Thumbnail"
                className="img-fluid rounded"
              />
            </Col>
            <Col md={8}>
              <h4>{exam?.title}</h4>
              <p>
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "20px",
                    marginRight: "10px",
                  }}
                  src={exam ? exam.createdBy.avatar : "Đang tải"}
                  alt="Avatar"
                />
                <span>{exam?.createdBy.fullName}</span>
              </p>
              <p>
                <FontAwesomeIcon icon={faClock} />
                <span style={{ paddingLeft: "10px" }}>
                  {exam
                    ? moment(exam.createdAt).format("DD/MM/YYYY")
                    : "Đang tải..."}
                </span>
              </p>
              <div className="d-flex gap-3">
                <span>
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="text-warning item-exam-icon"
                    title="Số câu hỏi"
                  />
                  {questions.length}
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
                    icon={faThumbsUp}
                    className="item-exam-icon"
                    title="Like"
                  />
                  0
                </span>
              </div>
              <div className="d-flex gap-4 mt-3" style={{ fontSize: "20px" }}>
                <span>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="item-exam-icon"
                    title="Like"
                  />
                </span>
                <span>
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="item-exam-icon"
                    title="Tym"
                  />
                </span>
              </div>
              <p className="mt-3">
                <strong>Trình độ:</strong> {exam ? exam.level : "Đang tải"}
              </p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <Button variant="primary" className="w-100">
                <FontAwesomeIcon icon={faFile} />
                <span style={{ marginLeft: "10px" }}>Thẻ ghi nhớ</span>
              </Button>
            </Col>
            <Col md={6}>
              <Button variant="primary" className="w-100">
                <FontAwesomeIcon icon={faPlay} />
                <span style={{ marginLeft: "10px" }}>Bắt đầu ôn thi</span>
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      <div className="container mt-4">
        <Card className="p-3 mb-3">
          <h5 style={{ borderBottom: "solid 1px #ccc", paddingBottom: "5px", color: "#645BFF", fontWeight: "400", textTransform: "uppercase" }}>Nội dung đề thi</h5>
          {questions.map((question, index) => (
            <div key={question._id} className="mt-3">
              <p className="d-flex" style={{ marginBottom: "0px" }}>
                <strong style={{ marginRight: "5px",}}>Câu {index + 1}: </strong> {parse(question.questionText)}
              </p>
              {/* Hiển thị danh sách lựa chọn nếu có */}
              {question.options.length > 0 && (
                <ul style={{ paddingLeft: "0px", paddingTop: "0px" }}>
                  {question.options.map((option, i) => (
                    <li key={i} className="d-flex">
                      <strong>{answerLabels[i]}.</strong> {parse(option)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default InfoExam;
