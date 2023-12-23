import { topUpAccount } from "../repository/accountRepository";

const accountDepositService = (data: any) => {
    console.log(data, 'data passed here');
    //Interface with database here.
    const result = topUpAccount();
    console.log(result, 'after top up...');

}

const accountWithdrawService = (data: any) => {
    console.log(data, 'withdraw service');
}

export {
    accountDepositService,
    accountWithdrawService,
}