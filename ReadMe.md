# Tocos - Carbon Reduction Campaign Platform

This repository contains the code for the Tocos Full Stack Web3 Developer Home Assignment. The project is a platform that enables carbon reduction campaigns where participants can earn Toco tokens for their contributions.

## Project Overview

Tocos is a platform that organizes carbon reduction campaigns and rewards participants with Toco tokens. The platform has two main user roles:

1. **Tocos Role (Client)**: Users who organize campaigns and award tokens
2. **User Role (Participant)**: Users who participate in campaigns and earn tokens

The backend is already provided, and your task is to develop:
- A frontend application (preferably using React or Next.js)
- A smart contract for the Toco ERC20 token

## Backend Structure

The backend is built with:
- Node.js with Express
- TypeORM for database interactions
- Authentication with JWT
- RESTful API architecture

Key entities:
- **User**: Represents users with either "tocos" or "user" roles
- **Activity**: Represents campaigns with title, description, reward amount, and status
- **Token**: Manages token distribution and tracking

## Development Requirements

### Frontend Requirements
- Build a responsive UI using React or Next.js
- Implement authentication (login/register)
- Create dashboards for both roles:
  - Client dashboard to create/manage campaigns and award tokens
  - Participant dashboard to browse, join, and complete campaigns
- Connect to the Web3 wallet for token transactions
- Display token balances and transaction history

### Smart Contract Requirements
- Implement an ERC20 token contract for "Toco"
- Deploy on any EVM-compatible network (e.g., Ethereum testnet, Polygon, etc.)
- Include functionality for:
  - Token minting
  - Token transfers
  - Balance checking

## Getting Started

### Backend Setup
1. Clone this repository
2. Install dependencies:

   ```cmd
   npx bun install
   ```

3. Set up environment variables (create a `.env` file based on the example)
4. Run the development server:
   
   ```cmd
   npx bun dev
   ```

### Frontend Development
1. Create a new directory for your frontend application
2. Initialize a new React/Next.js project
3. Connect to the backend API
4. Implement the required features

### Smart Contract Development
1. Set up a development environment for Solidity (e.g., Hardhat, Truffle)
2. Implement the ERC20 token contract
3. Deploy to your chosen network
4. Connect the frontend to interact with the smart contract

## Evaluation Criteria

Your submission will be evaluated based on:
1. Code quality and organization
2. UI/UX design and implementation
3. Smart contract functionality and security
4. Integration between frontend, backend, and blockchain
5. Documentation and code comments
6. Testing approach

## Submission Guidelines

1. Create a new GitHub repository with your solution
2. Include:
   - Frontend code
   - Smart contract code
   - Documentation on how to run the project
   - Any additional notes or explanations
3. Provide the deployed frontend URL (if applicable)
4. Share the deployed smart contract address and network
