let teachers = [];
let subjects = [];

Promise.all([
  fetch("../data/professores.json").then((res) => res.json()),
  fetch("../data/materias.json").then((res) => res.json()),
])
  .then(([professoresData, materiasData]) => {
    teachers = Object.values(professoresData);
    subjects = Object.values(materiasData);

    document
      .querySelector(".generator button")
      .addEventListener("click", () => {
        const matrix = createMatrix();
      });
  })
  .catch((err) => console.error("Erro ao carregar os dados:", err));

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createMatrix() {
  if (!teachers.length || !subjects.length) {
    throw new Error("Professores ou matérias ainda não carregados!");
  }

  const numTeachers = teachers.length;
  const pop = Array.from({ length: numTeachers }, () =>
    Array(100).fill("Livre")
  );

  for (let i = 0; i < 100; i++) {
    const t = generateRandomNumber(0, numTeachers - 1);
    const subjectIndex = generateRandomNumber(0, subjects.length - 1);

    if (teachers[t] && subjects[subjectIndex]) {
      pop[t][i] = `${teachers[t]}: ${subjects[subjectIndex]}`;
    }
  }

  return pop;
}
export function checkConflicts(pop) {
  const teacherConflicts = Array(pop.length).fill(0);

  for (let time = 0; time < 20; time++) {
    const co = {};
    for (let semester = 0; semester < 5; semester++) {
      const colIndex = semester * 20 + time;

      for (let teacher = 0; teacher < pop.length; teacher++) {
        const row = pop[teacher];
        if (!row) continue;

        const value = row[colIndex];
        if (!value || value === "Livre") continue;

        const name = value.split(":")[0].trim();
        if (!co[name]) co[name] = 0;
        co[name]++;
      }
    }

    for (let name in co) {
      if (co[name] > 1) {
        const conflicts = co[name] - 1;
        const t = pop.findIndex(
          (row) =>
            Array.isArray(row) &&
            row.some(
              (cell) => typeof cell === "string" && cell.startsWith(name)
            )
        );
      }
    }
  }

  return [...teacherConflicts].sort((a, b) => a - b);
}
