import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const PaymentSuccessScreen = () => {
const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://img.icons8.com/emoji/96/000000/check-mark-emoji.png' }}
          style={styles.icon}
        />
        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.subtitle}>
          Cảm ơn bạn đã giao dịch. Đơn hàng của bạn đang được xử lý.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Về Trang Chủ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebf7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 9,
    borderColor: '#1976d2',
    borderWidth: 2,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1976d2', //
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  }
});

export default PaymentSuccessScreen;
