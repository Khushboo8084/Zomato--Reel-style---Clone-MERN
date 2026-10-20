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

const Home = () => {
  // State to store fetched videos from API
  const [videos, setVideos] = useState([]);
  const [savedIds, setSavedIds] = useState(() => getSavedVideoIds());
  
  // Ref to store video element references for IntersectionObserver
  const videoRefs = useRef(new Map());

  // Fetch videos from backend API when component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/food", { withCredentials: true });
        setVideos(response.data.foodItems || []);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchVideos();
  }, []);

  


  const toggleSavedVideo = (videoId) => {
    const currentSaved = getSavedVideoIds();
    const updatedSaved = currentSaved.includes(videoId)
      ? currentSaved.filter((id) => id !== videoId)
      : [...currentSaved, videoId];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSaved));
    setSavedIds(updatedSaved);
  };

  async function LikeVideo(item) {
  const response = await axios.post(
    "http://localhost:3000/api/food/like",
    { foodId: item._id },
    { withCredentials: true }
  );

  if (response.data.like) {
    

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, likeCount: v.likeCount  + 1} : v))
          
  } else {
    

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, likeCount: v.likeCount - 1   }
          : v
      )
    );
  }
}

async function bookmarkVideo(item) {
  const response = await axios.post(
    "http://localhost:3000/api/food/save",
    { foodId: item._id },
    { withCredentials: true }
  );

  if (response.data.save) {
    

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, savesCount: (v.savesCount ?? 0) + 1 }
          : v
      )
    );
  } else {
    

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 0) - 1) }
          : v
      )
    );
  }
}

  // Set up IntersectionObserver to play/pause videos based on visibility
  useEffect(() => {
    // Create observer that triggers when video enters/leaves viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            // Play video when it becomes visible
            video.play();
          } else {
            // Pause video when it's no longer visible
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of video is visible
    );

    // Observe all video elements currently in the DOM
    videoRefs.current.forEach((video) => {
      observer.observe(video);
    });

    // Cleanup: unobserve all videos and disconnect observer
    return () => {
      videoRefs.current.forEach((video) => {
        observer.unobserve(video);
      });
      observer.disconnect();
    };
  }, [videos]); // Re-run when videos change

  return (
    <main className="home-feed">
      {videos.map((video) => (
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
              <p className="reel-title">{video.name}</p>
              <p className="reel-description">{video.description}</p>
            </div>
            <div className="reel-actions">
              <div className="reel-action-item">
                <button  onClick={() => LikeVideo(video)} className="reel-icon-btn" aria-label="Like video">
                  <ActionIcon name="like" />
                </button>
                <span className="reel-action-count">{video.likeCount}</span>
              </div>
              <div className="reel-action-item">
                <button
                  type="button"
                  className={`reel-icon-btn ${savedIds.includes(video._id) ? "is-saved" : ""}`}
                  aria-label={savedIds.includes(video._id) ? "Remove from saved" : "Save video"}
                  onClick={() => bookmarkVideo(video)}
                >
                  <ActionIcon name="save" />
                </button>
               <span className="reel-action-count">
  {video.savesCount ?? 0}
</span>
              </div>
              <div className="reel-action-item">
                <button type="button" className="reel-icon-btn" aria-label="Comments">
                  <ActionIcon name="comment" />
                </button>
                <span className="reel-action-count">Comments</span>
              </div>
            </div>
            <Link className="reel-button" to={`/food-partner/${video.foodPartner}`}>
              Visit Store
            </Link>
          </div>
        </section>
      ))}
      <footer className="bottom-nav">
        <Link className="nav-item" to="/">
          <ActionIcon name="home" />
          <span>Home</span>
        </Link>
        <Link className="nav-item" to="/saved">
          <ActionIcon name="save" />
          <span>Saved</span>
        </Link>
      </footer>
    </main>
  );
};

export default Home;