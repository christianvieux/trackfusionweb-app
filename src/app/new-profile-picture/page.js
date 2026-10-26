"use client";
// src/app/new-profile-picture/page.js
import React, { useEffect } from "react";
import { useUserInfo } from "../context/UserInfoContext";
import { useRouter } from "next/navigation";
import { withAuthGuard } from "../hoc/withAuthGuard";
import UpdateProfilePictureForm from "../components/UpdateProfilePictureForm";

function InitialProfilePictureSetup() {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUserInfo();

  const handleProfilePictureSubmit = async (newUrl) => {
    try {
      setUserInfo((prev) => {
        const updatedUrl = `${newUrl}?v=${new Date().getTime()}`;
        return { ...prev, profile_picture_url: updatedUrl };
      });
      router.push("/feed");
    } catch (error) {
      // Handle upload error
      console.error("Couldn't upload profile picture: ", error);
    }
  };

  const handleSkip = () => {
    router.push("/feed");
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.profile_picture_url) {
        router.push("/feed");
      }
    }
  }, [userInfo, router]);

  return (
    <div
      id="new_profile_page"
      className="flex max-h-full max-w-full items-center justify-center overflow-auto p-4"
    >
      <div
        id="container"
        className="border-gray-dark flex max-h-full max-w-md flex-col gap-8 overflow-y-auto border-2 bg-black p-4"
      >
        <h1 className="text-green-light w-max text-3xl font-bold">
          {`Welcome, ${userInfo?.username || ""}`}
        </h1>

        <div className="text-foreground">
          <p className="text-base leading-relaxed">
            Personalize your profile with a profile picture. A photo helps other
            members recognize you and adds a personal touch to your account.
          </p>
        </div>

        <UpdateProfilePictureForm
          initialProfilePicture={null}
          onSubmit={handleProfilePictureSubmit}
          isInitialSetup={true}
          className="max-w-full overflow-x-auto"
        />

        <div className="text-foreground/70 text-sm italic">
          <p className="mb-4">
            Not ready to upload a photo? That&apos;s okay. You can always add or
            update your profile picture later in Account Settings.
          </p>

          <button
            onClick={handleSkip}
            className="text-green-light hover:text-green underline transition-colors duration-300"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(InitialProfilePictureSetup);
