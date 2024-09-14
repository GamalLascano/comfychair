import Usuario from "../user/usuario";
import { Articulo } from "./articulo";

export class ArticuloPoster extends Articulo{
    private segundoAdjunto: string;

    public constructor(titulo: string, adjunto: string, autores: Array<Usuario>, autorNotificado: Usuario, segundoAdjunto: string) {
        super(titulo, adjunto, autores, autorNotificado);
        this.segundoAdjunto = segundoAdjunto;
    }
    
}