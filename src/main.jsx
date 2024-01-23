import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import SidePanel from './SidePanel.jsx'
import './index.css'
// import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const created = ({gl}) => {
    gl.setClearColor('#000000', 1)
}

const Main = () => {
    const [closestParcel, setClosestParcel] = useState(null);

    return (
        <>  
            <Theme appearance="dark" accentColor="mint" grayColor="sage" radius="small" panelBackground='translucent '>
                <SidePanel closestParcel={closestParcel}/>
            </Theme>
            <Canvas
                onCreated={ created }>
                <Experience setClosestParcel={setClosestParcel}/>
            </Canvas>
        </>
    );
}

root.render(<Main />) 
