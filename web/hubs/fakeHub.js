// src/client/hubs/fakeHub.mts
var FakeNetworkHub = class {
  #receiveCallback;
  #address;
  #isSet = false;
  #sendParams = { params: [] };
  #ICEParams;
  #sendCount = 0;
  constructor(endpoint, address, ICEParams) {
    console.log(ICEParams);
    ICEParams.params.sort((a, b) => {
      if (a.data.type === "description")
        return -1;
      return 1;
    });
    this.#ICEParams = ICEParams;
    this.#address = address;
    this.#receiveCallback = () => {
    };
  }
  async configuration() {
    return manualConfig();
  }
  async address() {
    return this.#address;
  }
  async send(message) {
    console.log(this.#ICEParams.params[this.#sendCount]);
    this.#onReceive(this.#ICEParams.params[this.#sendCount]);
    this.#sendCount++;
  }
  receive(callback) {
    this.#receiveCallback = callback;
  }
  dispose() {
  }
  #onReceive(message) {
    this.#receiveCallback(message);
  }
};
function manualConfig() {
  return {
    iceServers: [
      {
        urls: ["stun:stun1.l.google.com:19302", "stun:stun3.l.google.com:19302"]
      }
    ]
  };
}
export {
  FakeNetworkHub
};
