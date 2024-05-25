import Navbar from '../components/Navbar'
import '../styles/homepage.css'
import libraryImg from '../assets/library.png'
import bshelf from '../assets/Bookshelf Icon.png'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LibraryCard from '../components/LibraryCard'

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
                <h3>Our Libraries</h3>
                <div className="library-cards">
                    {libraries.map((lib) => (
                        <LibraryCard
                            key={lib.libraryid}
                            name={lib.libraryname}
                        />
                    ))}
                </div>
            </div>
            <div id="whyus-section"></div>
            <div className="cta"></div>
        </div>
    )
}
