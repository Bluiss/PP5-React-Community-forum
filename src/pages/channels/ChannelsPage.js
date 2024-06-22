import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ChannelsPagePost from "./ChannelsPagePost";

function ChannelsPage() {
  const { title } = useParams();
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (title) {
          const url = `/channels/title/${title}`;
          console.log(`Constructed URL for channel: ${url}`); 
          const response = await axiosReq.get(url);
          console.log('Channel API Response:', response);  // Log the entire response
          setChannel(response.data);
        } else {
          console.error("Channel title is missing");
        }
      } catch (err) {
        console.error("Error fetching channel data:", err);
        setError(err);
      }
    };

    fetchChannel();
  }, [title]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Row className="h-100">
      {channel ? (
        <ChannelsPagePost channel={channel} message="No posts found for this channel." />
      ) : (
        <div>Loading...</div>
      )}
    </Row>
  );
}

export default ChannelsPage;
