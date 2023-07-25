import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";

const Blogs = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/blogs/post")
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const trimString = (summary) => {
      return summary.length > 225 ? `${summary.substring(0, 225)}...` : summary;
  };

  return (
    <div>
      {posts.map((post) => {
        const { _id, title, summary, cover, createdAt, author } = post;
        const createdAtDate = new Date(createdAt);

        return (
          <div key={_id} className="blogs">
            <div className="posts-container">
              <div className="img-container">
                <Link to={`/post/${_id}`}>
                  <img
                    className="post-img"
                    src={cover}
                    alt="post-img"
                  />
                </Link>
              </div>
              <div className="post-content">
                <Link to={`/post/${_id}`}>
                  <h2 className="post-title">{title}</h2>
                </Link>
                <p className="info">
                  <a href="/">{author?.username}</a>
                  <time>
                    {createdAt && formatISO9075(new Date(createdAtDate))}
                  </time>
                </p>
                <p className="post-desc">{trimString(summary)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Blogs;
