import { createMatrix, checkConflicts } from "./gerarMatriz.js";
import { crossing } from "./funcoes/cruzamento.js";
import { mutation } from "./funcoes/mutacao.js";
import { selection } from "./funcoes/selecao.js";

document.querySelector(".generator button").addEventListener("click", () => {
  if (teachers.length === 0 || subjects.length === 0) {
    console.error("Dados ainda não carregados!");
    return;
  }
  const pop = createMatrix();
  const conflicts = checkConflicts(pop);

  const [bestIndex, randomIndex] = selection(conflicts);
  const pais = [pop[bestIndex], pop[randomIndex]];

  const filhos = [Array(100).fill("Livre"), Array(100).fill("Livre")];

  crossing(pais, filhos);

  mutation(filhos);

  const best = filhos[0]; 

  const tables = document.querySelectorAll(".viewClasses table");

  tables.forEach((table, weekIndex) => {
    const tbody = table.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");

    for (let day = 0; day < 5; day++) {
      for (let time = 0; time < 4; time++) {
        const columnIndex = weekIndex * 20 + day * 4 + time;
        const value = best[columnIndex] || "Livre";
        rows[time].children[day].textContent = value;
      }
    }
  });

  console.log("Conflitos:", conflicts);
  console.log("Pais selecionados:", bestIndex, randomIndex);
});

function runGeneticAlgorithm(generations = 50, pc = 0.7, pm = 0.1) {
  let pop = createMatrix();
  let bestIndividual = null;
  let bestScore = Infinity;

  for (let gen = 0; gen < generations; gen++) {
    const conflicts = checkConflicts(pop);
    const scored = pop.map((ind, i) => ({ ind, score: conflicts[i], index: i }));

    scored.sort((a, b) => a.score - b.score);
    if (scored[0].score < bestScore) {
      bestScore = scored[0].score;
      bestIndividual = scored[0].ind;
    }

    const nextPop = [];

    while (nextPop.length < 10) {
      const [i1, i2] = selection(conflicts); 
      const p1 = pop[i1];
      const p2 = pop[i2];

      let children = crossing([p1, p2], pc, 2);
      children = mutation(children, pm);

      nextPop.push(...children);
    }

    pop = nextPop.slice(0, 10);
  }

  return bestIndividual;
}
