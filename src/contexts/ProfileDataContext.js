import { createContext, useContext, useState, useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";

// Create contexts
const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

// Custom hooks
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
    topPosters: { results: [] },
  });

  // Fetch data for popular profiles and top posters on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: popularProfiles } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        const { data: topPosters } = await axiosReq.get(
          "/profiles/?ordering=-posts_count&limit=5"
        );

        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles,
          topPosters,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
