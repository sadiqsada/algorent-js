import json  
import base64  
from algosdk import account, mnemonic, constants  
from algosdk.v2client import algod  
from algosdk.future import transaction  
from algosdk.future.transaction import PaymentTxn
import sys


address = "http://localhost:4001"  #ip address for api endpoint, default values for testnet sandbox
token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"  #default auth token value for sandbox.
client = algod.AlgodClient(token, address)  

sender_address = sys.argv[1]
recipient_address = sys.argv[2]
txn_amount = sys.argv[3]