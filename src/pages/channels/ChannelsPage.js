import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { useParams, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ChannelsPagePost from "./ChannelsPagePost";
import Channel from "./Channel";
import Asset from "../../components/Asset";

function ChannelsPage() {
  const { title } = useParams();
  const location = useLocation();
  const [channel, setChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track whether the component is mounted
    const fetchChannelData = async () => {
      try {
        if (title) {
          const response = await axiosReq.get(`/channels/title/${title}/`);
          if (isMounted) {
            setChannel(response.data);
          }
        } else if (location.pathname === "/channels/followed") {
          console.log("Fetching followed channels");
          const response = await axiosReq.get("/channels/followed/");
          console.log("Followed channels response:", response.data);
          if (isMounted) {
            setChannels(response.data.results);
          }
        }
      } catch (err) {
        console.error("Error fetching channel data:", err);
        setError(err);
      }
    };

    fetchChannelData();

    return () => {
      isMounted = false; 
    };
  }, [title, location.pathname]);

  if (error) {
    console.log("Error state:", error);
    return <div>Error: {error.message}</div>;
  }


  return (
    <Row className="h-100">
      {title && channel ? (
        <ChannelsPagePost channel={channel} message="No posts found for this channel." />
      ) : channels.length > 0 ? (
        channels.map((chan) => (
          <Channel key={chan.id} channel={chan} />
        ))
      ) : (
        <Asset/>
      )}
    </Row>
  );
}

export default ChannelsPage;
