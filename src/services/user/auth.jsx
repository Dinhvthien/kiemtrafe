import {jwtDecode} from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export const checkTokenAndRole = async (token) => {
  try {
    if (!token) {
      console.error('No token found');
      return { isValid: false, isAdmin: false };
    }

    // Bước 1: Kiểm tra token hợp lệ qua /introspect
    const response = await fetch(`${apiUrl}/auth/introspect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Introspect failed with status: ${response.status}`);
    }

    const result = await response.json();
    const isValid = result.result.valid;

    if (!isValid) {
      console.error('Token is invalid or expired');
      return { isValid: false, isAdmin: false };
    }

    // Bước 2: Giải mã token để kiểm tra scope
    const decodedToken = jwtDecode(token);
    const scope = decodedToken.scope || '';
    const isAdmin = scope.includes('ROLE_ADMIN');

    return { isValid: true, isAdmin };
  } catch (error) {
    console.error('Introspect failed:', error);
    return { isValid: false, isAdmin: false };
  }
};