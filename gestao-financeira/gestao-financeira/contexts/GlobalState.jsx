import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

export const MoneyContext = createContext();

/**
 * Provider global do app.
 *
 * Centraliza:
 *  - hidratação inicial das categorias e transações a partir da API REST;
 *  - estado de carregamento e erro de rede;
 *  - ações para criar/excluir transações e categorias mantendo o estado em sync.
 *
 * O estado **não** é mais persistido em AsyncStorage. A fonte de verdade é o
 * banco MySQL exposto pela API (`gestao-financeira-api/`).
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} Provider com o objeto de contexto exposto via `MoneyContext`.
 */
export default function GlobalState({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = useCallback(() => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [transactions, selectedDate]);

  /**
   * Recarrega categorias e transações do servidor em paralelo.
   *
   * @returns {Promise<void>} Resolve quando ambos os GETs terminarem.
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, txs] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]);
      setCategories(cats);
      setTransactions(txs);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await AsyncStorage.getItem("@gestao:token");
        const userData = await AsyncStorage.getItem("@gestao:user");
        if (token && userData) {
          api.setToken(token);
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
          refresh();
        }
      } catch (error) {
        console.error("Erro ao ler AsyncStorage:", error);
      } finally {
        setLoadingAuth(false);
      }
    }
    loadStorageData();
  }, [refresh]);

  const signIn = useCallback(async (email, password) => {
    const response = await api.signin({ email, password });
    await AsyncStorage.setItem("@gestao:token", response.token);
    await AsyncStorage.setItem("@gestao:user", JSON.stringify(response.user));
    api.setToken(response.token);
    setUser(response.user);
    setIsAuthenticated(true);
    await refresh();
  }, [refresh]);

  const signUp = useCallback(async (name, email, password) => {
    const response = await api.signup({ name, email, password });
    await AsyncStorage.setItem("@gestao:token", response.token);
    await AsyncStorage.setItem("@gestao:user", JSON.stringify(response.user));
    api.setToken(response.token);
    setUser(response.user);
    setIsAuthenticated(true);
    await refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem("@gestao:token");
    await AsyncStorage.removeItem("@gestao:user");
    api.setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setTransactions([]);
    setCategories([]);
  }, []);

  /**
   * Cria uma nova transação no servidor e adiciona-a ao estado local.
   *
   * @param {{description: string, value: number, date: Date|string, categoryId: string}} data
   * @returns {Promise<object>} Transação criada (já com a categoria expandida).
   */
  const addTransaction = useCallback(async (data) => {
    const created = await api.createTransaction(data);
    setTransactions((prev) => [created, ...prev]);
    return created;
  }, []);

  /**
   * Exclui uma transação no servidor e remove-a do estado local.
   *
   * @param {string} id - id (cuid) da transação.
   * @returns {Promise<void>}
   */
  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Atualiza uma transação no servidor e no estado local.
   *
   * @param {string} id - id da transação
   * @param {object} data - dados atualizados
   */
  const updateTransaction = useCallback(async (id, data) => {
    const updated = await api.updateTransaction(id, data);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    );
    return updated;
  }, []);

  /**
   * Cria uma nova categoria no servidor e adiciona-a ao estado local.
   *
   * @param {{name: string, displayName: string, icon: string, background: string, isIncome?: boolean}} data
   * @returns {Promise<object>} Categoria criada.
   */
  const addCategory = useCallback(async (data) => {
    const created = await api.createCategory(data);
    setCategories((prev) =>
      [...prev, created].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      ),
    );
    return created;
  }, []);

  /**
   * Exclui uma categoria no servidor e remove-a do estado local.
   * Categorias padrão (`isDefault`) são bloqueadas pelo back-end.
   *
   * @param {string} id - id (cuid) da categoria.
   * @returns {Promise<void>}
   */
  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <MoneyContext.Provider
      value={{
        transactions: filteredTransactions, // Sobrescreve para que as telas só vejam os dados do mês selecionado
        allTransactions: transactions,
        selectedDate,
        nextMonth,
        prevMonth,
        categories,
        loading,
        loadingAuth,
        error,
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        refresh,
        addTransaction,
        removeTransaction,
        updateTransaction,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}
