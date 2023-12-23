-- Create User table
-- CREATE TABLE User(
--     userId INT PRIMARY KEY AUTO_INCREMENT,
--     firstName VARCHAR(50) NOT NULL,
--     lastName VARCHAR(50) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password VARCHAR(100) NOT NULL
-- );

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- '0000000001', '2', '0.00'

-- CREATE TABLE Account (
--   accountId INT PRIMARY KEY AUTO_INCREMENT,
--   userId INT,
--   balance DECIMAL(10, 2) DEFAULT 0,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (userId) REFERENCES User(userId)
-- );

-- Create Account table
-- CREATE TABLE Account (
--     accountId VARCHAR(10) ZEROFILL PRIMARY KEY,
--     userId INT,
--     balance DECIMAL(10, 2) DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (userId) REFERENCES User(userId)
-- );

CREATE TABLE Account (
    accountId INT PRIMARY KEY AUTO_INCREMENT,
    accountNumber CHAR(10) NOT NULL,
    userId INT,
    balance DECIMAL(10, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- CREATE TABLE Transaction (
--   transactionId INT PRIMARY KEY AUTO_INCREMENT,
--   userId INT,
--   accountId INT,
--   amount DECIMAL(10, 2) NOT NULL,
--   transactionType ENUM('Deposit', 'Withdrawal') NOT NULL,
--   transactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (userId) REFERENCES User(userId),
--   FOREIGN KEY (accountId) REFERENCES Account(accountId)
-- );

-- Create Transaction table
-- CREATE TABLE Transaction (
--     transactionId INT AUTO_INCREMENT PRIMARY KEY,
--     userId INT,
--     accountId VARCHAR(10) ZEROFILL,
--     amount DECIMAL(10, 2) NOT NULL,
--     transactionType ENUM('DEPOSIT', 'WITHDRAWAL') NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (userId) REFERENCES User(userId),
--     FOREIGN KEY (accountId) REFERENCES Account(accountId)
-- );

CREATE TABLE Transaction (
    transactionId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    accountId INT,
    amount DECIMAL(10, 2) NOT NULL,
    transactionType ENUM('DEPOSIT', 'WITHDRAWAL') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
);

-- CREATE TABLE AccountStatement (
--   statementId INT PRIMARY KEY AUTO_INCREMENT,
--   userId INT,
--   accountId INT,
--   transactionId INT,
--   statementDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (userId) REFERENCES User(userId),
--   FOREIGN KEY (accountId) REFERENCES Account(accountId),
--   FOREIGN KEY (transactionId) REFERENCES Transaction(transactionId)
-- );

-- Create AccountStatement table with CHAR column for accountId
CREATE TABLE AccountStatement (
    statementId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    accountId INT, 
    transactionId INT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (accountId) REFERENCES Account(accountId),
    FOREIGN KEY (transactionId) REFERENCES Transaction(transactionId)
);