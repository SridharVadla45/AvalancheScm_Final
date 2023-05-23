import React, { useEffect, useState } from 'react';
import DegenTokenContract from './contracts/DegenToken.json';
import { ethers } from 'ethers';
import './App.css';


const App = () => {
  const [degenToken, setDegenToken] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [transferAmount, setTransferAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();

        if (network.chainId !== 43113) {
          // Only support Fuji test network
          throw new Error('Please connect to the Fuji test network');
        }

        const contractAddress = '0xc817eD7b718A5cBf066ffe46B292205598b6861F';
        const contract = new ethers.Contract(contractAddress, DegenTokenContract.abi, signer);
        setDegenToken(contract);

        const currentAccount = (await signer.getAddress()).toLowerCase();
        setAccount(currentAccount);

        const currentBalance = await contract.balanceOf(currentAccount);
        setBalance(currentBalance.toString());
      } else {
        throw new Error('Please install MetaMask');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMint = async (to, amount) => {
    try {
      await degenToken.mint(to, amount);
      console.log('Tokens minted successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransfer = async () => {
    try {
      const recipient = document.getElementById('recipient').value;
      const amount = ethers.utils.parseEther(transferAmount);
      await degenToken.transfer(recipient, amount);
      console.log('Tokens transferred successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleBurn = async () => {
    try {
      const amount = ethers.utils.parseEther(burnAmount);
      await degenToken.burn(amount);
      console.log('Tokens burned successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedeem = async (itemId) => {
    try {
      await degenToken.redeem(itemId);
      console.log('Item redeemed successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>DegenToken App</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance}</p>
      <button onClick={() => handleMint(account, 100)}>Mint 100 Tokens</button>
      <div className='transfer'>
        <label htmlFor="recipient">Recipient Address:</label>
        <input type="text" id="recipient" />
        <label htmlFor="transferAmount">Transfer Amount:</label>
        <input
          type="text"
          id="transferAmount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button onClick={handleTransfer}>Transfer Tokens</button>
      </div>
      <div className='Burn'>
        <label htmlFor="burnAmount">Burn Amount:</label>
        <input
          type="text"
          id="burnAmount"
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
        />
        <button onClick={handleBurn}>Burn Tokens</button>
      </div>
      <button onClick={() => handleRedeem(0)}>Redeem DegenNFT</button>
      <button onClick={() => handleRedeem(1)}>Redeem Avatar</button>
      <button onClick={() => handleRedeem(2)}>Redeem DegenTokens</button>
    </div>
  );
};

export default App;
