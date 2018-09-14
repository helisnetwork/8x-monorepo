export declare const Executor: {
    "contractName": string;
    "abi": ({
        "inputs": {
            "name": string;
            "type": string;
        }[];
        "payable": boolean;
        "stateMutability": string;
        "type": string;
        "anonymous"?: undefined;
        "name"?: undefined;
        "constant"?: undefined;
        "outputs"?: undefined;
    } | {
        "anonymous": boolean;
        "inputs": {
            "indexed": boolean;
            "name": string;
            "type": string;
        }[];
        "name": string;
        "type": string;
        "payable"?: undefined;
        "stateMutability"?: undefined;
        "constant"?: undefined;
        "outputs"?: undefined;
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
