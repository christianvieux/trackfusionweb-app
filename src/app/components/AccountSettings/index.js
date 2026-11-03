"use client";

import UpdatePasswordForm from "./components/UpdatePasswordForm";
import { useUserInfo } from "../../context/UserInfoContext";
import AvatarPicker from "../AvatarPicker";

export default function AccountSettings({ className = "" }) {
  const { userInfo, setUserInfo } = useUserInfo();

  function handleAvatarUpdate(avatar) {
    setUserInfo((prev) => ({
      ...prev,
      avatar,
    }));
  }

  return (
    <section
      id="Settings"
      className={`flex w-full min-w-0 flex-wrap items-start justify-center gap-8 overflow-x-hidden overflow-y-auto text-foreground sm:p-4 ${className}`}
    >
      <AvatarPicker
        userId={userInfo?.id}
        username={userInfo?.username || ""}
        initialAvatar={userInfo?.avatar}
        title="Your avatar"
        subtitle="Choose a new look. Changes appear everywhere after you save."
        primaryLabel="Save avatar"
        appearance="settings"
        onSaved={handleAvatarUpdate}
      />

      <UpdatePasswordForm />
    </section>
  );
}
