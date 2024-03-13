import {Web3} from 'web3';
const web3 = new Web3(window.ethereum);

// Connect to MetaMask
if (typeof window.ethereum == 'undefined') {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

export default web3;