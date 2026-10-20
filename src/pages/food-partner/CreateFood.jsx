
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CreateFood.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
  // ADDED: state for the video file name and preview
  const [videoFileName, setVideoFileName] = useState('No file chosen');
  // ADDED: state for the preview URL
  const [videoPreview, setVideoPreview] = useState(null);
  // ADDED: state for the selected video file
  const [videoFile, setVideoFile] = useState(null);
  // ADDED: state for the name input
  const [name, setName] = useState('');
  // ADDED: state for the description input
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // MODIFIED: also store the selected file in videoFile
  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setVideoFileName(file.name);
      setVideoPreview(URL.createObjectURL(file));
      setVideoFile(file);
    } else {
      setVideoFileName('No file chosen');
      setVideoPreview(null);
      setVideoFile(null);
    }
  };

  // ADDED: submit the form data with axios
  const onSubmit = async (e) => {
    e.preventDefault();

   

    if (!videoFile) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('video', videoFile);

  const response  =  await axios
      .post("http://localhost:3000/api/food", formData, { withCredentials: true })
      .then((response) => {
        console.log('Video created successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error creating video:', error);
      });
       navigate("/");
      
  };

  const handleVideoChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoRemove = () => {
    setVideoFileName('No file chosen');
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <div className="create-food-header">
          <p className="create-food-eyebrow">Food partner</p>
          <h1>Create a food video</h1>
          <p className="create-food-copy">
            Add a short video, give it a name, and describe what makes it special.
          </p>
        </div>

        <form className="create-food-form" onSubmit={onSubmit}>
          <div className="form-field">
            <label className="field-label" htmlFor="video">
              Video
            </label>
            {videoPreview ? (
              <div className="video-preview-wrap">
                <video className="video-preview" controls src={videoPreview} />
                <div className="video-preview-meta">
                  <p className="video-preview-name">Preview: {videoFileName}</p>
                  <div className="video-preview-actions">
                    <button type="button" className="video-btn video-btn-change" onClick={handleVideoChangeClick}>
                      Change
                    </button>
                    <button type="button" className="video-btn video-btn-remove" onClick={handleVideoRemove}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <label className="video-upload" htmlFor="video">
              <span className="upload-icon">+</span>
              <span className="upload-text">Choose a video file</span>
              <span className="upload-hint">{videoFileName}</span>
              <input
                id="video"
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={handleVideoChange}
              />
            </label>
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Spicy Street Noodles"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows="5"
              placeholder="Tell viewers what to expect from this dish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn create-food-btn">
            Publish video
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;