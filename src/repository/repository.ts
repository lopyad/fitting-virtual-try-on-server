import VtoApi from "./google-vto";
import VertextAiApi from "./gemini-flash";
import { FileProductRepository } from './file-product';

export default class Repository {
  vtoApi: VtoApi;
  vertexApi: VertextAiApi;
  product: FileProductRepository;

  constructor() {
    this.vtoApi = new VtoApi();
    this.vertexApi = new VertextAiApi();
    this.product = new FileProductRepository();
  }
}