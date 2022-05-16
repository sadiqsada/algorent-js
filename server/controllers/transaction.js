const algosdk = require('algosdk');
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const Offer = require('../models/offerModel');

const createClient = () => {
  const algodToken = process.env.ALGOD_SERVER_TOKEN;
  const algodServer = process.env.ALGOD_SERVER;
  const algodPort = process.env.ALGOD_SERVER_PORT;
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  return algodClient;
};

const createAccount = async (req, res) => {
  try {
    const myAccount = algosdk.generateAccount();
    console.log('Account Address = ' + myAccount.addr);
    const accountMnemonic = algosdk.secretKeyToMnemonic(myAccount.sk);
    console.log('Account Mnemonic = ' + accountMnemonic);
    console.log('Account created. Save off Mnemonic and address');
    const newWallet = new Wallet({
      id: myAccount.addr,
      mnemonic: accountMnemonic,
    });
    await newWallet.save();
    const currentUser = await User.findById(req.userId);
    currentUser.wallets.push(newWallet);
    if (!currentUser.selectedWallet) {
      currentUser.selectedWallet = newWallet;
    }
    await currentUser.save();
    return res.json(myAccount);
  } catch (err) {
    console.log('err', err);
  }
};

const checkBalance = async (req, res) => {
  const { address } = req.body;
  const algodClient = createClient();
  const accountInfo = await algodClient.accountInformation(address).do();
  return res.json(accountInfo.amount);
};

const sendTransaction = async (req, res) => {
  const { amount, offerId } = req.body;
  console.log('amount');
  console.log(amount);
  const algodClient = createClient();
  const offer = await Offer.findById(offerId);
  const sender = await User.findById(offer.senderID);
  const senderWallet = await Wallet.findById(sender.selectedWallet);
  const elonUser = await User.find({ email: 'elonmusk@twitter.com' });
  const elonWallet = await Wallet.findById(elonUser[0].selectedWallet);
  const receiver = elonWallet.id;
  console.log('receiver');
  console.log(receiver);
  const params = await algodClient.getTransactionParams().do();
  params.fee = algosdk.ALGORAND_MIN_TX_FEE;
  params.flatFee = true;
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderWallet.id,
    to: receiver,
    amount: amount,
    suggestedParams: params,
  });

  // Sign the transaction
  const account = algosdk.mnemonicToSecretKey(senderWallet.mnemonic);
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
  if (!currentUser.selectedWallet) {
    currentUser.selectedWallet = newWallet;
  }
  await currentUser.save();
  return res.json({ message: 'Wallet successfully added! ' });
};

const getWallets = async (req, res) => {
  const user = await User.findById(req.userId);
  const wallets = [];
  for (let i = 0; i < user.wallets.length; i++) {
    const wallet = await Wallet.findById(user.wallets[i]);
    wallets.push(wallet);
  }
  return res.json(wallets);
};

const selectWallet = async (req, res) => {
  const { address } = req.body;
  const user = await User.findById(req.userId);
  const selectedWallet = await Wallet.find({ id: address });
  user.selectedWallet = selectedWallet[0];
  await user.save();
  return res.json({ message: `Selected Wallet with addr: ${address}` });
};

const getWallet = async (req, res) => {
  const user = await User.findById(req.userId);
  const wallet = await Wallet.findById(user.selectedWallet);
  return res.json(wallet);
}

module.exports = {
  addWallet,
  createAccount,
  checkBalance,
  sendTransaction,
  getWallets,
  selectWallet,
  getWallet
};
