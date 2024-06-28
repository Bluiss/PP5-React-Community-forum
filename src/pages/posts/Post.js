import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Row, Col, Tooltip, Overlay } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Avatar = lazy(() => import("../../components/Avatar"));

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
    vote_count: initialVoteCount,
    user_vote: initialUserVote,
    like_id,
    likes_count,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const [voteCount, setVoteCount] = useState(initialVoteCount || 0);
  const [userVote, setUserVote] = useState(initialUserVote || 0);
  const [showTooltip, setShowTooltip] = useState(false);
  const heartRef = useRef(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const { data } = await axiosRes.get(`/posts/${id}/`);
        setVoteCount(data.vote_count || 0);
        setUserVote(data.user_vote || 0);
      } catch (err) {
        console.log("Error fetching post data:", err);
      }
    };

    if (postPage) {
      fetchPostData();
    }
  }, [id, postPage]);

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
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

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleVote = async (voteType) => {
    const validVoteType = parseInt(voteType, 10);
    console.log("Sending vote with type:", validVoteType, "(type:", typeof validVoteType, ")");
  
    if (![1, -1].includes(validVoteType)) {
      console.error("Invalid vote type:", voteType);
      return;
    }
  
    if (userVote === validVoteType) {
      return;
    }
  
    try {
      await axiosRes.post("/votes/", { post: id, vote_type: validVoteType });
  
      setUserVote(validVoteType);
      setVoteCount((prevVoteCount) => {
        const validPrevVoteCount = isNaN(prevVoteCount) ? 0 : prevVoteCount;
        const validUserVote = isNaN(userVote) ? 0 : userVote;
  
        return validPrevVoteCount + validVoteType - validUserVote;
      });
  
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          if (post.id === id) {
            const currentVoteCount = isNaN(post.vote_count) ? 0 : post.vote_count;
            const newVoteCount = userVote
              ? currentVoteCount - userVote + validVoteType
              : currentVoteCount + validVoteType;
  
            return {
              ...post,
              vote_count: isNaN(newVoteCount) ? 0 : newVoteCount,
              user_vote: validVoteType,
            };
          }
          return post;
        }),
      }));
    } catch (err) {
      console.error("Error occurred while voting:", err.response ? err.response.data : err.message);
      if (err.response && err.response.data.detail) {
        console.error("Server response detail:", err.response.data.detail);
      }
    }
  };
  
  
  
  
  return (
    <Card className={`${styles.Post} mb-4`}>
      <Card.Body className="p-3">
        <Link to={`/posts/${id}`}>
          <Card.Img
            variant="top"
            src={image}
            alt={title}
            className="mb-3"
            loading="lazy"
            width="100%"
            height="auto"
          />
        </Link>
        <Card.Title className="text-center">{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
        <Row className="align-items-center justify-content-between mb-2">
          <Col xs="auto">
            <Link to={`/profiles/${profile_id}`}>
              <Suspense fallback={<div>Loading...</div>}>
                <Avatar src={profile_image} height={55} width={55} />
              </Suspense>
              <span className="ml-2">{owner}</span>
            </Link>
          </Col>
          <Col xs="auto" className="text-right">
            {channel_display_title && (
              <Link to={`/channels/${channel_display_title}`}>
                <Card.Text className="font-weight-bold">{channel_display_title}</Card.Text>
              </Link>
            )}
            {is_owner && postPage && (
              <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
            )}
          </Col>
        </Row>
        <div className="text-center mb-3">
          <Card.Text className="font-weight-bold">{updated_at}</Card.Text>
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span
            onClick={() => handleVote(1)}
            className={`cursor-pointer ${userVote === 1 ? styles.Voted : ''}`}
          >
            <i className="fas fa-arrow-up" />
          </span>
          <span className="ml-2">{voteCount}</span>
          <span
            onClick={() => handleVote(-1)}
            className={`ml-2 cursor-pointer ${userVote === -1 ? styles.Voted : ''}`}
          >
            <i className="fas fa-arrow-down" />
          </span>
        </div>
        <div className={styles.PostBar}>
          {is_owner ? (
            <>
              <i
                className="far fa-heart"
                ref={heartRef}
                onMouseOver={() => setShowTooltip(true)}
                onMouseOut={() => setShowTooltip(false)}
              />
              <Overlay target={heartRef.current} show={showTooltip} placement="top">
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    You can't like your own post!
                  </Tooltip>
                )}
              </Overlay>
            </>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <>
              <i
                className="far fa-heart"
                ref={heartRef}
                onMouseOver={() => setShowTooltip(true)}
                onMouseOut={() => setShowTooltip(false)}
              />
              <Overlay target={heartRef.current} show={showTooltip} placement="top">
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    Log in to like posts!
                  </Tooltip>
                )}
              </Overlay>
            </>
          )}
          {likes_count}
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
