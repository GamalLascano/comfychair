import Usuario from "../user/usuario";
import { Articulo } from "./articulo";

export class ArticuloPoster extends Articulo{
    private segundoAdjunto: string;

    public constructor() {
        super()
        this.segundoAdjunto = "";
    }

    public setSegundoAdjunto(segundoAdjunto: string) {
        this.segundoAdjunto = segundoAdjunto;
    }

}