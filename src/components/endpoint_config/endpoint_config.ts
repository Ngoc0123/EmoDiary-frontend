export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const ENDPOINT = {
    SIGN_UP: `${BACKEND_URL}/authentication/register`,
    SIGN_IN: `${BACKEND_URL}/authentication/login`,
    VERIFY_OTP: `${BACKEND_URL}/authentication/verify-otp`,
    RESEND_OTP: `${BACKEND_URL}/authentication/resend-otp`,
    VERIFY_MAGIC_LINK: `${BACKEND_URL}/authentication/verify-magic-link`,
    GET_ME: `${BACKEND_URL}/users/me`,
    LOGOUT: `${BACKEND_URL}/authentication/logout`,
};