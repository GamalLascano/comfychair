import { expect, jest, test } from "@jest/globals";
import Usuario from "../user/usuario";
import Conferencia from "../conference/conferencia";
test("Crear conferencia", () => {
  const conferencia = crearConferencia();
  expect(conferencia.getAutores().length).toBe(4);
  expect(conferencia.getChairs().length).toBe(2);
  expect(conferencia.getRevisores().length).toBe(3);
});
test("Crear Track", () => {});
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
