import { expect, jest, test } from "@jest/globals";
import Usuario from "../user/usuario";
import Conferencia from "../conference/conferencia";
import Track, { FormaSeleccionEnum } from "./track";
import { ArticuloRegular } from "../articles/articuloRegular";
import { ArticuloState } from "../articles/articulo";
import { ArticuloPoster } from "../articles/articuloPoster";

test("Crear conferencia", () => {
  const conferencia = crearConferencia();
  expect(conferencia.getAutores().length).toBe(4);
  expect(conferencia.getChairs().length).toBe(2);
  expect(conferencia.getRevisores().length).toBe(3);
});

test("Crear Track", () => {
  const fecha = new Date("24-06-2025")
  const newTrack = new Track("Session acerca de AI",fecha,3,FormaSeleccionEnum.CORTE_FIJO)
  const conferencia = crearConferencia();
  conferencia.addSession(newTrack)
  const index = conferencia.getSessions().findIndex(el=>el.getNombre() == "Session acerca de AI")
  expect(index).toBeGreaterThan(-1)
});

test("Crear Track y agregar articulos", () => {
  const conferencia = baseSetup()
  const index = conferencia.getSessions().findIndex(el=>el.getNombre() == "Session acerca de AI")
  expect(conferencia.getSessions()[index].getArticulos().length).toBe(4)
});

test("Crear Track con articulos y probar estados", () => {
  const conferencia = baseSetup()
  const index = conferencia.getSessions().findIndex(el=>el.getNombre() == "Session acerca de AI")
  const articulo1 = conferencia.getSessions()[index].getArticulos()[0]
  const articulo2 = conferencia.getSessions()[index].getArticulos()[1]
  const articulo3 = conferencia.getSessions()[index].getArticulos()[2]
  const articulo4 = conferencia.getSessions()[index].getArticulos()[3]
  conferencia.getSessions()[index].agregarArticulo(new ArticuloPoster("Paper 5","adjunto 5",conferencia.getAutores(),conferencia.getAutores()[2],"segundo adjunto"))
  const articulo5 = conferencia.getSessions()[index].getArticulos()[4]
  const artPasado = crearArticulo("Paper rechazable","adjunto", conferencia.getAutores(), conferencia.getAutores()[0], ABSTRACT_GENERAL);
  expect(articulo1.getEstado()).toBe(ArticuloState.RECIBIDO)
  expect(articulo2.getEstado()).toBe(ArticuloState.RECIBIDO)
  expect(articulo3.getEstado()).toBe(ArticuloState.RECHAZADO)
  expect(articulo4.getEstado()).toBe(ArticuloState.RECHAZADO)
  expect(articulo5.getEstado()).toBe(ArticuloState.RECIBIDO)
  const testFunction = ()=>{
    conferencia.getSessions()[index].agregarArticulo(artPasado,new Date("07/24/2025"))
  }
  expect(testFunction).toThrowError("No more articles are accepted at this stage")
})

function baseSetup(){
  const fecha = new Date("06/24/2025")
  const newTrack = new Track("Session acerca de AI",fecha,3,FormaSeleccionEnum.CORTE_FIJO)
  const conferencia = crearConferencia();
  conferencia.addSession(newTrack)
  const index = conferencia.getSessions().findIndex(el=>el.getNombre() == "Session acerca de AI")
  const atr1 = conferencia.getAutores().slice(1,2)
  const atr2 = conferencia.getAutores().slice(1,3)
  const atr3 = conferencia.getAutores().slice(0,1)
  const art1 = crearArticulo("Paper 1","adjunto", atr1, atr1[0], ABSTRACT_GENERAL);
  const art2 = crearArticulo("Paper 2","adjunto 2", atr2, atr2[0], ABSTRACT_GENERAL);
  const art3 = crearArticulo("Paper 3","adjunto 3", atr3, atr3[0], "");
  const art4 = crearArticulo("Paper 4","adjunto 4", [], conferencia.getAutores()[2], ABSTRACT_GENERAL);
  conferencia.getSessions()[index].agregarArticulo(art1,new Date("06/24/2024"))
  conferencia.getSessions()[index].agregarArticulo(art2,new Date("06/24/2024"))
  conferencia.getSessions()[index].agregarArticulo(art3,new Date("06/24/2024"))
  conferencia.getSessions()[index].agregarArticulo(art4,new Date("06/24/2024"))
  return conferencia
}

function crearArticulo(titulo: string, adjunto: string, autores: Array<Usuario>, designado: Usuario, abstract: string) {
  const newArticulo = new ArticuloRegular(titulo, adjunto, autores, designado, abstract)
  return newArticulo
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
enter`