import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Channel from "./Channel";
import { MoreDropdown } from "../../components/MoreDropdown";

const ChannelHeader = () => {
  const { title } = useParams();
  const history = useHistory();
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        console.log(`Fetching channel with title: ${title}`);
        const { data } = await axiosReq.get(`/channels/title/${title}/`);
        setChannel(data);
      } catch (err) {
        console.error(`Channel not found with title: ${title}`, err);
        setError(`Channel not found with title: ${title}`);
      }
    };

    fetchChannel();
  }, [title]);

  const handleEdit = () => {
    history.push(`/channels/${title}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/channels/title/${title}/`);
      history.push('/'); // Navigate to home or another appropriate page
    } catch (err) {
      console.error("Failed to delete the channel:", err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center">
      {channel && channel.is_owner && (
          <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
        {channel && <Channel channel={channel} imageSize={100} />}
        {channel && channel.is_owner && (
          <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;
