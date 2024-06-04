import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { useChannelData } from "../../contexts/ChannelDataContext";
import Channel from "./Channel";
import Asset from "../../components/Asset.js"; // Assuming Asset is a component that handles loading spinner

function PopularChannels() {
  const channelData = useChannelData();

  console.log("Channel Data:", channelData);

  // Ensure channelData is properly defined and handle cases where it's not yet available
  if (!channelData || !channelData.popularChannels || !Array.isArray(channelData.popularChannels)) {
    return (
      <div>
        <Asset spinner />
      </div>
    );
  }

  const { popularChannels } = channelData;

  return (
    <Container className={appStyles.Content}>
      <p>Most Popular Channels</p>
      <div className="d-flex flex-column align-items-left">
        {popularChannels.slice(0, 4).map((channel) => (
          <Channel key={channel.title} channel={channel} />
        ))}
      </div>
    </Container>
  );
}

export default PopularChannels;
