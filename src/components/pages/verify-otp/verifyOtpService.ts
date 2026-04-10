// NOTE: The verify-otp and resend-otp endpoints no longer exist in the current API spec.
// These functions are kept as stubs to avoid breaking the UI, but they will always throw.

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export async function verifyOtpApi(_data: VerifyOtpRequest): Promise<void> {
  throw new Error("Verify OTP endpoint is not available in the current API.");
}

export async function resendOtpApi(_email: string): Promise<void> {
  throw new Error("Resend OTP endpoint is not available in the current API.");
}
