export declare const Requirements: {
    "contractName": string;
    "abi": ({
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
    } | {
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
    })[];
    "bytecode": string;
    "compiler": {
        "name": string;
        "version": string;
    };
    "version": string;
    "networks": {};
};
