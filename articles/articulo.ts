abstract class Articulo {
    private titulo: string;
    private adjunto: string;
    private bids: Array<Bids>;
    private autores: Array<Usuario>;
    private autorNotificado: Usuario;
    private estado: ArticuloState;
    private revision: Array<Revision>;
    private revisores: Array<Usuario>;

    public constructor(titulo: string, adjunto: string, autores: Array<Usuario>, autorNotificado: Usuario) {
        this.titulo = titulo;
        this.adjunto = adjunto;
        this.autores = autores;
        this.autorNotificado = autorNotificado;
        this.estado = ArticuloState.RECIBIDO;
        this.bids = [];
        this.revision = [];
        this.revisores = [];
    }
    
    public getTitulo(): string {
        return this.titulo;
    }
    
    public getAuthors(): Array<Usuario> {
        return this.autores;
    }

    public setEstado(estado: ArticuloState): void {
        this.estado = estado
    }
}

enum ArticuloState {
    RECIBIDO = "Recibido",
    RECHAZADO = "Rechazado",
    BIDDING = "Bidding",
    REVISION = "Revision",
    ACEPTADO = "Aceptado",
}