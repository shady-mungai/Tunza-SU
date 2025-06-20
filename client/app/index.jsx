import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import "../global.css"

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({

})