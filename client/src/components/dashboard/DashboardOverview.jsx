import {} from 'react';
import "./dashboardOverview.scss"
import {moduleTypes} from "./dashboardModules";

const DashboardOverview = () => {
    const moduleLocations = [
        {type: "cardsBalance", x: 1, y: 0, w: 4, h: 3, hidden: false},
        {type: "incomeExpenses", x: 5, y: 0, w: 3, h: 2, hidden: false},
        {type: "monthExpenses", x: 8, y: 0, w: 2, h: 3, hidden: false},
        {type: "quickActions", x: 0, y: 0, w: 1, h: 3, hidden: false},
        {type: "quickTransfer", x: 5, y: 2, w: 3, h: 1, hidden: false},
        {type: "transactions", x: 10, y: 0, w: 2, h: 3, hidden: false},
    ]

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                <div className="dashboard__container__modules">
                    {moduleLocations.filter(module => !module.hidden).map(module => {
                        const Module = moduleTypes[module.type];
                        return (
                            <div className="dashboard__container__modules-item"
                                 key={module.type}
                                 style={{
                                     gridColumn: `${module.x + 1} / span ${module.w}`,
                                     gridRow: `${module.y + 1} / span ${module.h}`
                                 }}
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