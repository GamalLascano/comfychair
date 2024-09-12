class Usuario {
    private nombre: string;
    private afiliacion: string;
    private email: string;
    private password: string;
    private reviews: string[];
    
    constructor(nombre: string, afiliacion: string, email: string, password: string) {
        this.nombre = nombre;
        this.afiliacion = afiliacion;
        this.email = email;
        this.password = password;
        this.reviews = [];
    }

    public getNombre(): string {
        return this.nombre;
    }

    public addReview(name:string) {
        this.reviews.push(name);
    }

    public getReviewLength(){
        return this.reviews.length;
    }

    public getAfiliacion(): string {
        return this.afiliacion;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }
}