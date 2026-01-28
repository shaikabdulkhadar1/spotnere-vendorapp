import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { colors } from "./constants/colors";
import { isLoggedIn } from "./utils/auth";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  };

  const handleBack = () => {
    // Handle back navigation if needed
    console.log("Back pressed");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <>
        <StatusBar style="auto" />
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            <View style={styles.screenWrapper} />
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
              <HomeScreen />
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
    backgroundColor: colors.background || "#fff",
  },
  container: {
    flex: 1,
    margin: 8,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: colors.background || "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  screenWrapper: {
    flex: 1,
    overflow: "hidden",
  },
});
