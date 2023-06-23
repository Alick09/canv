export const distance = (posA, posB) => {
    return Math.hypot(posA.x - posB.x, posA.y - posB.y);
};