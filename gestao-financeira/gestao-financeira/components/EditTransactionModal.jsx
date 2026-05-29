import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";
import Button from "./Button";
import DescriptionInput from "./DescriptionInput";
import CurrencyInput from "./CurrencyInput";
import DatePicker from "./DatePicker";
import CategoryPicker from "./CategoryPicker";

export default function EditTransactionModal({ visible, onClose, transaction }) {
  const { categories, updateTransaction } = useContext(MoneyContext);
  const valueInputRef = useRef();

  const [form, setForm] = useState({
    description: "",
    value: 0,
    date: new Date(),
    categoryId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (transaction && visible) {
      setForm({
        description: transaction.description,
        value: Number(transaction.value),
        date: new Date(transaction.date),
        categoryId: transaction.categoryId,
      });
    }
  }, [transaction, visible]);

  const handleSave = async () => {
    if (!form.description.trim()) {
      Alert.alert("Informe a descrição.");
      return;
    }
    if (!form.value || form.value <= 0) {
      Alert.alert("Informe um valor maior que zero.");
      return;
    }
    if (!form.categoryId) {
      Alert.alert("Selecione uma categoria.");
      return;
    }

    setSubmitting(true);
    try {
      await updateTransaction(transaction.id, {
        description: form.description.trim(),
        value: form.value,
        date: form.date,
        categoryId: form.categoryId,
      });
      Alert.alert("Sucesso", "Transação atualizada!");
      onClose();
    } catch (e) {
      Alert.alert("Erro ao salvar", e.message ?? "Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView style={styles.overlay} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Editar transação</Text>
              <TouchableOpacity onPress={onClose} hitSlop={10}>
                <MaterialIcons name="close" size={24} color={colors.primaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                <DescriptionInput
                  form={form}
                  setForm={setForm}
                  valueInputRef={valueInputRef}
                />
                <CurrencyInput
                  form={form}
                  setForm={setForm}
                  valueInputRef={valueInputRef}
                />
                <DatePicker form={form} setForm={setForm} />
                <CategoryPicker
                  form={form}
                  setForm={setForm}
                  categories={categories}
                />
              </View>
              <Button onPress={handleSave} disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  formContainer: {
    marginBottom: 20,
  },
  form: {
    gap: 12,
    marginBottom: 24,
  },
});
