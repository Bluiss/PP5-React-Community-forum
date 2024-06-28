import React, { useState, useEffect, useRef, useContext } from "react";
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
import { useChannelData, useSetChannelData } from "../../contexts/ChannelDataContext";

const ChannelEditForm = () => {
  const { title } = useParams();
  const history = useHistory();
  const imageFile = useRef();
  const { pageChannel } = useChannelData();
  const { setChannelData } = useSetChannelData();

  const [channelData, setChannelDataLocal] = useState({
    title: "",
    name: "",
    description: "",
    image: "",
  });

  const { title: channelTitle, name, description, image } = channelData;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axiosReq.get(
          `/channels/title/${encodeURIComponent(title)}/`
        );
        const channel = response.data;
        if (channel) {
          setChannelDataLocal({
            title: channel.title,
            name: channel.name,
            description: channel.description,
            image: channel.image,
          });
        } else {
          history.push("/not-found");
        }
      } catch (err) {
        console.error(err);
        history.push("/");
      }
    };

    fetchChannelData();
  }, [title, history]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChannelDataLocal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      const { data } = await axiosReq.put(
        `/channels/title/${encodeURIComponent(title)}/`,
        formData
      );

      // Update the context state with the new data
      setChannelData((prevState) => {
        const updatedChannels = prevState.pageChannel.map((channel) =>
          channel.title === title ? data : channel
        );

        return {
          ...prevState,
          pageChannel: updatedChannels,
          popularChannel: updatedChannels,
        };
      });

      history.goBack();
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data);
    }
  };

  const ChannelTextFields = ({ title, name, description, handleChange, errors }) => (
    <>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={handleChange}
          name="title"
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
          value={description}
          onChange={handleChange}
          name="description"
          rows={5}
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
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
                <Form.Control
                  id="image-upload"
                  type="file"
                  ref={imageFile}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setChannelDataLocal({
                        ...channelData,
                        image: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  }}
                />
              </div>
            </Form.Group>
            <div className="d-md-none">
              <ChannelTextFields
                {...{ title: channelTitle, name, description, handleChange, errors }}
              />
            </div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>
            <ChannelTextFields
              {...{ title: channelTitle, name, description, handleChange, errors }}
            />
          </Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ChannelEditForm;
