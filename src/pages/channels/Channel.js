// src/pages/channels/Channel.js
import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

const Channel = (props) => {
  const { channel, mobile, imageSize = 55 } = props;
  const { id, title, image, owner } = channel;

  return (
    <div className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}>
      <div>
        <Link className="align-self-center" to={`/channel/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2`}>
        <strong>{title}</strong>
      </div>
    </div>
  );
};

export default Channel;