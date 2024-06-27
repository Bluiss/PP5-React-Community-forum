import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { useChannelData } from "../../contexts/ChannelDataContext";
import Channel from "./Channel";
import Asset from "../../components/Asset";

const PopularChannels = ({ mobile }) => {
  const { popularChannel } = useChannelData(); // Assuming popularChannel is an array

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile ? "d-lg-none text-center mb-3" : ""
      }`}
    >
      {popularChannel.length > 0 ? (
        <>
          <h5 className="text-center mb-3">Trending Channels</h5>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularChannel.slice(0, 4).map((channel) => (
                <Channel
                  className="d-flex justify-content-around"
                  key={channel.id}
                  channel={channel}
                  mobile
                />
              ))}
            </div>
          ) : (
            popularChannel.map((channel) => (
              <Channel key={channel.id} channel={channel} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularChannels;
