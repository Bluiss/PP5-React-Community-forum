import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useParams, useLocation } from "react-router-dom";
import axios from "axios"; 
import styles from "../styles/Title.module.css"; 

const TitleComponent = () => {
  const { id } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState("Loading...");

  useEffect(() => {
    const fetchTitle = async () => {
      if (location.pathname === "/") {
        setTitle("Threadly");
      } else if (id) {
        try {
          const { data } = await axios.get(`/channels/${id}`); 
          const channelTitle = data?.title || "Default Title";
          setTitle(channelTitle);
        } catch (error) {
          console.error("Error fetching channel title:", error);
          setTitle("Error fetching title");
        }
      }
    };

    fetchTitle();
  }, [id, location.pathname]);

  console.log("TitleComponent ID:", id);
  console.log("Location Pathname:", location.pathname);
  return <h1 className={styles.title}>{title}</h1>; 
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TitleComponent} />
        <Route path="/channels/:id" component={TitleComponent} /> 
      </Switch>
    </Router>
  );
};

export default App;
