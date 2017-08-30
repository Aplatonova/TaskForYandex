let el = document.getElementById('submitButton');
el.addEventListener('click', submit);
window.MyForm = {};
window.MyForm.validate = validate;
window.MyForm.setData = setData;
window.MyForm.getData = getData;
window.MyForm.submit = submit;

function validate() {
    let fio = document.getElementsByName("fio")[0].value.trim();
    let email = document.getElementsByName("email")[0].value;
    let phone = document.getElementsByName("phone")[0].value;

    let result = { isValid: true, errorFields: [] }

    let reg = /\D+/ig;
    let digitalPhone = phone.replace(reg, '');
    let sumPhone = 0;
    while (digitalPhone > 0) {
        sumPhone += digitalPhone % 10;
        digitalPhone = Math.floor(digitalPhone / 10);
    }
    let splitFio = fio.split(' ');
    if (splitFio.length != 3) {
        document.getElementById("fio").classList.add("error");
        result.errorFields.push("fio");
        result.isValid = false;
    } else if (splitFio.length == 3) {
        document.getElementById("fio").classList.remove("error");
    }
    if ((/^[A-Za-z0-9](?:[A-Za-z0-9\-\._]*[A-Za-z0-9])@(ya\.ru| yandex\.ru|yandex\.ua| yandex\.by| yandex\.kz| yandex\.com)$/).test(email)) {
        document.getElementById("email").classList.remove("error");
    } else {
        document.getElementById("email").classList.add("error");
        result.errorFields.push("email");
        result.isValid = false;
    }
    if ((/^\+7\(\d\d\d\)\d\d\d\-\d\d\-\d\d$/).test(phone) &&
        phone.length == 16 && sumPhone <= 30) {
        document.getElementById("phone").classList.remove("error");
    } else {
        document.getElementById("phone").classList.add("error");
        result.errorFields.push("phone");
        result.isValid = false;
    }
    return result;

}

function getData() {
    let fio = document.getElementsByName("fio")[0].value;
    let email = document.getElementsByName("email")[0].value;
    let phone = document.getElementsByName("phone")[0].value;
    return { fio: fio, email: email, phone: phone };
}

function setData(data) {
    document.getElementsByName("fio")[0].value = data.fio;
    document.getElementsByName("email")[0].value = data.email;
    document.getElementsByName("phone")[0].value = data.phone;
}

function submit() {
    //e.preventDefault();
    let validationFunction = validate();
    if (validationFunction.isValid == true) {
        //блокировка кнопки
        let address = document.getElementById('myForm').action;
        // 1. Создаём новый объект XMLHttpRequest
        var xhr = new XMLHttpRequest();
        // 2. Конфигурируем его: GET-запрос н
        xhr.open('GET', address, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {

                // 3. Отсылаем запрос
                // 4. Если код ответа сервера не 200, то это ошибка
                if (xhr.status != 200) {
                    // обработать ошибку
                    // alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
                } else {
                    // вывести результат
                    //alert(xhr.responseText); // responseText -- текст ответа.
                    let serverResp = JSON.parse(xhr.responseText);
                    if (serverResp.status == 'success') {
                        document.getElementById('resultContainer').innerHTML = 'Success';
                        document.getElementById("resultContainer").classList.add("success");
                    } else if (serverResp.status == 'progress') {
                        document.getElementById('resultContainer').innerHTML = 'progress';
                        document.getElementById("resultContainer").classList.add("progress");
                        setTimeout(submit(), serverResp.timeout);

                    } else if (serverResp.status == 'error') {
                        document.getElementById('resultContainer').innerHTML = serverResp.reason;
                        document.getElementById("resultContainer").classList.add("error");
                    }
                    document.getElementById("submitButton").disabled = true;

                }
            }
        }
        xhr.send(null);
    }

}