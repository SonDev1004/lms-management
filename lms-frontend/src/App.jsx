<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
=======
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutHome from 'layouts/home/LayoutHome';
import Login from 'pages/home/Login';
import Register from 'pages/home/Register';
import LayoutStudent from 'layouts/student/LayoutStudent';
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

function App() {
  const [count, setCount] = useState(0)

<<<<<<< Updated upstream
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
=======
                {/* Student Route */}
                <Route path='student' element={<LayoutStudent />}>

                </Route>

                {/* Teacher Route */}
                <Route path='teacher'>

                </Route>

                {/* Staff Route */}
                <Route path='staff'>

                </Route>

                {/* Admin Route */}
                <Route path='admin'>

                </Route>

            </Routes>
        </BrowserRouter >
    );
>>>>>>> Stashed changes
}

export default App
