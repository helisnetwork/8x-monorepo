![8X Logo](https://8xprotocol.com/assets/images/full-logo.png)

---

8x Protocol enables decentralised recurring payments on the Ethereum blockchain.
A complete explanation of the protocol may be found in our [whitepaper](https://github.com/8x-protocol/whitepaper).


[![Telegram Chat](https://img.shields.io/badge/CHAT-TELEGRAM-0088cc.svg)](http://t.me/eightexprotocol_contributors)
[![Solidity](https://img.shields.io/badge/SOLIDITY-0.4.24-orange.svg)](https://solidity.readthedocs.io/en/develop/index.html)
<<<<<<< HEAD
<<<<<<< HEAD
[![Apache License](https://img.shields.io/badge/LICENSE-APACHE 2.0-3DA639.svg)](https://opensource.org/licenses/Apache-2.0)
=======
[![Apache 2.0](https://img.shields.io/badge/LICENSE-APACHE 2.0-3DA639.svg)](https://opensource.org/licenses/Apache-2.0)
=======
[![Apache 2.0](https://img.shields.io/badge/LICENSE-APACHE2.0-3DA639.svg)](https://opensource.org/licenses/Apache-2.0)
>>>>>>> update readme

>>>>>>> update readme
## Contributing
We appreciate your desire to contribute to the 8x Protocol. We strive to maintain
a high standard over code quality and the security of our contracts. Please read over
this contributor guide before starting.

### How to Contribute
If you would like to contribute please fork the repo, create a new branch, fix the problem, commit the work with a clear message about what was accomplished, and submit a pull request.

### Code Quality
- When adding functionality, please also add tests and make sure they pass
- When adding a new function, make sure to add comments that adhere to the format seen throughout the project
- When fixing conflicts please use `rebase`
- When updating your working branch with `upstream master` changes, please `rebase`
- Make sure there are no linter `warnings` or `errors`

### Style Guide

##### Editor Settings
Please setup your editor with the following settings for this project.

- 4 space(soft) indentation
- strip trailing whitespace
- 120 char max line length

##### About Our Standards
The 8x Protocol uses [Solhint](https://github.com/protofire/solhint) to
maintain high security and code standards within our project. We are following
the code standards set forth in the [Official Solidity Style Guide](http://solidity.readthedocs.io/en/develop/style-guide.html) and the security standards outlined in the [ConsenSys Guide for Smart Contracts](https://consensys.github.io/smart-contract-best-practices/recommendations/).

###### Style Exceptions
Variables passed into a function should use `mixedCase`, however, they should be prefixed with an `_`. This tells us that it is an `immutable` value passed into the function.

Example:
```SOLIDITY
function example(address _exampleAddress)
    public
{
    ...
}
```

###### IDE Integrations for Solhint
- [Atom](https://atom.io/packages/atom-solidity-linter)
- [Sublime Text 3](https://packagecontrol.io/search/solhint)
- [Vim](https://github.com/sohkai/syntastic-local-solhint)
- [JetBrains IDEA, WebStorm, CLion, etc](https://plugins.jetbrains.com/plugin/10177-solidity-solhint)
- [VS Code: Solidity by Juan Blanco](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
- [VS Code: Solidity Language Support by CodeChain.io](https://marketplace.visualstudio.com/items?itemName=kodebox.solidity-language-server)

### Getting Started
Set a remote url for our upstream repo so you can keep your master branch unpolluted and updated.

```
git remote set-url upstream https://github.com/8xprotocol/contracts.git
```

##### Requirements
- Truffle ^4.1.8
- Gananche UI
- NPM

##### Pre Requisites
```
npm install
npm install -g solhint
```

##### Running Contract Tests
```
truffle test
```

##### Running Style/Security Tests
```
npm run lint
```

##### Running Full Test Suite
```
npm run test
```
