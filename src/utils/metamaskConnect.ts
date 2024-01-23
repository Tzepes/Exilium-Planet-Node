import detectEthereumProvider from '@metamask/detect-provider';

let wallet = { accounts: '', balance: "", chainId: "" };

declare global {
  interface Window {
    ethereum: any;
  }
}

export const formatBalance = (rawBalance: string) => {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
    return balance
  }
  
  export const formatChainAsNum = (chainIdHex: string) => {
    const chainIdNum = parseInt(chainIdHex)
    return chainIdNum
  }

const updateWallet = async (accounts:any) => { 
  try {
    if (typeof accounts[0] !== 'string') {
      throw new Error('Account address must be a string');
    }
    const balance = formatBalance(await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], "latest"],
    }))
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    })
    
    wallet = { accounts, balance, chainId };
    
  } catch (error) {
    console.error("Error updating wallet:", error);
  }
}

const handleConnect = async () => {
  let accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  })
  updateWallet(accounts);
}

const getProvider = async () => {
  const provider = await detectEthereumProvider({ silent: true });

  if(provider) {
    const accounts = await window.ethereum.request(
      {method: 'eth_accounts'}
    )
    updateWallet(accounts);
    window.ethereum.on('accountsChanged', updateWallet);
  }
}

getProvider();

export { handleConnect, wallet };