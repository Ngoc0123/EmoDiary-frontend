// Sign Up API Service
// This file contains all API calls related to sign-up functionality

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
}

export async function signUpApi(data: SignUpRequest): Promise<SignUpResponse> {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/auth/sign-up', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Sign up failed');
  // return response.json();

  // Simulated API call for now
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock response
  return {
    user: {
      id: "1",
      email: data.email,
      name: data.username,
    },
    token: "mock-jwt-token",
  };
}

export interface CheckEmailExistsResponse {
  exists: boolean;
}

export async function checkEmailExistsApi(email: string): Promise<CheckEmailExistsResponse> {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  // return response.json();

  // Simulated API call for now
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return { exists: false };
}

export interface CheckUsernameExistsResponse {
  exists: boolean;
}

export async function checkUsernameExistsApi(username: string): Promise<CheckUsernameExistsResponse> {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
  // return response.json();

  // Simulated API call for now
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return { exists: false };
}
