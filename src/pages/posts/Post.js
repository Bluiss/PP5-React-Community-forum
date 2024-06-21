import React from "react";

function ChannelsPagePost({ post }) {

  if (!post) {
    return <p>Loading post details...</p>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>
          <p className="card-text">{post.description}</p>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="img-fluid mt-3"
            />
          )}
        </div>
      </div>
      
      <h3 className="mt-4">Posts</h3>
      {post.posts && post.posts.length > 0 ? (
        post.posts.map((individualPost) => (
          <div key={individualPost.id} className="card mb-3">
            <div className="card-body">
              <h4 className="card-title">{individualPost.title}</h4>
              <p className="card-text">{individualPost.content}</p>
              {individualPost.image && (
                <img
                  src={individualPost.image}
                  alt={individualPost.title}
                  className="img-fluid"
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No posts available for this channel.</p>
      )}
    </div>
  );
}

export default ChannelsPagePost;
