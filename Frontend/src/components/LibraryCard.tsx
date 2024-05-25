import libraryImg from '../assets/OJ8XX60.jpg'
import '../styles/library-card.css'
import { ReactComponent as Arrow } from '../assets/arrow.svg'
export default function LibraryCard({ name }: { name: string }) {
    return (
        <section className="card-container">
            <img className="library-image" src={libraryImg} />
            <span>{name}</span>
            <a className="read-more">
                Readmore <Arrow />
            </a>
        </section>
    )
}
