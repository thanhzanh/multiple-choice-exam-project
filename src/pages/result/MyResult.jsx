import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment-timezone";
import { useNavigate } from "react-router-dom";
import { getListResultExam } from "../../services/ResultService";
import { getUser } from "../../services/AccountService";

const MyResult = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchGetUser = async () => {
      const userInfo = await getUser();
      setUser(userInfo);
    };

    fetchGetUser();
  }, []);

  useEffect(() => {
    if (!user || !user._id) return;
    const fetchGetListResult = async () => {
      try {
        const response = await getListResultExam(user._id);
        setResults(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy kết quả:", error);
      }
    };

    fetchGetListResult();
  }, [user]);

  // Xếp loại điểm
  const getRank = (score) => {
    if (score >= 9) return "Xuất sắc";
    if (score >= 8) return "Giỏi";
    if (score >= 6.5) return "Khá";
    if (score >= 5) return "Trung bình";
    return "Yếu";
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  return (
    <MainLayout>
      <div className="my-result-container">
        <h4 className="mb-4">Kết quả thi</h4>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Đề thi</th>
                <th scope="col">Điểm số</th>
                <th scope="col">Xếp loại</th>
                <th scope="col">Số câu đúng</th>
                <th scope="col">Số câu sai</th>
                <th scope="col">Tổng số câu</th>
                <th scope="col">Thời gian hoàn thành</th>
                <th scope="col">Thời gian nộp bài thi</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {results &&
                results.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{result.examId.title}</td>
                    <td>{result.scores}</td>
                    <td>{getRank(result.scores)}</td>
                    <td>{result.correctAnswers} câu</td>
                    <td>{result.totalQuestions - result.correctAnswers} câu</td>
                    <td>{result.totalQuestions} câu</td>
                    <td>{formatDuration(result.durationReal)}</td>
                    <td>{moment(result.submittedAt).format("DD/MM/YYYY, h:mm:ss a")}</td>
                    <td>
                      <FontAwesomeIcon
                        title="Xem chi tiết"
                        style={{ color: "black" }}
                        icon={faEye}
                        onClick={ () => navigate(`/exams/result/${result._id}`) }
                      />
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    Không có kết quả thi nào!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyResult;
