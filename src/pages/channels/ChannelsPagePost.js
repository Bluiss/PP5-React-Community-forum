import React, { useEffect, useState } from "react";
import { Form, Col, Row, Container, Dropdown } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import Asset from "../../components/Asset";
import PopularProfiles from "../profiles/PopularProfiles";
import NoResults from "../../assets/no-results.png";
import appStyles from "../../App.module.css";
import { fetchMoreData } from "../../utils/utils";
import TopPosters from "../../components/TopPosters";

function ChannelsPagePost({ message, filter = "" }) {
  const { id } = useParams(); // Get the channel ID from the URL
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("-created_at"); // Default to newest


  useEffect(() => {
    if (id) {
      const fetchPosts = async () => {
        try {
          // Construct the API URL with channel filtering
          const url = `/posts/?channel=${id}`;

          // Fetch posts filtered by channel ID and other parameters
          const { data } = await axiosReq.get(url);
          setPosts(data);
          setHasLoaded(true);
        } catch (err) {
          console.log("Error:", err); // Log the error to see what went wrong
        }
      };

      setHasLoaded(false);
      const timer = setTimeout(() => {
        fetchPosts();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      console.log("Channel ID is undefined, skipping fetchPosts");
    }
  }, [filter, query, pathname, sortOrder, id]); // Include channelId as a dependency

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />

        {/* Flexbox Row for sort and search controls */}
        <div className="d-flex justify-content-between align-items-center mb-3 pr-1">
          <div>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Sort By
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortOrder("-created_at")}>Newest</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOrder("created_at")}>Oldest</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOrder("-total_vote_count")}>Most Upvotes</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex-grow-1 ml-2">
            <Form className="w-100" onSubmit={(event) => event.preventDefault()}>
              <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Search posts"
              />
            </Form>
          </div>
        </div>

        {/* Content display */}
        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                dataLength={posts.results.length}
                next={() => fetchMoreData(posts, setPosts)}
                hasMore={!!posts.next}
                loader={<Asset spinner />}
              >
                {posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts} />
                ))}
              </InfiniteScroll>
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
        <TopPosters/>
      </Col>
    </Row>
  );
}

export default ChannelsPagePost;
