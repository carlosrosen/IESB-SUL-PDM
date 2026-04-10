import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DespesasRecentes from "./screens/DespesasRecentes";
import TodasDespesas from "./screens/TodasDespesas";
import GerenciarDespesa from "./screens/GerenciarDespesa";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./components/IconButton";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  const Tab = createBottomTabNavigator();

  function BottomTabScreen() {
    return (
      <Tab.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <IconButton
              icon="add"
              size={24}
              color="black"
              onPress={() => {
                navigation.navigate("GerenciarDespesa");
              }}
            />
          ),
        })}
      >
        <Tab.Screen
          name="DespesasRecentes"
          component={DespesasRecentes}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="hourglass" size={size} color={color} />
            ),
            tabBarLabel: "Recentes",
            title: "Despesas Recentes",
            tabBarLabelStyle: { fontSize: 12 },
          }}
        />
        <Tab.Screen
          name="TodasDespesas"
          component={TodasDespesas}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={size} color={color} />
            ),
            tabBarLabel: "Todas",
            title: "Todas as despesas",
            tabBarLabelStyle: { fontSize: 12 },
          }}
        />
      </Tab.Navigator>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Despesas"
          component={BottomTabScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="GerenciarDespesa" component={GerenciarDespesa} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
