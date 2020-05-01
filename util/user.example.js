module.exports = {
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'text'
        },
        premium: {
            type: 'simple-json',
            default: {
                donator: false,
                voter: false
            }
        }
    }
}