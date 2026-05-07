import { createContext, useContext, useState } from "react";

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [musicVolume, setMusicVolume] = useState(75);
  const [effectsVolume, setEffectsVolume] = useState(85);
  const [tipsEnabled, setTipsEnabled] = useState(true);

  return (
    <AppSettingsContext.Provider
      value={{
        musicVolume,
        setMusicVolume,
        effectsVolume,
        setEffectsVolume,
        tipsEnabled,
        setTipsEnabled
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider.");
  }

  return context;
}
