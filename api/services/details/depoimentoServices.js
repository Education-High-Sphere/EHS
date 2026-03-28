import depoimentoRepository from "../../repositories/details/depoimentoRepository.js";

export async function getRandomDepoimentos() {
  const depoimentos = await depoimentoRepository.findAll();
  return depoimentos;
}