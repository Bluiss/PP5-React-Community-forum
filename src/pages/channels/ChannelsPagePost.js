import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";

function ChannelsPagePosts() {
  const { channelId } = useParams(); // Extracting 'channelId' from the URL
  const [channel, setChannel] = useState(null); // State for channel details
  const [posts, setPosts] = useState([]); // State for posts related to the channel
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axiosReq.get(`/channels/${channelId}`); // Fetching channel details and its posts
        console.log('API Response:', response.data); // Log the full API response
        setChannel(response.data);
        setPosts(response.data.posts); // Assuming the API returns posts within the channel data
        setHasLoaded(true);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChannelData();
  }, [channelId]);

  return (
    <Container className={appStyles.Content}>
      <Row>
        <Col>
          {hasLoaded ? (
            channel ? (
              <div>
                <h1>{channel.title}</h1>
                <p>{channel.description}</p> {/* Displaying channel details */}
                <h2>Posts</h2>
                {posts.length ? (
                  posts.map((post) => (
                    <div key={post.id} className={appStyles.Post}>
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className={appStyles.Image}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p>No posts available for this channel.</p>
                )}
              </div>
            ) : (
              <p>Channel not found.</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ChannelsPagePosts;
