/**
 * Home Screen Component (Dashboard)
 * Displays vendor dashboard
 */

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { getCurrentUser } from "../utils/auth";

const HomeScreen = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.businessName}>
          {user?.business_name || "Vendor"}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <Ionicons name="business" size={48} color={colors.primary} />
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardText}>
            Your vendor dashboard is ready. More features coming soon!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default HomeScreen;
