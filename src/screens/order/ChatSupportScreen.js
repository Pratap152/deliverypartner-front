import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WEBSOCKET_URL } from "../../utils/host";
import { useSelector } from 'react-redux';

export default function ChatSupportScreen({ route, navigation }) {
  const { orderId, customerName } = route.params;
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Connecting...");
  const flatListRef = useRef(null);

  const { data: profile } = useSelector(state => state.profile);

  const getSelfieUri = (selfie) => {
    if (!selfie) return null;
    if (typeof selfie === 'string') return selfie;
    if (typeof selfie === 'object' && selfie.url) return selfie.url;
    return null;
  };
  const selfieUri = getSelfieUri(profile?.selfie);

  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = async () => {
      try {
        let token = await AsyncStorage.getItem("accessToken");

        if (!token) {
          console.log("No token found");
          if (isMounted) setStatus("Error: No Token");
          return;
        }

        // Clean token just in case it was stored with quotes
        token = token.replace(/^"|"$/g, '');

        const SOCKET_URL = `${WEBSOCKET_URL}/ws?type=ORDER_TRACKING&token=${token}&orderId=${orderId}&role=RIDER`;
        console.log("Connecting to WS...");

        ws.current = new WebSocket(SOCKET_URL);

        ws.current.onopen = () => {
          if (isMounted) {
            console.log("✅ Connected");
            setStatus("Connected");
          }
        };

        ws.current.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === "CHAT_MESSAGE") {
              setMessages((prev) => {
                // Prevent duplicate if we already added it optimistically
                if (data.senderRole === "RIDER" && prev.some(m => m.message === data.message && m.senderRole === "RIDER")) {
                  return prev;
                }
                return [...prev, data];
              });
            }
            if (data.type === "LIVE_LOCATION") {
              console.log("📍 Location:", data);
            }
          } catch (err) {
            console.log("❌ Invalid message:", event.data);
          }
        };

        ws.current.onerror = (err) => {
          if (isMounted) {
            console.log("❌ WS ERROR FULL:", err);
            setStatus("Error");
          }
        };

        ws.current.onclose = (e) => {
          if (isMounted) {
            console.log("❌ Disconnected:", e.code, e.reason);
            setStatus("Disconnected");
          }
        };
      } catch (error) {
        console.error("Error setting up WS:", error);
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      ws.current?.close();
    };
  }, [orderId]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = {
      type: "CHAT_MESSAGE",
      message: text,
      senderRole: "RIDER"
    };
    if (ws.current?.readyState === 1) {
      ws.current.send(JSON.stringify(payload));
      // Optimistically add message to UI
      setMessages((prev) => [...prev, { ...payload, id: Date.now().toString() }]);
      setText("");
    } else {
      Alert.alert("Connection Error", "Chat is still connecting or disconnected. Please wait.");
      console.log("❌ Socket not open");
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderRole === "RIDER";
    const senderName = isMe ? "You" : "Customer";

    return (
      <View style={[styles.msgWrapper, { justifyContent: isMe ? "flex-end" : "flex-start" }]}>
        {!isMe && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={36} color="#94A3B8" />
          </View>
        )}
        <View style={{ maxWidth: '75%' }}>
          <Text style={[styles.senderName, { alignSelf: isMe ? "flex-end" : "flex-start" }]}>
            {senderName}
          </Text>
          <View style={[styles.msgBox, isMe ? styles.myMsg : styles.otherMsg]}>
            <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.otherMsgText]}>{item.message}</Text>
          </View>
        </View>
        {isMe && (
          <View style={[styles.avatarContainer, { marginLeft: 8, marginRight: 0 }]}>
            {selfieUri ? (
              <Image source={{ uri: selfieUri }} style={{ width: 36, height: 36, borderRadius: 18, resizeMode: 'cover' }} />
            ) : (
              <Ionicons name="person-circle" size={36} color="#1E293B" />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{customerName || 'Customer'}</Text>
            <Text style={styles.headerOrderId}>{orderId}</Text>
          </View>
          <TouchableOpacity style={styles.langBtn}>
            <Ionicons name="globe-outline" size={16} color="#1E293B" style={{ marginRight: 4 }} />
            <Text style={styles.langText}>English</Text>
            <Ionicons name="chevron-down" size={16} color="#1E293B" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => {
              if (messages.length > 0) flatListRef.current?.scrollToEnd({ animated: true });
            }}
            onLayout={() => {
              if (messages.length > 0) flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type message..."
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerOrderId: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    marginHorizontal: 4,
  },
  msgBox: {
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  myMsg: {
    backgroundColor: '#1E293B',
    borderTopRightRadius: 4,
  },
  otherMsg: {
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMsgText: {
    color: '#FFFFFF',
  },
  otherMsgText: {
    color: '#334155',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
