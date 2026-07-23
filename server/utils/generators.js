export function generateAccountNumber() {
    return new Array.from(
        {length: 24},
        () => Math.floor(Math.random() * 10),
    ).join("")
}

export function generateCardNumber() {
    return ("2200" + new Array.from(
        {length: 12},
        () => Math.floor(Math.random() * 10),
    ).join("")).match(/.{4}/g)
}