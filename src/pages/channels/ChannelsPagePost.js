import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";

function ChannelsPagePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const response = await axiosReq.get(`/posts/${id}`);
        setPost(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Container className={appStyles.Content}>
      <Row>
        <Col>
          {post ? (
            <div>
              <h1>{post.title}</h1>
              <p>{post.content}</p>
              <p>{post.channel_display_title}</p>
              {post.image && <img src={post.image} alt={post.title} className={appStyles.Image} />}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ChannelsPagePost;
