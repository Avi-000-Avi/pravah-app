import type * as SentryType from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

let Sentry: typeof SentryType | null = null;
let initialised = false;

function tryLoadSentry(): typeof SentryType | null {
  try {
    // Lazy require so the native module is never evaluated when unavailable
    // (Expo Go, web). A top-level import would crash before this guard.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@sentry/react-native') as typeof SentryType;
  } catch (error) {
    if (__DEV__) {
      console.warn('[monitoring] @sentry/react-native unavailable (Expo Go or web?)', error);
    }
    return null;
  }
}

export function initMonitoring(): void {
  if (!dsn) {
    if (__DEV__) {
      console.warn('[monitoring] EXPO_PUBLIC_SENTRY_DSN not set — Sentry disabled');
    }
    return;
  }
  Sentry = tryLoadSentry();
  if (!Sentry) return;

  Sentry.init({
    dsn,
    tracesSampleRate: __DEV__ ? 0 : 0.2,
    environment: __DEV__ ? 'development' : 'production',
  });
  initialised = true;
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!initialised || !Sentry) return;
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context);
    Sentry?.captureException(error);
  });
}

export function captureMessage(message: string, level: SentryType.SeverityLevel = 'info'): void {
  if (!initialised || !Sentry) return;
  Sentry.captureMessage(message, level);
}
