import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { formatISO9075 } from "date-fns";
import { AiFillEdit } from "react-icons/ai";
import Spinner from "../components/Spinner";

const PostDetail = () => {
  const { id } = useParams();
  const [postItem, setPostItem] = useState(null);
  const { userInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/blogs/post/${id}`, {
          method: "GET",
          credentials: "include",
        });
        setIsLoading(false);
        const data = await response.json();
        setPostItem(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar />
      <div className="post-details-container">
        {postItem ? (
          <>
            <div className="post-detail-header">
              <h2>{postItem.title}</h2>
              <time className="time">
                {formatISO9075(new Date(postItem.createdAt))}
              </time>
              <p>{`By ${postItem.author.username}`}</p>
              <div className="edit-row">
                {userInfo.id === postItem.author._id && (
                  <div>
                    <Link className="edit-btn" to={`/edit/${postItem._id}`}>
                      <AiFillEdit className="edit-icon" />
                      Edit this Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="postpage-image-container">
              <img className="postpage-image" src={postItem.cover} alt="" />
            </div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: postItem.content }}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default PostDetail;
