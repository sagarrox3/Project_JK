import React from "react";
import "./BlogInfo.css";

const BlogInfo = ({ title, content, tags, author }) => {
  return (
    <div className="blog-container">
      <h2 className="blog-title">{title}</h2>
      <p className="blog-content">{content}</p>
      <div className="blog-tags">
        {tags.map((tag, index) => (
          <span key={index} className="blog-tag">
            #{tag}
          </span>
        ))}
      </div>
      <p className="blog-author">By <span className="blog-author-name">{author}</span></p>
    </div>
  );
};

export default BlogInfo;