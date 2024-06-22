import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useParams, useLocation } from "react-router-dom";
import axios from "axios"; 

const TitleComponent = () => {
  const { title } = useParams(); // Get the 'title' parameter from the URL
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Loading..."); // Rename to avoid conflict

  useEffect(() => {
    const fetchTitle = async () => {
      if (location.pathname === "/") {
        setPageTitle("Threadly");
      } else if (title) { // Correctly check for 'title'
        try {
          const { data } = await axios.get(`/channels/title/${title}`); // Correct URL
          const channelTitle = data?.title || "Default Title";
          setPageTitle(channelTitle);
        } catch (error) {
          console.error("Error fetching channel title:", error);
          setPageTitle("Error fetching title");
        }
      }
    };

    fetchTitle();
  }, [title, location.pathname]); // Update dependencies

  return <h1 className={pageTitle}>{pageTitle}</h1>; // Use 'pageTitle' for the content
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TitleComponent} />
        <Route exact path="/channels/:title" component={TitleComponent} /> {/* Use 'title' for the dynamic part */}
      </Switch>
    </Router>
  );
};

export default App;
