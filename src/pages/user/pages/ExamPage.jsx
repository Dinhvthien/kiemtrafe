import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExamHeader from "../components/ExamHeader";
import Question from "../components/Question";
import SubmitButton from "../components/SubmitButton";
import ConfirmModal from "../components/ConfirmModal";
import ResultModal from "../components/ResultModal";
import { submitExamData } from "../../../services/user/api";

const ExamPage = () => {
  const location = useLocation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const formRef = useRef(null);
  const [duration, setDuration] = useState(0); // Thời gian làm bài (phút)
  const [classCode, setClassCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasAutoSubmitted = useRef(false);

  // Lấy dữ liệu từ state khi component mount
  useEffect(() => {
    if (location.state) {
      const { classCode, phoneNumber, userName, examId, duration, questions } =
        location.state;
      setClassCode(classCode || "");
      setPhoneNumber(phoneNumber || "");
      setUserName(userName || "");
      setQuestions(questions || []);
      setDuration(duration || 0);
      localStorage.setItem("examId", examId); // Lưu examId nếu cần
    } else {
      // Thêm dữ liệu test để kiểm tra
      setQuestions([
        {
          questionId: 1,
          questionText: "Test question 1",
          options: ["A", "B", "C", "D"],
        },
        {
          questionId: 2,
          questionText: "Test question 2",
          options: ["A", "B", "C", "D"],
        },
      ]);
    }
  }, [location.state]);
  const handleSubmitClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    // Kiểm tra xem đã submit chưa
    if (isSubmitted) {
      return;
    }

    setIsConfirmModalOpen(false);
    setIsSubmitted(true); // Đánh dấu đã submit
    const formData = new FormData(formRef.current);
    const answers = [];

    // Xử lý dữ liệu form để tạo mảng answers
    formData.forEach((value, key) => {
      if (key.startsWith("question_")) {
        const questionId = parseInt(key.split("_")[1]);
        answers.push({
          questionId: questionId,
          selectedOptionId: parseInt(value),
        });
      }
    });

    // Tạo object dữ liệu theo định dạng mong muốn
    const examDataSubmit = {
      studentName: userName,
      phoneNumber: phoneNumber,
      classCode: classCode,
      examId: localStorage.getItem("examId") || "",
      submissionTime: new Date().toISOString(),
      answers: answers,
    };

    const response = await submitExamData(examDataSubmit);

    setResultMessage(response.message);
    setIsResultModalOpen(true);
  };

  // Hàm xử lý khi hết thời gian làm bài
  const handleTimeExpired = async () => {
    // Kiểm tra xem đã auto submit chưa (sử dụng ref để tránh gọi nhiều lần)
    if (hasAutoSubmitted.current || isSubmitted) {
      return;
    }

    // Đánh dấu đã auto submit
    hasAutoSubmitted.current = true;

    try {
      // Đánh dấu đã submit trước khi gọi API
      setIsSubmitted(true);

      const formData = new FormData(formRef.current);
      const answers = [];

      // Xử lý dữ liệu form để tạo mảng answers
      formData.forEach((value, key) => {
        if (key.startsWith("question_")) {
          const questionId = parseInt(key.split("_")[1]);
          answers.push({
            questionId: questionId,
            selectedOptionId: parseInt(value),
          });
        }
      });

      // Tạo object dữ liệu theo định dạng mong muốn
      const examDataSubmit = {
        studentName: userName,
        phoneNumber: phoneNumber,
        classCode: classCode,
        examId: localStorage.getItem("examId") || "",
        submissionTime: new Date().toISOString(),
        answers: answers,
      };

      await submitExamData(examDataSubmit);

      // Hiển thị thông báo hết thời gian
      setResultMessage("Hết thời gian làm bài! Bài thi đã được tự động nộp.");
      setIsResultModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi tự động submit:", error);
      setResultMessage(
        "Đã xảy ra lỗi khi tự động nộp bài. Vui lòng liên hệ giám thị."
      );
      setIsResultModalOpen(true);
    }
  };

  return (
    <div className="exam-page">
      {/* Truyền dữ liệu studentInfo và duration vào Navbar */}
      <Navbar
        studentInfo={{
          name: userName,
          phone: phoneNumber,
          classCode: classCode,
        }}
        examDuration={duration}
        onTimeExpired={handleTimeExpired}
      />

      <div className="container">
        <ExamHeader
          title="Bài Kiểm Tra"
          description="Hãy trả lời tất cả các câu hỏi dưới đây"
        />

        <form id="examForm" ref={formRef}>
          <div className="question-container">
            {questions.length > 0 ? (
              questions.map((question, index) => {
                console.log(question);
                return (
                  <Question
                    key={question.questionId}
                    question={question}
                    index={index}
                  />
                );
              })
            ) : (
              <p className="text-center text-gray-500">Đang tải câu hỏi...</p>
            )}
          </div>

          <SubmitButton onClick={handleSubmitClick} isSubmitted={isSubmitted} />
        </form>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      <ResultModal
        isOpen={isResultModalOpen}
        message={resultMessage}
        onClose={() => setIsResultModalOpen(false)}
        studentInfo={{
          name: userName,
          phone: phoneNumber,
          classCode: classCode,
        }}
      />
    </div>
  );
};

export default ExamPage;
