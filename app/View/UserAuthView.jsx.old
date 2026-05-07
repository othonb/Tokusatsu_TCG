import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useUser } from "../Context/UserContext";

function ModeButton({ active, label, onPress }) {
  return (
    <Pressable style={[styles.modeButton, active && styles.modeButtonActive]} onPress={onPress}>
      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function UserAuthView() {
  const { registerUser, loginUser } = useUser();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("Entre com sua conta ou crie um novo usuario para continuar.");

  const handleSubmit = () => {
    const result = mode === "register" ? registerUser(username, password) : loginUser(username, password);

    if (!result.ok) {
      setFeedback(result.message);
      return;
    }

    setFeedback(mode === "register" ? "Conta criada com sucesso." : "Login realizado com sucesso.");
    router.replace("/home");
  };

  return (
    <View style={styles.page}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Tokusatsu Chronicle</Text>
        <Text style={styles.title}>Tela de Usuario</Text>
        <Text style={styles.subtitle}>
          Antes de entrar na tela inicial, crie sua conta ou entre em uma conta existente.
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.modeRow}>
          <ModeButton active={mode === "login"} label="Entrar" onPress={() => setMode("login")} />
          <ModeButton active={mode === "register"} label="Criar conta" onPress={() => setMode("register")} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nome do usuario"
            placeholderTextColor="#7f8b97"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor="#7f8b97"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{mode === "register" ? "Criar e entrar" : "Entrar na conta"}</Text>
        </Pressable>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#040811",
    paddingHorizontal: 20,
    paddingVertical: 32,
    justifyContent: "center",
    gap: 18
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(92, 242, 255, 0.35)",
    backgroundColor: "rgba(8, 16, 28, 0.92)",
    padding: 22
  },
  eyebrow: {
    color: "#5cf2ff",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "700"
  },
  title: {
    color: "#fff4b0",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10
  },
  subtitle: {
    color: "#d4dde7",
    lineHeight: 22,
    marginTop: 10
  },
  formCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.28)",
    backgroundColor: "rgba(7, 11, 19, 0.94)",
    padding: 22,
    gap: 16
  },
  modeRow: {
    flexDirection: "row",
    gap: 10
  },
  modeButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingVertical: 12,
    alignItems: "center"
  },
  modeButtonActive: {
    borderColor: "#f6d94f",
    backgroundColor: "#f6d94f"
  },
  modeButtonText: {
    color: "#e5eef7",
    fontWeight: "800"
  },
  modeButtonTextActive: {
    color: "#071018"
  },
  fieldGroup: {
    gap: 8
  },
  label: {
    color: "#dce8f2",
    fontWeight: "700"
  },
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    paddingHorizontal: 14
  },
  submitButton: {
    borderRadius: 16,
    backgroundColor: "#f6d94f",
    paddingVertical: 14,
    alignItems: "center"
  },
  submitButtonText: {
    color: "#071018",
    fontWeight: "900"
  },
  feedbackCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14
  },
  feedbackText: {
    color: "#c9d5e1",
    lineHeight: 20
  }
});
