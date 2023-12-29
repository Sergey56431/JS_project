import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Balance {

    constructor() {
        this.balanceCoin = document.getElementById('balance')

    }

    static sending() {
        const that = this
        let balanceInput = document.getElementById('nowBalance');
        let sendBalance = document.getElementById('sendBalance');
        sendBalance.onclick = function () {
            JSON.stringify(balanceInput.value);
            let balance = CustomHttp.request(config.host + '/balance', "PUT", {
                newBalance: balanceInput.value
            })
        }
    }

    async myBalance() {
        let getBalance = await CustomHttp.request(config.host + '/balance')
        if (getBalance) {
            this.balanceCoin.innerText = getBalance.balance + "$";
            localStorage.setItem("balance", JSON.stringify(getBalance.balance))
            console.log(getBalance.balance)
        }
    }
}