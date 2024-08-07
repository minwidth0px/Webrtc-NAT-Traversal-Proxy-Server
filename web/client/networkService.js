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
export {
  networkService_default as default
};
