// src/app/context/UserInfoContext.js
"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { fetchPublicUserInfo } from "../services/userService";
import { useSession } from "./SessionContext";

const UserInfoContext = createContext({});

export const UserInfoProvider = ({ children }) => {
  const { user } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo]);

  useEffect(() => {
    let isActive = true;

    if (user?.id) {
      const fetchUserInfo = async function () {
        try {
          const newUserInfo = await fetchPublicUserInfo(user.id);
          if (!isActive) return;

          const timestamp = new Date(newUserInfo.updated_at).getTime();
          const separator = newUserInfo.profile_picture_url?.includes("?")
            ? "&"
            : "?";
          const canVersionProfilePicture =
            newUserInfo?.profile_picture_url && Number.isFinite(timestamp);
          const profilePictureUrlWithVersion = canVersionProfilePicture
            ? `${newUserInfo.profile_picture_url}${separator}v=${timestamp}`
            : newUserInfo?.profile_picture_url || null;

          setUserInfo({
            ...newUserInfo,
            profile_picture_url: profilePictureUrlWithVersion,
          });
        } catch {
          if (isActive) setUserInfo(null);
        }
      };
      fetchUserInfo();
    } else {
      setUserInfo({});
    }

    return () => {
      isActive = false;
    };
  }, [user]);

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => useContext(UserInfoContext);
