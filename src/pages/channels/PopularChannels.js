import React from 'react';
import { Container } from 'react-bootstrap';
import appStyles from "../../App.module.css";
import { useChannelData } from "../../contexts/ChannelDataContext";
import Channel from "./Channel";
import Asset from "../../components/Asset";

const PopularChannels = ({ mobile }) => {
  const { popularChannel } = useChannelData(); 


  const hasChannels = popularChannel && popularChannel.results && popularChannel.results.length > 0;

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {hasChannels ? (
        <>
          <p>Most followed channels</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularChannel.results.slice(0, 4).map((channel) => (
                <Channel key={channel.id} channel={channel} mobile />
              ))}
            </div>
          ) : (
            popularChannel.results.map((channel) => (
              <Channel key={channel.id} channel={channel} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
    
  );
}

export default PopularChannels;
