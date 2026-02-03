import api from './api';

export const login = async (role: string, credentials: any) => {
    const response = await api.post(`/auth/login/${role}`, credentials);
    return response.data;
};

export const register = async (role: string, data: any) => {
    // Handle FormData for file uploads if needed, but initial register usually JSON unless files required immediately
    // If `profile_photo` is required at register, we need FormData.
    // Based on backend, it accepts JSON or multipart. Backend uses `upload.single('image')` only on update profile? 
    // Let's check backend authRoutes: `router.post('/register/admin', registerAdmin);`
    // And controllers use req.body directly. No upload middleware on register routes in `authRoutes.js`.
    // So it's JSON.
    const response = await api.post(`/auth/register/${role}`, data);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};
