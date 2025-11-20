
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  text: string;
  type: 'sent' | 'reply';
};

export default function HomeScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [
      ...prev,
      { text: message, type: 'sent' },
      { text: `this is your quest: ${message}`, type: 'reply' }
    ]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
            {messages.map((msg, idx) => (
              <View
                key={idx}
                style={msg.type === 'sent' ? styles.sentMessage : styles.replyMessage}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.tabBar}>
        </View>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonArrow}>↑</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013220', // dark green
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 0,
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  messagesContent: {
    paddingBottom: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#228B22',
    borderRadius: 16,
    marginVertical: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  replyMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#32503fff',
    borderRadius: 16,
    marginVertical: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  messageText: {
    color: '#f0f3f2ff',
    fontSize: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#32503fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#32503fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 18,
    marginRight: 8,
    color: '#f0f3f2ff',
  },
  sendButton: {
    backgroundColor: '#228B22',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendButtonArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  tabBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'capitalize',
  },
});
