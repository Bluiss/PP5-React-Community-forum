import React, { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";

import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ChannelsPagePost from "./ChannelsPagePost";

function ChannelsPage() {
  const { id } = useParams();
  const [setPost] = useState();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
        ]);
        setPost({ results: [post] });
        console.log(post);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);
  return (
    <Row className="h-100">
        <ChannelsPagePost/>
    </Row>
  );
}

export default ChannelsPage;
