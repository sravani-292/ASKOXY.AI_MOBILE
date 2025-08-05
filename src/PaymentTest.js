import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import RazorpayCheckout from 'react-native-razorpay';

const PaymentTest = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',padding:20}}>
      <TouchableHighlight onPress={() => {
  var options = {
    description: 'Credits towards Buying from App',
    image: 'https://www.askoxy.ai/static/media/askoxylogoblack.56dbb158b7a0beaf4fbe.png',
    currency: 'INR',
    key: 'rzp_test_m32qvMp17RGWLi', // Your api key
    amount: '5000',
    name: 'ASKOXY.AI',
    prefill: {
      email: 'void@razorpay.com',
      contact: '9191919191',
      name: 'Razorpay Software'
    },
    theme: {color: '#F37254'}
  }
  RazorpayCheckout.open(options).then((data) => {
    console.log({data});
    // handle success
    alert(`Success: ${data.razorpay_payment_id}`);
  }).catch((error) => {
    // handle failure
    alert(`Error: ${error.code} | ${error.description}`);
  });
}}>
      <Text>Pay Now</Text>
    </TouchableHighlight>
    </View>
  )
}

export default PaymentTest

const styles = StyleSheet.create({})