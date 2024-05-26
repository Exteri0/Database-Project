import Navbar from '../components/Navbar'
import '../styles/homepage.css'
import libraryImg from '../assets/library.png'
import bshelf from '../assets/Bookshelf Icon.png'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LibraryCard from '../components/LibraryCard'
import Icon1 from '../assets/Icon.png'
import Icon2 from '../assets/Icon2.png'
import Icon3 from '../assets/Icon3.png'
import Arrow from '../assets/Down.svg?react'
import Footer from '../components/Footer'

export default function HomePage() {
    interface ILibrary {
        libraryid: number
        libraryname: string
        numberofbooks: number
        numberofusers: number
    }

    useEffect(() => {
        console.log('im in')
        fetch('http://localhost:3000/testapi/v1/libraries')
            .then((res) => res.json())
            .then((data: ILibrary[]) => {
                console.log('im inner in')
                console.log(data)
                setLibraries(data.slice(0, 3))
            })
    }, [])

    const [libraries, setLibraries] = useState<ILibrary[]>([
        {
            libraryid: 1,
            libraryname: 'Alex Library',
            numberofbooks: 19,
            numberofusers: 1,
        },
    ])

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
                <h1>Our Libraries</h1>
                <div className="library-cards">
                    {libraries.map((lib) => (
                        <LibraryCard
                            key={lib.libraryid}
                            name={lib.libraryname}
                        />
                    ))}
                </div>
            </div>
            <div id="whyus-section">
                <h1>Why Us?</h1>
                <div className="cards">
                    <section>
                        <img src={Icon1} />
                        <span className="title">
                            Members <br />
                            Management
                        </span>
                        <span className="details">
                            Easily manage the users borrowings
                        </span>
                    </section>
                    <section>
                        <img src={Icon2} />
                        <span className="title">
                            Updatable <br />
                            Books list
                        </span>
                        <span className="details">New books easily added</span>
                    </section>
                    <section>
                        <img src={Icon3} />
                        <span className="title">
                            Collaborative <br />
                            Environment
                        </span>
                        <span className="details">
                            Get to work alongside professionals
                        </span>
                    </section>
                </div>
            </div>
            <div className="cta">
                <span className="big-title">
                    What are you waiting for? <br />
                    Join us now!
                </span>
                <Link to={'login'} className="cta-cta">
                    Get Started <Arrow />
                </Link>
            </div>
            <Footer />
        </div>
    )
}
