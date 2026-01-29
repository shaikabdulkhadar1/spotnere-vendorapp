import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import BookingsScreen from "./screens/BookingsScreen";
import VenduDetailsScreen from "./screens/VenduDetailsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BottomNavBar from "./components/BottomNavBar";
import { colors } from "./constants/colors";
import { isLoggedIn } from "./utils/auth";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Parkinsans-Light": require("./assets/fonts/Parkinsans-Light.ttf"),
    "Parkinsans-Regular": require("./assets/fonts/Parkinsans-Regular.ttf"),
    "Parkinsans-Medium": require("./assets/fonts/Parkinsans-Medium.ttf"),
    "Parkinsans-SemiBold": require("./assets/fonts/Parkinsans-SemiBold.ttf"),
    "Parkinsans-Bold": require("./assets/fonts/Parkinsans-Bold.ttf"),
    "Parkinsans-ExtraBold": require("./assets/fonts/Parkinsans-ExtraBold.ttf"),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await isLoggedIn();
      setIsAuthenticated(loggedIn);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user) => {
    // Update authentication state to show HomeScreen
    setIsAuthenticated(true);
    setActiveTab("home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab("home");
  };

  const handleBack = () => {
    // Handle back navigation if needed
    console.log("Back pressed");
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "bookings":
        return <BookingsScreen />;
      case "venduDetails":
        return <VenduDetailsScreen />;
      case "profile":
        return <ProfileScreen onLogout={handleLogout} />;
      default:
        return <HomeScreen />;
    }
  };

  // Show loading state while checking authentication or loading fonts
  if (!fontsLoaded || isLoading) {
    return (
      <>
        <StatusBar style="auto" />
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <View style={[styles.screenWrapper, styles.loadingContainer]}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={styles.screenWrapper}>
            {isAuthenticated ? (
              <>
                {renderScreen()}
                <BottomNavBar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </>
            ) : (
              <LoginScreen
                onLoginSuccess={handleLoginSuccess}
                onBack={handleBack}
              />
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    margin: 10,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: "hidden",
  },
  screenWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
