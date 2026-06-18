import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

const BACKEND_URL = 'https://vibeplay-tsju.onrender.com';


const trailersData = [
  { id: 1, title: "John Wick Chapter 4", img: "/img/john-wick(2).png", video: "https://res.cloudinary.com/def0wyj1h/video/upload/q_auto/f_auto/v1781105373/jhon_stsuwp.mp4" },
  { id: 2, title: "Spider-man Brand New Day", img: "/img/Spider.jpg", video: "https://res.cloudinary.com/def0wyj1h/video/upload/q_auto/f_auto/v1781103859/spider_z5v1mq.mp4" },
  { id: 3, title: "Deadpool & Wolverine", img: "/img/Dead and wol.jpg", video: "https://res.cloudinary.com/def0wyj1h/video/upload/q_auto/f_auto/v1781105362/dead_pvhjgl.mp4" },
  { id: 4, title: "Demon Slayer: Infinity Castle", img: "img/demon.jpg", video: "https://res.cloudinary.com/def0wyj1h/video/upload/q_auto/f_auto/v1781107163/demon_ggkcy9.mp4" },
  { id: 5, title: "The Punisher: One Last Kill", img: "img/punisher.jpg", video: "https://res.cloudinary.com/def0wyj1h/video/upload/q_auto/f_auto/v1781106737/puni_a6d86k.mp4" },
  { id: 6, title: "Solo Leveling", img: "img/solo.png", video: "" },
  { id: 7, title: "Avengers Endgame", img: "img/avend.jpg", video: "" },
  { id: 8, title: "Jujutsu Kaisen", img: "img/jjk.jpg", video: "" },
  { id: 9, title: "Loki", img: "img/loki.jpg", video: "" },
  { id: 10, title: "One Piece", img: "img/one.jpg", video: "" },
];

function App() {
  return (
    <Router>
      <VibePlayApp />
    </Router>
  );
}

function VibePlayApp() {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 2. PERSISTENT AUTHENTICATION STATE
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('vibePlayUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [wishlist, setWishlist] = useState([]);

  // 3. EFFECT TO AUTO-LOAD WISHLIST FROM BACKEND
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser || !currentUser.token) {
        setWishlist([]);
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/wishlist`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setWishlist(data);
        }
      } catch (error) {
        console.error("Failed to load wishlist from server:", error);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  // 4. SYNCED WISHLIST ACTIONS VIA API
  const handleWishlistToggle = async (video) => {
    if (!currentUser) {
      navigate('/login'); 
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          id: video.id,
          title: video.title,
          img: video.img,
          video: video.video
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist); 
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  // 5. SESSION EXPIRATION LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('vibePlayUser');
    setCurrentUser(null);
    setWishlist([]);
    navigate('/');
  };

  return (
    <div className="app-container">
      {/*NAVBAR*/}
      <nav className="navbar">
        <div className="nav-header">
          <Link to="/" className="site-name">VibePlay</Link>
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? '✖' : '☰'}
          </button>
        </div>

        <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wish-list</Link>
          </div>

          <div className="nav-right">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-icon-btn">🔍</button>
            </div>

            {!currentUser ? (
              <div className="auth-buttons">
                <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="nav-link-box" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </div>
            ) : (
              <div className="user-profile">
                <div className="user-icon">👤 {currentUser.name}</div>
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

{/* --- FULLSCREEN VIDEO PLAYER --- */}
      {activeVideo && (
        <div className="video-modal">
          <div className="video-modal-content" style={{ height: '70vh', backgroundColor: '#000' }}>
            <button className="close-video-btn" onClick={() => setActiveVideo(null)}>Close ✖</button>
            
            {/* Native HTML5 Video Element */}
            <video 
              src={activeVideo.video} 
              controls 
              autoPlay 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            >
              Your browser does not support HTML video.
            </video>

          </div>
        </div>
      )}

      {/*PAGE ROUTING*/}
      <div className="main-content-wrapper">
        <Routes>
          {/* 1. HOME PAGE */}
          <Route path="/" element={
            <div className="home-page">
              {/* HERO SECTION */}
              <div className="hero-section" style={{ backgroundImage: `url('/img/john-wick(2).png')` }}>
                <div className="hero-content">
                  <p className="hero-subtitle">VIBEPLAY OFFICIAL: NEW MOVIE</p>
                  <h1 className="hero-title">JOHN - WICK CHAPTER 4</h1>
                  <div className="hero-buttons">
                    <button className="btn-watch" onClick={() => setActiveVideo(trailersData[0])}>
                      ▶ Watch Now
                    </button>
                    <button className="btn-wishlist" onClick={() => handleWishlistToggle(trailersData[0])}>
                      {wishlist.find(v => v.id === trailersData[0].id) ? '✓ Saved' : '+ Wishlist'}
                    </button>
                  </div>
                </div>
              </div>

              {/* TRAILERS SECTION */}
              <div className="content-section">
                <h2>Latest Movies</h2>
                <div className="grid-container">
                  {trailersData
                    .filter((trailer) => 
                      trailer.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((trailer) => (
                    <div key={trailer.id} className="grid-card">
                      <div className="card-image-wrapper">
                        <img src={trailer.img} alt={trailer.title} className="card-image" />
                        <div className="card-hover-actions">
                          <button className="icon-btn play-icon" onClick={() => setActiveVideo(trailer)}>▶</button>
                          <button className="icon-btn plus-icon" onClick={() => handleWishlistToggle(trailer)}>
                            {wishlist.find(v => v.id === trailer.id) ? '✓' : '+'}
                          </button>
                        </div>
                      </div>
                      <div className="card-info">
                        <h3>{trailer.title}</h3>
                      </div>
                    </div>
                  ))}

                  {trailersData.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="empty-state" style={{ gridColumn: '1 / -1', padding: '20px 0' }}>
                      No trailers found matching "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          } />

          {/* 2. WISHLIST PAGE */}
          <Route path="/wishlist" element={
            <div className="content-section page-padding">
              <h2>Your Wish-list</h2>
              {wishlist.length === 0 ? (
                <p className="empty-state">Login and click on the + icon to wishlist a video</p>
              ) : (
                <div className="grid-container">
                  {wishlist.map((trailer) => (
                    <div key={trailer.id} className="grid-card">
                      <div className="card-image-wrapper">
                        <img src={trailer.img} alt={trailer.title} className="card-image" />
                        <div className="card-hover-actions">
                          <button className="icon-btn play-icon" onClick={() => setActiveVideo(trailer)}>▶</button>
                          <button className="icon-btn plus-icon" onClick={() => handleWishlistToggle(trailer)}>✓</button>
                        </div>
                      </div>
                      <div className="card-info">
                        <h3>{trailer.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          } />

          {/* AUTH PAGES */}
          <Route path="/login" element={<AuthPage type="login" setUser={setCurrentUser} />} />
          <Route path="/signup" element={<AuthPage type="signup" setUser={setCurrentUser} />} />
        </Routes>
      </div>

      <footer className="site-footer">
        <p>&copy; VibePlay. All Rights Reserved.</p>
      </footer>
    </div>
  );
}


function AuthPage({ type, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const endpoint = type === 'signup' ? '/api/auth/signup' : '/api/auth/login';

    try {
      // 6. ASYNCHRONOUS HTTP REQUEST
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Save token & info to keep session alive across page refreshes
        localStorage.setItem('vibePlayUser', JSON.stringify(data));
        setUser(data);
        navigate('/'); 
      } else {
        // Capture specific backend error responses (e.g. "User already exists")
        setErrorMessage(data.message || 'Authentication failed');
      }
    } catch (error) {
      setErrorMessage('Cannot connect to the server. Is your backend running?');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Unlock a world of endless entertainment</h2>
        <p>Login to Discover, Stream, and Enjoy!</p>
      </div>
      <div className="auth-card">
        <h2>{type === 'login' ? 'Sign in' : 'Sign up'}</h2>
        
        {errorMessage && (
          <p style={{ color: '#e50914', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
            {errorMessage}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div className="input-group">
              <label>Name</label>
              <input type="text" required placeholder="John Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" required placeholder="example.email@gmail.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required placeholder="Enter at least 8+ characters" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="auth-submit-btn">{type === 'login' ? 'Sign in' : 'Sign up'}</button>
        </form>
        <p className="auth-switch">
          {type === 'login' ? "New to VibePlay? " : "Already have an account? "}
          <Link to={type === 'login' ? '/signup' : '/login'}>{type === 'login' ? 'Signup now' : 'Login now'}</Link>
        </p>
      </div>
    </div>
  );
}

export default App;
