import diferenciaisRepository from "../../repositories/details/diferenciaisRepository.js";

export async function getAllDiferenciais() {
    const diferenciais = await diferenciaisRepository.findAll();
    return diferenciais;
}