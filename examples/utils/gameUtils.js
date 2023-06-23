export const applyMovement = (pos, speed, accel, maxSpeed, dt) => {
    speed.x = Math.max(-maxSpeed, Math.min(maxSpeed, speed.x + accel.x));
    speed.y = Math.max(-maxSpeed, Math.min(maxSpeed, speed.y + accel.y));
    if (accel.x == 0)
        speed.x *= 0.99;
    if (accel.y == 0)
        speed.y *= 0.99;
    const abs = Math.hypot(speed.x, speed.y);
    pos.x += dt * speed.x * maxSpeed / Math.max(abs, maxSpeed);
    pos.y += dt * speed.y * maxSpeed / Math.max(abs, maxSpeed);
    return pos;
}

export const vectorTo = (posA, posB, length_ = null) => {
    const result = {x: posB.x - posA.x, y: posB.y - posA.y};
    if (length_ == null)
        return result;
    const actualLength = Math.hypot(result.x, result.y);
    return {x: result.x * length_ / actualLength, y: result.y * length_ / actualLength};
}