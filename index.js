let documentButton = document.getElementById("submitButton");
documentButton.addEventListener('click', submit);
window.MyForm = {};
window.MyForm.validate = validate;
window.MyForm.setData = setData;
window.MyForm.getData = getData;
window.MyForm.submit = submit;

let documentFio = document.getElementById("fio");
let documentEmail = document.getElementById("email");
let documentPhone = document.getElementById("phone");
let documentConteiner = document.getElementById('resultContainer');


function validate() {
    let result = { isValid: true, errorFields: [] }

    let reg = /\D+/ig;
    let digitalPhone = documentPhone.value.replace(reg, '');
    let sumPhone = 0;
    while (digitalPhone > 0) {
        sumPhone += digitalPhone % 10;
        digitalPhone = Math.floor(digitalPhone / 10);
    }
    let splitFio = documentFio.value.trim().split(' ');
    if (splitFio.length != 3) {
        documentFio.classList.add("error");
        result.errorFields.push("fio");
        result.isValid = false;
    } else if (splitFio.length == 3) {
        documentFio.classList.remove("error");
    }
    if ((/^[A-Za-z0-9](?:[A-Za-z0-9\-\._]*[A-Za-z0-9])@(ya\.ru| yandex\.ru|yandex\.ua| yandex\.by| yandex\.kz| yandex\.com)$/).test(documentEmail.value)) {
        documentEmail.classList.remove("error");
    } else {
        documentEmail.classList.add("error");
        result.errorFields.push("email");
        result.isValid = false;
    }
    if ((/^\+7\(\d\d\d\)\d\d\d\-\d\d\-\d\d$/).test(documentPhone.value) &&
        documentPhone.value.length == 16 && sumPhone <= 30) {
        documentPhone.classList.remove("error");
    } else {
        documentPhone.classList.add("error");
        result.errorFields.push("phone");
        result.isValid = false;
    }
    return result;

}

function getData() {
    return { fio: documentFio.value.trim(), email: documentEmail.value, phone: documentPhone.value };
}

function setData(data) {
    documentFio.value = data.fio;
    documentEmail.value = data.email;
    documentPhone.value = data.phone;
}

function submit() {
    let validationFunction = validate();
    if (validationFunction.isValid == true) {
        documentButton.disabled = true;
        let address = document.getElementById('myForm').action;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', address, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status != 200) {} else {
                    let serverResp = JSON.parse(xhr.responseText);
                    if (serverResp.status == 'success') {
                        documentConteiner.innerHTML = 'Success';
                        documentConteiner.classList.add("success");
                    } else if (serverResp.status == 'progress') {
                        documentConteiner.innerHTML = 'progress';
                        documentConteiner.classList.add("progress");
                        setTimeout(submit(), serverResp.timeout);

                    } else if (serverResp.status == 'error') {
                        documentConteiner.innerHTML = serverResp.reason;
                        documentConteiner.classList.add("error");
                    }
                }
            }
        }
        xhr.send(null);
    }

}