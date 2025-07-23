// lib/auth.ts
export const useTokenAuth = true; // true para Bearer mode, false para Sanctum

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const saveToken = (token: string) => localStorage.setItem('token', token);

export const clearToken = () => localStorage.removeItem('token');

export const getAuthMode = (): boolean => {
    return !!getToken();
}
