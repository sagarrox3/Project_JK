import React from "react";
import BlogList from "./BlogList";
import { useSelector } from "react-redux";
import "./MyBlogs.css";

const MyBlogs = () => {
  const blogs = useSelector(state => state.blog.userBlogs);

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <h2>Start Creating your blogs here..!!</h2>
      <h2>Happy Blogging..!!</h2>
      <BlogList blogs={blogs} />
    </div>
  );
};

export default MyBlogs;
