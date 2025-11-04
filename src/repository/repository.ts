import VtoApi from "./google-vto";
import VertextAiApi from "./gemini-flash";

export default class Repository {
  vtoApi: VtoApi
  vertexApi: VertextAiApi
  constructor() {
    this.vtoApi = new VtoApi();
    this.vertexApi = new VertextAiApi();
  }
}