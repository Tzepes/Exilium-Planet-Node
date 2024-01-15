import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const created = ({gl}) => {
    gl.setClearColor('#000000', 1)
}

root.render(
  <>
      <Canvas
          onCreated={ created }>
          <Experience/>
      </Canvas>
  </>
) 
