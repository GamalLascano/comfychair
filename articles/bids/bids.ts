class Bids {
    private revisor: Usuario;
    private interes: InteresState;

    public constructor(revisor: Usuario, interes: InteresState) {
        this.revisor = revisor;
        this.interes = interes;
    }

    public getRevisor(): Usuario {
        return this.revisor;
    }

    public getInteres(): InteresState {
        return this.interes;
    }

    public setInteres(interes: InteresState) {
        this.interes = interes;
    }
    
}

enum InteresState {
    INTERESADO = "Interesado",
    NO_INTERESADO = "No interesado",
    QUIZAS = "Quizas"
}