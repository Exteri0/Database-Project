import '../styles/components/usersdash.css'
import searchIcon from '../assets/search-normal.png'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import editIcon from '../assets/editIcon.png'
import trashIcon from '../assets/Trash Can.png'

export default function UsersDash() {
    const { libId } = useParams()

    interface IUser {
        userid?: string
        name: string
        password?: string
        membershipstatus: string
        libraryid?: string
        count: string
    }

    // const [targetISBN, setTargetISBN] = useState('')
    const [searchTarget, setSearchTarget] = useState('')
    const [usersData, setUsersData] = useState<IUser[]>([
        {
            userid: '',
            name: '',
            membershipstatus: '',
            count: '',
        },
    ])
    const [newUser, setNewUser] = useState<IUser>({
        name: '',
        password: '',
        membershipstatus: '',
        libraryid: '',
        count: '',
    })

    // const navigate = useNavigate()

    useState(async () => {
        const response = await fetch(
            `http://localhost:3000/testapi/v1/users/${libId}/library`
        )
        const data = await response.json()
        setUsersData(data as IUser[])
    })

    // async function BookPlusPlus(isbn: string) {
    //     const data = {
    //         ISBN_Entry: parseInt(isbn),
    //         LibraryIDEntry: libId,
    //         numberOfCopiesEntry: 1,
    //     }
    //     await fetch(
    //         'http://localhost:3000/testapi/v1/libraries/BookCopyUpdate',
    //         {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(data),
    //         }
    //     )
    //         .then((res) => res.json())
    //         .then((data) => console.log(data))
    // }

    async function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()
        const dataToBeSent = {
            name: String(newUser.name),
            membershipStatus: String(newUser.membershipstatus),
            libraryID: parseInt(libId as unknown as string),
            password: String(newUser.password),
        }
        console.log('this data is submitted')
        console.log(dataToBeSent)
        await fetch('http://localhost:3000/testapi/v1/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToBeSent),
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewUser({
            ...newUser,
            [e.target.name]: [e.target.value],
        })
    }

    return (
        <div className="users-dash">
            <div className="search-container">
                <div className="search-box">
                    <input
                        placeholder="Search for User"
                        onChange={(e) => setSearchTarget(e.target.value)}
                        value={searchTarget}
                    ></input>
                    <img src={searchIcon} />
                </div>
            </div>
            <div className="users-table">
                <h2>Library Users</h2>
                <div className="names">
                    <span>ID</span>
                    <span>Name</span>
                    <span>Membership</span>
                    <span>#Books Borrowed</span>
                </div>
                <main>
                    {usersData
                        .filter((user) =>
                            user.name
                                .toLowerCase()
                                .includes(searchTarget.toLowerCase())
                        )
                        .map((user) => (
                            <div className="user-container" key={user.userid}>
                                <span>{user.userid}</span>
                                <span>{user.name}</span>
                                <span>{user.membershipstatus}</span>
                                <span>{user.count}</span>
                            </div>
                        ))}
                </main>
                <h2>Add New User</h2>
                <div className="new-names">
                    <input
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => handleChange(e)}
                        name="name"
                    />
                    <input
                        placeholder="User Membership"
                        value={newUser.membershipstatus}
                        onChange={(e) => handleChange(e)}
                        name="membershipstatus"
                    />
                    <input
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => handleChange(e)}
                        name="password"
                    />
                    <button
                        className="submit-btn"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}
