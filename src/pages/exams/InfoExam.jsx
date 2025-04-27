import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
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
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactStars from "react-rating-stars-component";
import {
  faRightFromBracket,
  faClock,
  faQuestionCircle,
  faChartSimple,
  faPlay,
  faFile,
  faHeart,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import image from "../../assets/exam-02.png";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { logoutAccount, getUser } from "../../services/AccountService";
import { favoriteExam, listFavoriteExam } from "../../services/ExamService";
import PracticeTestModal from "../../components/PracticeModal";

import axios from "axios";
import parse from "html-react-parser";
import { postComment, getCommentsByExamId } from "../../services/CommentService";

const API_URL = "http://localhost:3000/api/v1/exams";

const Flashcard = ({ question, options, answer, questionIndex }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
        <div
          className="card-front d-flex flex-column justify-content-center align-items-center text-center"
          style={{ margin: "0px 20px" }}
        >
          <div className="d-flex text-left" style={{ minWidth: "700px" }}>
            <p style={{ width: "100px" }}>{`Câu ${questionIndex + 1}`}. </p>
            <div
              style={{
                fontSize: "16px",
                textAlign: "left",
                marginBottom: "0px",
              }}
            >
              {question ? parse(String(question)) : "Câu hỏi không có sẵn"}
            </div>
          </div>
          <div style={{ minWidth: "700px" }}>
            <ul
              className="options-list"
              style={{ padding: "0px", paddingLeft: "20px" }}
            >
              {options.map((option, index) => [
                <li key={index} className="d-flex text-left">
                  <strong>{["A", "B", "C", "D"][index]}.</strong>
                  {parse(String(option))}
                </li>,
              ])}
            </ul>
          </div>
        </div>
        <div className="card-back d-flex flex-column justify-content-center align-items-center">
          <div className="answer-title">Đáp án đúng</div>
          <div className="d-flex align-items-center answer-correct">
            <FontAwesomeIcon icon={faCheck} className="answer-text-success" />
            <span className="inner-answer-text">
              {answer ? parse(String(answer)) : "Câu trả lời chưa có sẵn"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoExam = () => {
  const navigate = useNavigate(); // hooks để điều hướng

  // TAB
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Nội dung đề thi"; // Mặc định là 'Nội dung đề thi'
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const indicatorRef = useRef(null);

  const tabs = [
    "Nội dung đề thi",
    "Đánh giá",
  ];
  // END TAB

  const { slug } = useParams(); // Lấy slug từ url
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [view, setView] = useState("home"); // home || flashcard
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const answerLabels = ["A", "B", "C", "D"]; // Danh sách ký hiệu đáp án

  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const progress = (currentIndex / questions.length) * 100;

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Hàm chuyển tab
  useEffect(() => {
    if (tabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
      moveIndicator(tabFromUrl);
    }
  }, [searchParams]);

  const moveIndicator = (tab) => {
    const tabElement = document.querySelector(`.tab-item[data-tab="${tab}"]`);
    if (tabElement && indicatorRef.current) {
      indicatorRef.current.style.width = `${tabElement.offsetWidth}px`;
      indicatorRef.current.style.left = `${tabElement.offsetLeft}px`;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    moveIndicator(tab);
    setSearchParams({ tab });
  };

  // end chuyển tab

  // Hàm lấy ra đề thi và câu hỏi
  useEffect(() => {
    const getExamData = async () => {
      try {
        const response = await axios.get(`${API_URL}/${slug}`, {
          withCredentials: true,
        });

        setExam(response.data.exam);
        setQuestions(response.data.questions);

        if (user) {
          setFavorite(user.favoriteExams.includes(response.data.exam._id));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài thi:", error);
      }
    };

    if (slug) {
      getExamData();
    }
  }, [slug]);

  // Hàm check bài thi đã tym hay chưa
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favoriteExams = await listFavoriteExam();
        const isFav = favoriteExams.some((ex) => ex._id === exam._id); // kiểm tra bài thi hiện tại có trong danh sách hay không
        setFavorite(isFav);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái yêu thích", error);
      }
    };
    checkFavoriteStatus();
  }, [exam?._id]);

  // Hàm thêm. xóa bài thi yêu thích
  const toggleFavorite = async () => {
    try {
      await favoriteExam(exam._id);
      setFavorite((prev) => !prev);
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích", error);
    }
  };

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

  // Xử lý thay đổi rating (comment)
  const handleChangeRating = (newRating) => setRating(newRating);

  // Hàm xử lý bình luận
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText) {
      toast.info("Vui lòng nhập đánh giá");
      return;
    };

    try {
      const data = {
        examId: exam._id,
        userId: user?._id,
        comment_text: commentText,
        rating,
      };
      await postComment(data);

      // Gọi lại API để lấy danh sách đầy đủ đã populate
      const updatedComments = await getCommentsByExamId(exam._id);
      setComments(updatedComments); // cập nhật lại giao diện

      // Reset form
      setCommentText("");
      setRating(0);
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

  // Hàm xử lý lấy bình luận
  useEffect(() => {
    if (!exam || !exam._id) return; 
    const fetchComments = async () => {
      try {
        const data = await getCommentsByExamId(exam?._id);
        setComments(data);
      } catch (err) {
        console.error("Lỗi khi lấy bình luận:", err);
      }
    };
    fetchComments();
  }, [exam?._id]);

  return (
    <div>
      <Helmet>
        <title>{exam ? exam.title : "QuizSTU"}</title>
      </Helmet>

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
                      <li onClick={() => navigate("/account/profile")}>
                        Hồ sơ cá nhân
                      </li>
                      <li onClick={() => navigate("/workspace/exams/list")}>
                        Đề thi cá nhân
                      </li>
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

      {view === "home" && (
        <div>
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
                      referrerPolicy="no-referrer"
                      src={exam ? exam.createdBy.avatar : "Đang tải"}
                      alt={exam?.createdBy?.fullName}
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
                    <span title="Lượt xem">
                      <FontAwesomeIcon
                        icon={faChartSimple}
                        className="text-primary item-exam-icon"
                      />
                      {exam ? exam.views : 0}
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
                  <div className="d-flex mt-3" style={{ fontSize: "20px" }}>
                    <span className="inner-icon-like">
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        className="inner-icon"
                        title="Like"
                      />
                    </span>
                    <span className="inner-icon-like">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`inner-icon ${favorite ? "tymed" : ""}`}
                        title={favorite ? "Bỏ tym" : "Thả tym"}
                        onClick={toggleFavorite}
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
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setView("flashcard")}
                  >
                    <FontAwesomeIcon icon={faFile} />
                    <span style={{ marginLeft: "10px" }}>Thẻ ghi nhớ</span>
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={handleShow}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                    <span style={{ marginLeft: "10px" }}>Bắt đầu ôn thi</span>
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>

          <div className="container mt-4">
            <Card className="p-3 mb-3">
              <div className="tabs-container">
                <div className="tab-list">
                  {tabs.map((tab) => (
                    <div
                      key={tab}
                      className={`tab-item ${
                        activeTab === tab ? "active" : ""
                      }`}
                      data-tab={tab}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                  <div ref={indicatorRef} className="indicator"></div>
                </div>
              </div>

              <div className="tab-content mt-3">
                {/* Tab: Nội dung đề thi */}
                {activeTab === "Nội dung đề thi" && (
                  <div>
                    {questions.length > 0 ? (
                      questions.map((question, index) => (
                        <div key={question._id} className="mt-3">
                          <p style={{ marginBottom: "0px" }}>
                            <strong
                              style={{ marginRight: "5px", display: "flex" }}
                            >
                              Câu {index + 1}: {parse(question.questionText)}
                            </strong>
                          </p>
                          {/* Hiển thị danh sách lựa chọn nếu có */}
                          {question.options.length > 0 && (
                            <ul
                              style={{
                                paddingLeft: "0px",
                                paddingTop: "0px",
                                marginBottom: "0px",
                              }}
                            >
                              {question.options.map((option, i) => (
                                <li key={i} className="d-flex">
                                  <strong>{answerLabels[i]}.</strong>{" "}
                                  {parse(option)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Đề thi chưa có câu hỏi nào</p>
                    )}
                    <div
                      style={{
                        padding: "5px",
                        backgroundColor: "#EF6C00",
                        color: "#ffff",
                      }}
                    >
                      Bạn đang ở chế độ xem trước, hãy bắt đầu ôn thi ngay nhé
                    </div>
                  </div>
                )}

                {/* Tab: Đánh giá */}
                {activeTab === "Đánh giá" && (
                  <div>
                    <Form onSubmit={handleSubmitComment}>
                      <Form.Group>
                        <Form.Label>Đánh giá đề thi</Form.Label>
                        <ReactStars
                          onChange={handleChangeRating}
                          count={5}
                          value={rating}
                          size={24}
                          activeColor="#ffd700"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="mt-2">Bình luận</Form.Label>
                        <Form.Control
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          style={{ paddingBottom: "100px" }}
                        />
                      </Form.Group>
                      <Button className="mt-3" type="submit">
                        Gửi bình luận
                      </Button>
                    </Form>
                    <div className="mt-4">
                      <h5>Bình luận của người dùng</h5>
                      {comments.length === 0 ? (
                        <p>Chưa có bình luận nào.</p>
                      ) : (
                        comments.map((comment, index) => (
                          <div key={index} className="border p-2 mb-3 rounded">
                            <div className="d-flex align-items-center mb-2">
                              <img
                                src={comment?.userId?.avatar}
                                alt="avatar"
                                className="rounded-circle"
                                width="40"
                                height="40"
                                style={{
                                  objectFit: "cover",
                                  marginRight: "10px",
                                }}
                              />
                              <strong>{comment?.userId?.fullName}</strong>
                            </div>
                            <p>{moment(comment.createdAt).format("DD/MM/YYYY")}</p>
                            <ReactStars
                              value={comment.rating}
                              count={5}
                              edit={false}
                              size={20}
                              activeColor="#ffd700"
                            />
                            <p className="mt-2">{comment.comment_text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {view === "flashcard" && (
        <div className="container mt-4 mb-4">
          <Row>
            {/* Card bên trái */}
            <Col md={4}>
              <Card
                className="flashcard"
                style={{
                  width: "100%",
                  height: "500px",
                  backgroundColor: "#ffffff", // Màu nền giống flashcard bên phải
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
                  alignItems: "center",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <h5>Danh sách phần thi</h5>
                <p>
                  <strong>Tiến độ hoàn thành: </strong>
                  <span style={{ color: "#6797FE", fontWeight: "700" }}>
                    {currentIndex}/{questions.length}
                  </span>
                </p>
                <div className="progress-container">
                  <progress
                    value={progress}
                    max="100"
                    className="progress-bar"
                  ></progress>
                  <span className="progress-text">{Math.round(progress)}%</span>
                </div>
                <Button
                  variant="danger"
                  className="mt-3"
                  style={{ bottom: "0px" }}
                  onClick={() => setView("home")}
                >
                  Trở về
                </Button>
              </Card>
            </Col>

            {/* Card bên phải - Chỉ hiển thị 1 câu hỏi */}
            <Col md={8} className="justify-content-center align-items-center">
              {questions.length > 0 && (
                <Flashcard
                  questionIndex={currentIndex}
                  question={questions[currentIndex]?.questionText}
                  options={questions[currentIndex]?.options || []} // Các đáp án A, B, C, D
                  answer={questions[currentIndex]?.correctAnswer} // Đáp án đúng
                />
              )}
            </Col>
          </Row>

          {/* Nút chuyển câu hỏi */}
          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={() =>
                setCurrentIndex((prevIndex) =>
                  prevIndex < questions.length - 1 ? prevIndex + 1 : 0
                )
              }
            >
              Tiếp theo
            </Button>
          </div>
        </div>
      )}
      <PracticeTestModal
        show={showModal}
        handleClose={handleClose}
        exam={exam}
        questions={questions}
      />
    </div>
  );
};

export default InfoExam;
