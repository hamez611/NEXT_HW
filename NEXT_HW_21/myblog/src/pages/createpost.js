import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CreatePost() {
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        images: ['', '', '']
      });
      const navigate = useNavigate();
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({
          ...newPost,
          [name]: value
        });
      };
    
      const handleImageChange = (index, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedImages = [...newPost.images];
          updatedImages[index] = reader.result;
          setNewPost({
            ...newPost,
            images: updatedImages
          });
        };
        reader.readAsDataURL(file);
      };
    
      const handleAddPost = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막음
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = [...savedPosts, { ...newPost, id: Date.now() }];
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        navigate('/'); // 메인 페이지로 리다이렉트
      };
    
      return (
        <div className="create-post-page">
          <h1>Create New Post</h1>
          <form className="post-form" onSubmit={handleAddPost}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newPost.title}
              onChange={handleInputChange}
            />
            <textarea
              name="content"
              placeholder="Content"
              value={newPost.content}
              onChange={handleInputChange}
            />
            {newPost.images.map((image, index) => (
              <div key={index}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                />
                {image && <img src={image} alt={`Preview ${index}`} width="100" />}
              </div>
            ))}
            <button type="submit">Add Post</button>
          </form>
        </div>
      );
    }