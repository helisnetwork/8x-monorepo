# Run git clone https://github.com/poanetwork/solidity-flattener
# #!/bin/bash

cd aion/solidity-flattener

npm start "../contracts/ApprovedRegistry.sol" "../flat"
npm start "../contracts/EightExToken.sol" "../flat"
npm start "../contracts/Executor.sol" "../flat"
npm start "../contracts/MultiSigWalletWithTimeLock.sol" "../flat"
npm start "../contracts/PaymentRegistry.sol" "../flat"
npm start "../contracts/StakeContract.sol" "../flat"
npm start "../contracts/TransferProxy.sol" "../flat"
npm start "../contracts/subscriptions/PayrollSubscription.sol" "../flat"
npm start "../contracts/WETH.sol" "../flat"