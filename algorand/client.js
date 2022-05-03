const algosdk = require('algosdk');

//account creation, may not be needed or can be made into its own js file
var account = algosdk.generateAccount();
var passphrase = algosdk.secretKeyToMnemonic(account.sk);
console.log( "My address: " + account.addr );
console.log( "My passphrase: " + passphrase );


const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = 4001;
let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


/*Balance Checking
const passphrase = "Your 25-word mnemonic generated and displayed above";

let myAccount = algosdk.mnemonicToSecretKey(passphrase)
console.log("My address: %s", myAccount.addr)

let accountInfo = await algodClient.accountInformation(myAccount.addr).do();
console.log("Account balance: %d microAlgos", accountInfo.amount);
*/
let params = await algodClient.getTransactionParams().do();
// comment out the next two lines to use suggested fee
params.fee = 1000;
params.flatFee = true;
const receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
const enc = new TextEncoder();
let note = enc.encode("Test");
let txn = algosdk.makePaymentTxnWithSuggestedParams(myAccount.addr, receiver, 1000000, undefined, note, params);
let signedTxn = txn.signTxn(myAccount.sk);
let txId = txn.txID().toString();
console.log("Signed transaction with txID: %s", txId);
await algodClient.sendRawTransaction(signedTxn).do();

