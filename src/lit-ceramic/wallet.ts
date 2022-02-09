import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import type { DIDProvider } from "dids";
import Web3Modal from "web3modal";

// @ts-ignore

export async function getProvider(
  web3Modal: Web3Modal,
  threeID: ThreeIdConnect
): Promise<DIDProvider> {
  try {
    console.log("0");
    const ethProvider = await web3Modal.connect();
    console.log("1");
    const addresses = await ethProvider.enable();
    console.log("2");
    await threeID.connect(new EthereumAuthProvider(ethProvider, addresses[0]));
    console.log("3");
    return threeID.getDidProvider();
  } catch (error) {
    console.log(error);
  }
}

export async function getAddress(web3Modal: Web3Modal): Promise<string> {
  const ethProvider = await web3Modal.connect();
  const addresses = await ethProvider.enable();
  const addr = addresses[0];
  return addr;
}
