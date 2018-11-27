const identifiers = (obj, number) => {
    let array = [
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c10",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c21",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c32",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c43",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c53",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c63",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c73",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c83",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c93",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37103",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37113",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37123",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37133",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37143",
        "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37154"
    ];  

    for (var i = 0; i < number; i++) {
        array.push(obj);
    }
    
    return array;
}

const destinations = (obj, number) => {
    let addressArray = [];
    for (var i = 0; i < number; i++) {
        addressArray.push(obj);
    }

    return addressArray;
}

const amounts = (obj, number) => {
    let amountArray = [];
    for (var i = 0; i < number; i++) {
        amountArray.push(obj);
    }

    return amountArray;
}

async function createNewPayment(contract, token, receiver, business, startDate = 100, interval = 0, fee = 1000) {
    let newSchedule = await contract.createScheduleWithPayments(
        identifiers(), 
        amounts(10*10**18, 15), 
        destinations(receiver, 15),
        token.address,
        startDate,
        interval,
        fee,
        true, 
        '',
        { from: business }
    );

    return newSchedule.logs[0].args.scheduleIdentifier;
}

module.exports = {
    identifiers,
    destinations,
    amounts,
    createNewPayment
}