import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Kiểm tra phản hồi HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Lỗi HTTP! Trạng thái: ${response.status}`
        );
      }

      // Phân tích phản hồi
      const data = await response.json();
      console.log("Phản hồi API:", data);

      // Kiểm tra token
      if (!data?.result?.token) {
        throw new Error("Không tìm thấy token trong phản hồi");
      }

      const token = data.result.token;
      localStorage.setItem("token", token);


      // Giải mã payload JWT
      try {
        const base64Payload = token.split(".")[1];
        if (!base64Payload) {
          throw new Error("Token không có payload hợp lệ");
        }
        // Thêm padding Base64 nếu cần
        const paddedPayload = base64Payload.padEnd(
          base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
          "="
        );
        // Giải mã payload
        const decodedPayload = JSON.parse(atob(paddedPayload));
        console.log("Payload giải mã:", decodedPayload);

        // Xác định vai trò
        let role = "user";
        if (decodedPayload.scope && decodedPayload.scope.includes("_")) {
          role = decodedPayload.scope.split("_")[1].toLowerCase();
        }
        console.log("Vai trò:", role);

        // Điều hướng
        if (role === "admin") {
          console.log("Điều hướng đến /admin" + navigate("/admin"));
          navigate("/admin");
        } else {
          console.log("Điều hướng đến /kiem-tra");
          navigate("/kiem-tra");
        }
      } catch (decodeError) {
        console.error("Lỗi giải mã token:", decodeError);
        // Vẫn cho phép đăng nhập, nhưng điều hướng mặc định
        setError("Đăng nhập thành công, nhưng không thể xác định vai trò.");
        navigate("/home");
      }
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu.");
      console.error("Lỗi đăng nhập:", err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Đăng nhập
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">Tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Nhập tài khoản"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Nhập mật khẩu"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#F9A825] text-white py-2 px-4 rounded-lg hover:bg-[#e6c185] transition duration-200"
        >
          Đăng nhập
        </button>

        {/* <div className="text-center mt-4">
          <div className="text-gray-500 mb-2">Hoặc</div>
          <span className="text-gray-500">Đăng ký: </span>
          <a href="/register" className="text-[#F9A825] hover:underline ml-1">
            Tại đây
          </a>
        </div> */}
      </form>
    </div>
  );
}