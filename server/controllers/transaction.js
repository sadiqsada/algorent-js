const algosdk = require('algosdk');
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');

const createClient = () => {
  const algodToken = process.env.ALGOD_SERVER_TOKEN;
  const algodServer = process.env.ALGOD_SERVER;
  const algodPort = process.env.ALGOD_SERVER_PORT;
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  return algodClient;
};

const createAccount = (req, res) => {
  try {
    const myAccount = algosdk.generateAccount();
    console.log('Account Address = ' + myAccount.addr);
    const accountMnemonic = algosdk.secretKeyToMnemonic(myAccount.sk);
    console.log('Account Mnemonic = ' + accountMnemonic);
    console.log('Account created. Save off Mnemonic and address');
    // console.log('Add funds to account using the TestNet Dispenser: ');
    // console.log('https://dispenser.testnet.aws.algodev.network/ ');
    return res.json(myAccount);
  } catch (err) {
    console.log('err', err);
  }
};

const checkBalance = async (req, res) => {
  const { myAccount } = req.body;
  const algodClient = createClient();
  const accountInfo = await algodClient.accountInformation(myAccount.addr).do();
  return res.json(accountInfo.amount);
};

const sendTransaction = async (req, res) => {
  const { sender, receiver, amount, myAccount, walletID } = req.body;
  const algodClient = createClient();
  const wallet = await Wallet.findById(walletID);
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
  const account = algosdk.mnemonicToSecretKey(wallet.mnemonic);
  const signedTxn = txn.signTxn(account.sk);
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
  const accountInfo = await algodClient.accountInformation(account.addr).do();
  console.log('Transaction Amount: %d microAlgos', confirmedTxn.txn.txn.amt);
  console.log('Transaction Fee: %d microAlgos', confirmedTxn.txn.txn.fee);

  console.log('Account balance: %d microAlgos', accountInfo.amount);
  return res.json({ message: 'Transaction Processed Successfully' });
};

const addWallet = async (req, res) => {
  const { id, mnemonic } = req.body;
  const newWallet = new Wallet({ id, mnemonic });
  await newWallet.save();
  const currentUser = await User.findById(req.userId);
  currentUser.wallets.push(newWallet);
  await currentUser.save();
  return res.json({ message: 'Wallet successfully added! '});
}

const getWallets = async (req, res) => {
  const user = await User.findById(req.userId);
  const wallets = [];
  for (let i = 0; i < user.wallets.length; i++) {
    const wallet = await Wallet.findById(user.wallets[i]);
    wallets.push(wallet);
  }
  return res.json(wallets);
}

module.exports = { addWallet, createAccount, checkBalance, sendTransaction, getWallets };
