class ArticuloRegular extends Articulo{
    private abstract: string;

    public constructor(titulo: string, adjunto: string, autores: Array<Usuario>, autorNotificado: Usuario, abstract: string) {
        super(titulo, adjunto, autores, autorNotificado);
        this.abstract = abstract;
    }

    public getAbstract(): string {
        return this.abstract;
    }
}