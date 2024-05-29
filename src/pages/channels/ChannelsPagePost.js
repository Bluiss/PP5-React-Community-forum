import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import { Spinner } from "react-bootstrap";
import Post from "/workspace/pp5-react-community-forum/src/pages/posts/Post.js"; // Import the Post component

function ChannelsPagePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const response = await axiosReq.get(`/posts/${id}`);
        setPost(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Container className={appStyles.Content}>
      <Row>
        <Col>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : post ? (
            <Post {...post} postPage={true} setPosts={setPost} /> // Render the Post component with post data
          ) : (
            <p>Post not found</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ChannelsPagePost;
