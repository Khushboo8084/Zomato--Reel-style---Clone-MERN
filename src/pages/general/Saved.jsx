import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const STORAGE_KEY = "savedFoodVideoIds";

const getSavedVideoIds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const ActionIcon = ({ name }) => {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "like":
      return (
        <svg {...commonProps}>
          <path d="M12 20.25s-7.5-4.35-9.5-8.13C.92 9.55 2.25 4.5 6.7 4.5c2.25 0 3.47 1.18 4.3 2.5.82-1.32 2.05-2.5 4.3-2.5 4.45 0 5.78 5.05 4.2 7.62-2 3.78-9.5 8.13-9.5 8.13Z" />
        </svg>
      );
    case "save":
      return (
        <svg {...commonProps}>
          <path d="M6.75 4.5h10.5a1.5 1.5 0 0 1 1.5 1.5v13.35L12 15.75l-6.75 3.6V6a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
      );
    case "comment":
      return (
        <svg {...commonProps}>
          <path d="M20.25 12a7.5 7.5 0 0 1-10.49 6.84L4.5 20.25l1.04-5.02A7.5 7.5 0 1 1 20.25 12Z" />
        </svg>
      );
    case "home":
      return (
        <svg {...commonProps}>
          <path d="M4.5 10.5 12 4.5l7.5 6v8.25a1.5 1.5 0 0 1-1.5 1.5h-3.75v-6h-4.5v6H6a1.5 1.5 0 0 1-1.5-1.5V10.5Z" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M6.75 4.5h10.5a1.5 1.5 0 0 1 1.5 1.5v13.35L12 15.75l-6.75 3.6V6a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
      );
  }
};

const Saved = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [savedIds, setSavedIds] = useState(() => getSavedVideoIds());
  const videoRefs = useRef(new Map());

 useEffect(() => {
  const fetchSavedFoods = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/food/save",
        { withCredentials: true }
      );

      const savedFoods = response.data.savedFoods.map((item) => ({
        _id: item.food._id,
        video: item.food.video,
        name: item.food.name,
        foodPartner: item.food.foodPartner,
        description: item.food.description,
        likeCount: item.food.likeCount,
        savesCount: item.food.savesCount,
        commentsCount: item.food.commentsCount,
      }));

      setAllVideos(savedFoods);
    } catch (error) {
      console.error("Failed to fetch saved videos:", error);
    }
  };

  fetchSavedFoods();
}, []);

  useEffect(() => {
    const handleStorage = () => setSavedIds(getSavedVideoIds());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const savedVideos = allVideos.filter((video) => savedIds.includes(video._id));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        observer.unobserve(video);
      });
      observer.disconnect();
    };
  }, [savedVideos]);

  return (
    <main className="home-feed saved-feed">
      {savedVideos.length === 0 ? (
        <div className="empty-saved-state">
          <p>No saved videos yet.</p>
        </div>
      ) : (
        savedVideos.map((video) => (
          <section className="reel-card" key={video._id}>
            <video
              ref={(el) => {
                if (el) {
                  videoRefs.current.set(video._id, el);
                } else {
                  videoRefs.current.delete(video._id);
                }
              }}
              className="reel-video"
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={video.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="reel-overlay">
              <div className="reel-info">
                <p className="reel-title">Saved: {video.name}</p>
                <p className="reel-description">{video.description}</p>
              </div>
              <div className="reel-actions">
                <div className="reel-action-item">
                  <button type="button" className="reel-icon-btn" aria-label="Like video">
                    <ActionIcon name="like" />
                  </button>
                  <span className="reel-action-count">23</span>
                </div>
                <div className="reel-action-item">
                  <button type="button" className="reel-icon-btn" aria-label="Saved video">
                    <ActionIcon name="save" />
                  </button>
                  <span className="reel-action-count">Saved</span>
                </div>
                <div className="reel-action-item">
                  <button type="button" className="reel-icon-btn" aria-label="Comments">
                    <ActionIcon name="comment" />
                  </button>
                  <span className="reel-action-count">45</span>
                </div>
              </div>
              <Link className="reel-button" to={`/food-partner/${video.foodPartner}`}>
                Visit Store
              </Link>
            </div>
          </section>
        ))
      )}

      <footer className="bottom-nav">
        <Link className="nav-item" to="/">
          <ActionIcon name="home" />
          <span>Home</span>
        </Link>
        <Link className="nav-item active" to="/saved">
          <ActionIcon name="save" />
          <span>Saved</span>
        </Link>
      </footer>
    </main>
  );
};

export default Saved;
