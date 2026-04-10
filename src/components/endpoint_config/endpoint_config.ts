export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const ENDPOINT = {
    // Auth
    SIGN_UP: `${BACKEND_URL}/api/v1/auth/register`,
    SIGN_IN: `${BACKEND_URL}/api/v1/auth/login`,
    REFRESH: `${BACKEND_URL}/api/v1/auth/refresh`,
    LOGOUT: `${BACKEND_URL}/api/v1/auth/logout`,

    // Users
    GET_ME: `${BACKEND_URL}/api/v1/users/me`,
    UPDATE_ME: `${BACKEND_URL}/api/v1/users/me`,

    // Drawings
    CREATE_DRAWING: `${BACKEND_URL}/api/v1/drawings/`,
    GET_DRAWING_TODAY: `${BACKEND_URL}/api/v1/drawings/today`,
    GET_DRAWING: (drawingId: string) => `${BACKEND_URL}/api/v1/drawings/${drawingId}`,

    // Friends
    SEND_FRIEND_REQUEST: `${BACKEND_URL}/api/v1/friends/request`,
    LIST_FRIENDS: `${BACKEND_URL}/api/v1/friends/list`,
    UPDATE_FRIENDSHIP: (friendshipId: string) => `${BACKEND_URL}/api/v1/friends/${friendshipId}`,
};