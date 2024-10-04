// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DigitalWallet {
    address public immutable owner;
    uint256 private _balance;

    enum TransactionType { Deposit, Withdrawal }

    struct TransactionRecord {
        uint256 amount;
        TransactionType txType;
        uint256 timestamp;
    }

    TransactionRecord[] private _transactionHistory;

    event FundsDeposited(address indexed depositor, uint256 amount);
    event FundsWithdrawn(address indexed recipient, uint256 amount);

    error UnauthorizedAccess(address caller);
    error InsufficientFunds(uint256 available, uint256 requested);

    constructor() payable {
        owner = msg.sender;
        _balance = msg.value;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert UnauthorizedAccess(msg.sender);
        }
        _;
    }

    function currentBalance() public view returns (uint256) {
        return _balance;
    }

    function transactionCount() public view returns (uint256) {
        return _transactionHistory.length;
    }

    function getTransactionDetails(uint256 index) public view returns (uint256, TransactionType, uint256) {
        require(index < _transactionHistory.length, "Transaction index out of bounds");
        TransactionRecord memory record = _transactionHistory[index];
        return (record.amount, record.txType, record.timestamp);
    }

    function depositFunds() public payable {
        uint256 initialBalance = _balance;
        _balance += msg.value;

        assert(_balance == initialBalance + msg.value);

        _transactionHistory.push(TransactionRecord({
            amount: msg.value,
            txType: TransactionType.Deposit,
            timestamp: block.timestamp
        }));

        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 amount) public onlyOwner {
        if (_balance < amount) {
            revert InsufficientFunds({
                available: _balance,
                requested: amount
            });
        }

        uint256 initialBalance = _balance;
        _balance -= amount;

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");

        assert(_balance == initialBalance - amount);

        _transactionHistory.push(TransactionRecord({
            amount: amount,
            txType: TransactionType.Withdrawal,
            timestamp: block.timestamp
        }));

        emit FundsWithdrawn(owner, amount);
    }
}
