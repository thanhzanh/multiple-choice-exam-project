import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSquarePlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import logo1 from "../assets/avatar2.png";
import { useNavigate } from "react-router-dom";
import { logoutAccount } from "../services/AccountService";
import { getUser } from "../services/AccountService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { search } from "../services/ExamService";

const Header = () => {
  const navigate = useNavigate(); // hooks để điều hướng

  const [searchKeyword, setSearchKeyword] = useState("");

  const [showMenu, setShowMenu] = useState(false);

  const [user, setUser] = useState(null);

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

  // Tìm kiếm bài thi trên kênh đề thi
  const handleSearchExam = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (searchKeyword.trim() !== "") {
        const searchUrl = `/exams/search?keyword=${searchKeyword}`;
        window.open(searchUrl);
      }
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="px-3 inner-header">
      <Container fluid>
        <Row className="align-items-center header">
          <Col xs={12} md={3} className="header-info">
            {user && user.avatar ? (
              <Image
                src={user.avatar}
                alt="Avatar"
                roundedCircle
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                className="header-info-img"
              />
            ) : (
              <span>Đang tải...</span>
            )}
            <div className="header-info-user">
              <span className="ml-2 font-weight-bold">
                {user ? user.fullName : "Đang tải..."}
              </span>
              <p>Kênh đề thi</p>
            </div>
          </Col>
          <Col xs={12} md={5}>
            <Form className="d-flex ms-auto header-search">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm đề thi"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchExam} // Bắt sự kiện Enter
                className="me-2 header-search-input"
              />
              <FontAwesomeIcon className="icon-search" icon={faSearch} />
            </Form>
          </Col>
          <Col
            xs={12}
            md={4}
            className="header-add-img d-flex justify-content-end align-items-center"
          >
            <Button
              variant="primary"
              className="btn-create-exam"
              onClick={() => navigate("/workspace/exams/create-exam")}
            >
              <FontAwesomeIcon icon={faSquarePlus} />
              <span className="header-title-create">Tạo đề thi</span>
            </Button>
            <div className="inner-profile">
              <Image
                className="btn-img-user-right"
                src={user?.avatar || logo1}
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
                  animate={{ opacity: showMenu ? 1 : 0, y: showMenu ? 0 : -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <li onClick={() => navigate('/account/profile')}>
                    Thông tin tài khoản
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
  );
};

export default Header;
