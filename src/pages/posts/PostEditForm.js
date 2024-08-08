import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults"; // make sure this is correctly imported

function PostEditForm() {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
    channel_title: "", // Assuming this is a display-only field based on your data
    channel: "", // This is the actual field expected by the backend for form submission
  });

  const { title, content, image, channel_title, channel } = postData;
  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        if (data.is_owner) {
          setPostData({
            title: data.title,
            content: data.content,
            image: data.image,
            channel_title: data.channel_display_title,
            channel: data.channel, // Ensure this is being fetched if needed
          });
        } else {
          history.push("/");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [history, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(postData.image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("channel", channel); // Make sure this is included
    if (imageInput.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/posts/${id}/`, formData);
      history.push(`/posts/${id}`);
    } catch (err) {
      console.error("Error submitting:", err);
      if (err.response) {
        setErrors(err.response.data);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="d-flex align-items-center justify-content-center">
        <Col md={7} lg={8}>
          <Container>
            <Form.Group className="text-center">
              <Image src={image} rounded className="img-fluid" />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="content"
                value={content}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" className="me-2">
              Save
            </Button>
            <Button onClick={() => history.goBack()}>Cancel</Button>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;
