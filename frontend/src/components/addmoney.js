import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "./balance.js";

export class Addmoney {

    constructor(page) {
        this.categoryInput = document.getElementById('categoryName');
        this.sendBtn = document.getElementById('send');

        Balance.sending();
        this.createdCategoryIncome();
    }

    createdCategoryIncome() {
        const that = this;
        this.sendBtn.onclick = function () {
            let categoryTitle = that.categoryInput.value;
            try {
                const result = CustomHttp.request(config.host + '/categories/income', "POST", {
                    title: categoryTitle
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
}