import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import './App.css'
import About from './pages/About'
import { UserState } from './context/UserContext'
import NewPost from './pages/NewPost'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'

const App = () => {
  return (
    <div className='main'>
      <UserState>
        <Routes>
          <Route path='/*' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route path='/create' element={<NewPost />} />
          <Route path='/post/:id' element={<PostDetail />} />
          <Route path='/edit/:id' element={<EditPost />} />
        </Routes>
      </UserState>
    </div>
  )
}

export default App