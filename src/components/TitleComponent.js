import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import axios from "axios"; 

const TitleComponent = () => {
  const { title } = useParams(); 
  const [pageTitle, setPageTitle] = useState("Loading...");

  useEffect(() => {
    const fetchTitle = async () => {
      if (!title) {
        setPageTitle("Threadly");
        return;
      }

      try {
        const { data } = await axios.get(`/channels/title/${title}`);
        const channelTitle = data?.title || "Default Title";
        setPageTitle(channelTitle);
        document.title = channelTitle; 
      } catch (error) {
        console.error("Error fetching channel title:", error);
        setPageTitle("Error fetching title");
        document.title = "Error fetching title"; 
      }
    };

    fetchTitle();
  }, [title]); 

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
