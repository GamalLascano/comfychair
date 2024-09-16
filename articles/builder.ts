import Usuario from "../user/usuario";

export interface Builder {
    setTitulo(titulo: string): this;
    setAdjunto(adjunto: string): this;
    setAutores(autores: Array<Usuario>): this;
    setAutorNotificado(autor: Usuario): this;
}