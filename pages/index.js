import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const contractABI = [
  "function checkBalance() external view returns (uint256)",
  "function addFunds() external payable",
  "function removeFunds(uint256 amount) external",
  "event FundsAdded(address indexed from, uint256 value)",
  "event FundsRemoved(address indexed to, uint256 value)"
];

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with the actual contract address

export default function DigitalWalletInteraction() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [addAmount, setAddAmount] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const updateBalance = useCallback(async () => {
    if (contract) {
      try {
        const balance = await contract.checkBalance();
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Failed to fetch balance", error);
        alert("Failed to fetch balance: " + error.message);
      }
    }
  }, [contract]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        const address = await signer.getAddress();
        setAddress(address);

        await updateBalance();

        // Event listeners
        contract.on("FundsAdded", (from, value) => {
          console.log(`Funds added: ${ethers.utils.formatEther(value)} ETH from ${from}`);
          updateBalance();
          updateTransactions(from, value, "Add");
        });

        contract.on("FundsRemoved", (to, value) => {
          console.log(`Funds removed: ${ethers.utils.formatEther(value)} ETH to ${to}`);
          updateBalance();
          updateTransactions(to, value, "Remove");
        });

        return () => {
          contract.removeAllListeners();
        };
      } catch (error) {
        console.error("Failed to connect", error);
        alert("Failed to connect to wallet: " + error.message);
      }
    };

    init();
  }, [updateBalance]);

  const updateTransactions = (address, value, type) => {
    const newTx = {
      address,
      amount: ethers.utils.formatEther(value),
      type,
      timestamp: new Date().toLocaleString()
    };
    setTransactions(prevTx => [newTx, ...prevTx]);
  };

  const handleAddFunds = async () => {
    if (contract && addAmount) {
      try {
        const tx = await contract.addFunds({ value: ethers.utils.parseEther(addAmount) });
        await tx.wait();
        setAddAmount("");
        await updateBalance();
      } catch (error) {
        console.error("Add funds failed", error);
        alert("Add funds failed: " + error.message);
      }
    }
  };

  const handleRemoveFunds = async () => {
    if (contract && removeAmount) {
      try {
        const tx = await contract.removeFunds(ethers.utils.parseEther(removeAmount));
        await tx.wait();
        setRemoveAmount("");
        await updateBalance();
      } catch (error) {
        console.error("Remove funds failed", error);
        alert("Remove funds failed: " + error.message);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #E6F3FF, #C5E3FF)',
      color: '#333',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#1E40AF'
      }}>Digital Wallet Interaction</h1>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          marginBottom: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          <h2 style={{ color: '#2563EB', marginBottom: '1rem', fontSize: '1.5rem' }}>Wallet Information</h2>
          <p style={{ marginBottom: '0.5rem' }}><span style={{ fontWeight: 'bold' }}>Address:</span> {address}</p>
          <p><span style={{ fontWeight: 'bold' }}>Wallet Balance:</span> {balance} ETH</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            flex: 1,
            minWidth: '300px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{ color: '#2563EB', marginBottom: '1rem', fontSize: '1.5rem' }}>Add Funds</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="number"
                placeholder="Amount in ETH"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #CBD5E0',
                  borderRadius: '0.25rem',
                  backgroundColor: '#F0F9FF'
                }}
              />
              <button
                onClick={handleAddFunds}
                style={{
                  backgroundColor: '#2563EB',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Add Funds
              </button>
            </div>
          </div>

          <div style={{
            flex: 1,
            minWidth: '300px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{ color: '#2563EB', marginBottom: '1rem', fontSize: '1.5rem' }}>Remove Funds</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="number"
                placeholder="Amount in ETH"
                value={removeAmount}
                onChange={(e) => setRemoveAmount(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #CBD5E0',
                  borderRadius: '0.25rem',
                  backgroundColor: '#F0F9FF'
                }}
              />
              <button
                onClick={handleRemoveFunds}
                style={{
                  backgroundColor: '#2563EB',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Remove Funds
              </button>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          <h2 style={{ color: '#2563EB', marginBottom: '1rem', fontSize: '1.5rem' }}>Transaction History</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>Amount (ETH)</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>Address</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>{tx.type}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>{tx.amount}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>{tx.address}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
