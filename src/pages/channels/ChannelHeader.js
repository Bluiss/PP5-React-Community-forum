import React from 'react';
import { useParams } from 'react-router-dom';
import { useChannelData } from '../../contexts/ChannelDataContext';
import Channel from './Channel';
import Typography from '@mui/material/Typography';
import { ChannelEditDropdown } from '../../components/MoreDropdown'; // Correctly import as named export

const ChannelHeader = () => {
  const { title } = useParams();
  const channelData = useChannelData();

  const channel = channelData.pageChannel.find(channel => channel.title === title);

  if (!channel) {
    console.error("Channel not found with title:", title);
    return (
      <Typography variant="body2" color="text.secondary">
        Channel not found.
      </Typography>
    );
  }


  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center">
        <Channel channel={channel} imageSize={100} />
        {channel?.is_owner && <ChannelEditDropdown title={channel?.title} />}
      </div>
    </div>
  );
};

export default ChannelHeader;
