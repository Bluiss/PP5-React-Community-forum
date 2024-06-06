import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";

const TitleComponent = () => {
  const [title, setTitle] = useState("Threadly");
  const location = useLocation();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        if (location.pathname === "/" || location.pathname === "") {
          setTitle("Threadly");
        } else if (id) {
          const { data } = await axiosReq.get(`/channels/${id}`);
          const channelTitle = data?.title || "Default Title";
          setTitle({channelTitle});
        } else {
          setTitle("Threadly - No Channel ID");
        }
      } catch (error) {
        console.error("Error fetching channel title:", error);
        setTitle("Threadly - Error fetching title");
      }
    };

    fetchTitle();
  }, [location.pathname, id]); 

  return <h1>{title}</h1>;
};

export default TitleComponent;
