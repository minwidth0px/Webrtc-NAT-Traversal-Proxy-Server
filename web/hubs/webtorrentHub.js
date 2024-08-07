// src/client/networkService.mts
var networkService_default = {
  remoteAddr: "",
  address: "",
  ICEParams: { params: [] } = { params: [] },
  useSmoke: false,
  smokeClient: null,
  async fetch(url, options) {
    if (this.useSmoke && this.smokeClient) {
      return await this.smokeClient.Http.fetch(url, options);
    } else {
      return await fetch(url, options);
    }
  }
};

// src/client/hubs/webtorrentHub.mts
var WebtorrentHub = class {
  #receiveCallback;
  #address;
  #ws;
  #infoHash;
  #firstSendSignal = true;
  #remoteAddr;
  constructor(ws, infoHash, localAddr, remoteAddr) {
    if (remoteAddr) {
      this.#address = remoteAddr;
    }
    this.#address = localAddr;
    this.#ws = ws;
    this.#ws.onmessage = (event) => {
      console.log(`message received:`);
      console.log(event.data);
      const msg = JSON.parse(event.data);
      console.log(msg);
      if (msg.offer) {
        console.log(`offer received:`);
        console.log(msg.offer);
        networkService_default.ICEParams.params.push(msg.offer);
        this.#onReceive(msg.offer);
      }
    };
    this.#infoHash = infoHash;
    this.#receiveCallback = () => {
    };
    networkService_default.address = this.#address;
  }
  async configuration() {
    return {
      iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun3.l.google.com:19302"] }]
    };
  }
  async address() {
    return this.#address;
  }
  send(message) {
    console.log(`message sent: `);
    console.log(message);
    if (this.#firstSendSignal) {
      this.#firstSendSignal = false;
    }
    message.from = this.#address;
    this.#ws.send(
      JSON.stringify({
        event: "started",
        action: "announce",
        info_hash: this.#infoHash,
        peer_id: this.#address,
        numwant: 1,
        offers: [
          {
            offer: message,
            offer_id: this.#address
          }
        ]
      })
    );
  }
  receive(callback) {
    this.#receiveCallback = callback;
  }
  dispose() {
    this.#ws.close();
  }
  #onReceive(message) {
    this.#receiveCallback(message);
  }
};
export {
  WebtorrentHub
};
