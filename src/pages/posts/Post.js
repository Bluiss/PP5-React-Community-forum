import React, { useState } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Row, Col } from "react-bootstrap";
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
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
    channel_display_title,
    vote_count,
    user_vote, 
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [userVote, setUserVote] = useState(user_vote); 

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

  const handleVote = async (voteType) => {
    if (userVote === voteType) {
      return; 
    }
    try {
      await axiosRes.post("/votes/", { post: id, vote_type: voteType });

      setUserVote(voteType);

      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          if (post.id === id) {
            const currentVoteCount = post.vote_count ?? 0;
            const newVoteCount = userVote
              ? currentVoteCount - userVote + voteType 
              : currentVoteCount + voteType;

            return {
              ...post,
              vote_count: newVoteCount,
              user_vote: voteType,
            };
          }
          return post;
        }),
      }));
    } catch (err) {
      console.error("Error occurred:", err.response ? err.response.data : err.message);
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
            <span>
              <Link to={`/channels/${id}`}>
                <Card.Text className="font-weight-bold">{channel_display_title}</Card.Text>
              </Link>
            </span>
            {is_owner && postPage && (
              <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
            )}
          </Col>
        </Row>
        {channel_display_title && (
          <div className="text-center mb-3">
            <Card.Text className="font-weight-bold">{updated_at}</Card.Text>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span
            onClick={() => handleVote(1)}
            className={`cursor-pointer ${userVote === 1 ? styles.Voted : ''}`}
          >
            <i className="fas fa-arrow-up" />
          </span>
          <span className="ml-2">{vote_count}</span>
          <span
            onClick={() => handleVote(-1)}
            className={`ml-2 cursor-pointer ${userVote === -1 ? styles.Voted : ''}`}
          >
            <i className="fas fa-arrow-down" />
          </span>
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
