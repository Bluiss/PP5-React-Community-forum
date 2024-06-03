import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useChannelData } from "../../contexts/ChannelDataContext";
import Channel from "./Channel";

const PopularChannels = ({ mobile }) => {
  const { popularChannels } = useChannelData() || { popularChannels: { results: [] } };

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularChannels.results.length ? (
        <>
          <p>Most followed channels.</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularChannels.results.slice(0, 4).map((channel) => (
                <Channel key={channel.id} channel={channel} mobile />
              ))}
            </div>
          ) : (
            popularChannels.results.map((channel) => (
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
