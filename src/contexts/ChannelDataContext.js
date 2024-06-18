// src/contexts/ChannelDataContext.js
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
    pageChannel: { results: [] },
    popularChannel: { results: [] },
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
        popularChannel: {
          results: prevState.popularChannel.results.map((channel) =>
            followHelper(channel, clickedChannel, data.id)
          ),
        },
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
        pageChannel: {
          results: prevState.pageChannel.results.map((channel) =>
            unfollowHelper(channel, clickedChannel)
          ),
        },
        popularChannel: {
          results: prevState.popularChannel.results.map((channel) =>
            unfollowHelper(channel, clickedChannel)
          ),
        },
      }));
    } catch (err) {
      console.error(err);
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
          popularChannel: data,
        }));
      } catch (err) {
        console.error(err);
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
