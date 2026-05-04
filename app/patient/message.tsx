import { SendIcon } from '@/assets/icons/common_icon/SendIcon';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
};

const BOT_REPLIES = [
  "I see. Have you been drinking enough water today?",
  "That's helpful information. Try to rest and avoid screens for a while.",
  "If the pain gets worse, please visit the clinic right away.",
  "I'll note this down. Would you like to schedule a consultation?",
  "Understood. Let me know if anything changes.",
  "Thank you for the update. Please take care!",
];

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: "Hi, Doctor. I've Been Having A Headache Since Yesterday. And It Hasn't Gone Away.", sender: 'user', time: '6:30 AM' },
  { id: '2', text: "I'm Sorry To Hear That. Can You Describe The Headache—Does It Feel Sharp, Dull, Or Throbbing?", sender: 'bot', time: '6:31 AM' },
  { id: '3', text: "It's More Of A Dull Pain, Mostly Around My Forehead.", sender: 'user', time: '6:33 AM' },
  { id: '4', text: "See. Have You Noticed Any Other Symptoms Like Fever, Nausea, Or Vision Changes?", sender: 'bot', time: '6:34 AM' },
  { id: '5', text: "No Fever. But I Felt A Little Dizzy In The Morning.", sender: 'user', time: '6:35 AM' },
  { id: '6', text: "Thanks For Sharing That. Have You Taken Any Medication For It?", sender: 'bot', time: '6:36 AM' },
];

function getTime(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const replyIndexRef = useRef(0);
  const router = useRouter();

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: getTime(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = BOT_REPLIES[replyIndexRef.current % BOT_REPLIES.length];
      replyIndexRef.current += 1;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'bot',
        time: getTime(),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
        <View style={[
            styles.bubble, 
            isUser ? styles.bubbleUser : styles.bubbleBot,
            isUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }
        ]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextBot]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()} style={styles.backBtn}>
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

      {/* Messages & Input Field */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatArea}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.msgRowBot}>
                <View style={[styles.typingBubble, { borderTopLeftRadius: 0 }]}>
                  <Text style={styles.typingDots}>• • •</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Bottom Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : hp(10) }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Type Something..."
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} activeOpacity={0.8}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(16),
    paddingVertical: hp(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
    gap: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#333',
    lineHeight: 30,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.BRAND_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  headerStatus: {
    fontSize: 11,
    color: Colors.BRAND_PRIMARY,
    marginTop: 1,
  },

  // Chat Area Styles
  chatArea: {
    paddingHorizontal: wp(14),
    paddingTop: hp(16),
    paddingBottom: hp(20),
    gap: 10,
  },
  msgRow: {
    marginBottom: hp(10),
  },
  msgRowUser: {
    alignItems: 'flex-end',
  },
  msgRowBot: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: wp(13),
    paddingVertical: hp(10),
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  bubbleBot: {
    backgroundColor: '#EEEEEE',
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  bubbleTextBot: {
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 3,
    paddingHorizontal: 4,
  },

  // Typing Indicator
  typingBubble: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: wp(14),
    paddingVertical: hp(10),
    borderRadius: 18,
  },
  typingDots: {
    fontSize: 18,
    color: '#999',
    letterSpacing: 3,
  },

  // Input Bar Styles
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
    paddingVertical: hp(10),
    backgroundColor: Colors.APP_BACKGROUND,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 60,
    paddingHorizontal: wp(14),
    paddingVertical: hp(17),
    fontSize: 13,
    color: '#0D0D0D',
    maxHeight: hp(100),
    backgroundColor: '#FFF'
  },
  sendBtn: {
    width: wp(83),
    height: hp(54),
    borderRadius: 60,
    backgroundColor: Colors.BRAND_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});