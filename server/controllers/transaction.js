const algosdk = require('algosdk');
const createAccount = (req, res) => {
  try {
    const myAccount = algosdk.generateAccount();
    console.log('Account Address = ' + myAccount.addr);
    const accountMnemonic = algosdk.secretKeyToMnemonic(myAccount.sk);
    console.log('Account Mnemonic = ' + accountMnemonic);
    console.log('Account created. Save off Mnemonic and address');
    // console.log('Add funds to account using the TestNet Dispenser: ');
    // console.log('https://dispenser.testnet.aws.algodev.network/ ');
    console.log(myAccount);
    return res.json(myAccount);
  } catch (err) {
    console.log('err', err);
  }
};

const createClient = (req, res) => {
  const algodToken =
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const algodServer = 'http://147.182.180.15';
  const algodPort = 4001;
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  return algodClient;
};

const checkBalance = async (req, res) => {
  const { algodClient, myAccount } = req.body;
  const accountInfo = await algodClient.accountInformation(myAccount.addr).do();
  return res.json(accountInfo.amount);
};

const sendTransaction = async (req, res) => {
  const { sender, receiver, amount, algodClient, myAccount } = req.body;
  const params = await algodClient.getTransactionParams().do();
  params.fee = algosdk.ALGORAND_MIN_TX_FEE;
  params.flatFee = true;
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: receiver,
    amount: amount,
    suggestedParams: params,
  });

  // Sign the transaction
  const signedTxn = txn.signTxn(myAccount.sk);
  const txId = txn.txID().toString();
  console.log('Signed transaction with txID: %s', txId);

  // Submit the transaction
  await algodClient.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  console.log(
    'Transaction ' +
      txId +
      ' confirmed in round ' +
      confirmedTxn['confirmed-round']
  );
  const accountInfo = await algodClient.accountInformation(myAccount.addr).do();
  console.log('Transaction Amount: %d microAlgos', confirmedTxn.txn.txn.amt);
  console.log('Transaction Fee: %d microAlgos', confirmedTxn.txn.txn.fee);

  console.log('Account balance: %d microAlgos', accountInfo.amount);
};

module.exports = { createAccount, createClient, checkBalance, sendTransaction };
