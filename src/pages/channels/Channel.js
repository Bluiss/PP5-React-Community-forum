import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useSetChannelData } from "../../contexts/ChannelDataContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const Channel = ({ channel, imageSize = 55, mobile }) => {
  console.log("Channel component received data:", channel);

  const {
    following_id = null,
    image,
    owner,
    title,
    description,
    followers_count,
  } = channel;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetChannelData();

  return (
    <Card className="mb-3">
      <Link to={`/channels/${title}`}>
        <Card.Img variant="top" src={image} alt="channel image" height="auto" />
      </Link>
      <Card.Body className="text-align-center">
        <Card.Title>
          <Link to={`/channels/${title}`}>{title}</Link>
        </Card.Title>
        <Card.Text>
          {description}
          <br />
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <span className="text-muted">Followers: {followers_count}</span>
        {!mobile && currentUser && !is_owner && (
          <>
            {following_id ? (
              <Button
                variant="outline-dark"
                onClick={() => handleUnfollow(channel)}
                className="ml-2"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant="dark"
                onClick={() => handleFollow(channel)}
                className="ml-2"
              >
                Follow
              </Button>
            )}
          </>
        )}
      </Card.Footer>
    </Card>
  );
};

export default Channel;
