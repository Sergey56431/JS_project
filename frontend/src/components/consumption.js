import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "./balance.js";

export class Consumption {

    constructor(page) {

        Balance.sending();
        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login'
        }

        try {
            const result = await CustomHttp.request(config.host + '/categories/expense');
            if (result) {
                localStorage.removeItem('BlockName')
                localStorage.removeItem('BlockId')
                this.showConsumptionElements(result)
            }
        } catch (error) {
            console.log(error);
        }
    }

    showConsumptionElements(result) {
        const incomesCategory= document.getElementById('consumptionItems');

        result.forEach(item => {
            const categoryItem = document.createElement('div');
            categoryItem.classList.add('col-sm-4', 'mb-4');

            const categoryCard = document.createElement('div');
            categoryCard.className = 'card';
            categoryItem.setAttribute('id', item.id)

            const categoryCardBody = document.createElement('div');
            categoryCardBody.className = 'card-body';

            const categoryCardName = document.createElement('h2');
            categoryCardName.className = 'card-title';
            categoryCardName.innerText = item.title;

            const editBtnIncome = document.createElement('a');
            editBtnIncome.setAttribute('href', '#/changepay');
            editBtnIncome.className = 'btn btn-primary me-1 change';
            editBtnIncome.innerText = 'Редактировать';

            const deleteBtn = document.createElement('a');
            deleteBtn.setAttribute('href', '#')
            deleteBtn.setAttribute('data-bs-toggle', 'modal')
            deleteBtn.setAttribute('data-bs-target', '#exampleModal')
            deleteBtn.className = 'btn btn-danger deleted';
            deleteBtn.innerText = 'Удалить';

            categoryCardBody.appendChild(categoryCardName);
            categoryCardBody.appendChild(editBtnIncome);
            categoryCardBody.appendChild(deleteBtn);

            categoryCard.appendChild(categoryCardBody)
            categoryItem.appendChild(categoryCard)
            incomesCategory.appendChild(categoryItem)
        })

        const categoryItemAdd = document.createElement('a');
        categoryItemAdd.className = 'col-sm-4';
        categoryItemAdd.setAttribute('href', '#/addpay');

        const categoryItemAddCard = document.createElement('div');
        categoryItemAddCard.className = 'card';

        const emptyCardBody = document.createElement('div');
        emptyCardBody.className = 'card-body empty';

        const emptyCardBodyAdd = document.createElement('div');
        emptyCardBodyAdd.className = 'add-card'
        emptyCardBodyAdd.innerHTML =
            '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"\n' +
            'xmlns="http://www.w3.org/2000/svg">\n' +
            '<path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"\n' +
            'fill="#CED4DA"/>\n' +
            '</svg>'


        emptyCardBody.appendChild(emptyCardBodyAdd);
        categoryItemAddCard.appendChild(emptyCardBody);
        categoryItemAdd.appendChild(categoryItemAddCard);
        incomesCategory.appendChild(categoryItemAdd);

        this.editBtnElements = document.querySelectorAll('.change')
        this.editBtnElements.forEach(item => {
            item.onclick = function () {
                const result = item.previousElementSibling.textContent
                const resultId = item.parentElement.parentElement.parentElement.id

                localStorage.setItem('BlockName', JSON.stringify(result))
                localStorage.setItem('BlockId', JSON.stringify(resultId))
            }
        })

        this.deleteBtnElement = document.querySelectorAll('.deleted');
        this.popupDeleteCategory = document.getElementById('btn-delete');
        const that = this
        this.deleteBtnElement.forEach(item => {
            item.onclick = function () {
                that.popupDeleteCategory.onclick = function () {
                    let resultId = item.parentElement.parentElement.parentElement.id
                    try {
                        const result = CustomHttp.request(config.host + '/categories/expense/' + resultId, "DELETE");
                        if (result) {
                            location.href = '#/consumption';
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        })
    }
}