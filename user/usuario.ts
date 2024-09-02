class Usuario {
    private nombre: string;
    private afiliacion: string;
    private email: string;
    private password: string;
    
    constructor(nombre: string, afiliacion: string, email: string, password: string) {
        this.nombre = nombre;
        this.afiliacion = afiliacion;
        this.email = email;
        this.password = password;
    }

    public getNombre(): string {
        return this.nombre;
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