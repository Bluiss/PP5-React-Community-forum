import React from "react";
import { Container, Button } from "react-bootstrap";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/Profile.module.css";
import {
  useChannelData,
  useSetChannelData,
} from "../../contexts/ChannelDataContext";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Asset from "../../components/Asset";

function PopularChannels() {
  const channelData = useChannelData();
  const { handleFollow, handleUnfollow } = useSetChannelData();
  const currentUser = useCurrentUser();

  if (
    !channelData ||
    !channelData.popularChannels ||
    !Array.isArray(channelData.popularChannels)
  ) {
    return (
      <div>
        <Asset spinner />
      </div>
    );
  }

  const { popularChannels } = channelData;

  const mobile = false;

  return (
    <Container className={appStyles.Content}>
      <p>Most Popular Channels</p>
      <div className="d-flex flex-column align-items-left">
        {popularChannels.slice(0, 4).map((channel) => {
          // Log the channel data to inspect its properties
          console.log("Channel Data:", channel);

          return (
            <div
              key={channel.title}
              className={`my-3 d-flex align-items-center ${
                mobile && "flex-column"
              }`}
            >
              <div>
                <Link
                  className="align-self-center"
                  to={`/channels/${channel.id}`}
                >
                  <Avatar src={channel.image} height={55} />
                </Link>
              </div>
              <div className={`mx-2 ${styles.WordBreak}`}>
                <strong>{channel.title}</strong>
              </div>
              <div className={`text-right ${!mobile && "ml-auto"}`}>
                {!mobile &&
                  currentUser &&
                  !channel.is_owner &&
                  (channel.following_id ? (
                    <Button
                      className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                      onClick={() => handleUnfollow(channel)}
                    >
                      unfollow
                    </Button>
                  ) : (
                    <Button
                      className={`${btnStyles.Button} ${btnStyles.Black}`}
                      onClick={() => handleFollow(channel)}
                    >
                      follow
                    </Button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default PopularChannels;
