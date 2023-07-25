import React from 'react'
import { Link } from 'react-router-dom'

const CreateButton = () => {
  return (
    <div className='btn-container'>
        <Link to="/create" className="create-post-button">Create
        </Link>
    </div>
  )
}

export default CreateButton