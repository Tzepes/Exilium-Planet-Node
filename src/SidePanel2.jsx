import './SidePanel2.css';
import './Form.css';

import React, {useState, useEffect} from 'react';
import axios from 'axios'

import { Text, Button } from '@radix-ui/themes';
import * as Tabs from '@radix-ui/react-tabs';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import ResourcesTable from './ResourcesTable';
import FormConnect from './FormConnect';

import {handleConnect, wallet} from './utils/metamaskConnect'
import { connectToMetamask, handleUsernameSubmit, fetchUser, fetchownsParcel, handleBuyParcel } from './utils/apis';

function SidePanel2({closestParcel}) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [metamaskConnection, setMetamaskConnection] = useState(false);
  const [user, setUser] = useState({
    username: '',
    ethAddress: ''
  })
  const [ownsParcel, setOwnsParcel] = useState(false);
  const [parcel, setParcel] = useState({
    username: 'Name',
        ownerEthAddress: wallet.accounts[0],
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

connectToMetamask(handleConnect, setMetamaskConnection);

// handleUsernameSubmit(user, wallet, setUser, setParcel); //add this to the form submit

useEffect(() => {
  if (wallet && wallet.accounts[0]) {
      fetchUser(wallet, setUser, setParcel, setMetamaskConnection);
      fetchownsParcel(wallet, setParcel, setOwnsParcel);
  }
}, [wallet.accounts]);

  return (
    <>
    <div className='SidePanel2'>
      <div className={`side-menu ${isMenuOpen? 'open': ''}`}>
        <button className='menu-toggle' onClick={() => setMenuOpen(!isMenuOpen)}>
          <HamburgerMenuIcon />
        </button>
          <Tabs.Root className="TabsRoot" defaultValue="tab1">
            <Tabs.List className="TabsList" aria-label="Manage your account">
              <Tabs.Trigger className="TabsTrigger" value="tab1">
                Account
              </Tabs.Trigger>
              <Tabs.Trigger className="TabsTrigger" value="tab2">
                Parcel
              </Tabs.Trigger>
              <Tabs.Trigger className="TabsTrigger" value="tab3">
                Clicked Parcel
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="tab1">
              {metamaskConnection ? (
                user.username && user.ethAddress ? (
                  <>
                    <h3 className="Text">User Name</h3>
                    <Text>{user.username}</Text>
                    <p></p>
                    <h3 className='Text'>Ethereum Adress</h3>
                    <Text>{user.ethAddress}</Text>
                  </>
                ) : (
                  <FormConnect wallet={wallet} setUser={setUser} setParcel={setParcel} setOwnsParcel={setOwnsParcel}/> // insert userame form
                )
                ) : (
                  <>
                      <Text as="h3">Please connect your MetaMask account.</Text>
                      <p></p>
                      <button className="Button" style={{ marginTop: 10 }} onClick={connectToMetamask}>Connect to MetaMask</button>
                  </>
                )}
              </Tabs.Content>
            

            <Tabs.Content className="TabsContent" value="tab2">
              {metamaskConnection ? (
                ownsParcel ?(
                  <>
                    <h3>Parcel Information</h3>
                    <p className='Text'><strong>Location</strong> {parcel.latitude}, {parcel.longitude}</p>
                    <p className='Text'><strong>Resources</strong></p>
                    <ResourcesTable parcelInfo={parcel}/>
                    <p></p>
                    <p className='Text'><strong>Value</strong> {parcel.ethValue} ETH</p>
                  </>
                ) : (
                  <>
                    <Text as="h3">You don't own a parcel, explore the planet and buy one now!</Text>
                  </>
                )
              ) : (
                <>
                  <Text as="h3">Please connect your MetaMask account.</Text>
                  <p></p>
                  <button className="Button" style={{ marginTop: 10 }} onClick={connectToMetamask}>Connect to MetaMask</button>
                </>
              )}
            </Tabs.Content>

            <Tabs.Content className="TabsContent" value="tab3">
              <h3>Parcel Information</h3>
              {closestParcel ? (
                <>
                  {ownsParcel && !closestParcel.ownerEthAddress ? (
                    <>
                      <p className='Text'><strong>Owner</strong> {closestParcel.ownerUsername}</p>
                      <p className='Text'><strong>Parcel ID</strong> {closestParcel.id}</p>
                      <p className='Text'><strong>Ethereum Address</strong> {closestParcel.ownerEthAddress}</p>
                      <p className='Text'><strong>Location</strong> {closestParcel.latitude}, {closestParcel.longitude}</p>
                      <ResourcesTable parcelInfo={closestParcel}/>
                      <p></p>
                      <p className='Text'><strong>Value</strong> {closestParcel.ethValue} ETH</p>
                    </>
                  ) : (
                    <>
                      <Text as="p"><strong>Parcel ID:</strong> {closestParcel.id}</Text>
                      <Text as="p"><strong>Location:</strong> {closestParcel.latitude}, {closestParcel.longitude},</Text>
                      <Text as="p"><strong>Ether Value:</strong> {closestParcel.ethValue}</Text>
                      <Text as="h2">This parcel has no owner</Text>
                      <Button onClick={() => handleBuyParcel(wallet, user, closestParcel, setOwnsParcel)}>Buy for {closestParcel.ethValue}</Button>
                  </>
                  )}
                  
                </>
              ) : (
                <Text as="p">No parcel selected</Text>
              )}
              
            </Tabs.Content>
          </Tabs.Root>
      </div>
    </div>
      
    </>
  )
}

export default SidePanel2
