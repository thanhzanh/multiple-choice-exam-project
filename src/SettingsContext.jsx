import React, { createContext, useState, useEffect } from "react";
import { getSettings } from "./services/SettingService";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [logoName, setLogoName] = useState("QuizSTU");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        if (response.data) {
          setLogoName(response.data.logoName || "QuizSTU");
        }
      } catch (error) {
        console.error("Lỗi khi load thông tin setting:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ logoName, setLogoName }}>
      {children}
    </SettingsContext.Provider>
  );
};