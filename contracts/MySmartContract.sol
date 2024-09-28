// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    // Struct to store details of each transaction
    struct Transaction {
        uint256 amount;
        string transactionType;  // "Deposit" or "Withdraw"
        uint256 timestamp;
    }

    // Array to store the transaction history
    Transaction[] public transactions;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor() payable {
        owner = payable(msg.sender);
        balance = msg.value;  // Initialize with the amount of ether sent during deployment
    }

    // View balance of the contract
    function getBalance() public view returns (uint256) {
    return address(this).balance;
}

    // View the number of transactions made
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    // View transaction details by index
    function getTransaction(uint index) public view returns (uint256, string memory, uint256) {
        require(index < transactions.length, "Invalid index");
        Transaction memory txn = transactions[index];
        return (txn.amount, txn.transactionType, txn.timestamp);
    }

    // Deposit function
    function deposit() public payable {
        uint256 _previousBalance = balance;

        // perform transaction
        balance += msg.value;

        // assert transaction completed successfully
        assert(balance == _previousBalance + msg.value);

        // store transaction in history
        transactions.push(Transaction({
            amount: msg.value,
            transactionType: "Deposit",
            timestamp: block.timestamp
        }));

        // emit the event
        emit Deposit(msg.value);
    }

    // Custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    // Withdraw function
    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // transfer the Ether to the owner
        owner.transfer(_withdrawAmount);

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // store transaction in history
        transactions.push(Transaction({
            amount: _withdrawAmount,
            transactionType: "Withdraw",
            timestamp: block.timestamp
        }));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
