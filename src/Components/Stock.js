import React from 'react'
import Navbar from './Navbar'

export default function Stock(props) {
  return (
    <div>
      <Navbar name={props.name} />
      Stock
    </div>
  )
}
