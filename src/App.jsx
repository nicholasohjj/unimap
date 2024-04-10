import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {fetchMajors} from './services/service'

function App() {
  const [majors, setMajors] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetchMajors()
      .then((data) => {
        console.log(data)
        setMajors(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  , [])

  return (
    <>
    {majors.length > 0 ? (
      <div className="App">
        <header className="App-header">
          <img src={reactLogo} className="App-logo" alt="logo" />
          <img src={viteLogo} className="Vite-logo" alt="logo" />
          <p>
            Edit <code>App.jsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={() => setCount(count + 1)}>
            count is: {count}
          </button>
          <ul>
            {majors.map((major) => (
              <li key={major.major_id}>{major.major_name}</li>
            ))}
          </ul>
        </header>
      </div>
    ) : (
      <div>Loading...</div>
    )}
    </>
  )
}

export default App
