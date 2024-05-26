import libraryImg from '../assets/OJ8XX60.jpg'
import '../styles/components/library-card.css'
import Arrow from '../assets/arrow.svg?react'
export default function LibraryCard({ name }: { name: string }) {
    return (
        <section className="card-container">
            <img className="library-image" src={libraryImg} />
            <div className="card-info">
                <span>
                    {name} <br></br>
                </span>
                <a className="read-more" href="login">
                    Readmore <Arrow />
                </a>
            </div>
        </section>
    )
}
