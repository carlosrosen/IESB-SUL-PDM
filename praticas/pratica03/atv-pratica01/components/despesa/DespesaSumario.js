import { View, Text, StyleSheet } from "react-native";

function DespesaSumario({ despesas, periodo }) {
  const somaDespesas = despesas.reduce((total, despesa) => {
    return total + despesa.valor;
  }, 0);

  return (
    <View style={styles.sumContainer}>
      <Text>{periodo}</Text>
      <Text>R$ {somaDespesas.toFixed(2)}</Text>
    </View>
  );
}
export default DespesaSumario;

const styles = StyleSheet.create({
  sumContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
