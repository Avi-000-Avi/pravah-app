import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
let initialised = false;

export function initMonitoring(): void {
  if (!dsn) {
    if (__DEV__) {
      console.warn('[monitoring] EXPO_PUBLIC_SENTRY_DSN not set — Sentry disabled');
    }
    return;
  }
  Sentry.init({
    dsn,
    tracesSampleRate: __DEV__ ? 0 : 0.2,
    environment: __DEV__ ? 'development' : 'production',
  });
  initialised = true;
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!initialised) return;
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context);
    Sentry.captureException(error);
  });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  if (!initialised) return;
  Sentry.captureMessage(message, level);
}
