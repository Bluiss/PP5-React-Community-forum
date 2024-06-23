import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { useParams, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ChannelsPagePost from "./ChannelsPagePost";
import Channel from "./Channel";

function ChannelsPage() {
  const { title } = useParams();
  const location = useLocation();
  const [channel, setChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        if (title) {
          // Fetch a single channel by title
          const response = await axiosReq.get(`/channels/title/${title}`);
          setChannel(response.data);
        } else if (location.pathname === "/channels/followed") {
          // Fetch followed channels
          const response = await axiosReq.get("/channels/followed/");
          setChannels(response.data);
        } else {
          console.error("No valid endpoint to fetch");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.error("Channel not found:", err);
          setError(new Error("Channel not found"));
        } else {
          console.error("Error fetching channel data:", err);
          setError(err);
        }
      }
    };

    fetchChannelData();
  }, [title, location.pathname]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Row className="h-100">
      {title && channel ? (
        <ChannelsPagePost channel={channel} message="No posts found for this channel." />
      ) : channels.length > 0 ? (
        channels.map((chan) => (
          <Channel key={chan.id} {...chan} />
        ))
      ) : (
        <div>Loading...</div>
      )}
    </Row>
  );
}

export default ChannelsPage;
