import {useEffect, useRef, useState} from 'react';
import "./dashboardOverview.scss"
import {defaultModuleLayout, rearrangeModules, getAllowedX, MAX_COLUMNS} from "./moduleFlow.js"
import {moduleTypes} from "./dashboardModules";

const DashboardOverview = () => {
    const [moduleLayout, setModuleLayout] = useState(() =>
        defaultModuleLayout.map(module => ({...module}))
    );
    const [dragCandidate, setDragCandidate] = useState(null)
    const gridRef = useRef(null)
    const dragDataRef = useRef(null)
    const dragCandidateRef = useRef(null)

    const renderedLayout = moduleLayout.map(module =>
        module.type === dragCandidate?.type ? dragCandidate : module
    )

    const getGridMetrics = () => {
        const grid = gridRef.current
        if (!grid) return null

        const rect = grid.getBoundingClientRect()
        const styles = getComputedStyle(grid)
        const columnGap = parseFloat(styles.columnGap) || 0
        const rowGap = parseFloat(styles.rowGap) || 0
        const cellWidth = (rect.width - columnGap * (MAX_COLUMNS - 1)) / MAX_COLUMNS
        const rowHeight = parseFloat(styles.gridTemplateRows) || cellWidth

        return {rect, columnGap, rowGap, cellWidth, rowHeight}
    }

    const startDrag = (event, module) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (dragDataRef.current) return;
        event.preventDefault()

        event.currentTarget.setPointerCapture(event.pointerId)
        const moduleRect = event.currentTarget.getBoundingClientRect()
        const candidate = {...module}

        dragDataRef.current = {
            pointerId: event.pointerId,
            offsetX: event.clientX - moduleRect.left,
            offsetY: event.clientY - moduleRect.top,
        }
        dragCandidateRef.current = candidate
        setDragCandidate(candidate)
    }

    const moveDrag = event => {
        const dragData = dragDataRef.current
        const currentCandidate = dragCandidateRef.current

        if (!dragData || !currentCandidate) return
        if (dragData.pointerId !== event.pointerId) return

        const metrics = getGridMetrics()
        if (!metrics) return

        const {rect, columnGap, rowGap, cellWidth, rowHeight} = metrics

        const left = event.clientX - rect.left - dragData.offsetX
        const top = event.clientY - rect.top - dragData.offsetY

        const candidateX = Math.round(left / (cellWidth + columnGap))
        const candidateY = Math.round(top / (rowHeight + rowGap))

        const x = getAllowedX({
            module: currentCandidate,
            plusX: candidateX - currentCandidate.x
        })

        const y = Math.max(0, candidateY)

        if (x === currentCandidate.x && y === currentCandidate.y) return

        const nextCandidate = {...currentCandidate, x, y}

        dragCandidateRef.current = nextCandidate
        setDragCandidate(nextCandidate)
    }

    const finishDrag = event => {
        const candidate = dragCandidateRef.current
        if (!candidate) return;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        setModuleLayout(prevLayout =>
            rearrangeModules({
                layout: prevLayout,
                pusher: candidate,
            })
        )
        dragDataRef.current = null
        dragCandidateRef.current = null
        setDragCandidate(null)
    }

    const cancelDrag = event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
        dragDataRef.current = null
        dragCandidateRef.current = null
        setDragCandidate(null)
    }

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                <div className="dashboard__container__modules" ref={gridRef}>
                    {renderedLayout.filter(module => !module.hidden).map(module => {
                        const Module = moduleTypes[module.type];
                        const isDragging = module.type === dragCandidate?.type
                        return (
                            <div className={`dashboard__container__module${isDragging ? " dashboard__container__module-dragging" : ""}`}
                                 key={module.type}
                                 style={{
                                     gridColumn: `${module.x + 1} / span ${module.w}`,
                                     gridRow: `${module.y + 1} / span ${module.h}`,
                                     zIndex: isDragging ? 10 : undefined,
                                 }}
                                 onPointerDown={event => startDrag(event, module)}
                                 onPointerMove={moveDrag}
                                 onPointerUp={finishDrag}
                                 onPointerCancel={cancelDrag}
                            >
                                <Module/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
export default DashboardOverview;