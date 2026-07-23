import sequelize from "../db.js";
import {DataTypes, UUIDV4} from 'sequelize';

const User = sequelize.define("user", {
    id: {type: DataTypes.UUID, allowNull: false, defaultValue: UUIDV4, primaryKey: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    passwordHash: {type: DataTypes.STRING, allowNull: false},
    pinHash: {type: DataTypes.STRING},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    middleName: {type: DataTypes.STRING},
    phoneNumber: {type: DataTypes.STRING, allowNull: false, unique: true},
    birthday: {type: DataTypes.DATEONLY},
    avatar: {type: DataTypes.STRING},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const UserBlocked = sequelize.define("userBlocked", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    comment: {type: DataTypes.STRING},
    reason: {type: DataTypes.STRING, allowNull: false},
    blockedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    blockedUntil: {type: DataTypes.DATE},
    unblockedAt: {type: DataTypes.DATE},
    blockedByAdminId: {type: DataTypes.UUID},
    unblockedByAdminId: {type: DataTypes.UUID},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
})

const UserLoginAttempt = sequelize.define("userLoginAttempt", {
    id: {type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    ip: {type: DataTypes.INET},
    success: {type: DataTypes.BOOLEAN, allowNull: false},
    attemptAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    userAgent: {type: DataTypes.STRING},
})

const UserSecurityState = sequelize.define("userSecurityState", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    loginFailedAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    loginBlockLevel: { type: DataTypes.INTEGER, defaultValue: 0 },
    loginBlockedUntil: { typ0e: DataTypes.DATE },
    pinFailedAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    pinBlockLevel: { type: DataTypes.INTEGER, defaultValue: 0 },
    pinBlockedUntil: { type: DataTypes.DATE },
})

const Role = sequelize.define("role", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    role: {type: DataTypes.ENUM("CLIENT", "OPERATOR", "MANAGER", "ADMIN", "SUPERADMIN"), allowNull: false, unique: true, defaultValue: "CLIENT"},
})

const UserRole = sequelize.define("userRole", {
    id: {type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
})

export {
    User,
    UserBlocked,
    UserLoginAttempt,
    UserSecurityState,
    Role,
    UserRole
};