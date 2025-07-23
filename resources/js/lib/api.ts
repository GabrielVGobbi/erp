import axios, { AxiosError, AxiosInstance } from 'axios';
import { getToken, getAuthMode } from './auth';
import { toast } from 'react-toastify';

interface ValidationErrors {
    [key: string]: string[];
}

// Cria instância API
const api: AxiosInstance = axios.create({
    baseURL: '/api/',
    withCredentials: false,
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const useToken = getAuthMode();
    const token = getToken();

    if (useToken && token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.withCredentials = false;
    } else {
        config.withCredentials = true;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {

        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            if (status === 422 && data && (data as any).errors) {
                const validationErrors: ValidationErrors = (data as any).errors;
                Object.values(validationErrors).forEach(errorList => {
                    errorList.forEach((message) => {
                        toast.error(message);
                    });
                });
            }

            if (status === 401) {
                sessionStorage.removeItem('token');
                toast.error('Sessão expirada! Redirecionando...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }

            if (status >= 400 && status !== 422 && status !== 401) {
                toast.error('Erro ao processar a requisição. Tente novamente.');
            }
        } else {
            toast.error('Erro de conexão. Verifique sua internet.');
        }

        return Promise.reject(error);
    }
);

export default api;
