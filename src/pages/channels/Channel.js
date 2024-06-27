import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useSetChannelData } from "../../contexts/ChannelDataContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosReq } from "../../api/axiosDefaults";

const Channel = ({ channel, imageSize = 55, mobile, className }) => {
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
  const history = useHistory();

  const { handleFollow, handleUnfollow } = useSetChannelData();
  const [isFollowing, setIsFollowing] = useState(!!following_id);

  useEffect(() => {
    setIsFollowing(!!following_id);
  }, [following_id]);

  const handleEdit = () => {
    history.push(`/channels/${title}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/channels/title/${title}/`);
      history.push("/");
    } catch (err) {
      console.error("Failed to delete the channel:", err);
    }
  };

  const handleFollowClick = async () => {
    try {
      await handleFollow(channel);
      setIsFollowing(true);
    } catch (err) {
      console.error("Failed to follow the channel:", err);
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await handleUnfollow(channel);
      setIsFollowing(false);
    } catch (err) {
      console.error("Failed to unfollow the channel:", err);
    }
  };

  // Debugging logs
  console.log("Channel data:", channel);
  console.log("Current user:", currentUser);
  console.log("Is owner:", is_owner);
  console.log("Following ID:", following_id);
  console.log("Is Following:", isFollowing);

  return (
    <Card className={`mb-3 ${className}`}>
      <Link to={`/channels/${title}`}>
        <Card.Img
          variant="top"
          src={image}
          alt="channel image"
          style={{ width: "100%", height: "auto" }}
        />
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
            {isFollowing ? (
              <Button
                variant="outline-dark"
                onClick={handleUnfollowClick}
                className="ml-2"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant="dark"
                onClick={handleFollowClick}
                className="ml-2"
              >
                Follow
              </Button>
            )}
          </>
        )}
        {is_owner && (
          <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </Card.Footer>
    </Card>
  );
};

export default Channel;
