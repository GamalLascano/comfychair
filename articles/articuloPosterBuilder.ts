import Usuario from "../user/usuario";
import { ArticuloPoster } from "./articuloPoster";
import { Builder } from "./builder";

export class ArticuloPosterBuilder implements Builder {
    private articulo: ArticuloPoster;
    constructor() {
        this.articulo = new ArticuloPoster();
    }
    setTitulo(titulo: string): this {
        this.articulo.setTitulo(titulo);
        return this;
    }
    setAdjunto(adjunto: string): this {
        this.articulo.setAdjunto(adjunto);
        return this;
    }
    setAutores(autores: Array<Usuario>): this {
        this.articulo.setAutores(autores);
        return this;
    }
    setAutorNotificado(autor: Usuario): this {
        this.articulo.setAutorNotificado(autor);
        return this;
    }
    setSegundoAdjunto(adjunto: string): this {
        this.articulo.setSegundoAdjunto(adjunto)
        return this;
    }
    build():ArticuloPoster{
        return this.articulo;
    }
}