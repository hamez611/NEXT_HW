import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const foundPost = savedPosts.find((p) => p.id === parseInt(id, 10));
    setPost(foundPost);
  }, [id]);

  const handleImageClick = (index) => {
    const newUrl = prompt("Enter the new image URL:");
    if (newUrl) {
      const updatedPost = { ...post };
      updatedPost.images[index] = newUrl;

      const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
      const postIndex = savedPosts.findIndex((p) => p.id === parseInt(id, 10));
      if (postIndex > -1) {
        savedPosts[postIndex] = updatedPost;
        localStorage.setItem('posts', JSON.stringify(savedPosts));
      }
      setPost(updatedPost);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-page">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <div className="post-images">
        {post.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Post ${post.id} - ${index}`}
            onClick={() => handleImageClick(index)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      <button onClick={handleBack}>Back to Main</button>
    </div>
  );
}

