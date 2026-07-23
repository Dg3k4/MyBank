import bankAccountService from "../service/bankAccountService.js";

class BankAccountController {
    async createAccount(req, res, next){
        try {
            const {id} = req.user
            const {currency, type, nickName} = req.body

            const newAccount = await bankAccountService.createBankAccount({userId: id, currency: currency, type: type, nickName: nickName})
            return res.status(201).json({message: "Successfully created new bank account", account: newAccount})
        } catch(e) {
            next(e)
        }
    }

    async getMyAccounts(req, res, next){
        try {
            const {id} = req.user

            const giveAccounts = await bankAccountService.getAllUserAccounts(id)
            return res.json({accounts: giveAccounts})
        } catch(e) {
            next(e)
        }
    }

    async getById(req, res, next){
        try {
            const userId = req.user.id
            const accountId  = req.params.id

            const accountById = await bankAccountService.getAccountById(userId, accountId)

            return res.json({account: accountById})
        } catch(e) {
            next(e)
        }
    }

    async getTransactions(req, res, next){
        try {
            const userId = req.user.id
            const accountId  = req.params.accountId
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 30

            const transactions = await bankAccountService.getTransactionsPagination({userId: userId, accountId: accountId, page: page, limit: limit})

            return res.json({transactions: transactions})
        } catch(e) {
            next(e)
        }
    }

    async closeAccountRequest(req, res, next){
        try {
            const userId = req.user.id
            const accountId = req.params.id

            const updatedAccount = await bankAccountService.doCloseRequest(userId, accountId)

            return res.json({message: "Request was made successfully", account: updatedAccount})
        } catch(e) {
            next(e)
        }
    }

    async updateNickName(req, res, next){
        try {
            const userId = req.user.id
            const accountId = req.params.id
            const {newNick} = req.body

            const updatedAccount = await bankAccountService.changeNickName(userId, accountId, newNick)

            return res.json({message: "Successfully changed nickname", account: updatedAccount})
        } catch(e) {
            next(e)
        }
    }
}

export default new BankAccountController();