import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

const ChannelDataContext = createContext();
const SetChannelDataContext = createContext();

export const useChannelData = () => useContext(ChannelDataContext);
export const useSetChannelData = () => useContext(SetChannelDataContext);

export const ChannelDataProvider = ({ children }) => {
  const [channelData, setChannelData] = useState({
    pageChannel: [], // Directly use an array
    popularChannel: [],
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedChannel) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedChannel.id,
      });

      setChannelData((prevState) => ({
        ...prevState,
        pageChannel: prevState.pageChannel.map((channel) =>
          followHelper(channel, clickedChannel, data.id)
        ),
        popularChannel: prevState.popularChannel.map((channel) =>
          followHelper(channel, clickedChannel, data.id)
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (clickedChannel) => {
    try {
      await axiosRes.delete(`/followers/${clickedChannel.following_id}/`);

      setChannelData((prevState) => ({
        ...prevState,
        pageChannel: prevState.pageChannel.map((channel) =>
          unfollowHelper(channel, clickedChannel)
        ),
        popularChannel: prevState.popularChannel.map((channel) =>
          unfollowHelper(channel, clickedChannel)
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/channels/?ordering=-followers_count");
        console.log("Fetched channels data:", data); // Debugging log

        // Assuming data is directly an array of channels
        setChannelData((prevState) => ({
          ...prevState,
          pageChannel: data, // Directly setting the array
          popularChannel: data, // Directly setting the array
        }));
      } catch (err) {
        console.error("Error fetching channels data:", err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ChannelDataContext.Provider value={channelData}>
      <SetChannelDataContext.Provider
        value={{ setChannelData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetChannelDataContext.Provider>
    </ChannelDataContext.Provider>
  );
};
