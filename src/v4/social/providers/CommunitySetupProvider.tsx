import React, { createContext, useContext, useState } from 'react';
import { MemberCommunitySetup } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';

type CommunitySetupContextType = {
  communityName: string;
  setCommunityName: (name: string) => void;
  about?: string;
  setAbout: (about: string) => void;
  categories: Amity.Category[];
  setCategories: (categories: Amity.Category[]) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  members: MemberCommunitySetup[];
  setMembers: (members: MemberCommunitySetup[]) => void;
  coverImages: Amity.File[];
  setCoverImages: (coverImages: Amity.File[]) => void;
};

const CommunitySetupContext = createContext<CommunitySetupContextType>({
  communityName: '',
  setCommunityName: (name: string) => {},
  about: '',
  setAbout: (about: string) => {},
  categories: [],
  setCategories: (categories: Amity.Category[]) => {},
  isPublic: true,
  setIsPublic: (isPublic: boolean) => {},
  members: [],
  setMembers: (members: MemberCommunitySetup[]) => {},
  coverImages: [],
  setCoverImages: (coverImages: Amity.File[]) => {},
});

export const useCommunitySetupContext = () => useContext(CommunitySetupContext);

type CommunitySetupProviderProps = {
  children: React.ReactNode;
};

export const CommunitySetupProvider: React.FC<CommunitySetupProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Amity.Category[]>([]);
  const [communityName, setCommunityName] = useState('');
  const [about, setAbout] = useState('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [members, setMembers] = useState<MemberCommunitySetup[]>([]);
  const [coverImages, setCoverImages] = useState<Amity.File[]>([]);

  const value: CommunitySetupContextType = {
    communityName,
    setCommunityName,
    about,
    setAbout,
    categories,
    setCategories,
    isPublic,
    setIsPublic,
    members,
    setMembers,
    coverImages,
    setCoverImages,
  };

  return <CommunitySetupContext.Provider value={value}>{children}</CommunitySetupContext.Provider>;
};
