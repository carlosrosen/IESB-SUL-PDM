import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function AuthToggle({ isLogin, onToggle, disabled }) {
  return (
    <TouchableOpacity
      style={styles.toggleContainer}
      onPress={onToggle}
      disabled={disabled}
    >
      <Text style={styles.toggleText}>
        {isLogin ? "Não tem uma conta? " : "Já possui uma conta? "}
        <Text style={styles.toggleTextBold}>
          {isLogin ? "Cadastre-se" : "Faça Login"}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
  toggleTextBold: {
    color: "#3EC381",
    fontWeight: "bold",
  },
});
