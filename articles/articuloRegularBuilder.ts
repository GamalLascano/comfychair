import Usuario from "../user/usuario";
import { ArticuloRegular } from "./articuloRegular";
import { Builder } from "./builder";

export class ArticuloRegularBuilder implements Builder {
    private articulo: ArticuloRegular;
    constructor() {
        this.articulo = new ArticuloRegular();
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
    setAbstract(abstract: string): this {
        this.articulo.setAbstract(abstract)
        return this;
    }
    build():ArticuloRegular{
        return this.articulo;
    }
}