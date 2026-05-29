import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import MonthFilter from "../../components/MonthFilter";
import EditTransactionModal from "../../components/EditTransactionModal";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

/**
 * Tela "Transações".
 *
 * Lista as transações vindas do servidor, com:
 *  - estado de carregamento inicial,
 *  - mensagem de erro com botão de "Tentar novamente",
 *  - pull-to-refresh,
 *  - long-press para excluir.
 *
 * @returns {JSX.Element}
 */
export default function Transactions() {
  const {
    user,
    transactions,
    loading,
    error,
    refresh,
    removeTransaction,
    selectedDate,
    prevMonth,
    nextMonth,
  } = useContext(MoneyContext);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editVisible, setEditVisible] = useState(false);

  const handleLongPress = (item) => {
    Alert.alert(
      "Opções da transação",
      `O que deseja fazer com a transação "${item.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Editar",
          onPress: () => {
            setSelectedTransaction(item);
            setEditVisible(true);
          },
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => confirmDelete(item),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Excluir transação",
      `Deseja realmente excluir a "${item.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTransaction(item.id);
              setSelectedTransaction(null);
            } catch (e) {
              Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>
          Não foi possível carregar.
        </Text>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            activeOpacity={0.7}
          >
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {user ? (
              <Text style={styles.welcomeText}>
                Bem-vindo(a), <Text style={styles.userName}>{user.name}</Text>!
              </Text>
            ) : null}
            <MonthFilter
              selectedDate={selectedDate}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>
            Ainda não há nenhum item! Adicione na aba do meio.
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={styles.listContent}
      />

      <EditTransactionModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        transaction={selectedTransaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  headerContainer: {
    marginBottom: 8,
    paddingVertical: 8,
  },
  welcomeText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "500",
  },
  userName: {
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  retry: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.primaryContrast,
    fontWeight: "600",
  },
});
