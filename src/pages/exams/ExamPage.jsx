import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Row, Col, ProgressBar, Navbar, Container, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { getUser, loginAccount } from "../../services/AccountService";
import { submitExam } from "../../services/ResultService";

const ExamPage = () => {
  
    const [user, setUser] = useState(null);
    const [answers, setAnswers] = useState({}); // Trạng thái lưu câu hỏi
    const [showMenu, setShowMenu] = useState(false);
    const questionRefs = useRef([]);

    const navigate = useNavigate(); // dùng để điều hướng
    const location = useLocation(); // dùng nhận dữ liệu từ state
    const { duration, questions, title, examId } = location.state || {};
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [startTime, setStartTime] = useState(null); 

    const totalQuestions = questions.length; // Tổng số câu hỏi
    const answeredCount = Object.keys(answers).length; // Tổng số câu hỏi đã trả lời
    const progressPersent = (answeredCount / totalQuestions) * 100; // Thanh tiến độ

    // Hàm xử lý lấy thời gian thực tế làm bài
    useEffect(() => {
        setStartTime(new Date());
      }, []);

    // Hàm xử lý scroll đến câu hỏi
    useEffect(() => {
        questionRefs.current = questions.map((_, i) => questionRefs.current[i] ?? React.createRef());
    }, [questions]);

    // scrollIntoView() giúp cuộn đến phần tử ref đang chỉ vào.
    const scrollToQuestion = (index) => {
        questionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    // End xử lý scroll đến câu hỏi

    // Hàm xử lý thời gian
    useEffect(() => {  
        if (timeLeft === 0) {
            toast.success("Hết giờ làm bài");
            handleSubmitExam();
        }
        
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)); // giảm 1s mỗi lần
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    let formatTime = (seconds) => {
        let minute = Math.floor(seconds / 60).toString().padStart(2, '0'); // padStart(2, '0') giúp hiển thị 09 thay vì 9.
        let second = (seconds % 60).toString().padStart(2, '0');
        return `${minute}:${second}`;
    }

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
    }, [user]);

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

    // Hàm xử lý chức năng nộp bài
    const handleSubmitExam = async() => {
        const formData = {
            userId: user ? user._id : "",
            examId: examId,
            timeSelected: duration, 
            startTime,
            answers: questions.map((question) => ({
                questionId: question._id,
                selectedOption: answers[question._id] || "" // nếu chưa chọn, gán rỗng
            }))
        }

        try {
            const response = await submitExam(formData);
            console.log("Thong tin bai thi", response.data);
            
            const resultId = response.data.result._id; 
            confirmAlert({
                title: 'Xác nhận nộp bài',
                message: 'Bạn có chắc chắn muốn nộp bài.',
                buttons: [
                  {
                    label: 'Có',
                    onClick: () => {
                        toast.success("Nộp bài thành công");
                        navigate(`/exams/result/${resultId}`);
                    }
                  },
                  {
                    label: 'Không',
                    onClick: () => {},
                  }
                ]
            });
            
        } catch (error) {
            console.error("Lỗi khi nộp bài", error);
        }
    };

    // Hàm xử lý nút thoát
    const handleBack = () => {
        confirmAlert({
            message: 'Bạn có chắc chắn muốn rời khỏi bài thi? Mọi câu trả lời chưa nộp sẽ bị mất.',
            buttons: [
              {
                label: 'Rời khỏi',
                onClick: () => navigate(-1), // Về lại chi tiết đề thi
              },
              {
                label: 'Tiếp tục làm bài',
                onClick: () => {}, // Không làm gì cả
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: false,
        });
    };

    return (
        <>
        {/* Header */}
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
                    <Card className="mb-3 sticky-card">
                        <Card.Body>
                            <h5><strong>Đề thi: </strong>{title}</h5>
                            <p>Số câu hỏi: {questions.length}</p>
                            <div style={{ display: "grid" }} className="mb-3">
                                <strong>Thời gian còn lại</strong>
                                <span className="text-primary"><strong>{formatTime(timeLeft)}</strong></span>
                            </div> 
                            <Button onClick={handleBack} variant="danger" className="me-2">Trở về</Button>
                            <Button onClick={handleSubmitExam} variant="primary">Nộp bài</Button>
                        </Card.Body>
                        <Card.Body>
                            <h6>Tiến độ hoàn thành</h6>
                            <ProgressBar now={progressPersent} label={`${Math.round(progressPersent)}%`}/>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Lâm bài thi */}
                <Col md={6}>
                {
                    questions.map((question, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Body>
                            <div ref={(el) => (questionRefs.current[index] = el)} key={index}>
                                <h6><strong>Câu {index + 1}</strong></h6>
                            </div>
                            <p>{parse(question.questionText)}</p>
                            {
                                question.options.map((qi, i) => (
                                    <div key={i} className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input"
                                            name={`question-${question._id}`}
                                            checked={answers[question._id] === qi}
                                            onChange={() => handleAnswerChange(question._id, qi)}
                                            value={qi}
                                        />
                                        <label className="form-check-label">{parse(qi)}</label>
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
                    <Card className="sticky-card">
                        <Card.Body>
                            <h6>Mục lục câu hỏi</h6>
                            <div className="d-flex flex-grap gap-2">                               
                                {                                  
                                    questions.map((question, index) => (
                                        <Button key={question._id} 
                                            variant={answers[question._id] ? "primary" : "outline-secondary" } 
                                            onClick={() => scrollToQuestion(index)}
                                            style={{ padding: "6px 12px" }} 
                                            size="sm">
                                            { index + 1 }
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