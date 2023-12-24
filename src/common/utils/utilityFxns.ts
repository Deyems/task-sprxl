
const isValidNumber = (str: string) => {
    const parsedNumber = parseInt(str, 10);
    return !isNaN(parsedNumber);
}

export {
    isValidNumber,
}