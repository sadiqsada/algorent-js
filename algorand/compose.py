
from algosdk import constants  
from algosdk.v2client import algod  
from algosdk.future.transaction import PaymentTxn
import sys



address = "http://localhost:4001"  #ip address for api endpoint, default values for testnet sandbox
token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"  #default auth token value for sandbox.
client = algod.AlgodClient(token, address)  

#USAGE
sender_address = sys.argv[1]
sender_key = sys.argv[2]
recipient_address = sys.argv[3]
txn_amount = sys.argv[4]
note = ""

if (sys.argv[5]):
    note = sys.argv[5]

params = client.suggested_params()  
params.flat_fee = constants.MIN_TXN_FEE   
params.fee = 1000  
amount = 1000  
receiver = recipient_address
note = note.encode()

unsigned_txn = PaymentTxn(sender_address, params, receiver, 1000000, None, note)
signed_txn = unsigned_txn.sign(sender_key)

txid = client.send_transaction(signed_txn)
print("Successfully sent transaction with txID: {}".format(txid)) #May want to remove