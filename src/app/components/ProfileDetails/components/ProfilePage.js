"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  fetchPublicUserInfo,
  fetchUserPublicFavoriteTracks,
  fetchUserPublicTracks,
} from "../../../services/userService";

import ShareModal from "../../ShareModal";
import { getSiteUrl } from "../../../utils/getSiteUrl";

import LoadingSkeleton from "./LoadingSkeleton";
import ProfileContentTabs from "./ProfileContentTabs";
import ProfileHeader from "./ProfileHeader";
import StateCard from "./StateCard";

export default function ProfilePage() {
  const { id: userId } = useParams();

  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedTab, setSelectedTab] = useState("tracks");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileUrl = getSiteUrl(`/profile/${userId}`);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const [userData, publicTracks, publicFavorites] = await Promise.all([
          fetchPublicUserInfo(userId),
          fetchUserPublicTracks(userId),
          fetchUserPublicFavoriteTracks(userId),
        ]);

        if (!isMounted) return;

        setUser(userData);
        setTracks(publicTracks || []);
        setFavorites(publicFavorites || []);
      } catch (error) {
        if (!isMounted) return;
        setError(error.message || "Something went wrong");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <div
      id="profile_page"
      className="flex max-h-full min-h-0 flex-1 justify-center overflow-y-auto p-6"
    >
      <div className="flex w-full max-w-6xl flex-col items-center space-y-6">
        <ShareModal
          visible={isShareOpen}
          setVisible={setIsShareOpen}
          url={profileUrl}
          title="Share Profile"
          description="Share your profile with others."
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <StateCard title="Error" message={error} />
        ) : (
          <>
            <ProfileHeader
              user={user}
              trackCount={tracks.length}
              favoriteCount={favorites.length}
              onShare={() => setIsShareOpen(true)}
            />

            <ProfileContentTabs
              selectedTab={selectedTab}
              onSelectionChange={setSelectedTab}
              tracks={tracks}
              setTracks={setTracks}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </>
        )}
      </div>
    </div>
  );
}
