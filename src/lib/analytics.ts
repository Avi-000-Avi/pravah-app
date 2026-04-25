import { PostHog } from 'posthog-react-native';

// Mirrors @posthog/core's JsonType — the constraint posthog enforces on event properties.
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type EventProperties = Record<string, JsonValue>;

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

let client: PostHog | null = null;

if (apiKey) {
  client = new PostHog(apiKey, {
    host: 'https://app.posthog.com',
  });
} else if (__DEV__) {
  console.warn('[analytics] EXPO_PUBLIC_POSTHOG_API_KEY not set — analytics disabled');
}

export function initAnalytics(): void {
  // Client initialises on construction; this is a no-op kept for call-site symmetry.
}

export function track(event: string, properties?: EventProperties): void {
  client?.capture(event, properties);
}

export function identify(userId: string, traits?: EventProperties): void {
  client?.identify(userId, traits);
}

export function resetAnalytics(): void {
  client?.reset();
}
