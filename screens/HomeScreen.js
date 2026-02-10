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
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { useApp } from "../contexts/AppContext";
import NotificationsModal from "../components/NotificationsModal";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = ({ onNavigateToBookings, onNavigateToReviews }) => {
  const { user, bookingsData, placeData, loadHomeScreenData } = useApp();
  const [revenueTimeRange, setRevenueTimeRange] = React.useState("Past month");
  const [revenueData, setRevenueData] = React.useState(null);
  const [selectedDataPoint, setSelectedDataPoint] = React.useState(null);
  const [showNotificationsModal, setShowNotificationsModal] =
    React.useState(false);
  const notificationButtonRef = React.useRef(null);
  const [notificationButtonLayout, setNotificationButtonLayout] =
    React.useState(null);

  // Load data when HomeScreen mounts - checks cache first
  React.useEffect(() => {
    loadHomeScreenData();
  }, [loadHomeScreenData]);

  const generateRevenueData = React.useCallback((timeRange) => {
    let labels = [];
    let data = [];
    let totalRevenue = 0;
    let trendPercentage = 0;

    const now = new Date();
    const maxDataPoints = 8; // Maximum 6 data points for X-axis

    switch (timeRange) {
      case "Today":
        // Generate 6 hourly data points for today
        const hoursPerPoint = 24 / maxDataPoints;
        labels = Array.from({ length: maxDataPoints }, (_, i) => {
          const hour = Math.floor(i * hoursPerPoint);
          return hour.toString().padStart(2, "0") + ":00";
        });
        data = Array.from(
          { length: maxDataPoints },
          () => Math.random() * 2000 + 500,
        );
        totalRevenue = data.reduce((sum, val) => sum + val, 0);
        trendPercentage = ((data[maxDataPoints - 1] - data[0]) / data[0]) * 100;
        break;

      case "Past week":
        // Generate 6 daily data points for past week
        labels = Array.from({ length: maxDataPoints }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - (maxDataPoints - 1 - i));
          return date.toLocaleDateString("en-US", { weekday: "short" });
        });
        data = Array.from(
          { length: maxDataPoints },
          () => Math.random() * 2000 + 1000,
        );
        totalRevenue = data.reduce((sum, val) => sum + val, 0);
        trendPercentage = ((data[maxDataPoints - 1] - data[0]) / data[0]) * 100;
        break;

      case "Past month":
        // Generate 6 weekly data points for past month
        labels = Array.from({ length: maxDataPoints }, (_, i) => {
          return `Week ${i + 1}`;
        });
        data = Array.from(
          { length: maxDataPoints },
          () => Math.random() * 2000 + 1500,
        );
        totalRevenue = data.reduce((sum, val) => sum + val, 0);
        trendPercentage = ((data[maxDataPoints - 1] - data[0]) / data[0]) * 100;
        break;

      case "Past Year":
        // Generate 6 monthly data points for past year (every 2 months)
        labels = Array.from({ length: maxDataPoints }, (_, i) => {
          const date = new Date(now);
          date.setMonth(date.getMonth() - (maxDataPoints - 1 - i) * 2);
          return date.toLocaleDateString("en-US", { month: "short" });
        });
        data = Array.from(
          { length: maxDataPoints },
          () => Math.random() * 2000 + 2000,
        );
        totalRevenue = data.reduce((sum, val) => sum + val, 0);
        trendPercentage = ((data[maxDataPoints - 1] - data[0]) / data[0]) * 100;
        break;

      default:
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        data = [1200, 1500, 1400, 1600, 1800, 1700];
        totalRevenue = data.reduce((sum, val) => sum + val, 0);
        trendPercentage = 5.2;
    }

    // Use fixed Y-axis max of 2500 for consistent display across all time ranges
    // This ensures Y-axis shows: 0, 500, 1000, 1500, 2000, 2500
    const fixedYAxisMax = 2500;

    setRevenueData({
      labels,
      datasets: [{ data }],
      totalRevenue,
      trendPercentage,
      yAxisMax: fixedYAxisMax,
    });
  }, []);

  React.useEffect(() => {
    generateRevenueData(revenueTimeRange);
  }, [revenueTimeRange, generateRevenueData]);

  const handleMetricPress = (title, subtitle) => {
    Alert.alert(title, subtitle);
  };

  const formatRevenue = (amount) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${Math.round(amount)}`;
  };

  const handleNotificationPress = () => {
    setShowNotificationsModal(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.businessName}>
            {user?.business_name || "Vendor"}
          </Text>
          <Text style={styles.description}>
            Overview of your vendor dashboard and key metrics
          </Text>
        </View>
        <View
          ref={notificationButtonRef}
          onLayout={(event) => {
            notificationButtonRef.current?.measureInWindow(
              (x, y, width, height) => {
                setNotificationButtonLayout({ x, y, width, height });
              },
            );
          }}
        >
          <TouchableOpacity
            onPress={handleNotificationPress}
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.grid}>
          <View style={[styles.cardBase, styles.cardLarge, styles.revenueCard]}>
            {revenueData && (
              <>
                <View style={styles.revenueHeader}>
                  <Text style={styles.revenueTitle}>Revenue</Text>
                  <View style={styles.revenueTopHeader}>
                    <Text style={styles.revenueSubtitle}>
                      {revenueTimeRange === "Today"
                        ? new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : revenueTimeRange === "Past week"
                          ? "Last 7 days"
                          : revenueTimeRange === "Past month"
                            ? "Last 4 weeks"
                            : "Last 12 months"}
                    </Text>
                    {revenueData && (
                      <View style={styles.trendContainerTop}>
                        <Ionicons
                          name="trending-up"
                          size={14}
                          color={colors.success}
                        />
                        <Text style={styles.trendValueTop}>
                          {Math.abs(revenueData.trendPercentage).toFixed(1)}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.chartContainer}>
                  <View style={styles.chartWrapper}>
                    <LineChart
                      data={revenueData}
                      width={screenWidth - 32}
                      height={200}
                      fromNumber={revenueData.yAxisMax || 2500}
                      fromZero={true}
                      segments={5}
                      chartConfig={{
                        backgroundColor: colors.cardBackground,
                        backgroundGradientFrom: colors.cardBackground,
                        backgroundGradientTo: colors.cardBackground,
                        decimalPlaces: 0,
                        color: (opacity = 1) => colors.primary,
                        labelColor: (opacity = 1) => "transparent", // Hide Y-axis label text
                        formatYLabel: () => "", // Remove Y-axis labels
                        style: {
                          borderRadius: 16,
                        },
                        propsForDots: {
                          r: "7",
                          strokeWidth: "2",
                          stroke: colors.primary,
                          fill: colors.cardBackground,
                        },
                        propsForBackgroundLines: {
                          strokeDasharray: "",
                          stroke: colors.border,
                          strokeWidth: 1,
                        },
                      }}
                      bezier
                      withDots={true}
                      withShadow={true}
                      withVerticalLines={false}
                      withHorizontalLines={true}
                      withInnerLines={true}
                      onDataPointClick={(data) => {
                        setSelectedDataPoint({
                          value: Math.round(data.value),
                          index: data.index,
                          label: revenueData.labels[data.index],
                        });
                        // Auto-hide tooltip after 3 seconds
                        setTimeout(() => {
                          setSelectedDataPoint(null);
                        }, 3000);
                      }}
                    />
                  </View>
                  {selectedDataPoint && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipLabel}>
                        {selectedDataPoint.label}
                      </Text>
                      <Text style={styles.tooltipValue}>
                        ${selectedDataPoint.value.toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.timeRangeContainer}>
                  {["Today", "Past week", "Past month", "Past Year"].map(
                    (range) => (
                      <TouchableOpacity
                        key={range}
                        style={[
                          styles.timeRangeButton,
                          revenueTimeRange === range &&
                            styles.timeRangeButtonActive,
                        ]}
                        onPress={() => setRevenueTimeRange(range)}
                      >
                        <Text
                          style={[
                            styles.timeRangeButtonText,
                            revenueTimeRange === range &&
                              styles.timeRangeButtonTextActive,
                          ]}
                        >
                          {range}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardSmall]}
            onPress={() => {
              if (onNavigateToBookings) {
                onNavigateToBookings();
              } else {
                handleMetricPress("Bookings", "View upcoming bookings");
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name="calendar"
                size={18}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>Bookings</Text>
            </View>
            {bookingsData.loading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loader}
              />
            ) : (
              <View style={styles.bookingsContainer}>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.cardValueSmall}>Today</Text>
                  <View style={styles.bookingsRow}>
                    <Text style={styles.cardValue}>{bookingsData.today}</Text>
                    <Text style={styles.cardHint}>bookings</Text>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.cardValueSmall}>So far this month</Text>
                  <View style={styles.bookingsRow}>
                    <Text style={styles.cardValue}>{bookingsData.total}</Text>
                    <Text style={styles.cardHint}>bookings</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardSmall, styles.ratingCard]}
            onPress={() => {
              if (onNavigateToReviews) {
                onNavigateToReviews();
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name="star"
                size={18}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>Rating</Text>
            </View>

            {/* Rating Labels Row */}
            <View style={styles.ratingLabelsRow}>
              <View style={styles.ratingLabelItem}>
                <View
                  style={[
                    styles.ratingLabelDot,
                    { backgroundColor: colors.success },
                  ]}
                />
                <Text style={styles.ratingLabelText}>5★</Text>
              </View>
              <View style={styles.ratingLabelItem}>
                <View
                  style={[
                    styles.ratingLabelDot,
                    { backgroundColor: "#8BC34A" },
                  ]}
                />
                <Text style={styles.ratingLabelText}>4★</Text>
              </View>
              <View style={styles.ratingLabelItem}>
                <View
                  style={[
                    styles.ratingLabelDot,
                    { backgroundColor: colors.warning },
                  ]}
                />
                <Text style={styles.ratingLabelText}>3★</Text>
              </View>
              <View style={styles.ratingLabelItem}>
                <View
                  style={[
                    styles.ratingLabelDot,
                    { backgroundColor: "#FF9800" },
                  ]}
                />
                <Text style={styles.ratingLabelText}>2★</Text>
              </View>
              <View style={styles.ratingLabelItem}>
                <View
                  style={[
                    styles.ratingLabelDot,
                    { backgroundColor: colors.error },
                  ]}
                />
                <Text style={styles.ratingLabelText}>1★</Text>
              </View>
            </View>

            {/* Pie Chart with Center Content */}
            <View style={styles.pieChartContainer}>
              <View style={styles.pieChartWrapper}>
                <PieChart
                  data={[
                    {
                      name: "5★",
                      population: 180,
                      color: colors.success,
                      legendFontColor: colors.textSecondary,
                      legendFontSize: 10,
                    },
                    {
                      name: "4★",
                      population: 100,
                      color: "#8BC34A",
                      legendFontColor: colors.textSecondary,
                      legendFontSize: 10,
                    },
                    {
                      name: "3★",
                      population: 25,
                      color: colors.warning,
                      legendFontColor: colors.textSecondary,
                      legendFontSize: 10,
                    },
                    {
                      name: "2★",
                      population: 5,
                      color: "#FF9800",
                      legendFontColor: colors.textSecondary,
                      legendFontSize: 10,
                    },
                    {
                      name: "1★",
                      population: 2,
                      color: colors.error,
                      legendFontColor: colors.textSecondary,
                      legendFontSize: 10,
                    },
                  ]}
                  width={180}
                  height={180}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="47"
                  absolute
                  hasLegend={false}
                />
                {/* Hollow center overlay */}
                <View style={styles.pieChartHollowCenter} />
                <View style={styles.ratingCenterContent}>
                  <Text style={styles.ratingValue}>4.8</Text>
                  <Text style={styles.ratingHint}>312 reviews</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardBase, styles.cardSmall]}
            onPress={() =>
              handleMetricPress("Avg. Price", "Compare pricing trends")
            }
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name="cash"
                size={18}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>Avg. Price</Text>
            </View>
            <Text style={styles.cardValue}>
              {placeData?.avg_price
                ? `$${parseFloat(placeData.avg_price).toFixed(0)}`
                : "$0"}
            </Text>
            <Text style={styles.cardHint}>per booking</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Modal */}
      <NotificationsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notificationButtonLayout={notificationButtonLayout}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  headerContent: {
    flex: 1,
  },
  notificationButton: {
    padding: 8,
    marginTop: 4,
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
  bookingsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingsContainer: {
    gap: 6,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  cardValueSmall: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
  cardValue: {
    fontSize: 40,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  cardHint: {
    fontSize: 16,
    marginLeft: 6,
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
  loader: {
    marginVertical: 8,
  },
  revenueCard: {
    padding: 12,
  },
  revenueTopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  trendContainerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendTextTop: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  trendValueTop: {
    fontFamily: fonts.bold,
    color: colors.success,
    paddingLeft: 5,
  },
  revenueHeader: {
    marginTop: 8,
  },
  revenueTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  revenueSubtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 0,
    position: "relative",
    overflow: "hidden",
  },
  chartWrapper: {
    marginLeft: -55,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth - 32,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  trendValue: {
    fontFamily: fonts.bold,
    color: colors.success,
  },
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    minWidth: 70,
    alignItems: "center",
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeButtonText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
  timeRangeButtonTextActive: {
    color: "#FFFFFF",
  },
  ratingCard: {
    padding: 12,
  },
  ratingLabelsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
    gap: 4,
  },
  ratingLabelItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingLabelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  ratingLabelText: {
    fontSize: 9,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  pieChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 140,
    width: "100%",
  },
  pieChartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 140,
    height: 140,
  },
  pieChartHollowCenter: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: colors.cardBackground,
    top: 25,
    left: 27,
  },
  ratingCenterContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 40,
    left: 35,
    width: 70,
    zIndex: 1,
  },
  ratingValue: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 2,
  },
  ratingHint: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    top: 10,
    alignSelf: "center",
    zIndex: 1000,
  },
  tooltipLabel: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.cardBackground,
    marginBottom: 2,
  },
  tooltipValue: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.cardBackground,
  },
});

export default HomeScreen;
