export const MAX_COLUMNS = 12

export const defaultModuleLayout  = [
    {type: "quickActions", x: 0, y: 0, w: 1, h: 3, hidden: false},
    {type: "cardsBalance", x: 1, y: 0, w: 4, h: 3, hidden: false},
    {type: "incomeExpenses", x: 5, y: 0, w: 3, h: 2, hidden: false},
    {type: "monthExpenses", x: 8, y: 0, w: 2, h: 3, hidden: false},
    {type: "transactions", x: 10, y: 0, w: 2, h: 3, hidden: false},
    {type: "quickTransfer", x: 5, y: 2, w: 3, h: 1, hidden: false},
]

export const getAllowedX = ({module, plusX}) => {
    const candidateX = module.x + plusX
    return Math.max(0, Math.min(candidateX, MAX_COLUMNS - module.w))
}

const getCollidingModules = ({layout, candidate}) => {
    return layout.filter(module =>
        !module.hidden &&
        module.type !== candidate.type &&
        candidate.x < module.x + module.w &&
        candidate.x + candidate.w > module.x &&
        candidate.y < module.y + module.h &&
        candidate.y + candidate.h > module.y
    )
}

const canPlace = ({layout, candidate}) => {
    return candidate.x >= 0 &&
        candidate.y >= 0 &&
        candidate.x + candidate.w <= MAX_COLUMNS &&
        !getCollidingModules({layout: layout, candidate: candidate}).length
}

const replaceModule = ({layout, module}) => {
    return layout.map(currentModule =>
        currentModule.type === module.type ? module : currentModule
    )
}

const stickModuleToTopLeft = ({layout, module}) => {
    let candidate = {...module}

    while (true) {
        const above = {...candidate, y: candidate.y - 1}
        if (candidate.y > 0 && canPlace({layout: layout, candidate: above})) {
            candidate = above
            continue
        }

        const left = {...candidate, x: candidate.x - 1}
        if (candidate.x > 0 && canPlace({layout: layout, candidate: left})) {
            candidate = left
            continue
        }

        return candidate
    }
}

const compactAllModules = layout => {
    let nextLayout = layout.map(module => ({...module}))
    let changed = true

    while (changed) {
        changed = false
        const orderedModules = [...nextLayout]
            .filter(module => !module.hidden)
            .sort((a, b) => a.y - b.y || a.x - b.x)

        orderedModules.forEach(module => {
            const currentModule = nextLayout.find(
                currentModule => currentModule.type === module.type
            )
            const positionedModule = stickModuleToTopLeft({
                layout: nextLayout,
                module: currentModule
            })

            if (positionedModule.x !== currentModule.x || positionedModule.y !== currentModule.y) {
                nextLayout = replaceModule({
                    layout: nextLayout,
                    module: positionedModule
                })
                changed = true
            }
        })
    }

    return nextLayout
}

const getModuleIntersection  = (a, b) => {
    const x = Math.max(a.x, b.x)
    const y = Math.max(a.y, b.y)
    const right = Math.min(a.x + a.w, b.x + b.w)
    const bottom = Math.min(a.y + a.h, b.y + b.h)
    if (right <= x || bottom <= y) return null

    return {x, y, w: right - x, h: bottom - y}
}

const getDropTarget = ({layout, candidate}) => {
    const collisions = getCollidingModules({layout, candidate})
    return collisions.reduce((best, module) => {
        const intersection = getModuleIntersection(candidate, module)
        const area = intersection.w * intersection.h
        return !best || area > best.area ? {module, area} : best
    }, null)?.module
}

const findFirstFreePosition = ({layout, module}) => {
    if (module.w < 1 || module.w > MAX_COLUMNS || module.h < 1) {
        throw new Error(`Invalid module size: ${module.type}`)
    }

    for (let y = 0; ; y++) {
        for (let x = 0; x <= MAX_COLUMNS - module.w; x++) {
            const candidate = {...module, x, y}
            const collisions = getCollidingModules({layout: layout, candidate: candidate})
            if (!collisions.length) return {x, y}
        }
    }
}

const insertBeforeTarget = ({layout, pusher, target}) => {
    const nextLayout = layout.filter(module => module.type !== pusher.type)
    const targetIndex = nextLayout.findIndex(module => module.type === target.type)

    if (targetIndex === -1) return layout
    nextLayout.splice(targetIndex, 0, pusher)
    return nextLayout
}

const compactLayout = layout => {
    const placedModules = []
    return layout.map(module => {
        if (module.hidden) return module

        const position = findFirstFreePosition({
            layout: placedModules,
            module: module
        })
        const positionedModule = {...module, ...position}
        placedModules.push(positionedModule)
        return positionedModule
    })
}

// Свободный модуль прилипает вверх и влево. При пересечении основной затронутый
// Модуль пытается занять старое место перемещаемого, остальные ищут свободное место
export const rearrangeModules = ({layout, pusher}) => {
    const originalPusher = layout.find(module => module.type === pusher.type)
    if (!originalPusher) return layout

    const collisions = getCollidingModules({layout: layout, candidate: pusher})
    if (!collisions.length) {
        const positionedPusher = stickModuleToTopLeft({
            layout: layout,
            module: pusher
        })

        const nextLayout = replaceModule({
            layout: layout,
            module: positionedPusher
        })

        return compactAllModules(nextLayout)
    }

    const target = getDropTarget({layout: layout, candidate: pusher})
    if (!target) return layout

    const displacedModules = [
        target,
        ...collisions.filter(module => module.type !== target.type)
    ]

    let nextLayout = replaceModule({layout: layout, module: pusher})

    displacedModules.forEach((module, index) => {
        if (index === 0) {
            const swapCandidate = {
                ...module,
                x: originalPusher.x,
                y: originalPusher.y
            }

            if (canPlace({layout: nextLayout, candidate: swapCandidate})) {
                nextLayout = replaceModule({
                    layout: nextLayout,
                    module: swapCandidate
                })
                return
            }
        }

        const position = findFirstFreePosition({
            layout: nextLayout,
            module: module
        })

        nextLayout = replaceModule({
            layout: nextLayout,
            module: {...module, ...position}
        })
    })

    return compactAllModules(nextLayout)
}