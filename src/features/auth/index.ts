export { useAuth } from './hooks/useAuth';
export { useGoogleSSO } from './hooks/useGoogleSSO';
export { usePhoneOTP, PHONE_E164_REGEX, toE164India } from './hooks/usePhoneOTP';
export { useAuthStore } from './store/authStore';
export type { AuthError, Session, User } from './types/auth.types';
