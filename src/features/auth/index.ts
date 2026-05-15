export { useAuth } from './hooks/useAuth';
export { useAuthCallback } from './hooks/useAuthCallback';
export { useAuthBootstrap } from './hooks/useAuthBootstrap';
export { useEmailAuth } from './hooks/useEmailAuth';
export { useGoogleSSO } from './hooks/useGoogleSSO';
// Phone OTP kept on disk; not the active sign-in path until SMS is wired.
export { usePhoneOTP, PHONE_E164_REGEX, toE164India } from './hooks/usePhoneOTP';
export { useAuthStore } from './store/authStore';
export type { AuthError, Session, User } from './types/auth.types';
