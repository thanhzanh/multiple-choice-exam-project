import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, ProgressBar, Navbar, Container, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { getUser, loginAccount } from "../../services/AccountService";
import { toast } from "react-toastify";

const mockQuestions = [
    {
      id: 1,
      content: "Graph vô hướng G(V,E) với V={a,b,c,d,e,f}; E={ab,ae,af,bc,ce,cd,de, ef}. Trong đồ thị G phải bớt đi số cạnh để G là đồ thị 2_đều:",
      options: ["3.'2'", "4.'3'", "1.'0'", "2.'1'"]
    },
    {
      id: 2,
      content: "Số phần tử trên ma trận kề biểu diễn Graph G(V,E) bằng:",
      options: ["|V| + |E|", "|V|.|V|", "|E|.|E|", "|V|.|E|"]
    },
    {
        id: 3,
        content: "Số phần tử trên ma trận kề biểu diễn Graph G(V,E) bằng:",
        options: ["|V| + |E|", "|V|.|V|", "|E|.|E|", "|V|.|E|"]
    },
      {
        id: 4,
        content: "Số phần tử trên ma trận kề biểu diễn Graph G(V,E) bằng:",
        options: ["|V| + |E|", "|V|.|V|", "|E|.|E|", "|V|.|E|"]
      }
];

const ExamPage = () => {
  
    const [user, setUser] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();

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

    // Hàm xử lý bấm thay đổi câu hỏi
    const handleAnswerChange = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]:option }))
    }
    
    // Hàm xử lý đăng xuất
    const handleLogoutAccount = async() => {
        await loginAccount();
        toast.success('Đăng xuất thành công');
        navigate('auth/login');
    }

    return (
        <>
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
                            <li onClick={() => navigate('/account/profile')}>Hồ sơ cá nhân</li>
                            <li onClick={() => navigate('workspace/exams/list')}>Quản lý đề thi</li>
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

        <div className="container-fluid mt-4">
            <Row>
                {/* Thông tin bài thi */}
                <Col md={3}>
                    <Card className="mb-3">
                        <Card.Body>
                            <h5><strong>Đề thi: </strong>Toán cao cấp</h5>
                            <div style={{ display: "grid" }} className="mb-3">
                                <strong>Thời gian còn lại</strong>
                                <span className="text-primary"><strong>04:59</strong></span>
                            </div> 
                            <Button variant="danger" className="me-2">Trở về</Button>
                            <Button variant="primary">Nộp bài</Button>
                        </Card.Body>
                        <Card.Body>
                            <h6>Tiến độ hoàn thành</h6>
                            <ProgressBar />
                        </Card.Body>
                    </Card>
                </Col>

                {/* Lâm bài thi */}
                <Col md={6}>
                {
                    mockQuestions.map((q, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Body>
                            <p><strong>Câu {index+1}</strong></p>
                            <p>{q.content}</p>
                            {
                                q.options.map((qi, i) => (
                                    <div key={i} className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input"
                                            name={`question-${q.id}`}
                                            checked={answers[q.id] === qi}
                                            onChange={() => handleAnswerChange(q.id, qi)}
                                            value={qi}
                                        />
                                        <label className="form-check-label">{qi}</label>
                                    </div>
                                ))
                            }
                        </Card.Body>
                    </Card>
                    ))
                }               
                </Col>

                {/* Mục lục câu hỏi */}
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <h6>Mục lục câu hỏi</h6>
                            <div className="d-flex flex-grap gap-2">
                                {
                                    mockQuestions.map((q, i) => (
                                        <Button key={q.id} variant={answers[q.id] ? "primary" : "outline-secondary" } style={{ padding: "6px 12px" }} size="sm">
                                            { i + 1 }
                                        </Button>
                                    ))
                                }
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    </>
    );
};

export default ExamPage;