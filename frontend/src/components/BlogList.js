import React from "react";
import "./BlogList.css";
import BlogInfo from "./BlogInfo";

const BlogList = ({ blogs }) => {
      return (
        <div className="blog-list">
          {blogs.map((blog, index) => (
            <BlogInfo
              key={index}
              title={blog.title}
              content={blog.content}
              tags={blog.tags}
              author={blog.author}
              onClick={() => alert(`Currently Displayed: ${blog.title}`)}
            />
          ))}
        </div>
      );
};

export default BlogList;