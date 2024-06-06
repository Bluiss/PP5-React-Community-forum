import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ChannelsPagePost from "./ChannelsPagePost";

function ChannelsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data: post } = await axiosReq.get(`/channels/${id}`);
        setPost(post);
        console.log(post); // Log the post data
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      {post ? <ChannelsPagePost post={post} /> : <div>Loading...</div>}
    </Row>
  );
}

export default ChannelsPage;
