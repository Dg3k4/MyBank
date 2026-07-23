import sequelize from "../db.js";
import {DataTypes, UUIDV4} from "sequelize";

const RefreshToken = sequelize.define("refreshToken", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    tokenHash: {type: DataTypes.STRING, allowNull: false},
})

const ActivationToken = sequelize.define("activationToken", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    token: {type: DataTypes.STRING, allowNull: false},
})

export {
    RefreshToken,
    ActivationToken
};