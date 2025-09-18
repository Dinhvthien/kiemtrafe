import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const QuestionForm = ({ examId, onClose, onSuccess }) => {
  useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState(null);

  // Fetch all questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/exam-questions/${examId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Không thể tải danh sách câu hỏi');
        }
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError('Không thể tải danh sách câu hỏi: ' + err.message);
        console.error('Lỗi fetchQuestions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [examId]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: '',
        options: [
          { optionLabel: 'A', content: '', isCorrect: false },
          { optionLabel: 'B', content: '', isCorrect: false },
          { optionLabel: 'C', content: '', isCorrect: false },
          { optionLabel: 'D', content: '', isCorrect: false },
        ],
      },
    ]);
    setEditingQuestionIndex(null);
    setEditedQuestion(null);
  };

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].content = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...questions];
    if (field === 'isCorrect') {
      newQuestions[qIndex].options.forEach((opt, idx) => {
        opt.isCorrect = idx === oIndex;
      });
    } else {
      newQuestions[qIndex].options[oIndex][field] = value;
    }
    setQuestions(newQuestions);
  };

  const removeQuestion = async (qIndex) => {
    const question = questions[qIndex];
    if (question.questionId) {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/exam-questions/${question.questionId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Không thể xóa câu hỏi');
        }
        setQuestions(questions.filter((_, index) => index !== qIndex));
        setSuccess('Xóa câu hỏi thành công!');
      } catch (err) {
        setError('Không thể xóa câu hỏi: ' + err.message);
        console.error('Lỗi xóa:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setQuestions(questions.filter((_, index) => index !== qIndex));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const newQuestions = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.length >= 6) {
          const [question, a, b, c, d, correctAnswer] = row;
          const options = [
            { optionLabel: 'A', content: a || '', isCorrect: correctAnswer === 'A' },
            { optionLabel: 'B', content: b || '', isCorrect: correctAnswer === 'B' },
            { optionLabel: 'C', content: c || '', isCorrect: correctAnswer === 'C' },
            { optionLabel: 'D', content: d || '', isCorrect: correctAnswer === 'D' },
          ];
          newQuestions.push({ content: question || '', options });
        }
      }
      if (newQuestions.length > 0) {
        setQuestions(newQuestions);
        setError(null);
      } else {
        setError('Không tìm thấy dữ liệu câu hỏi trong file Excel.');
      }
    };
    reader.onerror = () => {
      setError('Lỗi khi đọc file Excel.');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEditQuestion = (qIndex) => {
    setEditingQuestionIndex(qIndex);
    setEditedQuestion({ ...questions[qIndex] });
  };

  const handleSaveEdit = async () => {
    if (editingQuestionIndex !== null && editedQuestion) {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/exam-questions/${editedQuestion.questionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(editedQuestion),
        });
        if (!response.ok) {
          throw new Error('Không thể cập nhật câu hỏi');
        }
        const newQuestions = [...questions];
        newQuestions[editingQuestionIndex] = editedQuestion;
        setQuestions(newQuestions);
        setEditingQuestionIndex(null);
        setEditedQuestion(null);
        setSuccess('Cập nhật câu hỏi thành công!');
      } catch (err) {
        setError('Không thể cập nhật câu hỏi: ' + err.message);
        console.error('Lỗi cập nhật:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Chỉ tạo mới cho câu hỏi không có questionId, cập nhật cho câu hỏi có questionId
      const newQuestions = questions.filter(q => !q.questionId);
      const updatedQuestions = questions.filter(q => q.questionId);

      if (newQuestions.length > 0) {
        const createPayload = { examId: parseInt(examId), questions: newQuestions };
        const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/exam-questions/creates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(createPayload),
        });
        if (!createResponse.ok) {
          throw new Error('Không thể tạo mới câu hỏi: ' + (await createResponse.text()));
        }
      }

      // Cập nhật từng câu hỏi đã có
      for (const question of updatedQuestions) {
        const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/exam-questions/${question.questionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(question),
        });
        if (!updateResponse.ok) {
          throw new Error('Không thể cập nhật câu hỏi: ' + (await updateResponse.text()));
        }
      }

      setSuccess('Lưu danh sách câu hỏi thành công!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Không thể lưu danh sách câu hỏi: ' + err.message);
      console.error('Lỗi lưu danh sách:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Nút Thêm, Sửa, và Nhập file Excel */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={addQuestion}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Thêm
        </button>
        <button
          onClick={() => handleEditQuestion(editingQuestionIndex !== null ? editingQuestionIndex : 0)}
          disabled={editingQuestionIndex === null || questions.length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Sửa
        </button>
        <label className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded cursor-pointer">
          Tải file Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Form sheet cho danh sách câu hỏi */}
      <form onSubmit={handleListSubmit} className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">STT</th>
                <th className="py-2 px-4 border-b text-left">Câu hỏi</th>
                <th className="py-2 px-4 border-b text-left">Đáp án A</th>
                <th className="py-2 px-4 border-b text-left">Đáp án B</th>
                <th className="py-2 px-4 border-b text-left">Đáp án C</th>
                <th className="py-2 px-4 border-b text-left">Đáp án D</th>
                <th className="py-2 px-4 border-b text-left">Đáp án đúng</th>
                <th className="py-2 px-4 border-b text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, qIndex) => (
                <tr key={qIndex} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-bold">{qIndex + 1}</td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={question.content}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  {question.options.map((option, oIndex) => (
                    <td key={oIndex} className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={option.content}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'content', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b">
                    <select
                      value={question.options.findIndex(opt => opt.isCorrect) + 1}
                      onChange={(e) => handleOptionChange(qIndex, parseInt(e.target.value) - 1, 'isCorrect', true)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Chưa chọn</option>
                      <option value={1}>A</option>
                      <option value={2}>B</option>
                      <option value={3}>C</option>
                      <option value={4}>D</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Lưu danh sách câu hỏi'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md"
          >
            Hủy
          </button>
        </div>
      </form>

      {/* Modal chỉnh sửa câu hỏi */}
      {editingQuestionIndex !== null && editedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Chỉnh sửa câu hỏi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Câu hỏi</label>
                <input
                  type="text"
                  value={editedQuestion.content}
                  onChange={(e) => setEditedQuestion({ ...editedQuestion, content: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lựa chọn</label>
                {editedQuestion.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2 mt-2">
                    <span className="font-bold">{option.optionLabel}.</span>
                    <input
                      type="text"
                      value={option.content}
                      onChange={(e) => {
                        const newOptions = [...editedQuestion.options];
                        newOptions[oIndex].content = e.target.value;
                        setEditedQuestion({ ...editedQuestion, options: newOptions });
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="radio"
                      name="correctEdit"
                      checked={option.isCorrect}
                      onChange={() => {
                        const newOptions = editedQuestion.options.map((opt, idx) => ({
                          ...opt,
                          isCorrect: idx === oIndex,
                        }));
                        setEditedQuestion({ ...editedQuestion, options: newOptions });
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Lưu'}
                </button>
                <button
                  onClick={() => {
                    setEditingQuestionIndex(null);
                    setEditedQuestion(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;