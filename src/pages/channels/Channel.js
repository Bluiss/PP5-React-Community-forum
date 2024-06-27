import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useSetChannelData } from "../../contexts/ChannelDataContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosReq } from "../../api/axiosDefaults";

const Channel = ({ channel, imageSize = 55, mobile, className }) => {
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
  const history = useHistory();

  const { handleFollow, handleUnfollow } = useSetChannelData();

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
        {is_owner && (
          <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </Card.Footer>
    </Card>
  );
};

export default Channel;
