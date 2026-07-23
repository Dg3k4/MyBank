import sequelize from "../db.js";
import {DataTypes, UUIDV4} from "sequelize";

const BankAccount = sequelize.define("bankAccount", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    currency: {type: DataTypes.ENUM("USD", "EUR", "RUB"), allowNull: false},
    type: {type: DataTypes.ENUM("personal", "savings", "family", "credit", "deposit", "business"), defaultValue: "personal"},
    balance: {type: DataTypes.DECIMAL(19, 4), defaultValue: 0},
    accountNumber: {type: DataTypes.STRING, allowNull: false, unique: true},
    status: {type: DataTypes.ENUM("active", "blocked", "frozen", "closed", "pending"), defaultValue: "active"},
    nickName: {type: DataTypes.STRING, defaultValue: "Банковский счёт"},
}, {
    indexes: [{
        unique: true, fields: ["userId", "currency", "type"]  // Уникальность опредёлённого типа счёта на один userId
    }]
})

const BankAccountStatusHistory = sequelize.define("bankAccountStatusHistory", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    newStatus: {type: DataTypes.ENUM("active", "blocked", "frozen", "closed"), allowNull: false},
    previousStatus: {type: DataTypes.ENUM("active", "blocked", "frozen", "closed")},
    statusChangeAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    changeByType: {type: DataTypes.ENUM("admin", "system")},
    adminId: {type: DataTypes.UUID},
    reason: {type: DataTypes.STRING, allowNull: false},
})

const Card = sequelize.define("card", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    parentCardId: {type: DataTypes.UUID},
    cardNumberEncrypted: {type: DataTypes.STRING, allowNull: false, unique: true},
    cardNumberHash: {type: DataTypes.STRING, allowNull: false, unique: true},
    cardNumberLast4: {type: DataTypes.STRING, allowNull: false},
    holderName: {type: DataTypes.STRING, allowNull: false},
    expirationDate: {type: DataTypes.DATEONLY, allowNull: false},
    cardType: {type: DataTypes.ENUM("main", "additional", "shared"), defaultValue: "main"},
    spendingLimit: {type: DataTypes.DECIMAL(19, 4), defaultValue: 0},
    monthlyLimit: {type: DataTypes.DECIMAL(19, 4), defaultValue: null},
    dailyLimit: {type: DataTypes.DECIMAL(19, 4), defaultValue: null},
    status: {type: DataTypes.ENUM("active", "blocked", "frozen", "expired", "pending"), defaultValue: "active"},
}, {
    indexes: [{
        unique: true, fields: ["bankAccountId"], where: {cardType: "main"} // Ограничение в одну main карту на один bankAccountId
    }]
})

const CardLimitUsage = sequelize.define("cardLimitUsage", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    monthlyPeriod: {type: DataTypes.DATE, defaultValue: null},
    monthlySpent: {type: DataTypes.DECIMAL(19, 4), defaultValue: 0},
    dailyPeriod: {type: DataTypes.DATE, defaultValue: null},
    dailySpent: {type: DataTypes.DECIMAL(19, 4), defaultValue: 0},
})

const CardStatusHistory = sequelize.define("cardStatusHistory", {
    id: {type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true},
    newStatus: {type: DataTypes.ENUM("active", "blocked", "frozen", "expired"), allowNull: false},
    previousStatus: {type: DataTypes.ENUM("active", "blocked", "frozen", "expired")},
    statusChangeAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    changeByType: {type: DataTypes.ENUM("admin", "system")},
    adminId: {type: DataTypes.UUID},
    reason: {type: DataTypes.STRING},
})

const Transaction = sequelize.define("transaction", {
    id: {type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    operationType: {type: DataTypes.ENUM("transfer", "deposit", "withdrawal", "payment"), allowNull: false},
    operationAmount: {type: DataTypes.DECIMAL(19, 4), allowNull: false},
    operationDate: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    operationCurrency: {type: DataTypes.ENUM("USD", "EUR", "RUB"), allowNull: false},
    operationStatus: {type: DataTypes.ENUM("pending", "success", "failed", "canceled"), defaultValue: "pending"},
    fromAccountId: {type: DataTypes.UUID},
    toAccountId: {type: DataTypes.UUID},
    fromCardId: {type: DataTypes.UUID},
    toCardId: {type: DataTypes.UUID},
    description: {type: DataTypes.STRING},
})

export {
    BankAccount,
    BankAccountStatusHistory,
    Card,
    CardLimitUsage,
    CardStatusHistory,
    Transaction,
}