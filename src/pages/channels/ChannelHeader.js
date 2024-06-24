import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Channel from "./Channel"; // Import Channel component
import { ChannelEditDropdown } from "../../components/MoreDropdown"; // Correct the import path

const ChannelHeader = () => {
  const { title } = useParams();
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        console.log(`Fetching channel with title: ${title}`); // Log the title
        const { data } = await axiosReq.get(`/channels/title/${title}/`);
        console.log("Fetched channel data:", data); // Log the response
        setChannel(data);
      } catch (err) {
        console.error(`Channel not found with title: ${title}`, err); // Log the error
        setError(`Channel not found with title: ${title}`);
      }
    };

    fetchChannel();
  }, [title]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center">
        {channel && <Channel channel={channel} imageSize={100} />}
        {channel?.is_owner && <ChannelEditDropdown title={channel?.title} />}
      </div>
    </div>
  );
};

export default ChannelHeader;
