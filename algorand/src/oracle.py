from pyteal import *


ADMIN_KEY = Bytes("admin")
WHITELISTED_KEY = Bytes("whitelisted")
REQUESTS_BALANCE_KEY = Bytes("requests_balance")
MAX_BUY_AMOUNT = Int(1000000000)
MIN_BUY_AMOUNT = Int(10000000)
REQUESTS_SELLER = Addr("3H234AKB3JMGCACL3HR7KVG3ZNXUEMQQWOH3QFL7FPK4E767UXSXA3I5TA")
EXCHANGE_NOTE = Bytes("algo-oracle-app-4")


def approval_program():
    on_creation = Seq(
        [
            Assert(Txn.application_args.length() == Int(0)),
            App.localPut(Int(0), ADMIN_KEY, Int(1)),
            Return(Int(1))
        ]
    )

    is_contract_admin = App.localGet(Int(0), ADMIN_KEY)

    # set/remove an admin for this contract
    admin_status = Btoi(Txn.application_args[2])
    set_admin = Seq(
        [
            Assert(
                And(
                    is_contract_admin,
                    Txn.application_args.length() == Int(3),
                    Txn.accounts.length() == Int(1),
                    )
            ),
            App.localPut(Int(1), ADMIN_KEY, admin_status),
            Return(Int(1)),
        ]
    )

    register = Seq(
        [
            App.localPut(Int(0), WHITELISTED_KEY, Int(0)), Return(Int(1))
        ]
    )

    #whitelisting of oracle app
    whitelist = Seq(
        [
            Assert(
                And(
                    is_contract_admin,
                    Txn.application_args.length() == Int(2),
                    Txn.accounts.length() == Int(1)
                )
            ),
            App.localPut(Int(1), WHITELISTED_KEY, Int(1)),
            Return(Int(1))
        ]
    )

    is_whitelisted = App.localGet(Int(0), WHITELISTED_KEY)

    # An admin can increase the request balance of a user.
    requests_amount = Btoi(Txn.application_args[1])
    allocate_requests = Seq(
        [
            Assert(
                And(
                    is_contract_admin,  # Sent by admin
                    Txn.application_args.length() == Int(3),  # receiver and amount are provided
                    Txn.accounts.length() == Int(1),
                    App.localGet(Int(1), WHITELISTED_KEY),  # receiver is whitelisted
                )
            ),
            App.localPut(
                Int(1),
                REQUESTS_BALANCE_KEY,
                App.localGet(Int(1), REQUESTS_BALANCE_KEY) + requests_amount
            ),
            Return(Int(1))
        ]
    )

    # client purchases "credits" to be able to send requests to the app
    buy_requests = Seq(
        [
            Assert(
                And(
                    is_whitelisted,
                    Global.group_size() == Int(2),  # buying requests must be done using an atomic transfer
                    Gtxn[0].type_enum() == TxnType.Payment,  
                    Gtxn[0].receiver() == REQUESTS_SELLER,  
                    Gtxn[0].amount() >= MIN_BUY_AMOUNT,  
                    Gtxn[0].amount() <= MAX_BUY_AMOUNT,  
                    Txn.group_index() == Int(1),  #set cost for transaction request amount
                    Txn.application_args.length() == Int(2),
                    Txn.accounts.length() == Int(1)  # the address which will use the requests must be provided
                )
            ),
            App.localPut(
                Int(1),
                REQUESTS_BALANCE_KEY,
                App.localGet(Int(1), REQUESTS_BALANCE_KEY) + (Gtxn[0].amount() / Int(100000)),
                ),
            Return(Int(1))
        ]
    )

    settlement_status_request = Seq(
        [
            Assert(
                And(
                    is_whitelisted,
                    Txn.note() == EXCHANGE_NOTE,
                    Txn.application_args.length() == Int(4),
                    Txn.accounts.length() == Int(0),
                    App.localGet(Int(0), REQUESTS_BALANCE_KEY) >= Int(1)
                )
            ),
            App.localPut(
                Int(0),
                REQUESTS_BALANCE_KEY,
                App.localGet(Int(0), REQUESTS_BALANCE_KEY) - Int(1),
                ),
            Return(Int(1))
        ]
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(is_contract_admin)],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(is_contract_admin)],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, register],
        [Txn.application_args[0] == Bytes("set_admin"), set_admin],
        [Txn.application_args[0] == Bytes("whitelist"), whitelist],
        [Txn.application_args[0] == Bytes("allocate_requests"), allocate_requests],
        [Txn.application_args[0] == Bytes("buy_requests"), buy_requests],
        [Txn.application_args[0] == Bytes("get_settlement_status"), settlement_status_request]
    )
    return program


def clear_state_program():
    program = Seq(
        [
            Return(Int(1))
        ]
    )

    return program


if __name__ == "__main__":
    with open("oracle_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=5)
        f.write(compiled)

    with open("oracle_clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=5)
        f.write(compiled)