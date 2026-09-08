import API from './api';

// Login User
export const loginUser = async (credentials) => {
    const response = await API.post('/login', credentials);
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Logout User
export const logout = async () => {
    try {
        await API.post('/logout');
    } catch (error) {
        console.error('Logout failed', error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Logout Alias for backward compatibility
export const logoutUser = logout;

// Get Current User from Local Storage
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};