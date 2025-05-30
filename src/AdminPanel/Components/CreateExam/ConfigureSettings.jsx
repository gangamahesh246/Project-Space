import React from 'react'
import { useSelector } from 'react-redux'

const ConfigureSettings = () => {
    const data = useSelector((state) => state)
    console.log(data)
  return (
    <div>
      <h1>Configure Settings</h1>
    </div>
  )
}

export default ConfigureSettings
