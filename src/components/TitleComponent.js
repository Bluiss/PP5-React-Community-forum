import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import axios from "axios"; 

const TitleComponent = () => {
  const { title } = useParams(); // Extract the title from the URL
  const [pageTitle, setPageTitle] = useState("Loading...");

  useEffect(() => {
    const fetchTitle = async () => {
      if (!title) {
        // If no title is provided, default to "Threadly"
        setPageTitle("Threadly");
        return;
      }

      try {
        // Fetch channel details using the title
        const { data } = await axios.get(`/channels/title/${title}`);
        const channelTitle = data?.title || "Default Title";
        setPageTitle(channelTitle);
        document.title = channelTitle; // Update the document title
      } catch (error) {
        console.error("Error fetching channel title:", error);
        setPageTitle("Error fetching title");
        document.title = "Error fetching title"; // Update document title on error
      }
    };

    fetchTitle();
  }, [title]); // Only depend on 'title' to trigger the effect

  return <h1>{pageTitle}</h1>;
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TitleComponent} />
        <Route exact path="/channels/:title" component={TitleComponent} />
      </Switch>
    </Router>
  );
};

export default App;
