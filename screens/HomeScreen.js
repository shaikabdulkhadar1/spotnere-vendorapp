/**
 * Home Screen Component (Dashboard)
 * Displays vendor dashboard
 */

import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
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

  const handleMetricPress = (title, subtitle) => {
    Alert.alert(title, subtitle);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.businessName}>
          {user?.business_name || "Vendor"}
        </Text>
        <Text style={styles.description}>
          Overview of your vendor dashboard and key metrics
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.cardBase, styles.cardLarge]}
            onPress={() => handleMetricPress("Revenue", "Open revenue analytics")}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name="trending-up"
                size={20}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>Revenue</Text>
            </View>
            <Text style={styles.cardValue}>$12,480</Text>
            <Text style={styles.cardHint}>+12.4% this month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardSmall]}
            onPress={() => handleMetricPress("Bookings", "View upcoming bookings")}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={18} color={colors.primary} style={styles.cardIcon} />
              <Text style={styles.cardLabel}>Bookings</Text>
            </View>
            <Text style={styles.cardValue}>128</Text>
            <Text style={styles.cardHint}>24 pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardSmall]}
            onPress={() => handleMetricPress("Rating", "See guest reviews")}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="star" size={18} color={colors.primary} style={styles.cardIcon} />
              <Text style={styles.cardLabel}>Rating</Text>
            </View>
            <Text style={styles.cardValue}>4.8</Text>
            <Text style={styles.cardHint}>312 reviews</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardSmall]}
            onPress={() => handleMetricPress("Avg. Response", "Track response time")}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="time" size={18} color={colors.primary} style={styles.cardIcon} />
              <Text style={styles.cardLabel}>Avg. Response</Text>
            </View>
            <Text style={styles.cardValue}>18m</Text>
            <Text style={styles.cardHint}>-6m this week</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardSmall]}
            onPress={() => handleMetricPress("Avg. Price", "Compare pricing trends")}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="cash" size={18} color={colors.primary} style={styles.cardIcon} />
              <Text style={styles.cardLabel}>Avg. Price</Text>
            </View>
            <Text style={styles.cardValue}>$94</Text>
            <Text style={styles.cardHint}>per booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardLarge]}
            onPress={() => handleMetricPress("Pending Actions", "Handle approvals and messages")}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>Pending Actions</Text>
            </View>
            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>5 approvals</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>3 messages</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>2 updates</Text>
              </View>
            </View>
            <Text style={styles.cardHint}>Tap to manage</Text>
          </TouchableOpacity>
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
    padding: 10,
    paddingTop: 20,
    paddingBottom: 100,
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
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardBase: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  cardLarge: {
    width: "100%",
  },
  cardSmall: {
    width: "48%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  cardHint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
