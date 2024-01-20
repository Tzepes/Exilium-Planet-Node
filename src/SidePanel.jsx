import './sidePanel.css'
import { useState } from 'react'
import { Text, Button } from '@radix-ui/themes';
import * as Tabs from '@radix-ui/react-tabs';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

function SidePanel({ parcel }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className={`app ${isMenuOpen ? 'menu-open' : ''}`}>
            <button className="menu-toggle" onClick={toggleMenu}>
                <HamburgerMenuIcon color='#12A594'/>
            </button>
            <div className={`menu ${isMenuOpen ? '' : 'menu-close'}`}>
                <Tabs.Root activationMode='true' defaultValue="tab1" className="TabsRoot">
                    <Tabs.List className='TabsList'>
                        <Tabs.Trigger value="tab1" className='TabsTrigger'><h4>My Account</h4></Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="tab1">
                    {parcel && parcel.ethereumAdress ? (
                        parcel.owner === parcel.ethereumAdress ? (
                        <>
                            <Text as="h2">My Parcel Information</Text>
                            <Text as="p"><strong>Owner:</strong> {parcel.userName}</Text>
                            <Text as="p"><strong>Ethereum Address:</strong> {parcel.ethereumAdress}</Text>
                            <Text as="p"><strong>Location:</strong> {parcel.location.longitude}, {parcel.location.latitude}</Text>
                        </>
                        ) : (
                        <>
                            <Text as="h3">You don't own a parcel. You must buy a parcel.</Text>
                            <Button>Buy a parcel</Button>
                        </>
                        )
                    ) : (
                        <>
                        <Text as="h3">Please connect your MetaMask account.</Text>
                        <Button>Connect to MetaMask</Button>
                        </>
                    )}
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    )
}   

export default SidePanel