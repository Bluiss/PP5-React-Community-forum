import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Row, Col, Tooltip, Overlay } from "react-bootstrap";
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
    vote_count: initialVoteCount,
    user_vote: initialUserVote,
    like_id, // Add this line
    likes_count, // Add this line
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  // Initialize states
  const [voteCount, setVoteCount] = useState(initialVoteCount || 0);
  const [userVote, setUserVote] = useState(initialUserVote || 0);
  const [showTooltip, setShowTooltip] = useState(false);
  const heartRef = useRef(null); // Ref for heart icon to position the tooltip

  // Fetch and initialize post data when component mounts
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

    // Only fetch post data if on the post page
    if (postPage) {
      fetchPostData();
    }
  }, [id, postPage]);

  // Function to handle editing the post
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

  // Function to handle deleting the post
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle voting
  const handleVote = async (voteType) => {
    // Prevent voting again in the same direction
    if (userVote === voteType) {
      return;
    }

    try {
      console.log("Sending vote request to /votes/ with data:", { post: id, vote_type: voteType });
      await axiosRes.post("/votes/", { post: id, vote_type: voteType });

      // Update local state immediately after vote
      setUserVote(voteType);
      setVoteCount((prevVoteCount) => {
        // Calculate new vote count
        const validPrevVoteCount = isNaN(prevVoteCount) ? 0 : prevVoteCount;
        const validVoteType = isNaN(voteType) ? 0 : voteType;
        const validUserVote = isNaN(userVote) ? 0 : userVote;

        return validPrevVoteCount + validVoteType - validUserVote;
      });

      // Update parent component's state (if applicable)
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          if (post.id === id) {
            const currentVoteCount = post.vote_count ?? 0;
            const newVoteCount = userVote
              ? currentVoteCount - userVote + voteType // Adjust the vote count if there was a previous vote
              : currentVoteCount + voteType;

            return {
              ...post,
              vote_count: isNaN(newVoteCount) ? 0 : newVoteCount,
              user_vote: isNaN(voteType) ? 0 : voteType,
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
              <i className="far fa-heart" ref={heartRef} onMouseOver={() => setShowTooltip(true)} onMouseOut={() => setShowTooltip(false)} />
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
              <i className="far fa-heart" ref={heartRef} onMouseOver={() => setShowTooltip(true)} onMouseOut={() => setShowTooltip(false)} />
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
