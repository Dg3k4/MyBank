export const createSeededRandom = (seed) => {
    let state = seed
    return () => {
        state = (state * 16807) % 2147483647
        return (state - 1) / 2147483646
    }
}

const randomRange = (random, min, max) => min + random() * (max - min)

const jitterPoint = (random, point, jitterX, jitterY) => ({
    x: point.x + randomRange(random, -jitterX, jitterX),
    y: point.y + randomRange(random, -jitterY, jitterY)
})

const normalizePoint = (point, width, height, side) => ({
    x: (side === "left" ? point.x : 1 - point.x) * width,
    y: point.y * height
})

export const generatePatternPath = (random, width, height, side = "left") => {
    const start = {x: 0.08, y: 0.02}

    const segments = [
        {c1: {x: 0.18, y: 0.03}, c2: {x: 0.78, y: 0.03}, end: {x: 1.02, y: 0.10}},
        {c1: {x: 1.04, y: 0.17}, c2: {x: 0.34, y: 0.20}, end: {x: 0.10, y: 0.34}},
        {c1: {x: 0.02, y: 0.49}, c2: {x: 0.32, y: 0.56}, end: {x: 1.00, y: 0.60}},
        {c1: {x: 1.03, y: 0.67}, c2: {x: 0.30, y: 0.72}, end: {x: 0.12, y: 0.84}},
        {c1: {x: 0.05, y: 0.96}, c2: {x: 0.02, y: 1.05}, end: {x: 0.08, y: 1.12}}
    ]

    const startPoint = normalizePoint(jitterPoint(random, start, 0.015, 0.015), width, height, side)
    let path = `M ${startPoint.x} ${startPoint.y}`

    for (const segment of segments) {
        const c1 = normalizePoint(jitterPoint(random, segment.c1, 0.03, 0.02), width, height, side)
        const c2 = normalizePoint(jitterPoint(random, segment.c2, 0.03, 0.02), width, height, side)
        const end = normalizePoint(jitterPoint(random, segment.end, 0.02, 0.02), width, height, side)

        path += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`
    }

    return path
}

export const makePatternPath = (seed, width, height, loopCount = 2, side = "left") => {
    const random = createSeededRandom(seed)
    const path = generatePatternPath(random, width, height, side)
    console.log(path)
    return path
}