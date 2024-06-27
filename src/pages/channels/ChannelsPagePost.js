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
import ChannelHeader from "./ChannelHeader";

function ChannelsPagePost({ message }) {
  const { title } = useParams();
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("-created_at");

  useEffect(() => {
    if (title) {
      const fetchPosts = async () => {
        try {
          // Update the URL to use channel__title
          const url = `/posts/?channel__title=${title}&ordering=${sortOrder}`;
          const response = await axiosReq.get(url);
          setPosts(response.data);
          setHasLoaded(true);
        } catch (err) {
          console.error("Error fetching posts data:", err);
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
      console.error("Channel title is undefined, skipping fetchPosts");
    }
  }, [query, pathname, sortOrder, title]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <ChannelHeader />
        <div className="d-flex justify-content-between align-items-center mb-3 pr-1">
          <div>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Sort By
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortOrder("-created_at")}>
                  Newest
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortOrder("created_at")}>
                  Oldest
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortOrder("-total_vote_count")}
                >
                  Most Upvotes
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex-grow-1 ml-2">
            <Form
              className="w-100"
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Search posts"
              />
            </Form>
          </div>
        </div>

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
        <TopPosters />
      </Col>
    </Row>
  );
}

export default ChannelsPagePost;
