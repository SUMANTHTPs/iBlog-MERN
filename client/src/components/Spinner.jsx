import React from 'react'
import {PropagateLoader} from 'react-spinners';

const Spinner = () => {
  return (
    <div className='load-spinner'>
        <PropagateLoader />
    </div>
  )
}

export default Spinner