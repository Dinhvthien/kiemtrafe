import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const ExamCheckForm = () => {
  const { classCode } = useParams();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    classCode: classCode || "",
  });
  const [formErrors, setFormErrors] = useState({
    phoneNumber: "",
    classCode: "",
  });
  const [isChecking, setIsChecking] = useState(false);
  const [notificationType, setNotificationType] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(0[0-9]{9})$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateClassCode = (classCode) => {
    return classCode.length <= 6 && classCode.trim() !== "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const showNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationType(null);
    }, 3000);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      phoneNumber: "",
      classCode: "",
    };

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0)";
      isValid = false;
    }

    if (!formData.classCode.trim()) {
      errors.classCode = "Vui lòng nhập mã lớp học";
      isValid = false;
    } else if (!validateClassCode(formData.classCode)) {
      errors.classCode = "Mã lớp học không hợp lệ (tối đa 6 ký tự)";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCheck = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsChecking(true);

    try {
      // Bước 1: Lấy thông tin học sinh
      const studentResponse = await fetch(`${API_URL}/students/phone/${formData.phoneNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!studentResponse.ok) {
        const errorData = await studentResponse.json();
        throw new Error(errorData.message || "Không tìm thấy thông tin học sinh");
      }

      const studentData = await studentResponse.json();
      const userName = studentData.result?.userName; // Truy cập result.userName
      if (!userName) {
        throw new Error("Không tìm thấy tên học sinh trong phản hồi");
      }

      // Bước 2: Lấy bài thi ngẫu nhiên
      const examResponse = await fetch(`${API_URL}/students/random-by-class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          classCode: formData.classCode,
        }),
      });

      if (!examResponse.ok) {
        const errorData = await examResponse.json();
        throw new Error(errorData.message || "Xác thực thất bại hoặc không tìm thấy bài thi");
      }

      const data = await examResponse.json();
      const { examId, duration, questions } = data.result || {};
      if (!examId || !duration || !questions) {
        throw new Error("Dữ liệu bài thi không hợp lệ");
      }

      // Chuyển hướng đến ExamPage
      navigate("/exam-page", {
        state: {
          classCode: formData.classCode,
          phoneNumber: formData.phoneNumber,
          userName,
          examId,
          duration,
          questions,
        },
      });

      showNotification("Xác thực thành công! Đang chuyển đến bài thi...", "success");
    } catch (error) {
      showNotification(error.message || "Đã xảy ra lỗi khi kiểm tra thông tin", "error");
    } finally {
      setIsChecking(false);
    }
  };

  const NotificationDisplay = () => {
    if (!notificationType) return null;

    return (
      <div
        className={`fixed top-5 right-5 p-4 rounded-md shadow-lg max-w-sm transition-opacity ${
          notificationType === "success"
            ? "bg-green-500 text-white"
            : notificationType === "error"
            ? "bg-red-500 text-white"
            : "bg-yellow-500 text-white"
        }`}
      >
        {notificationMessage}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Kiểm tra thông tin</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <form onSubmit={handleCheck}>
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="Nhập số điện thoại"
              disabled={isChecking}
            />
            {formErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{formErrors.phoneNumber}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="classCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mã Lớp học
            </label>
            <input
              type="text"
              id="classCode"
              name="classCode"
              value={formData.classCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.classCode ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="Nhập mã lớp học"
              disabled={isChecking}
              maxLength={6}
            />
            {formErrors.classCode && (
              <p className="mt-1 text-sm text-red-500">{formErrors.classCode}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isChecking}
          >
            {isChecking ? "Đang kiểm tra..." : "Kiểm tra"}
          </button>
        </form>
      </div>

      <NotificationDisplay />
    </div>
  );
};

export default ExamCheckForm;