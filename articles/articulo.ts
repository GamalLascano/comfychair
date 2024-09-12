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
    
    public makeBid(user: Usuario, interes: InteresState){
        const newBid = new Bids(user, interes)
        this.bids.push(newBid)
    }

    public modifyBid(user: Usuario, interes: InteresState){
        var foundBid = this.bids.find((bid)=>{
            user == bid.getRevisor()
        })
        if (foundBid == undefined){
            throw new Error("The bid was not found")
        }
        const tempBidArray = this.bids.filter((bid)=>{bid !== foundBid})
        foundBid.setInteres(interes)
        tempBidArray.push(foundBid)
        this.bids = tempBidArray
    }

    public getAuthors(): Array<Usuario> {
        return this.autores;
    }

    public getBids() {
        return this.bids
    }

    public getRevisoresLength() {
        return this.revisores.length
    }

    public setRevisores(users: Usuario[]) {
        this.revisores=users
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