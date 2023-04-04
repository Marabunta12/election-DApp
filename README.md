# Decentralized election aplication built on Ethereum blockchain


## This project is an Ethereum-based application which allows to hold an election. Smart contract is written in Solidity, front-end is built with Next.js framework and uses The Graph to read data from the blockchain. Here are the main features of this app:

* The contract sets deployer as an election admin.
* Election admin control election process. He can add voters, candidates, start and stop election.
* Only authorised voters have right to vote.
* Election admin control when election is open.

## This Dapp goal is to allow some centralized entity to hold en election with easily verifiable results. Thanks to blockchain technology any attems of fraud are impossible.

## This repository contains only smart contracts code. For front-end and subgraph code see links below

* ### [Election front-end code](https://github.com/Marabunta12/election-DApp-frontend)
* ### [Subgraph code](https://github.com/Marabunta12/election-dapp-graph)

# Getting Started

## Requirements

### Before using this app you need to install the following:

* ### Nodejs
* ### Yarn

# Usage

## Deploy

```
yarn hardhat deploy
```

## Test
```
yarn hardhat test
```

## Scripts
### You can interact with contract using scripts

```
yarn hardhat run scripts/<script-name>
```

# Deployment to a testnet

## 1. Setup environment variables

You need to create `.env` file and add environment variables similar to what you see in `.env.example` file.

## 2. Deploy

```
yarn hardhat deploy --network goerli
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
