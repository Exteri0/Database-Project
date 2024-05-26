import '../styles/Login.css'
import pic from '../assets/Lib green.png'
import logo from '../assets/Bookshelf Icon.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [err, setErr] = useState([0, ''])
    const [info, setInfo] = useState({
        key: '',
        ssn: '',
        name: '',
    })

    const navigate = useNavigate()
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInfo({
            ...info,
            [e.target.name]: [e.target.value],
        })
    }

    async function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()
        console.log('Im submitted with the following data')
        const data = {
            librarianSSNEntry: parseInt(info.ssn, 10),
            librarianNameEntry: String(info.name),
            LibraryIDEntry: parseInt(info.key, 10),
        }
        console.log(data)
        const res = await fetch(
            'http://localhost:3000/testapi/v1/libraries/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        )
            .then((res) => res.json())
            .then((data) => data)

        if (res.response != 'Rejected') navigate(`/dashboard/${res.response}/1`)
        else setErr([1, 'WRONG CREDENTIALS'])
    }

    return (
        <div className="login-container">
            <div className="navbar">
                <img src={logo} alt="" />
            </div>
            <div className="form-pic">
                <div className="form">
                    <h2>Login to your librarian account</h2>
                    <label>SSN</label>
                    <input
                        value={info.ssn}
                        name="ssn"
                        onChange={(e) => handleChange(e)}
                    />
                    <label>Name</label>
                    <input
                        value={info.name}
                        name="name"
                        onChange={(e) => handleChange(e)}
                    />
                    <label>Library Key</label>
                    <input
                        value={info.key}
                        name="key"
                        onChange={(e) => handleChange(e)}
                    />
                    <button onClick={(e) => handleSubmit(e)}>Log in</button>
                    <span className="error">{err[1]}</span>
                </div>
                <img src={pic} />
            </div>
        </div>
    )
}
