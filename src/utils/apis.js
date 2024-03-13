import axios from 'axios';
import web3 from './web3';
import {ethers} from 'ethers';
import exl_contract from './exiliumland-contract';

export async function connectToMetamask(handleConnect, setMetamaskConnection) {
  try {
    await handleConnect();
    setMetamaskConnection(true);
  } catch (error) {
    console.log('Something went wrong. Please try again.');
  }
}

export async function handleUsernameSubmit(event, username, wallet, setUser, setParcel, setOwnsParcel) {
  event.preventDefault();
  
  try {
        const response = await axios.put('http://localhost:3000/api/users/createUser', {
            username: username,
            cntEthAddress: wallet.accounts[0],
        });

        if (response.status === 200 && Object.keys(response.data).length > 0) {
            setUser({ 
                username: response.data.username || '', 
                ethAddress: response.data.cntEthAddress || '' 
            });
            setParcel(prevParcel => ({ ...prevParcel, username: response.data.username }));
            fetchownsParcel(wallet, setParcel, setOwnsParcel);
        } else {
            console.log('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.log(error);
    }
}

export async function fetchUser(wallet, setUser, setParcel, setMetamaskConnection) {
    try {
        const response = await axios.get(`http://localhost:3000/api/users/${wallet.accounts[0]}`);
        if(response.status === 200 && Object.keys(response.data).length > 0) {
            setUser({ 
                username: response.data.username || '', 
                ethAddress: response.data.ethAddress || '' 
            });
                
            setParcel(prevParcel => ({ ...prevParcel, username: response.data.username }));
            setMetamaskConnection(true);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function fetchownsParcel(wallet, setParcel, setOwnsParcel) {
    try {
        const response = await axios.get(`http://localhost:3000/api/parcels/${wallet.accounts[0]}`);
        if (response.status === 200 && Object.keys(response.data).length > 0) {
            setParcel(response.data[0]);
            setOwnsParcel(true);
        } else {
            setOwnsParcel(false);
        }
    } catch (error) {
        console.log('Something went wrong. Please try again.', error);
    }
}

export async function handleBuyParcel(wallet, user, closestParcel, setParcel, setOwnsParcel) {
    if (!wallet.accounts || wallet.accounts.length === 0) {
        console.log('Please connect your wallet first.');
        return;
      }
      
      try {
          const response = await axios.put(`http://localhost:3000/api/parcels/${closestParcel._id}`, {
              username: user.username,
              ethereumAddress: wallet.accounts[0],
          });

          mintToken(wallet).then((receipt) => {
            if (receipt.status === 200 && response.status === 200) {
                console.log('Parcel bought successfully!');
                setParcel(response.data);
                fetchownsParcel(wallet, setParcel, setOwnsParcel);
            }
          }).catch((error) => { 
                console.log('Something went wrong.', error);
          });
      } catch (error) {
          console.log('Something went wrong.', error);
      }
}

async function mintToken(wallet) {
    const uri = 'https://white-cheerful-dormouse-841.mypinata.cloud/ipfs/QmQhkgdPsehHhwVpkLGjtcXjrkGWwNXY8uv4KnrVbPk9kZ';
    
    try {
        const receipt = await exl_contract.methods.safeMint(wallet.accounts[0], uri, 1, 1).send({ from: '0xE29eA2e0b5E7192956c8D38B0F66313D8B95D324' });
        return receipt;
    } catch (error) {
        console.error('Error minting token:', error);
    }
}