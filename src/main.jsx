import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import SidePanel2 from './SidePanel2.jsx'
import './index.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const created = ({gl}) => {
    gl.setClearColor('#000000', 1)
}


const Main = () => {
    const [closestParcel, setClosestParcel] = useState(null);

    return (
        <>  
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <Canvas style={{ width: '100%', height: '100%' }} onCreated={created}>
                        <Experience setClosestParcel={setClosestParcel}/>
                    </Canvas>
                </div>
                <Theme appearance="dark" accentColor="mint" grayColor="sage" radius="small" panelBackground='translucent'>
                    <SidePanel2 closestParcel={closestParcel}/>
                </Theme>
            </div>
        </>
    );
}

root.render(<Main />) 
