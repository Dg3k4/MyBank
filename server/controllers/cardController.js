import TransactionService from "../service/transactionService.js";
import cardService from "../service/cardService.js";

class CardController {
    async createCard(req, res, next){
        try {
            const {holderName, cardType, parentCardId, currency, type, nickName} = req.body
            const userId = req.user.id

            const makeCard = await cardService.createCard
            ({userId: userId, currency: currency,
                type: type, nickName: nickName, holderName: holderName, cardType: cardType, parentCardId: parentCardId
            })
        } catch(e) {
            next(e)
        }
    }

    async getById(req, res, next){
        try {

        } catch(e) {

        }
    }

    async getMe(req, res, next){
        try {

        } catch(e) {

        }
    }

    async makeTransaction(req, res, next) {
        try {
            const {fromCardId, toCardId, amount, description} = req.body
            const userId = req.user.id

            const makeTransaction = await TransactionService.makeTransfer({userId: userId, fromCardId: fromCardId, toCardId: toCardId, amount: amount, description: description})

            return res.json({body: makeTransaction, message: "Transactions successfully"})
        } catch(e) {
            next(e)
        }
    }

    async getTransactions(req, res, next){
        try {

        } catch(e) {

        }
    }

    async changeStatusRequest(req, res, next){
        try {

        } catch(e) {

        }
    }
}

export default new CardController();