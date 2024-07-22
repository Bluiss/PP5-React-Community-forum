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
  const { title } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [channelData, setChannelData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const { title: channelTitle, description, image } = channelData;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axiosReq.get(`/channels/title/${encodeURIComponent(title)}/`);
        const channel = response.data;
        setChannelData({
          title: channel.title,
          description: channel.description,
          image: channel.image,
        });
      } catch (err) {
        console.error(err);
        history.push("/");
      }
    };
    fetchChannelData();
  }, [title, history]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChannelData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setChannelData((prevState) => ({
        ...prevState,
        image: URL.createObjectURL(event.target.files[0]),
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", channelTitle);
    formData.append("description", description);
    if (imageFile.current?.files[0]) {
      formData.append("image", imageFile.current.files[0]);
    }

    try {
      await axiosReq.put(`/channels/title/${encodeURIComponent(title)}/`, formData);
      history.push(`/channels/${encodeURIComponent(channelTitle)}`); // Redirect to the channel's page
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container className={`${appStyles.Content} d-flex flex-column justify-content-center`}>
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label className="d-flex justify-content-center" htmlFor="image-upload">
                  <div>Click or tap to upload an image</div>
                </Form.Label>
              )}
              <Form.Control
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageFile}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={channelTitle}
                onChange={handleChange}
              />
              {errors?.title?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="description"
                value={description}
                onChange={handleChange}
              />
              {errors?.description?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
              Save
            </Button>
          </Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ChannelEditForm;
