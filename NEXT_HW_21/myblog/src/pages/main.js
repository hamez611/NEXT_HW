import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export function Main() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(savedPosts);
  }, []);

  return (
    <div className="main-page">
      <h1>Blog Posts</h1>
      <Link to="/create">
        <button className="create-post-button">새로운 포스트 작성하기</button>
      </Link>
      {posts.map((post) => (
        <div key={post.id} className="post-summary">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <div className="post-images">
            {post.images.map((image, index) => (
              <img key={index} src={image} alt={`Post ${post.id} - ${index}`} />
            ))}
          </div>
          <Link to={`/detail/${post.id}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
}

    






