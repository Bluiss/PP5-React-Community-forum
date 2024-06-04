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
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedChannel.id,
      });

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
      console.log(err);
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
