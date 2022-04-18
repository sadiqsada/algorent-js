const formatAddress = (address) => {
    const splitAddress = address.split('-');
    const addressLength = address.length;
    const zipCode = splitAddress[addressLength - 1];
    const state = splitAddress[addressLength - 2];
    
    let formattedAddress = '';
    for (let i = 0; i < addressLength - 2; i++) {
        formattedAddress += splitAddress[i] + ' ';
    }

    formattedAddress += ', ' + state + ',' + zipCode;
    return formattedAddress;
}

module.exports = formatAddress;