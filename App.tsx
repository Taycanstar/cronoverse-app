import { StatusBar } from "expo-status-bar";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/store";
import { ThemeContext } from "./src/utils/themeContext";
import { default as customDarkTheme } from "./darkTheme.json";
import { default as customLightTheme } from "./lightTheme.json";
import React, { useState, useContext, useEffect } from "react";
import { TaskProvider } from "./src/contexts/TaskContext";
import { SubscriptionProvider } from "./src/contexts/SubscriptionContext";
import { Appearance, Platform } from "react-native";
import { refreshTokenAction } from "./src/store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StripeProvider } from "@stripe/stripe-react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

if (__DEV__) {
  import("expo-dev-client");
}

export default function App() {
  const [theme, setTheme] = useState<string>("dark");
  // const toggleTheme = () => {
  //   const nextTheme = theme === "light" ? "dark" : "light";

  //   setTheme(nextTheme);
  // };

  const toggleTheme = (themeChoice?: string) => {
    if (themeChoice === "system") {
      setTheme(Appearance.getColorScheme() || "light");
    } else if (
      themeChoice === "dark" ||
      (themeChoice === undefined && theme === "light")
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    const setUpPurchases = async () => {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      try {
        if (Platform.OS === "ios") {
          await Purchases.configure({
            apiKey: "appl_rsGwllAosgwUriBuKFFUMSIQqrM",
          });
        }
        // else if (Platform.OS === "android") {
        //   await Purchases.configure({ apiKey: "your_android_public_api_key" });
        // }
      } catch (error) {
        console.error("Error setting up Purchases:", error);
      }
    };

    setUpPurchases();
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StripeProvider
        publishableKey="pk_test_51JGZkjIkJrKrc9JwM8pLmHvCw0x8fYvGWwbcmp1Q0IUfuHRTjNyFg7rAng2eLUHpqnnFat8FRuvIuwy8Pk5dGz7w00HIV0Cagh"
        merchantIdentifier="merchant.com.maxticker"
      >
        <Provider store={store}>
          <SubscriptionProvider>
            <TaskProvider>
              <ApplicationProvider
                {...eva}
                theme={{
                  ...eva[theme as keyof typeof eva],
                  ...(theme === "light" ? customLightTheme : customDarkTheme),
                }}
              >
                <StatusBar style={theme === "dark" ? "light" : "dark"} />
                <AppNavigator />
              </ApplicationProvider>
            </TaskProvider>
          </SubscriptionProvider>
        </Provider>
      </StripeProvider>
    </ThemeContext.Provider>
  );
}
