import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';

type LayoutContextType = {
  activeTab: HomePageTab;
  setActiveTab: (tab: HomePageTab) => void;
};

const LayoutContext = createContext<LayoutContextType>({
  activeTab: HomePageTab.Newsfeed,
  setActiveTab: () => {},
});

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);

  if (!context) throw new Error('useLayoutContext must be used within a LayoutProvider');

  return context;
};

type LayoutProviderProps = PropsWithChildren<unknown>;

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<HomePageTab>(HomePageTab.Newsfeed);

  return (
    <LayoutContext.Provider value={{ activeTab, setActiveTab }}>{children}</LayoutContext.Provider>
  );
};
