import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, typography } from '@/lib/theme';

interface Message {
  id: string;
  role: 'coach' | 'user';
  text: string;
}

const SEED: Message[] = [
  {
    id: '1',
    role: 'coach',
    text: 'Hey Avinash. How are you feeling about today’s plan?',
  },
  {
    id: '2',
    role: 'user',
    text: 'A bit tired — slept late. Should I still do the HIIT session?',
  },
  {
    id: '3',
    role: 'coach',
    text: 'Let’s swap it for the morning mobility flow today and push HIIT to tomorrow. Recovery first.',
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const [messages] = useState<Message[]>(SEED);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={20}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Coach</Text>
        <Text style={styles.subtitle}>Your AI nutrition & fitness guide</Text>
      </View>

      <ScrollView
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleCoach]}
          >
            <Text
              style={[
                styles.bubbleText,
                m.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextCoach,
              ]}
            >
              {m.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.composerWrap}>
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything…"
            placeholderTextColor={colors.text.muted}
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <Pressable style={[styles.send, !draft && styles.sendDisabled]} disabled={!draft}>
            <Feather name="arrow-up" size={18} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.size['2xl'],
    color: colors.text.primary,
    letterSpacing: typography.size['2xl'] * typography.tracking.display,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: typography.size.sm,
    color: colors.text.muted,
    marginTop: 2,
  },
  thread: { flex: 1 },
  threadContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 10,
  },
  bubbleCoach: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.text.primary,
    borderTopRightRadius: 4,
  },
  bubbleText: { fontFamily: fonts.body, fontSize: typography.size.base, lineHeight: 20 },
  bubbleTextCoach: { color: colors.text.primary },
  bubbleTextUser: { color: colors.white },

  composerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 96, // clear floating tab bar
    paddingTop: 8,
    backgroundColor: colors.bg,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: typography.size.base,
    color: colors.text.primary,
    maxHeight: 100,
    paddingTop: 6,
    paddingBottom: 6,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text.primary,
  },
  sendDisabled: { opacity: 0.4 },
});
