export default class UserDTO {
    id;
    email;
    firstName;
    isActivated;
    roles;
    sessionId;

    constructor(model, roles = [], tokenId) {
        this.id = model.id;
        this.email = model.email;
        this.firstName = model.firstName;
        this.isActivated = model.isActivated;
        this.roles = roles.map(i => {
            if (typeof i === "string") {return i}
            return i.role
        })
        this.sessionId = tokenId
    }
}