import '../styles/components/bookdash.css'
import searchIcon from '../assets/search-normal.png'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import handIcon from '../assets/image 22.png'
import plusIcon from '../assets/+.png'
import minusIcon from '../assets/minus.png'

export default function BookDash() {
    const { libId } = useParams()

    interface IBook {
        isbn: string
        book_name: string
        book_genre: string
        number_copies: string
        author_name: string
        authorSSN?:
    }

    const [targetISBN, setTargetISBN] = useState('')
    const [booksData, setBooksData] = useState<IBook[]>([
        {
            isbn: '',
            book_name: '',
            book_genre: '',
            number_copies: '',
            author_name: '',
        },
    ])
    const[newBook,setNewBook] = useState<IBook>({
            isbn: '',
            book_name: '',
            book_genre: '',
            number_copies: '',
            author_name: '',
    })

    const navigate = useNavigate()

    useState(async () => {
        const response = await fetch(
            `http://localhost:3000/testapi/v1/libraries/${libId}/books`
        )
        const data = await response.json()
        setBooksData(data as IBook[])
    })

    async function BookPlusPlus(isbn: string) {
        const data = {
            ISBN_Entry: parseInt(isbn),
            LibraryIDEntry: libId,
            numberOfCopiesEntry: 1,
        }
        await fetch(
            'http://localhost:3000/testapi/v1/libraries/BookCopyUpdate',
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        )
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    async function handleSubmit(e:React.FormEvent<HTMLButtonElement>){
        const dataToBeSent = {
            ISBN_Entry:,
            bookNameEntry:,
            bookGenreEntry:,
            libraryIDEntry:libId
        }
    }


    return (
        <div className="book-dash">
            <div className="search-container">
                <div className="search-box">
                    <input
                        placeholder="Search for ISBN"
                        onChange={(e) => setTargetISBN(e.target.value)}
                        value={targetISBN}
                    ></input>
                    <img src={searchIcon} />
                </div>
            </div>
            <div className="books-table">
                <h2>Library Books</h2>
                <div className="names">
                    <span>ISBN</span>
                    <span>Book Name</span>
                    <span>Author</span>
                    <span>#Copies</span>
                </div>
                <main>
                    {booksData.map((book) => (
                        <div className="book-container" key={book.isbn}>
                            <span>{book.isbn}</span>
                            <span>{book.book_name}</span>
                            <span>{book.author_name}</span>
                            <span>{book.number_copies}</span>
                            <div className="buttons">
                                <img
                                    src={handIcon}
                                    onClick={() => navigate('/borrow')}
                                />
                                <img
                                    src={minusIcon}
                                    onClick={() => BookPlusPlus(book.isbn)}
                                />
                                <img
                                    src={plusIcon}
                                    onClick={() => BookPlusPlus(book.isbn)}
                                />
                            </div>
                        </div>
                    ))}
                </main>
                <h2>Add New Book</h2>
                <div className="new-names">
                    <input placeholder="ISBN"></input>
                    <input placeholder="Book Name"></input>
                    <input placeholder="Author"></input>
                    <input placeholder="#Copies"></input>
                    <button className="submit-btn">Add</button>
                </div>
            </div>
        </div>
    )
}
