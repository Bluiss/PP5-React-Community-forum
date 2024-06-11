import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

const ChannelDataContext = createContext();
const SetChannelDataContext = createContext();

export const useChannelData = () => useContext(ChannelDataContext) || { channelData: { pageChannel: { results: [] }, popularChannels: { results: [] } } };
export const useSetChannelData = () => useContext(SetChannelDataContext);

export const ChannelDataProvider = ({ children }) => {
  const [channelData, setChannelData] = useState({
    pageChannel: { results: [] },
    popularChannels: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedChannel) => {
    // Check if the user is already following the channel
    if (clickedChannel.following_id) {
      console.log("User is already following this channel. Skipping follow request.");
      return;
    }
  
    try {
      const payload = { followed: clickedChannel.id };
      console.log('Payload:', payload);
  
      const { data } = await axiosRes.post("/followers/", payload);
      console.log('Follow API response:', data);
  
      setChannelData((prevState) => ({
        ...prevState,
        pageChannel: {
          results: prevState.pageChannel.results.map((channel) =>
            followHelper(channel, clickedChannel, data.id)
          ),
        },
        popularChannels: {
          ...prevState.popularChannels,
          results: prevState.popularChannels.results.map((channel) =>
            followHelper(channel, clickedChannel, data.id)
          ),
        },
      }));
    } catch (err) {
      if (err.response) {
        if (err.response.data.detail === "possible duplicate") {
          console.warn("You are already following this channel.");
          // Optionally, update UI or state to reflect the duplicate follow attempt
        } else {
          console.error('API Error:', err.response.data);
        }
      } else if (err.request) {
        console.error('Request Error:', err.request);
      } else {
        console.error('General Error:', err.message);
      }
    }
  };

  const handleUnfollow = async (clickedChannel) => {
    try {
      await axiosRes.delete(`/followers/${clickedChannel.following_id}/`);

      setChannelData((prevState) => ({
        ...prevState,
        pageChannel: {
          results: prevState.pageChannel.results.map((channel) =>
            unfollowHelper(channel, clickedChannel)
          ),
        },
        popularChannels: {
          ...prevState.popularChannels,
          results: prevState.popularChannels.results.map((channel) =>
            unfollowHelper(channel, clickedChannel)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/channels/?ordering=-followers_count"
        );
        setChannelData((prevState) => ({
          ...prevState,
          popularChannels: data,
        }));
      } catch (err) {
        console.log(err);
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
