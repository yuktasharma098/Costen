import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom';
function Logout() {

  const navigate = useNavigate()
  useEffect(() => {

    sessionStorage.clear()
    navigate('/login')
  }, [])
  return (
    <div>Logout</div>
  )
}

export default Logout