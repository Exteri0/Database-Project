import Navbar from '../components/Navbar'
import '../styles/homepage.css'
import libraryImg from '../assets/library.png'
import bshelf from '../assets/Bookshelf Icon.png'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div className="home-container">
            <Navbar />
            <div className="hero-section">
                <div className="text-cta">
                    <div>
                        <img className="logo" src={bshelf} />
                        <span>BookShelf:</span>
                    </div>
                    <span>The World of books from</span>
                    <span style={{ color: '#4caf4f' }}>
                        3 different libraries
                    </span>
                    <Link to={'login'} className="login-cta">
                        <span>Login</span>
                    </Link>
                </div>

                <img className="library-img" src={libraryImg} />
            </div>
            <div id="libraries-section">
                <h3>Our Libraries</h3>
                <div className="library-cards"></div>
            </div>
            <div id="whyus-section"></div>
            <div className="cta"></div>
        </div>
    )
}
