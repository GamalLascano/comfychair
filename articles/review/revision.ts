class Revision {
    private revisor: Usuario;
    private calificacion: Number;
    private descripcion: string;

    public constructor(revisor: Usuario, calificacion: Number, descripcion: string) {
        this.revisor = revisor;
        this.calificacion = calificacion;
        this.descripcion = descripcion
    }

    public getRevisor(): Usuario {
        return this.revisor;
    }

    public getCalificacion(): Number {
        return this.calificacion;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }
}