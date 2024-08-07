// src/client/hub.mts
var RemoteNetworkHub = class {
  #receiveCallback;
  #address = manualAddr();
  #sendParams = { params: [] };
  constructor(endpoint) {
    this.manualRecive();
    this.#receiveCallback = () => {
    };
  }
  async configuration() {
    return manualConfig();
  }
  async address() {
    return this.#address;
  }
  send(message) {
    console.log(`message sent: `);
    console.log(message);
    this.manualSend(message);
  }
  receive(callback) {
    this.#receiveCallback = callback;
  }
  dispose() {
  }
  #onReceive(message) {
    this.#receiveCallback(message);
  }
  manualRecive() {
    const textarea = document.getElementById("receive");
    console.log(textarea);
    if (textarea !== null) {
      textarea.addEventListener("paste", async (e) => {
        e.preventDefault();
        const text = e.clipboardData?.getData("text/plain");
        if (text) {
          const message = JSON.parse(text);
          message.params.sort((a, b) => {
            if (a.data.type === "description")
              return -1;
            return 1;
          });
          for (let i = 0; i < message.params.length; i++) {
            this.#onReceive(message.params[i]);
            await delay(5);
          }
        }
      });
    }
  }
  manualSend(message) {
    const log = document.getElementById("send");
    const copy = document.getElementById("copy");
    const qr = document.getElementById("qrcode");
    this.#sendParams.params.push(message);
    const paramsString = JSON.stringify(this.#sendParams);
    if (log !== null) {
      message.from = this.#address;
      log.innerText = paramsString;
    }
    if (qr !== null) {
      qr.setAttribute("contents", paramsString);
    }
    if (copy !== null) {
      copy.addEventListener("click", () => {
        navigator.clipboard.writeText(paramsString);
      });
    }
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
function manualAddr() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
var delay = (ms) => new Promise((res) => setTimeout(res, ms));
export {
  RemoteNetworkHub
};
