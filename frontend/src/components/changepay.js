import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "./balance.js";

export class Changepay {

    constructor(page) {
        this.categoryInput = document.getElementById('categoryName');
        this.sendBtn = document.getElementById('send');

        Balance.sending();
        this.addNameConsumption();
        this.newNameConsumption();
    }

    addNameConsumption() {
        let result = localStorage.getItem('BlockName');
        JSON.parse(result);
        this.result = result.replace(/[^а-яё]/gi, ' ');
        this.categoryInput.placeholder = this.result;
    }

     async newNameConsumption() {
        const that = this;
        let resultId = localStorage.getItem('BlockId');
        JSON.parse(resultId);
        resultId = resultId.replace(/[^1-9]/gi, ' ');
        resultId = parseInt(resultId);
        this.sendBtn.onclick = function () {
            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login';
            }

            try {
                CustomHttp.request(config.host + '/categories/expense/' + resultId, "PUT", {
                    title: that.categoryInput.value
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
}