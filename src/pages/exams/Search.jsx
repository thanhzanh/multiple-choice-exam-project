import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment-timezone";
import {
  Navbar,
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSquarePlus,
  faRightFromBracket,
  faClock,
  faQuestionCircle,
  faChartSimple,
  faBookOpen,
  faEarthAmericas,
  faEdit,
  faTrash,
  faHistory,
  faPlay,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutAccount } from "../../services/AccountService";
import { getUser } from "../../services/AccountService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/exams";

const Search = () => {
  const navigate = useNavigate(); // hooks để điều hướng
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const [user, setUser] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // hàm tìm kiếm bài thi
  const fetchSearchResults = async (keyword) => {
    try {
      const { data: exams } = await axios.get(`${API_URL}/search`, {
        params: { keyword },
      });
      
      // Gọi API đếm số câu hỏi cho từng bài thi
      const updatedExams = await Promise.all(
        exams.map( async(exam) => {
          try {
            const count = await axios.get(`http://localhost:3000/api/v1/questions/countQuestion/${exam._id}`, {
              withCredentials: true
            });

            return { ...exam, questionCount: count.data.totalQuestion }
          } catch (error) {
            console.error("Lỗi khi lấy số câu hỏi", error);
            return { ...exam, questionCount: 0 } // Nếu lỗi thì mặc định là 0
          }
        })
      )

      setSearchResults(updatedExams);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword");

    if (keyword) {
      setSearchKeyword(keyword);
      fetchSearchResults(keyword);
    }
  }, [location.search]);

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
                <div className="header-info-user">
                  <span className="ml-2 font-weight-bold" style={{ fontSize: "26px" }}>
                    QuizSTU
                  </span>
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
                    src={user?.avatar}
                    roundedCircle
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowMenu(!showMenu)} 
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

      <div className="main-list-exam">
        <Card className="shadow-sm rounded">
          <Card.Header className="d-flex">
            <p className="count-exam">{searchResults.length} đề thi</p>
            <Form.Group className="d-flex header-search-exam">
              <Form.Control
                type="text"
                value={searchKeyword}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="me-2 header-search-input"
              />
              <FontAwesomeIcon className="icon-search" icon={faSearch} />
            </Form.Group>
          </Card.Header>

          <div className="d-flex flex-wrap">
            {searchResults.map((exam) => (
              <div key={exam._id} style={{ width: "20%" }}>
                <Card className="shadow-sm item-exam">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3000/uploads/${exam.image}`}
                    alt={exam?.createdBy?.fullName}
                    referrerPolicy="no-referrer"
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
                          className="text-warning inner-exam-icon"
                          title="Số câu hỏi"
                        />
                        {exam.questionCount}
                      </span>
                      <span>
                        <FontAwesomeIcon
                          icon={faChartSimple}
                          className="text-primary inner-exam-icon"
                          title="Lượt xem"
                        />
                        0
                      </span>
                      <span>
                        <FontAwesomeIcon
                          icon={faBookOpen}
                          className="text-success inner-exam-icon"
                          title="Số lượt thi"
                        />
                        0
                      </span>
                    </div>
                    <p className="text-muted item-exam-create mt-2 mb-0 inner-avatar-name title='Xem kênh đề thi'">
                      <Image
                        src={exam.createdBy.avatar }
                        roundedCircle
                        title="Xem kênh đề thi"
                        style={{ width: "30px", height: "30px", objectFit: "cover", marginRight: "10px" }}
                      /> 
                      <span title="Xem kênh đề thi">{exam.createdBy.fullName}</span>
                    </p>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <Button variant="primary" className="w-100 mt-3" onClick={() => window.open(`/exams/${exam.slug}`)}>
                      <FontAwesomeIcon icon={faPlay} /> Vào ôn thi
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Search;
