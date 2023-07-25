import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Blogs from "../components/blogs";
import CreateButton from "../components/CreateButton";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";

const Home = () => {
  const { userInfo } = useContext(UserContext);
  return (
    <div>
      <Navbar />
      <Header />
      <Blogs/>
      {userInfo?.username && <CreateButton />}
    </div>
  );
};

export default Home;
