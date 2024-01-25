import './sidePanel.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Text, Button, Table } from '@radix-ui/themes';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import {handleConnect, wallet} from './utils/metamaskConnect'

function SidePanel({closestParcel}) { // use useEffect() for closestParcel click so app no longer rerenders
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [metamaskConnection, setMetamaskConnection] = useState(false);
    const [user, setUser] = useState({
        username: '',
        metamaskAddress: '',
    });
    const [ownsParcel, setOwnsParcel] = useState(false);
    const [parcel, setParcel] = useState({
        username: 'Name',
        metamaskAddress: wallet.accounts[0],
        longitude: '0',
        latitude: '0', 
        resources:{
            minerals: {
                iron: 0,
                aluminum: 0,
                titanium: 0,
                copper: 0,
                silver: 0,
                gold: 0,
            },
            naturalResources: {
                liquidWater: 0,
                ice: 0,
            },
            naturalGas: 0,
        },
        population: 0,
        terraformProgress: 0,
        ethValue: '0.05',
      });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    async function connectToMetamask() {
        try {
            await handleConnect();
            setMetamaskConnection(true); 
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
    }

    const handleUsernameSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.put('http://localhost:3000/api/users/createUser', {
                username: user.username,
                cntEthAddress: wallet.accounts[0],
            });

            if (response.status === 200 && Object.keys(response.data).length > 0) {
                setUser({ 
                    username: response.data.username || '', 
                    metamaskAddress: response.data.cntEthAddress || '' 
                  });
                setParcel(prevParcel => ({ ...prevParcel, username: response.data.username }));
                fetchownsParcel();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
    };

    const fetchUser = async() => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${wallet.accounts[0]}`);
            if(response.status === 200 && Object.keys(response.data).length > 0) {
                setUser({ 
                    username: response.data.username || '', 
                    metamaskAddress: response.data.ethAddress || '' 
                  });
                setParcel(prevParcel => ({ ...prevParcel, username: response.data.username }));
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchownsParcel = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/parcels/${wallet.accounts[0]}`);
            if (response.status === 200 && Object.keys(response.data).length > 0) {
                setParcel(response.data[0]);
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
            fetchUser();
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
                username: user.username,
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
                        <Tabs.Trigger value="tab1" className='TabsTrigger'><h4>Account</h4></Tabs.Trigger>
                        <Tabs.Trigger value="tab2" className='TabsTrigger'><h4>Parcel</h4></Tabs.Trigger>
                        <Tabs.Trigger value="tab3" className='TabsTrigger'><h4>Clicked Parcel</h4></Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="tab1">
                        {wallet.accounts && wallet.accounts.length > 0 ? ( // if user is logged in
                            user.username && user.metamaskAddress ? ( // if user has username and metamask address
                                <>
                                    <Text as="p"><strong>Name:</strong> {user.username}</Text>
                                    <Text as="p"><strong>Ethereum Address:</strong> {user.metamaskAddress}</Text>
                                </>
                            ) : (
                                <>
                                    <form onSubmit={handleUsernameSubmit}>
                                        <label>
                                            Username:
                                            <input type="text" value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} required />
                                        </label>
                                        <Button type="submit">Connect</Button>
                                    </form>
                                </>
                            )
                        ):(
                            <>
                                <Text as="h3">Please connect your MetaMask account.</Text>
                                <Button size="2" variant="surface" onClick={connectToMetamask}>Connect to MetaMask</Button>
                            </>
                        )}
                        
                    </Tabs.Content>
                    <Tabs.Content value="tab2">
                    {wallet.accounts && wallet.accounts.length > 0 ? (
                        ownsParcel ? (
                            <>
                              <Text as="h2">My Parcel Information</Text>                              
                              <Text as="p"><strong>Location:</strong> {parcel.longitude}, {parcel.latitude}</Text>
                              <Text as="h3">Resources</Text>
                              <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Iron</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Aluminum</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Titanium</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Copper</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Silver</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Gold</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                    <Table.RowHeaderCell>{parcel.resources.minerals.iron}</Table.RowHeaderCell>
                                    <Table.Cell>{parcel.resources.minerals.aluminum}</Table.Cell>
                                    <Table.Cell>{parcel.resources.minerals.titanium}</Table.Cell>
                                    <Table.Cell>{parcel.resources.minerals.copper}</Table.Cell>
                                    <Table.Cell>{parcel.resources.minerals.silver}</Table.Cell>
                                    <Table.Cell>{parcel.resources.minerals.gold}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                              </Table.Root>

                              <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Liquid Water</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Ice</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Natural Gas</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.RowHeaderCell>{parcel.resources.naturalResources.liquidWater}</Table.RowHeaderCell>
                                        <Table.Cell>{parcel.resources.naturalResources.ice}</Table.Cell>
                                        <Table.Cell>{parcel.resources.naturalGas}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                              </Table.Root>
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
                        <Button size="2" variant="surface" onClick={connectToMetamask}>Connect to MetaMask</Button>
                        </>
                    )}
                    </Tabs.Content>
                    <Tabs.Content value="tab3">
                        <Text as="h2">Parcel Information</Text>
                        {closestParcel ? (
                            <>
                                {!ownsParcel ? (
                                    <>
                                        <Text as="p"><strong>Parcel ID:</strong> {closestParcel.id}</Text>
                                        <Text as="p"><strong>Location:</strong> {closestParcel.longitude}, {closestParcel.latitude}</Text>
                                        <Text as="p"><strong>Ether Value:</strong> {closestParcel.ethValue}</Text>
                                        <Text as="h2">This parcel has no owner</Text>
                                        <Button onClick={handleBuyParcel}>Buy for {closestParcel.ethValue}</Button>
                                    </>
                                ) : (
                                    <>
                                        <Text as="p"><strong>Owner:</strong> {closestParcel.userName}</Text>
                                        <Text as="p"><strong>Parcel ID:</strong> {closestParcel.id}</Text>
                                        <Text as="p"><strong>Ethereum Address:</strong> {closestParcel.ownerEthAddress}</Text>
                                        <Text as="p"><strong>Location:</strong> {closestParcel.longitude}, {closestParcel.latitude}</Text>
                                        <Text as="p"><strong>Ether Value:</strong> {closestParcel.ethValue}</Text>
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