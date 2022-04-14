from algosdk import account, mnemonic

#to fund wallet see https://developer.algorand.org/docs/archive/build-apps/hello_world/
#faucet link to add funds to your testnet wallet: https://bank.testnet.algorand.network/
# or https://dispenser.testnet.aws.algodev.network/


def generate_algorand_keypair():  
    private_key, address = account.generate_account()  
    print("My address: {}".format(address))  
    print("My private key: {}".format(private_key))  
    print("My passphrase: {}".format(mnemonic.from_private_key(private_key)))  
  
# Write down the address, private key, and the passphrase for later usage  
generate_algorand_keypair()  

