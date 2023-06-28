import React from 'react'
import Navbar from './Navbar'

export default function Dashboard(props) {
  return (
    <div>
      <Navbar name={props.name} />
      Dashboard
    </div>
  )
}
