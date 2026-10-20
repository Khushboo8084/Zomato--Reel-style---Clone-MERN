import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])

    useEffect(() => {
  axios
    .get(`http://localhost:3000/api/food-partner/${id}`, {
      withCredentials: true,
    })
    .then((response) => {
      setProfile(response.data.foodPartner);
      setVideos(response.data.foodPartner.foodItems)
    })
}, [id]);

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-top">
          <img
  className="profile-avatar"
  src="https://images.unsplash.com/photo-1777466139924-47c1ad8fbd9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI3fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D"
  alt="Profile"
/>
          <div className="profile-pill-group">
            <span className="profile-pill">{profile?.name}</span>
            <span className="profile-pill">{profile?.address}</span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{profile?.totalMeals}</span>
            <span className="profile-stat-label">total meals</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{profile?.customerServed}</span>
            <span className="profile-stat-label">customer served</span>
          </div>
        </div>

       
  
    <div className="profile-video-grid">
  {videos.map((video) => (
    <video
      key={video._id}
      className="profile-video-cell"
      muted
      preload="metadata"
      
    >
      <source src={video.video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ))}
</div>
  

      </section>
    </main>
  );
};

export default Profile;