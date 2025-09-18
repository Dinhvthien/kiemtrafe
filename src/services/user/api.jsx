export const submitExamData = async (examData) => {
  try {
    const response = await fetch('http://localhost:8080/lms/exam-submissions', {
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