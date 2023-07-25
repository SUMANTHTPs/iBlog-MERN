import React, { useState } from "react";
import Editor from "../components/Editor";
import { useNavigate, useParams } from "react-router-dom";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/blogs/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      navigate("/");
    }
  };

  return (
    <div>
      <form className="login-form create-form" onSubmit={handleSubmit}>
        <h2
          style={{ paddingBottom: "2.5em" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Write a blog
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          required
        />
        <input
          type="text"
          placeholder="summary"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
        <input
          type="file"
          placeholder="Select"
          accept=".jpg, .jpeg, .png"
          max={1048576}
          onChange={(ev) => setFiles(ev.target.files)}
        />
        <Editor value={content} onChange={setContent} />
        <button style={{ margin: "auto", width: "30%" }}>Create</button>
      </form>
    </div>
  );
};

export default NewPost;
