export function mutation(children, pm = 0.1) {
    const mutated = children.map(child => [...child]);

    if (Math.random() < pm) {
        for (let k = 0; k < 2; k++) { 
            for (let i = 0; i < 6; i++) {  
                for (let j = 0; j < 100; j += 20) { 
                    const p1 = j + Math.floor(Math.random() * 20);
                    const p2 = j + Math.floor(Math.random() * 20);
                    const aux = mutated[k][p1];
                    mutated[k][p1] = mutated[k][p2];
                    mutated[k][p2] = aux;
                }
            }
        }
    }

    return mutated;
}
  