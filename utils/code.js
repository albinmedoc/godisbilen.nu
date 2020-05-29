const generate_codes = (quantity, lenght) => {
    let result = [];

    for (var i = 0; i < quantity; i++) {
        result.push(generate_code(lenght));
    }

    return result;
};

const generate_code = (lenght) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (var i = 0; i < lenght; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return result;
};
