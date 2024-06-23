import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useSetChannelData } from "../../contexts/ChannelDataContext"; 
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/Channel.module.css";
import btnStyles from "../../styles/Button.module.css";

const Channel = ({ channel, imageSize = 55, mobile }) => {
  const { id, following_id, image, owner, title, updated_at, likes_count, comments_count, like_id, profile_id } = channel;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { setChannelData, handleFollow, handleUnfollow } = useSetChannelData();

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { channel: id });
      setChannelData((prevChannels) => ({
        ...prevChannels,
        results: prevChannels.results.map((channel) => {
          return channel.id === id
            ? { ...channel, likes_count: channel.likes_count + 1, like_id: data.id }
            : channel;
        }),
      }));
    } catch (err) {
      console.log(err);
      // Optionally show a notification to the user
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setChannelData((prevChannels) => ({
        ...prevChannels,
        results: prevChannels.results.map((channel) => {
          return channel.id === id
            ? { ...channel, likes_count: channel.likes_count - 1, like_id: null }
            : channel;
        }),
      }));
    } catch (err) {
      console.log(err);
      // Optionally show a notification to the user
    }
  };

  return (
    <Card className={`${styles.Channel} mb-4`}>
      <Card.Body className="p-3 d-flex flex-column align-items-center">
        <Link to={`/channels/${id}`} className="align-self-center mb-3">
          <Card.Img variant="top" src={image} alt={title} className="mb-3" />
        </Link>
        <Card.Title className="text-center">{title}</Card.Title>
        <Row className="align-items-center justify-content-center mb-2">
          <Col xs="auto" className="text-center">
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={image} height={imageSize} />
              <span className={`${styles.OwnerText} ml-2`}>{owner}</span>
            </Link>
          </Col>
        </Row>
        <Row className="align-items-center justify-content-between mb-3">
          <Col xs="auto" className="text-center">
            <span>{new Date(updated_at).toLocaleDateString()}</span> {/* Display date in a readable format */}
          </Col>
        </Row>
        <div className="d-flex justify-content-center mt-2">
          <div className="d-flex align-items-center mr-3">
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You can't like your own channel!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            ) : like_id ? (
              <span onClick={handleUnlike} className="cursor-pointer" aria-label="Unlike this channel">
                <i className={`fas fa-heart ${styles.Heart}`} />
              </span>
            ) : currentUser ? (
              <span onClick={handleLike} className="cursor-pointer" aria-label="Like this channel">
                <i className={`far fa-heart ${styles.HeartOutline}`} />
              </span>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to like channels!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            )}
            <span className="ml-2">{likes_count}</span>
          </div>
          <div className="d-flex align-items-center">
            <Link to={`/channels/${id}`} className="d-flex align-items-center" aria-label="View comments on this channel">
              <i className="far fa-comments" />
              <span className="ml-2">{comments_count}</span>
            </Link>
          </div>
        </div>
        {currentUser && !is_owner && (
          <div className="d-flex justify-content-center mt-2">
            {following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(channel)}
                aria-label="Unfollow this channel"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(channel)}
                aria-label="Follow this channel"
              >
                Follow
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Channel;
