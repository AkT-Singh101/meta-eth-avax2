import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const contractABI = [
  "function getBalance() public view returns (uint256)",
  "function getTransactionCount() public view returns (uint256)",
  "function getTransaction(uint index) public view returns (uint256, string memory, uint256)",
  "function deposit() public payable",
  "function withdraw(uint256 _withdrawAmount) public",
  "event Deposit(uint256 amount)",
  "event Withdraw(uint256 amount)"
];

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with the actual contract address

export default function AssessmentContractInteraction() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

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
        await updateTransactionHistory();

        // Event listeners
        contract.on("Deposit", (amount) => {
          console.log(`Deposit event: ${ethers.utils.formatEther(amount)} ETH`);
          alert(`Deposited ${ethers.utils.formatEther(amount)} ETH`);
          updateBalance();
          updateTransactionHistory();
        });

        contract.on("Withdraw", (amount) => {
          console.log(`Withdraw event: ${ethers.utils.formatEther(amount)} ETH`);
          alert(`Withdrawn ${ethers.utils.formatEther(amount)} ETH`);
          updateBalance();
          updateTransactionHistory();
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
  }, []);

  const updateBalance = async () => {
    if (contract) {
      try {
        const balance = await contract.getBalance();
        console.log("Contract balance:", ethers.utils.formatEther(balance)); // Debugging balance
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Failed to fetch balance", error);
        alert("Failed to fetch balance: " + error.message);
      }
    }
  };

  const updateTransactionHistory = async () => {
    if (contract) {
      try {
        const count = await contract.getTransactionCount();
        const txs = [];
        for (let i = 0; i < count.toNumber(); i++) {
          const [amount, type, timestamp] = await contract.getTransaction(i);
          txs.push({
            amount: ethers.utils.formatEther(amount),
            type,
            timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString()
          });
        }
        setTransactions(txs);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
        alert("Failed to fetch transaction history: " + error.message);
      }
    }
  };

  const handleDeposit = async () => {
    if (contract && depositAmount) {
      try {
        console.log("Initiating deposit of", depositAmount);
        const tx = await contract.deposit({ value: ethers.utils.parseEther(depositAmount) });
        await tx.wait();
        console.log("Deposit successful!", tx);
        setDepositAmount(""); // Clear the input field
        await updateBalance(); // Update balance after deposit
        await updateTransactionHistory(); // Update transaction history
      } catch (error) {
        console.error("Deposit failed", error);
        alert("Deposit failed: " + error.message);
      }
    }
  };

  const handleWithdraw = async () => {
    if (contract && withdrawAmount) {
      try {
        const currentBalance = await contract.getBalance();
        const withdrawAmountWei = ethers.utils.parseEther(withdrawAmount);
        if (withdrawAmountWei.gt(currentBalance)) {
          alert("Insufficient funds for withdrawal");
          return;
        }
        console.log("Initiating withdrawal of", withdrawAmount);
        const tx = await contract.withdraw(withdrawAmountWei);
        await tx.wait();
        console.log("Withdrawal successful!", tx);
        setWithdrawAmount(""); // Clear the input field
        await updateBalance(); // Update balance after withdrawal
        await updateTransactionHistory(); // Update transaction history
      } catch (error) {
        console.error("Withdrawal failed", error);
        alert("Withdrawal failed: " + error.message);
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
      }}>Assessment Contract Interaction</h1>
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
          <p><span style={{ fontWeight: 'bold' }}>Contract Balance:</span> {balance} ETH</p>
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
            <h2 style={{ color: '#2563EB', marginBottom: '1rem', fontSize: '1.5rem' }}>Deposit</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="number"
                placeholder="Amount in ETH"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #CBD5E0',
                  borderRadius: '0.25rem',
                  backgroundColor: '#F0F9FF'
                }}
              />
              <button
                onClick={handleDeposit}
                style={{
                  backgroundColor: '#2563EB',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Deposit
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
            <h2 style={{ color: '#2563EB', marginBottom: '1rem', fontSize: '1.5rem' }}>Withdraw</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="number"
                placeholder="Amount in ETH"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #CBD5E0',
                  borderRadius: '0.25rem',
                  backgroundColor: '#F0F9FF'
                }}
              />
              <button
                onClick={handleWithdraw}
                style={{
                  backgroundColor: '#2563EB',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Withdraw
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
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>{tx.type}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #CBD5E0' }}>{tx.amount}</td>
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
