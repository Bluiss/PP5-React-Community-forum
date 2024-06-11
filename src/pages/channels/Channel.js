// src/pages/channels/Channel.js
import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

const Channel = (props) => {
  const { channel, mobile, imageSize = 55 } = props;
  const { id, title, image } = channel;

  return (
    <div className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}>
      <div>
        <Link className="align-self-center" to={`/channels/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2`}>
        <strong>{title}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile &&
          currentUser &&
          !is_owner &&
          (following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => handleUnfollow(channel)}
              >
              unfollow
            </Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={() => handleFollow(channel)}
            >
              follow
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Channel;
