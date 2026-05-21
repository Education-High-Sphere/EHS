import Fuse from 'fuse.js';

import courseRepository from '../repositories/cursos/cursoRepository.js';

let fuse;

const options = {
  keys: ['nome', 'descricao', 'categoria'],
  threshold: 0.4, // Ajuste a sensibilidade da busca
  shouldSort: true,
  includeScore: true
};

export async function setupSearch() {
    console.log("Carregando cursos para busca...");
    const courses = await courseRepository.findAll();

    fuse = new Fuse(courses, options);
    console.log('Busca inicializada com', courses.length, 'cursos.');
}

export function searchCourses(query) {
  if (!fuse) {
    throw new Error('Busca não inicializada. Chame setupSearch() primeiro.');
  }

  const results = fuse.search(query);
  return results;
};

