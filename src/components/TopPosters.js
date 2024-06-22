import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../App.module.css"; // Correct path for App.module.css
import Asset from "./Asset"; // Correct path for Asset
import { useProfileData } from "../contexts/ProfileDataContext"; // Ensure correct import
import Profile from "../pages/profiles/Profile";


const TopPosters = () => {
  // Get topPosters and loading state from the useProfileData context
  const { topPosters } = useProfileData();

  // Check if the data is available
  const hasLoaded = topPosters && topPosters.results;

  return (
    <Container className={appStyles.Content}>
      <p className="align-items-center">Top Posters</p>
      {hasLoaded ? (
        topPosters.results.length ? (
          topPosters.results.map((poster) => (
            <div key={poster.id} className="d-flex justify-content-between align-items-center">
              <Profile key={poster.id} profile={poster} />
              <span>{poster.username} {poster.posts_count} Posts</span>
            </div>
          ))
        ) : (
          <p>No top posters available.</p>
        )
      ) : (
        <Asset spinner /> // Show a spinner while loading
      )}
    </Container>
  );
};

export default TopPosters;
