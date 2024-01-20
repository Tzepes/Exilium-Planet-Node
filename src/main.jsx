import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import SidePanel from './SidePanel.jsx'
import './index.css'
import { Theme } from '@radix-ui/themes'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const created = ({gl}) => {
    gl.setClearColor('#000000', 1)
}

root.render(
  <>  
    <Theme appearance="dark" accentColor="mint" grayColor="sage" radius="small" panelBackground='translucent '>
        <SidePanel/>
    </Theme>
    <Canvas
        onCreated={ created }>
        <Experience/>
    </Canvas>
  </>
) 
