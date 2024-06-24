// ChannelDataContext.js
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
    pageChannel: [],
    popularChannel: [],
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedChannel) => {
    try {
      console.log("Clicked channel object:", clickedChannel); // Debugging log

      if (!clickedChannel.id) {
        console.error("Invalid clickedChannel object:", clickedChannel);
        return;
      }

      console.log("Attempting to follow channel with ID:", clickedChannel.id); // Debugging log

      // Correctly call the backend endpoint
      await axiosRes.post(`/channels/${clickedChannel.id}/follow/`);

      // Update local state after successful follow
      setChannelData((prevState) => ({
        ...prevState,
        pageChannel: prevState.pageChannel.map((channel) =>
          followHelper(channel, clickedChannel, clickedChannel.id)
        ),
        popularChannel: prevState.popularChannel.map((channel) =>
          followHelper(channel, clickedChannel, clickedChannel.id)
        ),
      }));
    } catch (err) {
      console.error("Error in handleFollow:", err.response ? err.response.data : err);
    }
  };

  const handleUnfollow = async (clickedChannel) => {
    try {
      console.log("Attempting to unfollow channel with ID:", clickedChannel.id); // Debugging log

      if (!clickedChannel.id) {
        console.error("Invalid clickedChannel object:", clickedChannel);
        return;
      }

      // Correctly call the backend endpoint
      await axiosRes.post(`/channels/${clickedChannel.id}/unfollow/`);

      // Update local state after successful unfollow
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
      console.error("Error in handleUnfollow:", err.response ? err.response.data : err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/channels/?ordering=-followers_count");
        setChannelData((prevState) => ({
          ...prevState,
          pageChannel: data,
          popularChannel: data,
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
