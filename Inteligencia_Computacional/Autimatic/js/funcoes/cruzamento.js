export function crossing(parents, pc = 0.7, cuts = 2) {
    const children = [
        Array(100).fill(""),
        Array(100).fill("")
    ];
    const pontosCortes = new Set();
    const random = Math.random();
    let cruza = false;

    if (random < pc) {
        if (cuts < 1) cuts = 1;
        if (cuts > 4) cuts = 4;

        while (pontosCortes.size < cuts) {
            pontosCortes.add(Math.floor(Math.random() * 4) + 1);
        }

        const pontos = Array.from(pontosCortes).sort((a, b) => a - b);
        let i = 0;

        
        for (const element of pontos) {
            const aux = element * 20;
            for (let j = i; j < aux; j++) {
                children[0][j] = cruza ? parents[1][j] : parents[0][j];
                children[1][j] = cruza ? parents[0][j] : parents[1][j];
            }
            cruza = !cruza;
            i = aux;
        }

        for (let j = i; j < 100; j++) {
            children[0][j] = cruza ? parents[1][j] : parents[0][j];
            children[1][j] = cruza ? parents[0][j] : parents[1][j];
        }
    } else {
        return [...parents];
    }

    return children;
}
  