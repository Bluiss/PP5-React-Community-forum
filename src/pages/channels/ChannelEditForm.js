import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const ChannelEditForm = () => {
  const { title } = useParams(); // Get the channel title from the URL
  const history = useHistory();
  const imageFile = useRef();

  const [channelData, setChannelData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const { name, description, image } = channelData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        // Fetch the channel by title from the URL
        const { data } = await axiosReq.get(`/channels/?title=${title}`);
        if (data.results.length > 0) {
          const channel = data.results[0];
          setChannelData({
            name: channel.name,
            description: channel.description,
            image: channel.image,
          });
        } else {
          history.push("/not-found");
        }
      } catch (err) {
        console.log(err);
        history.push("/");
      }
    };

    fetchChannelData();
  }, [title, history]);

  const handleChange = (event) => {
    setChannelData({
      ...channelData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      // Update the channel using the title
      await axiosReq.put(`/channels/${title}/`, formData);
      history.goBack();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={handleChange}
          name="name"
        />
      </Form.Group>
      {errors?.name?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          value={description}
          onChange={handleChange}
          name="description"
          rows={5}
        />
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        Cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        Save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              {image && (
                <figure>
                  <Image src={image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setChannelData({
                      ...channelData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ChannelEditForm;
