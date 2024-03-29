import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "./balance.js";

export class Create {
    constructor(page) {
        this.newCreateTypeOperation = document.getElementById('typeField');
        this.newCreateCategoryOperation = document.getElementById('categoryField');
        this.newCreateAmountOperation = document.getElementById('sumField');
        this.newCreateDateOperation = document.getElementById('dateField');
        this.newCreateCommentOperation = document.getElementById('commentField');
        this.saveNewCreateOperation = document.getElementById('createBtn');
        this.category = null;
        this.balanceToChange = 0;

        Balance.sending();
        this.Categories();
    }

    async Categories() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login';
        }
        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                this.createNewOperation(result);
            }
            result.forEach(item => {
                const option = document.createElement('option');
                option.setAttribute('value', item.title);
                option.setAttribute('id', item.id);
                option.className = 'option-element';
                option.innerText = item.title;

                let indexSelected = this.newCreateTypeOperation.selectedIndex,
                    options = this.newCreateTypeOperation.querySelectorAll('option')[indexSelected];

                let selectedId = options.getAttribute('id');
                if (selectedId === 'one') {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }

                this.newCreateCategoryOperation.appendChild(option);

                this.newCreateTypeOperation.addEventListener('change', (e) => {
                    if (this.newCreateTypeOperation.value === 'expense') {
                        option.style.display = 'none';
                        this.newCreateCategoryOperation.value = ' ';
                    } else {
                        option.style.display = 'block';
                    }
                })
                this.newCreateCategoryOperation.addEventListener('change', (e) => {
                    result.forEach(item => {
                        if (item.title && this.newCreateCategoryOperation.value === item.title) {
                            this.category = item.id;
                            return this.category;
                        }
                    })
                })
            })

            const resultExpense = await CustomHttp.request(config.host + '/categories/expense');
            this.createNewOperation(resultExpense);
            resultExpense.forEach(itemExp => {
                const optionExp = document.createElement('option');
                optionExp.setAttribute('value', itemExp.title);
                optionExp.setAttribute('id', itemExp.id);
                optionExp.className = 'option-element-exp';
                optionExp.innerText = itemExp.title;

                let indexSelected = this.newCreateTypeOperation.selectedIndex,
                    option = this.newCreateTypeOperation.querySelectorAll('option')[indexSelected];

                let selectedId = option.getAttribute('id');

                if (selectedId === 'two') {
                    optionExp.style.display = 'block';
                } else {
                    optionExp.style.display = 'none';
                }

                this.newCreateCategoryOperation.appendChild(optionExp)
                this.newCreateTypeOperation.addEventListener('change', (e) => {
                    if (this.newCreateTypeOperation.value === 'income') {
                        optionExp.style.display = 'none';
                        this.newCreateCategoryOperation.value = ' ';
                    } else {
                        optionExp.style.display = 'block';
                    }
                })

                this.newCreateCategoryOperation.addEventListener('change', (e) => {
                    resultExpense.forEach(item => {
                        if (item.title && this.newCreateCategoryOperation.value === item.title) {
                            this.category = item.id;
                            return this.category;
                        }
                    })
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    createNewOperation() {
        const that = this;
        this.saveNewCreateOperation.onclick = function () {
            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login';
            }
            try {
                const result = CustomHttp.request(config.host + '/operations', "POST", {
                    type: that.newCreateTypeOperation.value,
                    category_id: that.category,
                    amount: that.newCreateAmountOperation.value,
                    date: that.newCreateDateOperation.value,
                    comment: that.newCreateCommentOperation.value,
                });


                if (result) {
                    that.changeBalance();
                    location.href = '#/operations';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

     async changeBalance() {
        let balance = Number(localStorage.getItem('balance'));
        let amount = Number(this.newCreateAmountOperation.value);
        if (this.newCreateTypeOperation.value === 'income'){
            this.balanceToChange = (balance) + (amount);
        }
        if (this.newCreateTypeOperation.value === 'expense') {
            this.balanceToChange = (balance) - (amount);
        }

        JSON.stringify(this.balanceToChange);
        await CustomHttp.request(config.host + '/balance', "PUT", {
            newBalance: this.balanceToChange
        })
    }
}