// Sign In API Service
// This file contains all API calls related to sign-in functionality

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
}

export async function signInApi(data: SignInRequest): Promise<SignInResponse> {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('/api/auth/sign-in', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Sign in failed');
  // return response.json();

  // Simulated API call for now
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock response
  return {
    user: {
      id: "1",
      email: data.email,
      name: data.email.split("@")[0],
    },
    token: "mock-jwt-token",
  };
}
