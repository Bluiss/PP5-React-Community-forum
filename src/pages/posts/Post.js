import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
    channel_display_title,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={`${styles.Post} mb-4`}>
      <Card.Body className="p-3">
        <Link to={`/posts/${id}`}>
          <Card.Img variant="top" src={image} alt={title} className="mb-3" />
        </Link>
        <Card.Title className="text-center">{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
        <Row className="align-items-center justify-content-between mb-2">
          <Col xs="auto">
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} height={55} />
              <span className="ml-2">{owner}</span>
            </Link>
          </Col>
          <Col xs="auto" className="text-right">
            <span>{updated_at}</span>
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </Col>
        </Row>
        {channel_display_title && (
          <div className="text-center mb-3">
            <Link to={`/channels/${id}`}>
              <Card.Text className="font-weight-bold">
                {channel_display_title}
              </Card.Text>
            </Link>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike} className="cursor-pointer">
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike} className="cursor-pointer">
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          <span className="ml-2">{likes_count}</span>
        </div>
        <div className="d-flex align-items-center">
          <Link to={`/posts/${id}`} className="d-flex align-items-center">
            <i className="far fa-comments" />
            <span className="ml-2">{comments_count}</span>
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default Post;
