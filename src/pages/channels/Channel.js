import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useSetChannelData } from "../../contexts/ChannelDataContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const Channel = ({ channel, imageSize = 55, mobile }) => {
  const {
    id,
    following_id,
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
    <Card className="mb-3  ">
      <Card.Img variant="top" src={image} alt="channel image" height="auto"/>
      <Card.Body className="text-align-center" >
        <Card.Title>{title}</Card.Title>
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
                onClick={() => handleUnfollow(id)}
                className="ml-2"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant="dark"
                onClick={() => handleFollow(id)}
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
