export function selection(conflicts) {
    const half = Math.floor(conflicts.length / 2);
    const bestIndex = Math.floor(Math.random() * half);        
    const randomIndex = Math.floor(Math.random() * conflicts.length); 

    return [bestIndex, randomIndex]; 
}
  