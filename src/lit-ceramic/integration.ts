/* eslint-disable @typescript-eslint/ban-ts-comment */
// Don't forget to rebuild
import { createIDX } from "./idx";
import type { CeramicApi } from "@ceramicnetwork/common";
import type { DID } from "dids";
import { _encryptWithLit, _decryptWithLit } from "./lit";
import { _startLitClient } from "./client";
import {
  _authenticateCeramic,
  _createCeramic,
  _writeCeramic,
  _readCeramic,
  _decodeFromB64,
} from "./ceramic";
import { ThreeIdConnect } from "@3id/connect";
import Web3Modal from "web3modal";

declare global {
  interface Window {
    did?: DID;
  }
}
export class Integration {
  ceramicPromise: Promise<CeramicApi>;

  constructor(ceramicNodeUrl = "https://ceramic-clay.3boxlabs.com") {
    this.ceramicPromise = _createCeramic(ceramicNodeUrl);
  }

  startLitClient(window: Window) {
    _startLitClient(window);
  }

  /**
   * Encrypts using Lit and then writes using Ceramic
   * whatever the module user inputs (as long as it is a string for now)
   *
   * @param {String} toEncrypt what the module user wants to encrypt and store on ceramic
   * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
   * @returns {Promise<String>} A promise that resolves to a streamID for the encrypted data that's been stored
   */
  async encryptAndWrite(
    toEncrypt: string,
    accessControlConditions: Array<Object>,
    web3Modal: Web3Modal,
    threeID: ThreeIdConnect
  ): Promise<string> {
    try {
      const a = await _authenticateCeramic(
        this.ceramicPromise,
        web3Modal,
        threeID
      );
      // @ts-ignore
      const en = await _encryptWithLit(a, toEncrypt, accessControlConditions);
      const wr = await _writeCeramic(a, en);
      // @ts-ignore
      return wr;
    } catch (error) {
      return `something went wrong encrypting: ${error}`;
    }
  }

  /**
   * Retrieves a stream and decrypts message then returns to user
   *
   * @param {String} streamID the streamID of the encrypted data the user wants to access
   * @returns {Promise<String>} A promise that resolves to the unencrypted string of what was stored
   */
  async readAndDecrypt(
    streamID: string,
    web3Modal: Web3Modal,
    threeID: ThreeIdConnect
  ): Promise<any> {
    try {
      // makes certain DID/wallet has been auth'ed
      const a = await _authenticateCeramic(
        this.ceramicPromise,
        web3Modal,
        threeID
      );
      // read data and retrieve encrypted data
      const en = await _readCeramic(a, streamID);
      /* prettier-ignore */ console.log('TCL ~ file: integration.ts ~ line 84 ~ Integration ~ en', en)
      // decode data returned from ceramic
      const deco = await _decodeFromB64(en);
      /* prettier-ignore */ console.log('TCL ~ file: integration.ts ~ line 87 ~ Integration ~ deco', deco)
      // decrypt data that's been decoded
      const decrypt = await _decryptWithLit(deco[0], deco[1], deco[2], deco[3]);
      /* prettier-ignore */ console.log('TCL ~ file: integration.ts ~ line 90 ~ Integration ~ decrypt', decrypt)
      return decrypt;
    } catch (error) {
      // /* prettier-ignore */ console.log('TCL ~ file: integration.ts ~ line 94 ~ Integration ~ error.stack', error.stack)
      return `something went wrong decrypting: ${error} \n StreamID sent: ${streamID}`;
    }
  }
}
