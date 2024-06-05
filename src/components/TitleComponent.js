import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";

const TitleComponent = () => {
  const [title, setTitle] = useState("Threadly");
  const location = useLocation();
  const { id } = useParams(); // Ensure the id parameter is correctly extracted

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        if (location.pathname === "/" || location.pathname === "") {
          setTitle("Threadly");
        } else if (id) {
          const { data } = await axiosReq.get(`/channel/${id}`);
          const channelTitle = data?.title || "Default Title";
          setTitle(`Threadly - ${channelTitle}`);
        } else {
          setTitle("Threadly - No Channel ID");
        }
      } catch (error) {
        console.error("Error fetching channel title:", error);
        setTitle("Threadly - Error fetching title");
      }
    };

    fetchTitle();
  }, [location.pathname, id]); // Ensure id is included in the dependency array

  return <h1>{title}</h1>;
};

export default TitleComponent;
