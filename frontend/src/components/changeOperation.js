import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class ChangeOperation {

    constructor(page) {
        this.typeField = document.getElementById('typeField');
        this.categoryField = document.getElementById('categoryField');
        this.sumField = document.getElementById('sumField');
        this.dateField = document.getElementById('dateField');
        this.commentField = document.getElementById('commentField');
        this.saveBtn = document.getElementById('createBtn');
        this.balanceToChange = 0;
        this.category = null;

        this.init()
    }

    async init () {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login';
        }

        let type = localStorage.getItem('Type')
        type = type.replace(/[^а-яёa-z]/gi, ' ');
        type = type.replace(/\s+/g, ' ').trim();
        let category = localStorage.getItem('Category')
        category = category.replace(/[^а-яёa-z1-9]/gi, ' ');
        category = category.replace(/\s+/g, ' ').trim();

        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            this.addInputNameOperations(result);
            this.editOperation(result);
            result.forEach(item => {
                const option = document.createElement('option')
                option.setAttribute('value', item.title);
                option.setAttribute('id', item.id);
                option.className = 'option-element';
                option.innerText = item.title;

                let indexSelected = this.typeField.selectedIndex,
                    options = this.typeField.querySelectorAll('option')[indexSelected];

                let selectedId = options.getAttribute('id');
                if (selectedId === 'one') {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }

                this.categoryField.appendChild(option);

                this.typeField.addEventListener('change', (e) => {
                    if (this.typeField.value === 'expense') {
                        option.style.display = 'none';
                        this.categoryField.value = ' ';
                    } else {
                        option.style.display = 'block';
                    }
                })
            })

            if (type === 'доход') {
                result.forEach(item => {
                    if (item.title === category) {
                        this.categoryField.value = category;
                        this.category = item.id;
                        return this.category;
                    }
                })
            }
            this.categoryField.addEventListener('change', (e) => {
                result.forEach(item => {
                    if (item.title && this.categoryField.value === item.title) {
                        this.category = item.id
                        return this.category
                    }
                })
            })

            const resultExpense = await CustomHttp.request(config.host + '/categories/expense');
            if (type === 'доход') {
                resultExpense.forEach(item => {
                    if (item.title === category) {
                        this.categoryField.value = item.title
                    }
                })
            }
            this.addInputNameOperations(resultExpense)
            this.editOperation(resultExpense)
            resultExpense.forEach(itemExp => {
                const optionExp = document.createElement('option')
                optionExp.setAttribute('value', itemExp.title);
                optionExp.setAttribute('id', itemExp.id);
                optionExp.className = 'option-element-exp';
                optionExp.innerText = itemExp.title

                let indexSelected = this.typeField.selectedIndex,
                    option = this.typeField.querySelectorAll('option')[indexSelected];

                let selectedId = option.getAttribute('id');

                if (selectedId === 'two') {
                    optionExp.style.display = 'block'
                } else {
                    optionExp.style.display = 'none'
                }

                this.categoryField.appendChild(optionExp)
                this.typeField.addEventListener('change', (e) => {

                    if (this.typeField.value === 'income') {
                        optionExp.style.display = 'none'
                        this.categoryField.value = ' '
                    } else {
                        optionExp.style.display = 'block'
                    }
                })
            })

            if (type === 'расход') {
                resultExpense.forEach(item => {
                    if (item.title === category) {
                        this.categoryField.value = category
                        this.category = item.id
                        return this.category
                    }
                })
            }
            this.categoryField.addEventListener('change', (e) => {
                resultExpense.forEach(item => {
                    if (item.title && this.categoryField.value === item.title) {
                        this.category = item.id
                        return this.category
                    }
                })
            })

        } catch (error) {
            console.log(error);
        }
    }
    addInputNameOperations() {
        let balance = Number(localStorage.getItem('balance'));
        console.log(typeof Number(this.sumField.value));
        console.log(typeof balance);
        let type = localStorage.getItem('Type');
        let amount = localStorage.getItem('Amount');
        let date = localStorage.getItem('Date');
        let comment = localStorage.getItem('Comment');
        type = type.replace(/[^а-яёa-z]/gi, ' ');
        type = type.replace(/\s+/g, ' ').trim();
        amount = amount.replace(/[^0-9]/gi, ' ');
        amount = amount.replace(/\s+/g, ' ').trim();
        date = date.replace(/[^0-9.]/gi, ' ');
        date = date.replace(/\s+/g, ' ').trim();
        comment = comment.replace(/[^а-яёa-z1-9]/gi, ' ');
        comment = comment.replace(/\s+/g, ' ').trim();

        date = date.split('.');
        date = date[2] + '-' + date [1] + '-' + date[0];

        if (type === 'доход') {
            this.typeField.value = 'income';
            this.balanceToChange = balance + Number(this.sumField.value);
            this.changeBalance();
        } else {
            this.typeField.value = 'expense';
            this.balanceToChange = balance - this.sumField.value;

            this.changeBalance();
        }
        this.sumField.value = amount;
        this.dateField.value = date;
        this.commentField.value = comment;

    }

    editOperation() {
        const that = this
        let operationId = localStorage.getItem('OperationId')
        JSON.parse(operationId)
        operationId = operationId.replace(/[^1-9]/gi, ' ');
        operationId = parseInt(operationId)
        this.saveBtn.onclick = function () {
            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/login'
            }

            try {
                const result = CustomHttp.request(config.host + '/operations/' + operationId, "POST", {
                    type: that.typeField.value,
                    category_id: that.category,
                    amount: that.sumField.value,
                    date: that.dateField.value,
                    comment: that.commentField.value
                });
                if (result) {
                    location.href = '#/operations'
                }
            } catch (error) {
                console.log(error);
            }
            that.removeLocalStorage()
        }
    }

    changeBalance() {
        JSON.stringify(this.balanceToChange)
        let newBalance = CustomHttp.request(config.host + '/balance', "PUT", {
            newBalance: this.balanceToChange
        })

    }

    removeLocalStorage() {
        localStorage.removeItem('Type');
        localStorage.removeItem('Amount');
        localStorage.removeItem('Date');
        localStorage.removeItem('Comment');
        localStorage.removeItem('Category');
        localStorage.removeItem('OperationId');
    }
}