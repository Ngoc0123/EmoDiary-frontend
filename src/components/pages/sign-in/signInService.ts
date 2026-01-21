import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

export interface SignInRequest {
  email: string;
  password: string;
}

// Reusing the UserRead type or defining a similar one
export interface UserRead {
  id: string;
  email: string | null;
  is_verified: boolean;
  is_active: boolean;
}

export interface SignInResponse {
  // Check the openapi spec from step 59:
  // responses.200.content.application/json.schema.title: "Response Login Authentication Login Post"
  // It likely returns the UserRead object or something similar, and sets an httpOnly cookie.
  // The spec says response body is "Response Login Authentication Login Post" but doesn't define it deeply.
  // USUALLY, login returns the user object + maybe access token (if not cookie only).
  // The user said: "Login user and set access token in httpOnly cookie."
  // So the response might just be the user object or a success message.
  // Let's assume it returns the UserRead object for now based on typical patterns if it's not void.
  // However, looking at the previous step's spec for /authentication/login, the response schema was empty/generic in the prompt text or referenced a title.
  // Let's assume it returns the user information relevant to the frontend context.
  // Actually, looking at the user's prompt step 59, response 200 schema has title "Response Login Authentication Login Post".
  // Often Fastapi returns the result of the function.
  // I will check if I should type it as any safely or generic.
  // Let's look at the signUpService which used UserRead.
  // I will assume it returns the User details for the frontend to store in context.
  
  // Actually, let's look at what the USER context needs: id, email, name, avatar.
  // The UserRead has id, email, is_verified, is_active.
  // We'll stick to what the API returns.
  id?: string;
  email?: string;
}

export async function signInApi(data: SignInRequest): Promise<void> {
    // The previous mock returned user and token. 
    // The Spec says "set access token in httpOnly cookie". 
    // So the response body might not have the token.
    // We will just return void or the response body as is.
    // If the frontend needs user details immediately, the API should return it.
    // For now, let's type return as any to be safe and adaptable, or void if we just rely on cookies.
    // But the frontend usually needs to update the auth context with the user.
    // If the API doesn't return the user, we might need to fetch /me or similar.
    // But let's assume valid login returns something.
    return request.post(ENDPOINT.SIGN_IN, data);
}

