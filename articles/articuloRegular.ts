import Usuario from "../user/usuario";
import { Articulo } from "./articulo";

export class ArticuloRegular extends Articulo {
  private abstract: string;

  public constructor(){
    super()
    this.abstract = ""
  }

  public getAbstract(): string {
    return this.abstract;
  }

  public setAbstract(abstract: string) {
    this.abstract = abstract;
  }
}
