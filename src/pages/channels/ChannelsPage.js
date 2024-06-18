import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ChannelsPagePost from "./ChannelsPagePost";

function ChannelsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleMount = async () => {
      try {
        if (id) {
          const url = `/channels/${id}`;
          console.log(`Constructed URL: ${url}`); 
          const { data: post } = await axiosReq.get(`/channels/${id}`);
          setPost(post);
        } else {
          throw new Error("Channel ID is missing");
        }
      } catch (err) {
        setError(err);
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Row className="h-100">
      {post ? <ChannelsPagePost post={post} /> : <div>Loading...</div>}
    </Row>
  );
}

export default ChannelsPage;
