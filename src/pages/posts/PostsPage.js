import React, { useEffect, useState } from "react";
import { Form, Col, Row, Container, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Asset from "../../components/Asset";
import PopularProfiles from "../profiles/PopularProfiles";
import PopularChannels from "../channels/PopularChannels";
import NoResults from "../../assets/no-results.png";
import appStyles from "../../App.module.css";
import { fetchMoreData } from "../../utils/utils";

function PostsPage({ message, filter = "" }) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("-created_at"); // Default to newest

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}&ordering=${sortOrder}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, sortOrder]);

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
        <PopularChannels />
      </Col>
    </Row>
  );
}

export default PostsPage;
