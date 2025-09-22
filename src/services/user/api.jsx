const apiUrl = import.meta.env.VITE_API_URL;
export const submitExamData = async (examData) => {
  try {
    const response = await fetchWithAuth(`/exam-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      success: true,
      message: result.message || "Bài thi của bạn đã được nộp thành công!",
      data: result
    };
  } catch (error) {
    console.error('Error submitting exam:', error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại!"
    };
  }
};

// API để lấy kết quả chi tiết bài thi của student
export const getExamResult = async (submissionId) => {
  try {
    const response = await fetchWithAuth(`/exam-submissions/${submissionId}/result`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error fetching exam result:', error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi lấy kết quả bài thi!"
    };
  }
};

// API để lấy kết quả bài thi theo examId và phoneNumber
export const getExamResultByStudent = async (examId, phoneNumber) => {
  try {
    const response = await fetchWithAuth(`/exam-submissions/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        examId: examId,
        phoneNumber: phoneNumber
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error fetching exam result by student:', error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi lấy kết quả bài thi!"
    };
  }
};

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Thêm token nếu có
  };

  const response = await fetch(`${apiUrl}${url}`, { ...options, headers });

  if (response.status === 401) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh token");
      }

      const { accessToken } = await refreshResponse.json();
      localStorage.setItem("token", accessToken);

      // Thử lại yêu cầu gốc với token mới
      const retryResponse = await fetch(`${apiUrl}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return retryResponse;
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw error;
    }
  }

  return response;
}