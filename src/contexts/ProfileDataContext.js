import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

// Create contexts
const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

// Custom hooks to use the ProfileDataContext and SetProfileDataContext
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  // State to hold the profile data, including pageProfile, popularProfiles, and topPosters
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
    topPosters: { results: [] }, // Initialize topPosters state
  });

  const currentUser = useCurrentUser();

  // Function to handle following a profile
  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        topPosters: {
          ...prevState.topPosters,
          results: prevState.topPosters.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle unfollowing a profile
  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        topPosters: {
          ...prevState.topPosters,
          results: prevState.topPosters.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Effect to fetch popular profiles and top posters
  useEffect(() => {
    const handleMount = async () => {
      try {
        // Fetch popular profiles
        const { data: popularProfiles } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );

        // Fetch top posters
        const { data: topPosters } = await axiosReq.get(
          "/profiles/?ordering=-posts_count&limit=5"
        );

        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles,
          topPosters, // Update topPosters in state
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
