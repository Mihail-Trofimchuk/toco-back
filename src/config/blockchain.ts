import { ethers } from "ethers";
import TocoTokenAbi from "@/abis/TocoToken.json";

export const RPC_URL = process.env.RPC_URL!;
export const PRIVATE_KEY = process.env.PRIVATE_KEY!;
export const TOCO_CONTRACT_ADDRESS = process.env.TOCO_CONTRACT_ADDRESS!;

export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

export const tokenContract = new ethers.Contract(
  TOCO_CONTRACT_ADDRESS,
  TocoTokenAbi.abi,
  wallet
);
