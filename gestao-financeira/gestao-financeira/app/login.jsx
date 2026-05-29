import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MoneyContext } from "../contexts/GlobalState";

import CustomInput from "../components/CustomInput";
import AuthButton from "../components/AuthButton";
import AuthToggle from "../components/AuthToggle";

export default function LoginScreen() {
  const { signIn, signUp } = useContext(MoneyContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async () => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailPattern = email.trim();
    const passwordPattern = senha.trim();

    if (!emailPattern || !passwordPattern) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!regexEmail.test(emailPattern)) {
      setErrorMessage("Por favor, digite um formato de e-mail válido.");
      return;
    }

    if (!isLogin && !nome) {
      setErrorMessage("Por favor, informe o seu nome.");
      return;
    }

    if (!isLogin && passwordPattern !== confirmarSenha) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setErrorMessage("");
    setIsProcessing(true);

    try {
      if (isLogin) {
        await signIn(emailPattern, passwordPattern);
      } else {
        await signUp(nome, emailPattern, passwordPattern);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? "Seja bem-vindo ao Money!" : "Crie a sua conta"}
            </Text>

            {errorMessage !== "" && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            {!isLogin && (
              <CustomInput
                label="Nome"
                placeholder="João Pedro"
                value={nome}
                onChangeText={setNome}
              />
            )}

            <CustomInput
              label="E-mail"
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <CustomInput
              label="Senha"
              placeholder="********"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            {!isLogin && (
              <CustomInput
                label="Confirmar Senha"
                placeholder="********"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            )}

            <AuthButton
              onPress={submit}
              loading={isProcessing}
              text={isLogin ? "Entrar" : "Cadastrar"}
            />

            <AuthToggle
              isLogin={isLogin}
              onToggle={handleToggle}
              disabled={isProcessing}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#37BF81",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
});
