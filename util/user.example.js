module.exports = {
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'text'
        },
        voted: {
            type: 'boolean',
            default: false
        }
    }
}