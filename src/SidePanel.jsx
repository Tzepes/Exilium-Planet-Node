import './sidePanel.css'
import { useState } from 'react'
import { Text, Button } from '@radix-ui/themes';
import * as Tabs from '@radix-ui/react-tabs';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {handleConnect, wallet} from './utils/metamaskConnect'

function SidePanel({closestParcel}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [parcel, setParcel] = useState({
        owner: 'Dummy name',
        metamaskAddress: wallet.accounts[0],
        longitude: '40.712776',
        latitude: '-74.005974', 
        ethValue: '0.05',
      });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    function handleBuyParcel() {
        if (!wallet.accounts || wallet.accounts.length === 0) {
          alert('Please connect your wallet first.');
          return;
        }
        
        closestParcel.userName = wallet.accounts[0];
        closestParcel.ownerEthAddress = wallet.accounts[0];
      
        // TODO: Implement the logic to transfer the ether from the user's wallet to the contract
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
                        <Tabs.Trigger value="tab2" className='TabsTrigger'><h4>Clicked Parcel</h4></Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="tab1">
                    {wallet.accounts && wallet.accounts.length > 0 ? (
                        <>
                        <Text as="h2">My Parcel Information</Text>
                        <Text as="p"><strong>Name:</strong> {parcel.owner}</Text>
                        <Text as="p"><strong>Ethereum Address:</strong> {wallet.accounts[0]}</Text>
                        <Text as="p"><strong>Location:</strong> {parcel.longitude}, {parcel.latitude}</Text>
                        <Text as="p"><strong>Ether Value:</strong> {parcel.ethValue}</Text>
                        </>
                    ) : (
                        <>
                        <Text as="h3">Please connect your MetaMask account.</Text>
                        <Button onClick={handleConnect}>Connect to MetaMask</Button>
                        </>
                    )}
                    </Tabs.Content>
                    <Tabs.Content value="tab2">
                        {closestParcel ? (
                            <>
                                <Text as="h2">Parcel Information</Text>
                                <Text as="p"><strong>Owner:</strong> {closestParcel.userName}</Text>
                                <Text as="p"><strong>Parcel ID:</strong> {closestParcel.id}</Text>
                                <Text as="p"><strong>Ethereum Address:</strong> {closestParcel.ownerEthAddress}</Text>
                                <Text as="p"><strong>Location:</strong> {closestParcel.longitude}, {closestParcel.latitude}</Text>
                                <Text as="p"><strong>Ether Value:</strong> {closestParcel.price}</Text>
                                {!closestParcel.ownerEthAddress && (
                                    <>
                                        <Text as="h2">This parcel has no owner</Text>
                                        <Button onClick={handleBuyParcel}>Buy for {closestParcel.price}</Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <Text as="h2">Click on a parcel to retrieve its information</Text>
                        )}
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    )
}   

export default SidePanel