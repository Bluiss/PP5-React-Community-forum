import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";

import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setPost,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {}
  };

  return (
    <>
      <hr />
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col xs={2}>
              <Link to={`/profiles/${profile_id}`}>
                <Avatar src={profile_image} />
              </Link>
            </Col>
            <Col xs={10}>
              <div className="d-flex justify-content-between">
                <div>
                  <span className={styles.Owner}>{owner}</span>
                  <span className={styles.Date}>{updated_at}</span>
                </div>
                {is_owner && !showEditForm && (
                  <MoreDropdown
                    handleEdit={() => setShowEditForm(true)}
                    handleDelete={handleDelete}
                  />
                )}
              </div>
              {showEditForm ? (
                <CommentEditForm
                  id={id}
                  profile_id={profile_id}
                  content={content}
                  profileImage={profile_image}
                  setComments={setComments}
                  setShowEditForm={setShowEditForm}
                />
              ) : (
                <p>{content}</p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default Comment;
