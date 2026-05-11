import { SendIcon } from '@/assets/icons/common_icon/SendIcon';
import { Colors } from '@/constants/theme';
import { useSendFaqMessageMutation } from '@/redux/services/faqChatApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
  hasWhatsApp?: boolean;
  whatsAppUrl?: string;
};

function getTime(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function extractWhatsAppUrl(text: string): string | null {
  const match = text.match(/https?:\/\/wa\.me\/[^\s"\\)]+/);
  return match ? match[0].replace(/\\n/g, '').trim() : null;
}

function cleanReply(text: string): string {
  return text.replace(/\\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

const INITIAL_MESSAGES: Message[] = [
  { id: '0', text: 'Hi 👋 How can I help you today?', sender: 'bot', time: getTime() },
];

function WhatsAppButton({ url }: { url: string }) {
  return (
    <TouchableOpacity
      style={styles.waBtn}
      activeOpacity={0.8}
      onPress={() => Linking.openURL(url).catch(() => {})}
    >
      <Text style={styles.waBtnText}>💬  Open WhatsApp</Text>
    </TouchableOpacity>
  );
}

function MessageBubble({ item }: { item: Message }) {
  const isUser = item.sender === 'user';
  return (
    <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleBot,
        isUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 },
      ]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextBot]}>
          {item.text}
        </Text>
        {!isUser && item.hasWhatsApp && item.whatsAppUrl && (
          <WhatsAppButton url={item.whatsAppUrl} />
        )}
      </View>
      <Text style={styles.timestamp}>{item.time}</Text>
    </View>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [sendMessage, { isLoading: isSending }] = useSendFaqMessageMutation();

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const res = await sendMessage({ message: text }).unwrap();
      const cleaned = cleanReply(res.reply);
      const waUrl = extractWhatsAppUrl(res.reply);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: cleaned,
        sender: 'bot',
        time: getTime(),
        hasWhatsApp: !!waUrl,
        whatsAppUrl: waUrl ?? undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        time: getTime(),
      }]);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>H</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Chat with Hana</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
      </View>

      {/* ── Messages + Input ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble item={item} />}
            contentContainerStyle={styles.chatArea}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            ListFooterComponent={
              isSending ? (
                <View style={styles.msgRowBot}>
                  <View style={[styles.typingBubble, { borderTopLeftRadius: 0 }]}>
                    <Text style={styles.typingDots}>• • •</Text>
                  </View>
                </View>
              ) : null
            }
          />
        </TouchableWithoutFeedback>

        {/* ── Input Bar ── */}
        <View style={[
          styles.inputBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : hp(10) }
        ]}>
          <TextInput
            style={styles.textInput}
            placeholder="Type Something..."
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            editable={!isSending}
          />
          <TouchableOpacity
            style={[styles.sendBtn, isSending && { opacity: 0.6 }]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={isSending}
          >
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(16), paddingVertical: hp(10),
    borderBottomWidth: 0.5, borderBottomColor: '#EEEEEE',
    gap: 10,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 26, color: '#333', lineHeight: 30 },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.BRAND_PRIMARY,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: '#111' },
  headerStatus: { fontSize: 11, color: Colors.BRAND_PRIMARY, marginTop: 1 },

  chatArea: {
    paddingHorizontal: wp(14),
    paddingTop: hp(16),
    paddingBottom: hp(20),
    flexGrow: 1,
  },
  msgRow: { marginBottom: hp(10) },
  msgRowUser: { alignItems: 'flex-end' },
  msgRowBot: { alignItems: 'flex-start' },

  bubble: {
    maxWidth: '78%',
    paddingHorizontal: wp(13),
    paddingVertical: hp(10),
    borderRadius: 18,
  },
  bubbleUser: { backgroundColor: Colors.BRAND_PRIMARY },
  bubbleBot: { backgroundColor: '#EEEEEE' },
  bubbleText: { fontSize: 13, lineHeight: 19 },
  bubbleTextUser: { color: '#FFFFFF' },
  bubbleTextBot: { color: '#1a1a1a' },

  timestamp: { fontSize: 10, color: '#aaa', marginTop: 3, paddingHorizontal: 4 },

  waBtn: {
    marginTop: hp(10),
    backgroundColor: '#25D366',
    borderRadius: 10,
    paddingVertical: hp(9),
    paddingHorizontal: wp(14),
    alignItems: 'center',
  },
  waBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  typingBubble: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: wp(14), paddingVertical: hp(10),
    borderRadius: 18,
  },
  typingDots: { fontSize: 18, color: '#999', letterSpacing: 3 },

  inputBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: wp(12), paddingVertical: hp(10),
    backgroundColor: Colors.APP_BACKGROUND,
    borderTopWidth: 0.5, borderTopColor: '#EEEEEE',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1, borderColor: Colors.BORDER_COLOR,
    borderRadius: 60,
    paddingHorizontal: wp(14), paddingVertical: hp(17),
    fontSize: 13, color: '#0D0D0D',
    maxHeight: hp(100), backgroundColor: '#FFF',
  },
  sendBtn: {
    width: wp(83), height: hp(54),
    borderRadius: 60, backgroundColor: Colors.BRAND_PRIMARY,
    justifyContent: 'center', alignItems: 'center',
  },
});