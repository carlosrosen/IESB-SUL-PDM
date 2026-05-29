import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

export default function MonthFilter({ selectedDate, onPrev, onNext }) {
  const monthName = selectedDate.toLocaleString("pt-BR", { month: "long" });
  const year = selectedDate.getFullYear();
  const formattedDate = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${year}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrev} style={styles.button}>
        <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.dateText}>{formattedDate}</Text>
      <TouchableOpacity onPress={onNext} style={styles.button}>
        <MaterialIcons name="chevron-right" size={28} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderRadius: 12,
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: {
    padding: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
  },
});
