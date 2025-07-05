import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';

export default function HomeScreen() {
  const [question, setQuestion] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'agent'; text: string }[]>([]);

  const askAgent = async () => {
    if (question.trim() === '') return;

    setMessages(prev => [...prev, { sender: 'user', text: question }]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, { sender: 'agent', text: data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'agent', text: 'Bir hata oluştu!' }]);
    }

    setQuestion('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>İş Bulma Ajanı</Text>

          <ScrollView
            style={styles.chatContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.agentBubble
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Metin giriniz..."
              value={question}
              onChangeText={setQuestion}
            />
            <Button title="Gonder" onPress={askAgent} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F2F2'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  chatContainer: {
    flex: 1,
    marginVertical: 16
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end'
  },
  agentBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: 16
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff'
  }
});
