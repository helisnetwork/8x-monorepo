export declare const PaymentRegistry: {
    "contractName": string;
    "abi": ({
        "constant": boolean;
        "inputs": {
            "name": string;
            "type": string;
        }[];
        "name": string;
        "outputs": {
            "name": string;
            "type": string;
        }[];
        "payable": boolean;
        "stateMutability": string;
        "type": string;
        "anonymous"?: undefined;
    } | {
        "anonymous": boolean;
        "inputs": {
            "indexed": boolean;
            "name": string;
            "type": string;
        }[];
        "name": string;
        "type": string;
        "constant"?: undefined;
        "outputs"?: undefined;
        "payable"?: undefined;
        "stateMutability"?: undefined;
    })[];
    "bytecode": string;
    "compiler": {
        "name": string;
        "version": string;
    };
    "version": string;
    "networks": {};
};
