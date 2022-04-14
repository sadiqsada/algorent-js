import json  
import base64  
from algosdk import account, mnemonic, constants  
from algosdk.v2client import algod  
from algosdk.future import transaction  
from algosdk.future.transaction import PaymentTxn

#https://developer.algorand.org/docs/get-details/transactions/
#https://developer.algorand.org/docs/get-details/transactions/transactions/

address = "http://localhost:4001"  #ip address for api endpoint, default values for testnet sandbox
token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"  #default auth token value for sandbox.
client = algod.AlgodClient(token, address)  

wallet_address = 'TRU34J6LMHGVMJIMGUCDBKMKXO3KQQJG44FI5Q2NLW5HDFMKWJPOEAQQTU'
private_key = 'CGzGk0TpIr1V6RiOj9d31RXqlwRRMGCi2+mWU7q5HWKcab4ny2HNViUMNQQwqYq7tqhBJucKjsNNXbpxlYqyXg=='
print("Address: {}".format(wallet_address))  
account_info = client.account_info(wallet_address)  
print("Account Balance: {} microAlgos".format(account_info.get('amount'))) #same as satoshis, micro = 10^-6

params = client.suggested_params()  
params.flat_fee = constants.MIN_TXN_FEE   
params.fee = 1000  
amount = 1000  
receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA"  
note = "Test Transaction".encode()  

unsigned_txn = PaymentTxn(wallet_address, params, receiver, 1000000, None, note)
#signed_txn = unsigned_txn.sign(mnemonic.to_private_key(passphrase)) recommended way to do it from the docs, in this case we will just sign with the privaate key
signed_txn = unsigned_txn.sign(private_key)

txid = client.send_transaction(signed_txn)
print("Successfully sent transaction with txID: {}".format(txid))

def wait_for_confirmation(client, transaction_id, timeout):
    """
    Wait until the transaction is confirmed or rejected, or until 'timeout'
    number of rounds have passed.
    Args:
        transaction_id (str): the transaction to wait for
        timeout (int): maximum number of rounds to wait    
    Returns:
        dict: pending transaction information, or throws an error if the transaction
            is not confirmed or rejected in the next timeout rounds
    """
    start_round = client.status()["last-round"] + 1;
    current_round = start_round

    while current_round < start_round + timeout:
        try:
            pending_txn = client.pending_transaction_info(transaction_id)
        except Exception:
            return 
        if pending_txn.get("confirmed-round", 0) > 0:
            return pending_txn
        elif pending_txn["pool-error"]:  
            raise Exception(
                'pool error: {}'.format(pending_txn["pool-error"]))
        client.status_after_block(current_round)                   
        current_round += 1
    raise Exception(
        'pending tx not found in timeout rounds, timeout value = : {}'.format(timeout))
    
    


# wait for confirmation 
try:
    confirmed_txn = wait_for_confirmation(client, txid, 4)  
except Exception as err:
    print(err)

print("Transaction information: {}".format(json.dumps(confirmed_txn, indent=4)))
print("Decoded note: {}".format(base64.b64decode(confirmed_txn["txn"]["txn"]["note"]).decode()))