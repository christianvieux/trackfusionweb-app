"use client";
// src/app/new-profile-picture/page.js
import React from "react";
import { useUserInfo } from "../context/UserInfoContext";
import { useRouter } from "next/navigation";
import { withAuthGuard } from "../hoc/withAuthGuard";
import AvatarPicker from "../components/AvatarPicker";

function InitialProfilePictureSetup() {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUserInfo();

  const handleAvatarSaved = async (avatar) => {
    setUserInfo((prev) => ({ ...prev, avatar }));
    router.replace("/feed");
  };

  const handleSkip = () => {
    router.replace("/feed");
  };

  return (
    <div
      id="new_profile_page"
      className="flex w-full justify-center py-4 sm:py-6"
    >
      <AvatarPicker
        userId={userInfo?.id}
        username={userInfo?.username || ""}
        initialAvatar={userInfo?.avatar}
        onSaved={handleAvatarSaved}
        onSkip={handleSkip}
      />
    </div>
  );
}

export default withAuthGuard(InitialProfilePictureSetup);
