import React from "react";
import { View, StyleSheet } from "react-native";
import SidebarNavigation from "./SidebarNavigation";

const LayoutWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      <SidebarNavigation />
      <View style={styles.mainContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
});

export default LayoutWrapper;
