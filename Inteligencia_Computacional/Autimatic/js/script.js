import { createMatrix, checkConflicts } from "./gerarMatriz.js";
import { crossing } from "./funcoes/cruzamento.js";
import { mutation } from "./funcoes/mutacao.js";
import { selection } from "./funcoes/selecao.js";


document.querySelector(".generator button").addEventListener("click", () => {
  const best = runGeneticAlgorithm(); // matriz 10x100
  const bestFlat = [];

  // Transforma a matriz 10x100 em um array linear de 100 células,
  // onde cada coluna representa a aula de uma turma
  for (let col = 0; col < 100; col++) {
    let found = false;
    for (let row = 0; row < 10; row++) {
      const cell = best[row][col];
      if (cell !== "Livre" && !found) {
        bestFlat[col] = cell;
        found = true;
      }
    }
    if (!found) bestFlat[col] = "Livre";
  }

  // Mapeia os dados nas 5 tabelas
  const tables = document.querySelectorAll(".viewClasses table");

  tables.forEach((table, turmaIndex) => {
    const tbody = table.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");

    for (let time = 0; time < 4; time++) { // 4 horários por dia
      for (let day = 0; day < 5; day++) { // 5 dias por semana
        const index = turmaIndex * 20 + day * 4 + time;
        const value = bestFlat[index] || "Livre";
        rows[time].children[day].textContent = value;
        rows[time].children[day].className = value === "Livre" ? "free" : "busy";
      }
    }
  });
});

function runGeneticAlgorithm(generations = 50, pc = 0.7, pm = 0.1) {
  let pop = Array.from({ length: 10 }, () => createMatrix());
  let bestIndividual = null;
  let bestScore = Infinity;

  for (let gen = 0; gen < generations; gen++) {
    const conflictScores = pop
      .map(checkConflicts)
      .map((arr) => arr.reduce((a, b) => a + b));
    const scored = pop.map((ind, i) => ({
      ind,
      score: conflictScores[i],
      index: i,
    }));

    scored.sort((a, b) => a.score - b.score);
    if (scored[0].score < bestScore) {
      bestScore = scored[0].score;
      bestIndividual = scored[0].ind;
    }

    const nextPop = [];

    while (nextPop.length < 10) {
      const [i1, i2] = selection(conflictScores);
      const p1 = pop[i1];
      const p2 = pop[i2];

      let children = crossing([p1, p2], pc, 2);
      children = mutation(children, pm);

      nextPop.push(...children);
    }

    pop = nextPop.slice(0, 10);

    console.log(`Geração ${gen + 1} | Melhor conflito: ${scored[0].score}`);
  }

  return bestIndividual;
}
