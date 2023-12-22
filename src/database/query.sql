CREATE TABLE User(
    userId INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);


CREATE TABLE Account (
  accountId INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  balance DECIMAL(10, 2) DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE Transaction (
  transactionId INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  accountId INT,
  amount DECIMAL(10, 2) NOT NULL,
  transactionType ENUM('Deposit', 'Withdrawal') NOT NULL,
  transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(userId),
  FOREIGN KEY (accountId) REFERENCES Account(accountId)
);

CREATE TABLE AccountStatement (
  statementId INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  accountId INT,
  transactionId INT,
  statementDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(userId),
  FOREIGN KEY (accountId) REFERENCES Account(accountId),
  FOREIGN KEY (transactionId) REFERENCES Transaction(transactionId)
);