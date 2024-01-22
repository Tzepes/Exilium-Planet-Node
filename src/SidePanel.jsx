import './sidePanel.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Text, Button } from '@radix-ui/themes';
import * as Tabs from '@radix-ui/react-tabs';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {handleConnect, wallet} from './utils/metamaskConnect'

function SidePanel({closestParcel}) { // use useEffect() for closestParcel click so app no longer rerenders
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [metamaskConnection, setMetamaskConnection] = useState(false);
    const [ownsParcel, setOwnsParcel] = useState(false);
    const [parcel, setParcel] = useState({
        owner: 'Dummy name',
        metamaskAddress: wallet.accounts[0],
        longitude: '40.712776',
        latitude: '-74.005974', 
        ethValue: '0.05',
      });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log(ownsParcel);
    }

    async function connectToMetamask() {
        try {
            await handleConnect();
            setMetamaskConnection(true); 
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
    }

    
    const fetchownsParcel = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/parcels/${wallet.accounts[0]}`);
            if (response.status === 200 && Object.keys(response.data).length > 0) {
                setParcel(response.data);
                setOwnsParcel(true);
            } else {
                setOwnsParcel(false);
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        if (wallet.accounts[0]) {
            fetchownsParcel();
        }
    }, [wallet.accounts]);

    async function handleBuyParcel() {
        if (!wallet.accounts || wallet.accounts.length === 0) {
          alert('Please connect your wallet first.');
          return;
        }
        
        try {
            const response = await axios.put(`http://localhost:3000/api/parcels/${closestParcel._id}`, {
                ethereumAddress: wallet.accounts[0],
            });
            
            if (response.status === 200) {
                alert('Parcel bought successfully!');
                setParcel(response.data);
                fetchownsParcel();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
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
                        ownsParcel ? (
                            <>
                              <Text as="h2">My Parcel Information</Text>
                              <Text as="p"><strong>Name:</strong> {parcel.owner}</Text>
                              <Text as="p"><strong>Ethereum Address:</strong> {wallet.accounts[0]}</Text>
                              <Text as="p"><strong>Location:</strong> {parcel.longitude}, {parcel.latitude}</Text>
                              <Text as="p"><strong>Ether Value:</strong> {parcel.ethValue}</Text>
                            </>
                          ) : (
                            <>
                              <Text as="p"><strong>Ethereum Address:</strong> {wallet.accounts[0]}</Text>
                              <Text as="h3">You don't own a parcel, explore the planet and buy one now!</Text>
                            </>
                          )
                    ) : (
                        <>
                        <Text as="h3">Please connect your MetaMask account.</Text>
                        <Button onClick={connectToMetamask}>Connect to MetaMask</Button>
                        </>
                    )}
                    </Tabs.Content>
                    <Tabs.Content value="tab2">
                        <Text as="h2">Parcel Information</Text>
                        {closestParcel ? (
                            <>
                                {!ownsParcel ? (
                                    <>
                                        <Text as="p"><strong>Parcel ID:</strong> {closestParcel.id}</Text>
                                        <Text as="p"><strong>Location:</strong> {closestParcel.longitude}, {closestParcel.latitude}</Text>
                                        <Text as="p"><strong>Ether Value:</strong> {closestParcel.price}</Text>
                                        <Text as="h2">This parcel has no owner</Text>
                                        <Button onClick={handleBuyParcel}>Buy for {closestParcel.price}</Button>
                                    </>
                                ) : (
                                    <>
                                        <Text as="p"><strong>Owner:</strong> {closestParcel.userName}</Text>
                                        <Text as="p"><strong>Parcel ID:</strong> {closestParcel.id}</Text>
                                        <Text as="p"><strong>Ethereum Address:</strong> {closestParcel.ownerEthAddress}</Text>
                                        <Text as="p"><strong>Location:</strong> {closestParcel.longitude}, {closestParcel.latitude}</Text>
                                        <Text as="p"><strong>Ether Value:</strong> {closestParcel.price}</Text>
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