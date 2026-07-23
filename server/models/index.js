import {
    User,
    UserBlocked,
    UserLoginAttempt,
    UserSecurityState,
    UserRole,
    Role
} from './userModels.js'
import {
    BankAccount,
    BankAccountStatusHistory,
    Card,
    CardLimitUsage,
    CardStatusHistory,
    Transaction
} from "./bankModels.js";
import {
    RefreshToken,
    ActivationToken,
} from "./tokenModels.js";

// Пользователь
User.hasMany(BankAccount)
BankAccount.belongsTo(User)

User.hasMany(RefreshToken)
RefreshToken.belongsTo(User)

User.hasOne(ActivationToken)
ActivationToken.belongsTo(User)

User.hasMany(UserBlocked)
UserBlocked.belongsTo(User)

User.hasMany(UserLoginAttempt)
UserLoginAttempt.belongsTo(User)

User.hasOne(UserSecurityState)
UserSecurityState.belongsTo(User)

User.belongsToMany(Role, {through: UserRole})
Role.belongsToMany(User, {through: UserRole})


//Счёт
BankAccount.hasMany(Card)
Card.belongsTo(BankAccount)

BankAccount.hasMany(BankAccountStatusHistory)
BankAccountStatusHistory.belongsTo(BankAccount)

BankAccount.hasMany(Transaction, {as: "OutgoingTransactions", foreignKey: "fromAccountId"}) // У одного счёта много ИСХОДЯЩИХ транзакций
Transaction.belongsTo(BankAccount, {as: "FromAccount", foreignKey: "fromAccountId"})

BankAccount.hasMany(Transaction, {as: "IncomingTransactions", foreignKey: "toAccountId"}) // У одного счёта много ПРИХОДЯЩИХ транзакций
Transaction.belongsTo(BankAccount, {as: "ToAccount", foreignKey: "toAccountId"})


//Карточка
Card.hasMany(Transaction, {as: "OutgoingCardTransactions", foreignKey: "fromCardId"})
Transaction.belongsTo(Card, {as: "FromCard", foreignKey: "fromCardId"})

Card.hasMany(Transaction, {as: "IncomingCardTransactions", foreignKey: "toCardId"})
Transaction.belongsTo(Card, {as: "ToCard", foreignKey: "toCardId"})

Card.hasOne(CardLimitUsage)
Card.belongsTo(Card)

Card.hasMany(CardStatusHistory)
CardStatusHistory.belongsTo(Card)

export {
    User,
    UserBlocked,
    UserLoginAttempt,
    UserSecurityState,
    UserRole,
    RefreshToken,
    ActivationToken,
    Role,
    BankAccount,
    BankAccountStatusHistory,
    Card,
    CardLimitUsage,
    CardStatusHistory,
    Transaction
}