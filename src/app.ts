/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Integration } from "lit-ceramic-sdk";

declare global {
  interface Window {
    litNodeClient: {
      saveEncryptionKey: (args: unknown) => unknown;
      getEncryptionKey: (args: unknown) => unknown;
    };
  }
}

export class App {
  message = "Hello";
  litCeramicIntegration: Integration;
  // streamID = "kjzl6cwe1jw1479rnblkk5u43ivxkuo29i4efdx1e7hk94qrhjl0d4u0dyys1au"; // test data
  streamID = "kjzl6cwe1jw14ajv5r4mzj6v2nfnqlp39ev3kyx67hdixoa1frzc1e9uaolobi6"; // test data
  // web3Modal: Web3Modal;
  // threeID: any;;

  constructor() {
    /* prettier-ignore */ console.log('TCL ~ file: app.ts ~ line 26 ~ App ~ constructor ~ constructor')
  }

  // bind() {
  // document.addEventListener(
  //   "lit-ready",
  //   function (e) {
  //     console.log("LIT network is ready");
  //     // setNetworkLoading(false); // replace this line with your own code that tells your app the network is ready
  //   },
  //   false
  // );
  // }

  async attached() {
    this.litCeramicIntegration = new Integration();
    // this.threeID = new ThreeIdConnect();
    // this.web3Modal = new Web3Modal({
    //   disableInjectedProvider: false,
    //   cacheProvider: false,
    //   providerOptions: {
    //     walletconnect: {
    //       package: WalletConnectProvider,
    //       options: {
    //         infuraId: "e87f83fb85bf4aa09bdf6605ebe144b7",
    //       },
    //     },
    //     authereum: {
    //       package: Authereum,
    //       options: {},
    //     },
    //   },
    // });

    console.log("DOMContent.........");
    this.litCeramicIntegration.startLitClient(window);
  }

  async readCeramic() {
    if (document.getElementById("stream") === null) {
      this.updateAlert(
        "danger",
        `Error, please write to ceramic first so a stream can be read`
      );
    } else {
      // @ts-ignore
      const response = this.litCeramicIntegration
        // .readAndDecrypt(this.streamID, this.web3Modal, this.threeID)
        .readAndDecrypt(this.streamID)
        .then(
          (value) =>
            // @ts-ignore
            (document.getElementById("decryption").innerText = value)
        );
      console.log(response);
    }
  }

  updateAlert = (status: string, message: string) => {
    const alert = document.getElementById("alerts");

    if (alert !== null) {
      alert.textContent = message;
      alert.classList.add(`alert-${status}`);
      alert.classList.remove("hide");
      setTimeout(() => {
        alert.classList.add("hide");
      }, 5000);
    }
  };

  // encrypt with Lit and write to ceramic
  async encryptLit() {
    const updateStreamID = (resp: string | string) => {
      this.streamID = resp;
      /* prettier-ignore */ console.log('TCL ~ file: app.ts ~ line 82 ~ App ~ updateStreamID ~ this.streamID', this.streamID)
      // @ts-ignore
      document.getElementById("stream").innerText = resp;
    };

    /* prettier-ignore */ console.log('TCL ~ file: app.ts ~ line 81 ~ App ~ click')
    // @ts-ignore
    const stringToEncrypt = document.getElementById("secret").value;
    // User must posess at least 0.000001 ETH on eth
    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: "0x45b211cd08724D584cD94e7B974584249cD87638",
        },
      },
    ];
    const value = await this.litCeramicIntegration.encryptAndWrite(
      stringToEncrypt,
      accessControlConditions,
      // this.web3Modal,
      // this.threeID
    );
    const response = updateStreamID(value);
    console.log(response);
  }
}
