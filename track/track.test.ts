import { expect, jest, test } from "@jest/globals";
import Usuario from "../user/usuario";
import Conferencia from "../conference/conferencia";
import Track from "./track";
import { ArticuloRegular } from "../articles/articuloRegular";
import { ArticuloState } from "../articles/articulo";
import { ArticuloPoster } from "../articles/articuloPoster";
import { CorteFijoStrategy } from "./strategy/corteFijoStrategy";
import { InteresState } from "../articles/bids/bids";
import { MejoresStrategy } from "./strategy/mejoresStrategy";

test("Crear conferencia", () => {
  const conferencia = crearConferencia();
  expect(conferencia.getAutores().length).toBe(4);
  expect(conferencia.getChairs().length).toBe(2);
  expect(conferencia.getRevisores().length).toBe(3);
});

test("Crear Track", () => {
  const fecha = new Date("24-06-2025");
  const conferencia = crearConferencia();
  const newTrack = new Track(
    "Session acerca de AI",
    fecha,
    3,
    new CorteFijoStrategy(50),
    conferencia.getRevisores()
  );

  conferencia.addSession(newTrack);
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  expect(index).toBeGreaterThan(-1);
});

test("Crear Track y agregar articulos", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  expect(conferencia.getSessions()[index].getArticulos().length).toBe(4);
});

test("Crear Track con articulos y probar estados", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  const articulo1 = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2 = conferencia.getSessions()[index].getArticulos()[1];
  const articulo3 = conferencia.getSessions()[index].getArticulos()[2];
  const articulo4 = conferencia.getSessions()[index].getArticulos()[3];
  conferencia
    .getSessions()
    [index].agregarArticulo(
      new ArticuloPoster(
        "Paper 5",
        "adjunto 5",
        conferencia.getAutores(),
        conferencia.getAutores()[2],
        "segundo adjunto"
      )
    );
  const articulo5 = conferencia.getSessions()[index].getArticulos()[4];
  const artPasado = crearArticulo(
    "Paper rechazable",
    "adjunto",
    conferencia.getAutores(),
    conferencia.getAutores()[0],
    ABSTRACT_GENERAL
  );
  expect(articulo1.getEstado()).toBe(ArticuloState.RECIBIDO);
  expect(articulo2.getEstado()).toBe(ArticuloState.RECIBIDO);
  expect(articulo3.getEstado()).toBe(ArticuloState.RECHAZADO);
  expect(articulo4.getEstado()).toBe(ArticuloState.RECHAZADO);
  expect(articulo5.getEstado()).toBe(ArticuloState.RECIBIDO);
  const testFunction = () => {
    conferencia
      .getSessions()
      [index].agregarArticulo(artPasado, new Date("07/24/2025"));
  };
  expect(testFunction).toThrowError(
    "No more articles are accepted at this stage"
  );
});

test("Crear Track con articulos y editar articulo", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  const articulo3 = conferencia.getSessions()[index].getArticulos()[2];
  if (articulo3 instanceof ArticuloRegular) {
    articulo3.setAbstract(ABSTRACT_GENERAL);
  }
  expect(articulo3.getEstado()).toBe(ArticuloState.RECHAZADO);
  conferencia
    .getSessions()
    [index].editarArticulo(articulo3, new Date("06/25/2024"));
  const a3rIndex = conferencia
    .getSessions()
    [index].getArticulos()
    .findIndex((el) => el.getTitulo() == articulo3.getTitulo());
  const a3r = conferencia.getSessions()[index].getArticulos()[a3rIndex];
  expect(a3r.getEstado()).toBe(ArticuloState.RECIBIDO);
});

test("Crear Track con articulos y editar articulo fuera de tiempo", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  const articulo3 = conferencia.getSessions()[index].getArticulos()[2];
  if (articulo3 instanceof ArticuloRegular) {
    articulo3.setAbstract(ABSTRACT_GENERAL);
  }
  expect(articulo3.getEstado()).toBe(ArticuloState.RECHAZADO);
  const editarError = () => {
    conferencia
      .getSessions()
      [index].editarArticulo(articulo3, new Date("06/25/2027"));
  };

  expect(editarError).toThrowError("You cannot edit this article anymore");
});

test("Crear Track con articulos y pasar a bidding", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  const articulo1 = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2 = conferencia.getSessions()[index].getArticulos()[1];
  const articulo3 = conferencia.getSessions()[index].getArticulos()[2];
  const articulo4 = conferencia.getSessions()[index].getArticulos()[3];
  expect(articulo1.getEstado()).toBe(ArticuloState.RECIBIDO);
  expect(articulo2.getEstado()).toBe(ArticuloState.RECIBIDO);
  expect(articulo3.getEstado()).toBe(ArticuloState.RECHAZADO);
  expect(articulo4.getEstado()).toBe(ArticuloState.RECHAZADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2S = conferencia.getSessions()[index].getArticulos()[1];
  expect(conferencia.getSessions()[index].getArticulos().length).toBe(2);
  expect(articulo1S.getEstado()).toBe(ArticuloState.BIDDING);
  expect(articulo2S.getEstado()).toBe(ArticuloState.BIDDING);
});

test("Pasar a bidding y hacer bids", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  expect(
    conferencia.getSessions()[index].getArticulos()[0].getBids().length
  ).toBe(2);
});

test("Pasar a bidding, hacer bids y pasar a review", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2R = conferencia.getSessions()[index].getArticulos()[1];
  const reviewers = articulo1R.getRevisores();
  const reviewers2 = articulo2R.getRevisores();
  expect(reviewers.length).toBe(3);
  expect(reviewers2.length).toBe(3);
});

test("Pasar a bidding, hacer bids y pasar a review con otro reviewer mas", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index];
  const profe = new Usuario("Profesor", "UBA", "probe@uba.edu.ar", "1234");
  conferencia.addReviewer(profe);
  expect(conferencia.getSessions()[index].getRevisores().length).toBe(4);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = revisores[0];
  const revisor2 = revisores[1];
  const revisor3 = revisores[2];
  const revisor4 = revisores[3];
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.QUIZAS);
  articulo1S.makeBid(revisor2, InteresState.NO_INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2R = conferencia.getSessions()[index].getArticulos()[1];
  const reviewers = articulo1R.getRevisores();
  const reviewers2 = articulo2R.getRevisores();
  expect(reviewers.length).toBe(3);
  expect(reviewers2.length).toBe(3);
  expect(revisor1.getReviewLength()).toBe(2);
  expect(revisor2.getReviewLength()).toBe(1);
  expect(revisor3.getReviewLength()).toBe(2);
  expect(revisor4.getReviewLength()).toBe(1);
});

test("Pasar a bidding, no hacer bids y pasar a review con otro reviewer mas", () => {
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index];
  const profe = new Usuario("Profesor", "UBA", "probe@uba.edu.ar", "1234");
  conferencia.addReviewer(profe);
  expect(conferencia.getSessions()[index].getRevisores().length).toBe(4);
  conferencia.getSessions()[index].avanzarEstado();
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = revisores[0];
  const revisor2 = revisores[1];
  const revisor3 = revisores[2];
  const revisor4 = revisores[3];
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2R = conferencia.getSessions()[index].getArticulos()[1];
  const reviewers = articulo1R.getRevisores();
  const reviewers2 = articulo2R.getRevisores();
  expect(reviewers.length).toBe(3);
  expect(reviewers2.length).toBe(3);
  expect(revisor1.getReviewLength()).toBe(2);
  expect(revisor2.getReviewLength()).toBe(2);
  expect(revisor3.getReviewLength()).toBe(1);
  expect(revisor4.getReviewLength()).toBe(1);
});

test("Pasar a review, y puntuar",()=>{
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2R = conferencia.getSessions()[index].getArticulos()[1];
  const reviewers = articulo1R.getRevisores();
  const reviewers2 = articulo2R.getRevisores();
  reviewers.forEach((reviewer)=>{
    articulo1R.makeReview(reviewer, 3, "Excelente")
  })
  reviewers2.forEach((reviewer)=>{
    articulo2R.makeReview(reviewer, 1, "Bueno")
  })
  expect(articulo1R.getPuntaje()).toBe(9)
  expect(articulo2R.getPuntaje()).toBe(3)
})

test("Pasar a review, puntuar con un usuario no permitido",()=>{
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const fakeReviewer = conferencia.getChairs()[0]
  const fakeExecution = ()=>{
    articulo1R.makeReview(fakeReviewer, 3, "Excelente")
  }
  expect(fakeExecution).toThrowError("This user is not allowed to make a review")
})

test("Pasar a review, puntuar con un puntaje no permitido",()=>{
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const reviewers = articulo1R.getRevisores();
  const fakeExecution = ()=>{
    articulo1R.makeReview(reviewers[0], 4, "Excelente")
  }
  expect(fakeExecution).toThrowError("Puntuacion no valida")
})

test("Pasar a review, y puntuar de vuelta con un reviewer",()=>{
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2R = conferencia.getSessions()[index].getArticulos()[1];
  const reviewers = articulo1R.getRevisores();
  const reviewers2 = articulo2R.getRevisores();
  reviewers.forEach((reviewer)=>{
    articulo1R.makeReview(reviewer, 3, "Excelente")
  })
  reviewers2.forEach((reviewer)=>{
    articulo2R.makeReview(reviewer, 1, "Bueno")
  })
  const fakeExecution = ()=>{
    articulo1R.makeReview(reviewers[0], 3, "Excelente")
  }
  expect(fakeExecution).toThrowError("This user already made a review")
})

test("Pasar a seleccion, y filtrar",()=>{
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2R = conferencia.getSessions()[index].getArticulos()[1];
  const reviewers = articulo1R.getRevisores();
  const reviewers2 = articulo2R.getRevisores();
  reviewers.forEach((reviewer)=>{
    articulo1R.makeReview(reviewer, 3, "Excelente")
  })
  reviewers2.forEach((reviewer)=>{
    articulo2R.makeReview(reviewer, 1, "Bueno")
  })
  conferencia.getSessions()[index].avanzarEstado();
  const seleccionadosCorteFijo = conferencia.getSessions()[index].seleccionarArticulos()
  expect(seleccionadosCorteFijo.length).toBe(1)
  conferencia.getSessions()[index].setFormaSeleccion(new MejoresStrategy(2))
  const seleccionadosMejores = conferencia.getSessions()[index].seleccionarArticulos()
  expect(seleccionadosMejores.length).toBe(2)
  conferencia.getSessions()[index].setFormaSeleccion(new CorteFijoStrategy(30))
  const seleccionadosCorteFijo2 = conferencia.getSessions()[index].seleccionarArticulos()
  expect(seleccionadosCorteFijo2.length).toBe(1)
  conferencia.getSessions()[index].confirmarSeleccionArticulos()
  expect(conferencia.getSessions()[index].getArticulos().length).toBe(1)
})

test("Pasar a seleccion, y pasarse de largo",()=>{
  const conferencia = baseSetup();
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1S = conferencia.getSessions()[index].getArticulos()[0];
  const revisores = conferencia.getSessions()[index].getRevisores();
  const revisor1 = conferencia.getSessions()[index].getRevisores()[0];
  const revisor2 = conferencia.getSessions()[index].getRevisores()[1];
  expect(revisores.length).toBe(3);
  articulo1S.makeBid(revisor1, InteresState.INTERESADO);
  articulo1S.makeBid(revisor2, InteresState.INTERESADO);
  conferencia.getSessions()[index].avanzarEstado();
  const articulo1R = conferencia.getSessions()[index].getArticulos()[0];
  const articulo2R = conferencia.getSessions()[index].getArticulos()[1];
  const reviewers = articulo1R.getRevisores();
  const reviewers2 = articulo2R.getRevisores();
  reviewers.forEach((reviewer)=>{
    articulo1R.makeReview(reviewer, 3, "Excelente")
  })
  reviewers2.forEach((reviewer)=>{
    articulo2R.makeReview(reviewer, 1, "Bueno")
  })
  conferencia.getSessions()[index].avanzarEstado();
  const intentarPasarAOtroEstado = ()=>{
    conferencia.getSessions()[index].avanzarEstado();
  }
  expect(intentarPasarAOtroEstado).toThrowError("Ya se llego al ultimo estado")
})

function baseSetup() {
  const fecha = new Date("06/24/2025");
  const conferencia = crearConferencia();
  const newTrack = new Track(
    "Session acerca de AI",
    fecha,
    3,
    new CorteFijoStrategy(50),
    conferencia.getRevisores()
  );
  conferencia.addSession(newTrack);
  const index = conferencia
    .getSessions()
    .findIndex((el) => el.getNombre() == "Session acerca de AI");
  const atr1 = conferencia.getAutores().slice(1, 2);
  const atr2 = conferencia.getAutores().slice(1, 3);
  const atr3 = conferencia.getAutores().slice(0, 1);
  const art1 = crearArticulo(
    "Paper 1",
    "adjunto",
    atr1,
    atr1[0],
    ABSTRACT_GENERAL
  );
  const art2 = crearArticulo(
    "Paper 2",
    "adjunto 2",
    atr2,
    atr2[0],
    ABSTRACT_GENERAL
  );
  const art3 = crearArticulo("Paper 3", "adjunto 3", atr3, atr3[0], "");
  const art4 = crearArticulo(
    "Paper 4",
    "adjunto 4",
    [],
    conferencia.getAutores()[2],
    ABSTRACT_GENERAL
  );
  conferencia
    .getSessions()
    [index].agregarArticulo(art1, new Date("06/24/2024"));
  conferencia
    .getSessions()
    [index].agregarArticulo(art2, new Date("06/24/2024"));
  conferencia
    .getSessions()
    [index].agregarArticulo(art3, new Date("06/24/2024"));
  conferencia
    .getSessions()
    [index].agregarArticulo(art4, new Date("06/24/2024"));
  return conferencia;
}

function crearArticulo(
  titulo: string,
  adjunto: string,
  autores: Array<Usuario>,
  designado: Usuario,
  abstract: string
) {
  const newArticulo = new ArticuloRegular(
    titulo,
    adjunto,
    autores,
    designado,
    abstract
  );
  return newArticulo;
}

function crearConferencia() {
  const pablo = new Usuario("Pablo", "UNLP", "pablo@unlp.edu.ar", "1234");
  const pedro = new Usuario("Pedro", "UNLP", "pedro@unlp.edu.ar", "1234");
  const patricio = new Usuario(
    "Patricio",
    "UNLP",
    "patricio@unlp.edu.ar",
    "1234"
  );
  const mabel = new Usuario("Mabel", "UNLP", "mabel@unlp.edu.ar", "1234");
  const maria = new Usuario("Maria", "UNLP", "maria@unlp.edu.ar", "1234");
  const tomas = new Usuario("Tomas", "UNLP", "tomas@unlp.edu.ar", "1234");
  const chairs = [mabel, tomas];
  const revisores = [pablo, pedro, tomas];
  const autores = [patricio, pablo, pedro, maria];
  const conferencia = new Conferencia(chairs, revisores, autores);
  return conferencia;
}

const ABSTRACT_GENERAL = `xhdzcyygue 
gcybvascxt 
ewtqseslna 
tsvmzhjkuw 
yzsaztdyqc 
aayluuwize 
wbgwanooyc 
zzymzgswlz 
xblktifbev 
pylfngmnnk 
kisozismdx 
vkreyfxquv 
vwbjhcgxco 
aymvtkxhue 
inycnkuunj 
afmbebwzvq 
alguewitma 
zyerftrxem 
bvmruhnbbl 
ccunktuptf 
zbcwczcvto 
xflijvsnby 
pkqrghzlcs 
yegxbdinmh 
vldykwcxgr 
vkemqughai 
xlikozdmnz 
supgcyzhdt 
ozwkywfjyr 
xnjxlwhtli 
nyipagwgeg 
grytcxslik 
ezzcggfnuf 
mizsrydfbd 
oflmfmvyne 
rpflqwnzep 
jrkkjqwvsw 
hnaulamyto 
vamenxlxeo 
fvysfkhgzj  
ulratsfvyy  
wjbdofzphe 
kcdrodxjwt 
ybvmvdkmmf 
piphzzrgbs 
scwejdvjtn 
mveozquodu 
uuejwmvbcn 
ypvbakwlmz 
wcbzydzwwm 
wncpfduulf 
wwaxqpcftp 
qkilmpqixg 
walmxzhdof 
jhawhyooot 
mubrqctpip 
dktbxwzjrx 
tgsvuhcszg 
vpasljcckl 
qewlafllzj 
xvtfvltvof 
mlxdvzgllv 
kltdynnkir 
cjlwhvwaay 
bkujvyftff 
inzfnkvmul 
smlrcttqom 
jnvyaetufc 
ltxyqccguy 
kskzborqdc 
mkicxvsmlp 
xwatmzdyza 
artxzcsbzm 
amijtjignw 
fxpbrtgkzn 
ajhiljmvdz 
ribckypgpm 
xfsuwokhsy 
rhzydaotfv 
dzwkzcdvdk 
drmqpshicv 
xtxtsbwwfl 
sbljhsvevh 
ejvmnlxezz 
pcrbxldtvv 
qmiplsbbnh 
gqprqszvxv 
htgedhmbif 
jjycblrkhf 
oprzntpzoc 
oyshibjhss 
zutknniyay 
afpmaubhni 
ziponwqmjj 
twqdckrrms 
fucezyizcb 
ycmmbxvnzl 
hnwgruunce 
tuihlxehqs 
mmuimfyouq 
zejygraxfn 
dnvfjfdvep 
xitnxsequl 
pkfkwtgkzq 
bdrkihsbqq 
ojewovifjt 
khkzojcquy 
sgcjohrmye 
zxcdswxmlu 
qmxlkyfvpx 
vhqhbxtqal 
xknxrpmrcw 
hjutpdydwx 
djhvquklzz 
bxyvsmecmv 
rwvjtzoqix 
rjlfjnujfx 
jgavuljjtd 
vbrxyprdek 
mgmbozuzuo 
pwlzzjlive 
ufshmzfkxa 
nfvhixpawb 
zkuzvnsdfm 
cbqwtpksgz 
lrwwyzqmrr 
pyzakrcnkp 
asvatjrkym 
kgkuaizevr 
owwcqxewou 
rowlsnyilt 
octhjfbgci 
swdjbugrwh 
tczzkzmikp 
oevctkgyfk 
kjgvxxqyff 
agzsgtmeyk 
gazpskoabu 
bhsysqhtwe 
bwerzsnbmr 
aydmiglwoy 
qrjjshgvfg 
ujuiizhbfa 
nggihpmzuq 
nzfbovwvvb 
fumhcnqajw 
nhcrteodsj 
pxfmwopjpb 
xrwbhszmuz 
fcmeexmlcp 
ckaxuvnhqk 
erxhbqnzby 
ynxfgknsma 
hwhchzachg 
lyyqqmbmzp 
eviynhslis 
dobmvbanqi 
ddjfxncbnu 
atloqleibm 
yxebaokviv 
mfadwgcjrm 
juwegauywc 
xmyrwfupbe 
sarnatrbjz 
lxlmlpyqiz 
zbkwchyllc 
tdhdlmxend 
cxppcjjupp 
qfbauppoto 
qkupwqguaj 
dyxbctvshb 
fgzyysjyth 
mkrajtlufp 
qzkwobuvbn 
bdlrmncati 
gyrabkbmgb 
kgduhtaxjk 
kysdjatdhj 
rioakxmlmv 
huepbgqgfa 
ymkkmbvyhr 
lqgjecpwcl 
whddctogrx 
hdaaozqfmh 
rwtfkhthcz 
cnbdoazwkw 
dxjsmzwvzi 
xpvwnqftjr 
mpxxjbcrkh 
grgzkozoqw 
woozxlldar 
traiuzvdww 
rltxztmcgg 
trcmrvefan 
nduvinbkpx 
gjebsboayk 
atjgituobg 
dirhcsflhi 
uswtzdutfm 
mnqzgwxbew 
lhuwjtaufu 
rndsoikbjb 
fdrxgmwsnh 
ohgpbvmufz 
onlwthsyeo 
xcacfwzhmp 
ihtutkunyr 
lmzzykpbhk 
edhxdqvyvf 
qdtkaolgsr 
qhyppxeuaq 
avoewxcvea 
bcdnxkjiah 
fchnfrnpwo 
wcmwzhcgtu 
dlcekeojfq 
sudeszsoxm 
vjmvnsosjd 
wupnekzwci 
tofyhqcltu 
yllezlmewr 
ukdhfppzvp 
wrnryxckhz 
ktvexzfxav 
xcfkhzusye 
dpophzijii 
tsxrbnjcqd 
kndzmnoddr 
rtggfcuclg 
wuvwmeiyvj 
oiobbdhuia 
keoqwksdot 
hnyzqeymns 
kgukrvtohr 
rwxgcifydj 
diivgzuvlj 
tycxnfmfqx 
bufzkzhlpe 
nqazyqtokk 
navfnvdoyz 
gggwynynwo 
wylsurnbbs 
huhibggzpx 
mstnpkcwpp 
utmuswqnua 
cdbczpwrxd 
mzdphcxnli 
rrhodmsdzu 
nnrtyrvrvk 
hyfpfpuxnc 
xgaajknmhw 
dpswkoostx 
svsimaixpx 
eekjgcryxo 
tjadxvfwjy 
mwluwxovoy 
vtsasnrzes 
sticpaugfu 
ujhmmcolsw 
ylikqleyse 
zruhpkmgqo 
lursxlztrt 
ijpcftcqyg 
djniyimqcc 
byjrlirvqr 
bgdrldctcl 
fygexsabvi 
byhqztledu 
ekxvkrnoov 
wzejxoblki 
cllrzapcvm 
wdfqomegdo 
hgqsbxylbt 
vwqfxewmiu 
dylpchfoyp 
ggejoupcqy 
rcctqyapaw 
astockahoy 
lrwhzuwxsn 
ahhgfhstnz 
bthvfhvkbp 
yxlgnsgffm 
joqvbdlahs 
jzrzhrshvb 
zmqlzddcaq 
nvtvlzvkml 
vidvxohpie 
wwcrrvpjbh 
daiakrsdba 
xgzamtzuum 
qurjraurvq 
kzcwlhzacf 
uuyrszousb 
jjqaxyetsz 
hjuibzoyla 
qvtmxlhbir 
dtdfytbbtr 
horqreqrap 
wizlyyvhfb 
mtduakpcqw 
enter`;
