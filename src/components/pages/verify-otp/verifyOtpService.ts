import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export async function verifyOtpApi(data: VerifyOtpRequest): Promise<void> {
  return request.post(ENDPOINT.VERIFY_OTP, data);
}

export async function resendOtpApi(email: string): Promise<void> {
  return request.post(ENDPOINT.RESEND_OTP, null, {
    params: { email }
  });
}
