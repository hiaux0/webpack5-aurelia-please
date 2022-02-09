import * as LitJsSdk from 'lit-js-sdk'
/* prettier-ignore */ console.log('TCL ~ file: app.ts ~ line 2 ~ LitJsSdk', LitJsSdk)

declare global {
  interface Window {
    litNodeClient: unknown;
  }
}

export class App {
  message = "Hello";

  bind() {
    // document.addEventListener(
    //   "lit-ready",
    //   function (e) {
    //     console.log("LIT network is ready");
    //     // setNetworkLoading(false); // replace this line with your own code that tells your app the network is ready
    //   },
    //   false
    // );
  }

  async attached() {
    // const client = new LitJsSdk.LitNodeClient();
    // await client.connect();
    // window.litNodeClient = client;
  }
}
