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
import logo2 from "../assets/avatar1.png";
import { useNavigate } from "react-router-dom";
import { logoutAccount } from "../services/AccountService";
import { getUser } from "../services/AccountService";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate(); // hooks để điều hướng

  const [showMenu, setShowMenu] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getInfoUser = async () => {
      try {
        const infoUser = await getUser(); // Phản hồi từ gọi API

        console.log("Dữ liệu API:", infoUser);
        setUser(infoUser)

        
      } catch (error) {
        console.error("Lỗi khi thấy thông tin người dùng:", error);
      }
      
    }
    getInfoUser();
  }, [])

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
  }

  return (
    <Navbar bg="light" expand="lg" className="px-3 inner-header">
      <Container fluid>
        <Row className="align-items-center header">
          <Col xs={12} md={3} className="header-info">
            <Image
              src={user?.avatar || logo1}
              roundedCircle
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
              className="header-info-img"
            />
            <div className="header-info-user">
              <span className="ml-2 font-weight-bold">{user ? user.fullName : "Đang tải..."}</span>
              <p>Kênh đề thi</p>
            </div>
          </Col>
          <Col xs={12} md={5}>
            <Form className="d-flex ms-auto header-search">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm đề thi"
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
            <Button
              variant="primary"
              className="btn-create-exam"
              onClick={handleLogoutAccount}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span className="header-title-create">Đăng xuất</span>
            </Button>
            <div className="position-relative">
              <Image
                className="btn-img-user-right position-relative"
                src={user?.avatar || logo1}
                roundedCircle
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
              <ul className="position-absolute list-info-tool">
                <li>Hồ sơ cá nhân</li>
                <li>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Đăng xuất
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
