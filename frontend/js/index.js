window.addEventListener('DOMContentLoaded', function() {
    // функционал прелоадеров
    // для таблицы клиентов
    function clientsPreload() {
        const preloader = document.getElementById('table-preloader');
        const table = document.querySelector('.clients__table');
        const addBtn = document.querySelector('.clients__add-client');
        const popups = document.querySelectorAll('.popup');

        document.body.onload = function() {
            if (!preloader.classList.contains('done')) {
                preloader.classList.add('done'); // выключаем прелоадер
                table.classList.remove('preload'); // меняем сосотояние таблицы клиентов
                addBtn.classList.remove('preload'); // отображаем кнопку добавления клиентов
                popups.forEach(el => {
                    el.classList.remove('preload'); // отключаем все модальные окна во время загрузки страницы
                });
            }
        }
    }
    // для модальных окон
    function popupPreload(modifier, response) {
        const preloader = document.getElementById(`${modifier}-preloader`);
        if (response.status === 200) {
            if (!preloader.classList.contains('done')) {
                preloader.classList.add('done'); // выключаем прелоадер
            }
        }
    }

    clientsPreload(); // запускаем прелоадер клиентов
    
    // создаем функционал для модальных окон
    function popup() {
        const popupLinks = document.querySelectorAll('.popup-link');
        const body = document.querySelector('.body');
        const lockPadding = document.querySelectorAll('.lock-padding');

        let unlock = true;

        const TIMEOUT = 300;

        function bodyLock() {
            const lockPaddingValue = window.innerWidth - document.querySelector('.popup__body').offsetWidth + 'px';

            if (lockPadding.length > 0) {
                for (let i = 0; i < lockPadding.length; i++) {
                    const el = lockPadding[i];
                    el.style.paddingRight = lockPaddingValue;
                }
            }
            body.style.paddingRight = lockPaddingValue;
            body.classList.add('lock');

            unlock = false;
            setTimeout(function() {
                unlock = true;
            }, TIMEOUT);
        }

        function bodyUnlock() {
            setTimeout(function() {
                for (let i = 0; i < lockPadding.length; i++) {
                    const el = lockPadding[i];
                    el.style.paddingRight = '0px';
                }
                body.style.paddingRight = '0px';
                body.classList.remove('lock');
            }, TIMEOUT);

            unlock = false;
            setTimeout(function() {
                unlock = true;
            }, TIMEOUT);
        }

        function popupClose(popupActive, doUnlock = true) {
            if (unlock) {
                popupActive.classList.remove('open');

                if (doUnlock) {
                    bodyUnlock();
                }

                // очищаем селекты
                const select = document.querySelectorAll('.popup__select');
                select.forEach(el => {
                    el.classList.remove('active');
                });

                // очищаем выпадающие меню
                const menu = document.querySelectorAll('.popup__select-menu');
                menu.forEach(el => {
                    el.classList.remove('open');
                });

                // убираем hash
                history.pushState(null, null, '/index.html');

                // обнуляем прелоадеры
                // для модального окна редактирования клиента
                const preloaderEdit = document.getElementById('edit-preloader');
                if (preloaderEdit.classList.contains('done')) {
                    preloaderEdit.classList.remove('done'); // включаем прелоадер
                }
                // для модального окна открытия клиента
                const preloaderOpen = document.getElementById('open-preloader');
                if (preloaderOpen.classList.contains('done')) {
                    preloaderOpen.classList.remove('done'); // включаем прелоадер
                }

                // сбрасываем верстку модальных окон
                popupReset();
            }
        }

        function popupOpen(curentPopup) {
            if (curentPopup && unlock) {
                const popupActive = document.querySelector('.popup.open');
                if (popupActive) {
                    popupClose(popupActive, false);
                } else {
                    bodyLock();
                }
                curentPopup.classList.add('open');
                curentPopup.addEventListener('click', function(e) {
                    if (!e.target.closest('.popup__content')) {
                        popupClose(e.target.closest('.popup'));
                    }
                });
            }
        }

        if (popupLinks.length > 0) {
            for (let i = 0; i < popupLinks.length; i++) {
                const popupLink = popupLinks[i];
                popupLink.addEventListener('click', function(e) {
                    const popupName = popupLink.getAttribute('href').replace('#', '');
                    const curentPopup = document.getElementById(popupName);
                    popupOpen(curentPopup);
                    e.preventDefault();
                });
            }
        }

        const popupCloseIcon = document.querySelectorAll('.close-popup');
        if (popupCloseIcon.length > 0) {
            for (let i = 0; i < popupCloseIcon.length; i++) {
                const el = popupCloseIcon[i];
                el.addEventListener('click', function(e) {
                    popupClose(el.closest('.popup'));
                    e.preventDefault();
                });
            }
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const popupActive = document.querySelector('.popup.open');
                if (popupActive !== null) {
                    popupClose(popupActive);
                }
            }
        });

        (function() {
            if (!Element.prototype.closest) {
                Element.prototype.closest = function(css) {
                    var node = this;
                    while (node) {
                        if (node.matches(css)) return node;
                        else node = node.parentElement;
                    }
                }
                return null;
            }
        })();

        (function() {
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.matchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector;
            }
        })();
    }

    // функция для анимирования отображений лейблов
    function popupLabels(modifier) {
        document.querySelectorAll(`.popup__form-item${modifier}`).forEach(item => {
            if (item.childNodes[3].value.length > 0) {
                item.childNodes[1].classList.remove('empty');
            } else {
                item.childNodes[1].classList.add('empty');
            }
            item.addEventListener('click', function() {
                item.childNodes[1].classList.remove('empty');
                item.childNodes[3].focus();
            });
            item.childNodes[3].addEventListener('focus', function() {
                item.childNodes[1].classList.remove('empty');
            });
        });
    }

    // функция сброса данных в модальных окнах
    function popupReset() {
        // для модального окна создания клиента
        document.getElementById('form-surname--create').value = '';
        document.getElementById('form-name--create').value = '';
        document.getElementById('form-last-name--create').value = '';
        document.getElementById('popup-new-contacts').innerHTML = '<div class="popup__contact popup__contact--create new-contact new-contact--create"></div>';
        // для модального окна редактирования клиента
        document.getElementById('popup-edit-id').textContent = '';
        document.getElementById('form-surname--edit').value = '';
        document.getElementById('form-name--edit').value = '';
        document.getElementById('form-last-name--edit').value = '';
        document.getElementById('popup-edit-contacts').innerHTML = '<div class="popup__contact popup__contact--edit new-contact new-contact--edit"></div>';
        // для модального окна открытия клиента
        document.getElementById('popup-open-id').textContent = '';
        document.getElementById('form-surname--open').value = '';
        document.getElementById('form-name--open').value = '';
        document.getElementById('form-last-name--open').value = '';
        document.getElementById('popup-open-contacts').innerHTML = '<div class="popup__contact popup__contact--open new-contact new-contact--open"></div>';
        document.getElementById('popup-open-link').value = '';
    }

    // возвращаем лейбл в исходное состояние
    function defaultLabelCondition(e) {
        const target = e.target;
        const items = document.querySelectorAll('.popup__form-item');

        items.forEach(item => {
            if (!(target === item || item.contains(target)) && item.childNodes[3].value === '') {
                item.childNodes[1].classList.add('empty');
            }
        });
    }
    // при клике вне инпута
    document.addEventListener('mousedown', function(e) {
        const popups = document.querySelectorAll('.popup');
        popups.forEach(el => {
            if (el.classList.contains('open')) {
                defaultLabelCondition(e);
            }
        });
    });
    // при фокусе на другой инпут
    document.querySelectorAll('.popup__form-input').forEach(input => {
        const inputs = document.querySelectorAll('.popup__form-input');
        input.addEventListener('focus', function() {
            inputs.forEach(el => {
                if (!(el === document.activeElement) && el.value === '') {
                    el.previousElementSibling.classList.add('empty');
                }
            });
        });
    });
    // при открытии модального окна, посколько после закрытия в инпутах может остаться текст
    document.querySelector('.clients__add-client').addEventListener('click', function(e) {
        defaultLabelCondition(e);
    });

    // создаем переменную для GET данных с сервера
    let data;

    // создаем переменные для кнопок сортировки
    const sortIDBtn = document.getElementById('sort-id');
    const sortNameBtn = document.getElementById('sort-name');
    const sortCreatedBtn = document.getElementById('sort-created');
    const sortUpdatedBtn = document.getElementById('sort-updated');
    const searchInput = document.querySelector('.search__input'); // инпут фильтра

    // создаем массив промтов для инпутов и селектов контактов
    const inputPromts = ['+7 ', 'facebook.com/', 'vk.com/', 'instagram.com/', 'telegram.com/', 'whatsapp.com/'];
    const selectPromts =['Телефон', 'Email', 'Facebook', 'VK', 'Instagram', 'Telegram', 'WhatsApp', 'Другое'];

    let nodeContacts = document.querySelectorAll('.popup__input');
    let arrayContacts = Array.prototype.slice.call(nodeContacts); // конвертируем nodelist в массив

    // проверяем включена ли сортировка
    function checkSort() {
        if (sortIDBtn.classList.contains('active') || sortIDBtn.classList.contains('active-reverse')) {
            if (sortIDBtn.classList.contains('active')) {
                sortID('ascending');
            } else {
                sortID('descending');
            }
        } else if (sortNameBtn.classList.contains('active') || sortNameBtn.classList.contains('active-reverse')) {
            if (sortNameBtn.classList.contains('active')) {
                sortName('ascending');
            } else {
                sortName('descending');
            }
        } else if (sortCreatedBtn.classList.contains('active') || sortCreatedBtn.classList.contains('active-reverse')) {
            if (sortCreatedBtn.classList.contains('active')) {
                sortDate('created', 'ascending');
            } else {
                sortDate('created', 'descending');
            }
        } else if (sortUpdatedBtn.classList.contains('active') || sortUpdatedBtn.classList.contains('active-reverse')) {
            if (sortUpdatedBtn.classList.contains('active')) {
                sortDate('updated', 'ascending');
            } else {
                sortDate('updated', 'descending');
            }
        }
    }

    // определяем поведение контента в инпутах
    function inputMasks(type, field) {
        const error = field.parentNode.childNodes[7];
        switch (type.textContent) {
            case selectPromts[0]:
                field.disabled = false;
                field.type = 'tel';
                field.value = inputPromts[0];
                field.dataset.type = 'tel';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                    if (field.dataset.type === 'tel') {
                        field.value = field.value.replace(/[a-zа-яё]/gi, '');

                        if (field.value.length < 3) {
                            field.value = '+7 ';
                        }

                        if (field.value.length === 13) {
                            field.value = `${field.value.substring(0, 2)} (${field.value.substring(3, 6)}) ${field.value.substring(6, 9)} ${field.value.substring(9, 11)}-${field.value.substring(11, 13)}`;
                        }

                        if (field.value.length === 17) {
                            field.value = `${field.value.substring(0, 2)} ${field.value.substring(3).split(' ').join('').split('-').join('').split('(').join('').split(')').join('')}`;
                        }

                        if (field.value.length === 19) {
                            field.value = field.value.substring(0, 18);
                        }
                    }
                });
                break;
            case selectPromts[1]:
                field.disabled = false;
                field.type = 'email';
                field.value = '';
                field.dataset.type = 'email';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                    if (field.dataset.type === 'email') {
                        field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');
                    }
                });
                break;
            case selectPromts[2]:
                field.disabled = false;
                field.type = 'text';
                field.value = inputPromts[1];
                field.dataset.type = 'fb';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                    if (field.dataset.type === 'fb' && field.value.length < 13) {
                        field.value = inputPromts[1];
                        field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');
                    }
                });
                break;
            case selectPromts[3]:
                field.disabled = false;
                field.type = 'text';
                field.value = inputPromts[2];
                field.dataset.type = 'vk';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                    if (field.dataset.type === 'vk' && field.value.length === 6) {
                        field.value = inputPromts[2];
                        field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');
                    }
                });
                break;
            case selectPromts[4]:
                field.disabled = false;
                field.type = 'text';
                field.value = inputPromts[3];
                field.dataset.type = 'inst';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                    if (field.dataset.type === 'inst' && field.value.length === 13) {
                        field.value = inputPromts[3];
                        field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');
                    }
                });
                break;
            case selectPromts[5]:
                field.disabled = false;
                field.type = 'text';
                field.value = inputPromts[4];
                field.dataset.type = 'tg';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                    if (field.dataset.type === 'tg' && field.value.length === 12) {
                        field.value = inputPromts[4];
                        field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');
                    }
                });
                break;
            case selectPromts[6]:
                field.disabled = false;
                field.type = 'text';
                field.value = inputPromts[5];
                field.dataset.type = 'wa';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                    if (field.dataset.type === 'wa' && field.value.length === 12) {
                        field.value = inputPromts[5];
                        field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');
                    }
                });
                break;
            default:
                field.disabled = false;
                field.type = 'text';
                field.value = '';
                field.dataset.type = 'any';

                field.addEventListener('input', function() {
                    field.classList.remove('error');
                    error.classList.add('disabled');
                    error.textContent = '';
                });
                break;
        }
    }

    // редактируем клиента
    async function editClient(id) {
        const response = await fetch('http://localhost:3000/api/clients');
        data = await response.json();

        checkSort();

        // получаем все кнопки "изменить"
        const editBtn = document.querySelectorAll('.clients__table-edit');

        // редактируем конкретного клиента
        /**
         * Однако если включена сортировка по изменениям,то редактируем всю таблицу целиком,
         * поскольку из-за динамического содежания массив данных будет сортироваться после каждого
         * изменения клиента и менять порядок клиентов в массиве
         */
        if (sortUpdatedBtn.classList.contains('active') || sortUpdatedBtn.classList.contains('active-reverse')) {
            clearAllClients();
            displayAllClients(data);
            popup();
            editPopup();
            deletePopup();
        } else {
            for (let i = 0; i < data.length; i++) {
                if (editBtn[i].dataset.id === id) {
                    const clientRow = editBtn[i].parentNode.parentNode;
    
                    editClientLayout(data, i, clientRow);
    
                    clientRow.classList.add('add-client');
    
                    setTimeout(function() {
                        clientRow.classList.remove('add-client');
                    }, 150);
    
                    // добавляем контакты каждому клиенту
                    contactLayout(data, i);
                }
            }
        }
    }

    // добавляем нового клиента в верстку
    function displayNewClient(data) {
        for (let i = 0; i < data.length; i++) {
            const clientsTable = document.querySelector('.clients__table');
            const client = document.createElement('div');
            client.classList.add('clients__table-row');
            let id = data[i].id.toString();
            clientLayout(data, i, id, client);
            clientsTable.append(client);

            // добавляем контакты каждому клиенту
            contactLayout(data, i);
        }

        // анимация появления
        let newClient = data[0].createdAt;
        let newClientIndex;
        for (let i = 0; i < data.length; i++) {
            if (data[i].createdAt >= newClient) {
                newClient = data[i].createdAt;
                newClientIndex = i;
            }
        }

        const tableRows = document.querySelectorAll('.clients__table-row');
        tableRows[newClientIndex + 1].classList.add('add-client');
        setTimeout(function() {
            tableRows[newClientIndex + 1].classList.remove('add-client');
        }, 150);

        // добавляем фокусировку новому клиенту
        setTimeout(function() {
            tableRows[newClientIndex + 1].setAttribute('tabindex', '-1');
            tableRows[newClientIndex + 1].focus();
            tableRows[newClientIndex + 1].removeAttribute('tabindex');
        }, 300);
    }

    // добавляем нового клиента на сервер
    async function addNewClient() {
        // очищаем фильтр
        const tableRows = document.querySelectorAll('.clients__table-row');
        searchInput.value = '';
        tableRows.forEach(el => {
            el.classList.remove('filter');
        });

        // вносим изменения в массив данных
        const response = await fetch('http://localhost:3000/api/clients');
        data = await response.json();
        console.log(data);

        // отключение / включение скролла
        adaptiveScroll();

        checkSort();
        clearAllClients();
        displayNewClient(data);
        popup();
        editPopup();
        deletePopup();
        openPopup();
    }

    // создаем / изменяем пользователя на сервере
    async function getClient(modifier, method, id) {
        nodeContacts = document.querySelectorAll(`.popup__input${modifier}`);
        arrayContacts = Array.prototype.slice.call(nodeContacts); // конвертируем nodelist в массив
        
        // удаляем контакты с пустыми значениями
        for (let i = 0; i < arrayContacts.length; i++) {
            if (arrayContacts[i].value === '' || inputPromts.includes(arrayContacts[i].value)) {
                arrayContacts.splice(i, 1);
            }
        }

        const inputName = document.getElementById(`form-name${modifier}`);
        const inputSurname = document.getElementById(`form-surname${modifier}`);
        const inputLastName = document.getElementById(`form-last-name${modifier}`);
        const contacts = document.querySelector(`.popup__contacts${modifier}`);

        // выводим ошибки в поля инпутов
        const contactInputs = document.querySelectorAll('.popup__input');
        let contactsArray = []; // массив контактов, которые прошли валидацию
        contactInputs.forEach(input => {
            // валидация на пустые значения / номер телефона / эл. почту
            if (inputPromts.includes(input.value)) {
                for (let j = 0; j < inputPromts.length; j++) {
                    if (input.value === inputPromts[j]) {
                        contactsArray.push('');
                        break;
                    }
                }
            } else if (input.type === 'tel') {
                const MAX_TEL_LENGTH = 18;
                if (input.value.length < MAX_TEL_LENGTH) {
                    contactsArray.push('');
                } else {
                    contactsArray.push(input.value);
                }
            } else if (input.type === 'email') {
                if (!input.value.includes('@')) {
                    contactsArray.push('');
                } else if (!input.value.includes('.')) {
                    contactsArray.push('');
                } else {
                    contactsArray.push(input.value);
                }
            } else {
                contactsArray.push(input.value);
            }
        });

        if (contactsArray.includes('')) {
            // выключаем прелоадер
            switch (method) {
                case 'PATCH':
                    document.getElementById('edit-confirm-preloader').classList.add('done');
                    document.getElementById('edit-preloader-background').classList.add('done');
                    break;
                case 'POST':
                    document.getElementById('add-confirm-preloader').classList.add('done');
                    document.getElementById('add-preloader-background').classList.add('done');
            }

            // подсвечиваем ошибку контакта
            for (let i = 0; i < contactsArray.length; i++) {
                if (contactsArray[i] === '') {
                    const error = contactInputs[i].parentNode.childNodes[7];
                    contactInputs[i].classList.add('error');
                    error.classList.remove('disabled');
                    switch (contactInputs[i].type) {
                        case 'tel':
                            const MIN_TEL_LENGTH = 3;
                            if (contactInputs[i].value.length > MIN_TEL_LENGTH) {
                                error.textContent = 'некорректный номер';
                            } else {
                                error.textContent = 'заполните поле';
                            }
                            break;
                        case 'email':
                            if (contactInputs[i].value.length > 0) {
                                error.textContent = 'некорректный номер';
                            } else {
                                error.textContent = 'заполните поле';
                            }
                            break;
                        default:
                            error.textContent = 'заполните поле';
                    }
                }
            }
        } else {
            const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
                method: method,
                headers: {'Content-Type': 'application.json'},
                body: JSON.stringify({
                    name: inputName.value,
                    surname: inputSurname.value,
                    lastName: inputLastName.value,
                    /**
                     * типы контактов:
                     * tel - телефон
                     * email - электронная почта
                     * fb - facebook
                     * vk - вконтакте
                     * inst - instagram
                     * tg - телеграмм
                     * wa - whatsapp
                     * any - другое
                     */
                    contacts:  Array.isArray(arrayContacts) ? arrayContacts.map(contact => ({
                        type: contact.dataset.type,
                        value: contact.value,
                      })) : [],
                })
            });

            const data = await response.json();

            if (data.hasOwnProperty('errors')) {
                // выключаем прелоадер
                switch (method) {
                    case 'PATCH':
                        document.getElementById('edit-confirm-preloader').classList.add('done');
                        document.getElementById('edit-preloader-background').classList.add('done');
                        break;
                    case 'POST':
                        document.getElementById('add-confirm-preloader').classList.add('done');
                        document.getElementById('add-preloader-background').classList.add('done');
                }

                for (let i = 0; i < data.errors.length; i++) {
                    switch (data.errors[i].field) {
                        case 'surname':
                            document.getElementById(`error-surname${modifier}`).textContent = data.errors[i].message;
                            inputSurname.classList.add('input-error');
                            inputSurname.addEventListener('input', function() {
                                if (inputSurname.value.length > 0) {
                                    document.getElementById(`error-surname${modifier}`).textContent = '';
                                    inputSurname.classList.remove('input-error');
                                } else {
                                    document.getElementById(`error-surname${modifier}`).textContent = data.errors[i].message;
                                    inputSurname.classList.add('input-error');
                                }
                            });
                            break;
                        case 'name':
                            document.getElementById(`error-name${modifier}`).textContent = data.errors[i].message;
                            inputName.classList.add('input-error');
                            inputName.addEventListener('input', function() {
                                if (inputName.value.length > 0) {
                                    document.getElementById(`error-name${modifier}`).textContent = '';
                                    inputName.classList.remove('input-error');
                                } else {
                                    document.getElementById(`error-name${modifier}`).textContent = data.errors[i].message;
                                    inputName.classList.add('input-error');
                                }
                            });
                            break;
                    }
                }
            } else {
                if (response.status === 200 || response.status === 201) {
                    setTimeout(function() {
                        // изменяем / добавляем клиента в верстке
                        switch (method) {
                            case 'PATCH':
                                // выключаем прелоадер
                                document.getElementById('edit-confirm-preloader').classList.add('done');
                                document.getElementById('edit-preloader-background').classList.add('done');

                                editClient(id);
                                break;
                            case 'POST':
                                // выключаем прелоадер
                                document.getElementById('add-confirm-preloader').classList.add('done');
                                document.getElementById('add-preloader-background').classList.add('done');

                                addNewClient();

                                // сбрасываем значения в модальном окне
                                inputName.value = '';
                                inputSurname.value = '';
                                inputLastName.value = '';
                                contacts.innerHTML = '<div class="popup__contact popup__contact--create new-contact new-contact--create"></div>';
                                break;
                        }
                        closePopup(); // закрываем модальное окно
                    }, 300);
                }
            }
        }
    }

    // удаляем текущего пользователя
    async function deleteClient(id) {
        // получаем все кнопки "удалить"
        const deleteBtn = document.querySelectorAll('.clients__table-delete');

        // удаляем определенного клиента из верстки
        for (let i = 0; i < data.length; i++) {
            if (deleteBtn[i].dataset.id === id) {
                const clientRow = deleteBtn[i].parentNode.parentNode;
                clientRow.parentNode.removeChild(clientRow);
            }
        }

        // удаляем клиента с сервера
        const localResponse = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'DELETE'
        });
        const localData = await localResponse.json();

        // обновляем массив данных с сервера
        const response = await fetch('http://localhost:3000/api/clients');
        data = await response.json();

        // отключение / включение скролла
        adaptiveScroll();

        closePopup(); // закрываем модальное окно
    }

    // верстка клиента
    function clientLayout(data, i, id, client) {
        client.innerHTML = `
            <a href="#popup-open" class="popup-link clients__open-client clients__table-link" data-id="${data[i].id}"></a>
            <div class="clients__table-id">
                <div class="clients__id-name">${id}</div>
                <a href="#popup-open" class="popup-link clients__open-client clients__id" data-id="${data[i].id}">${id.substring(0, id.length - 7)}...</a>
            </div>
            <div class="clients__table-fullname">
                <a href="#popup-open" class="popup-link clients__open-client clients__table-name-link" data-id="${data[i].id}">${data[i].surname} ${data[i].name} ${data[i].lastName}</a>
            </div>
            <div class="clients__table-create-time">
                <span class="clients__table-date">${data[i].createdAt.substring(8, 10)}.${data[i].createdAt.substring(5, 7)}.${data[i].createdAt.substring(0, 4)}</span>
                <span class="clients__table-time">${data[i].createdAt.substring(11, 16)}</span>
            </div>
            <div class="clients__table-edit-time">
                <span class="clients__table-date">${data[i].updatedAt.substring(8, 10)}.${data[i].updatedAt.substring(5, 7)}.${data[i].updatedAt.substring(0, 4)}</span>
                <span class="clients__table-time">${data[i].updatedAt.substring(11, 16)}</span>
            </div>
            <div class="clients__table-contacts"></div>
            <div class="clients__table-actions">
                <a href="#popup-edit" class="popup-link clients__table-action clients__table-edit" data-id="${data[i].id}">
                    <svg class="clients__edit-icon">
                        <use xlink:href="/sprite.svg#edit-icon"></use>
                    </svg>
                    <span>Изменить</span>
                </a>
                <a href="#popup-delete" class="popup-link clients__table-action clients__table-delete" data-id="${data[i].id}">
                    <svg class="clients__close-icon">
                        <use xlink:href="/sprite.svg#delete-icon"></use>
                    </svg>
                    <span>Удалить</span>
                </a>
            </div>
        `;
    }

    // редактируем верстку клиента
    function editClientLayout (data, i, client) {
        // редактируем имя
        client.childNodes[5].childNodes[1].textContent = `${data[i].surname} ${data[i].name} ${data[i].lastName}`;

        // редактируем время апдейта
        client.childNodes[9].innerHTML = `
            <span class="clients__table-date">${data[i].updatedAt.substring(8, 10)}.${data[i].updatedAt.substring(5, 7)}.${data[i].updatedAt.substring(0, 4)}</span>
            <span class="clients__table-time">${data[i].updatedAt.substring(11, 16)}</span>
        `;

        // очищаем поле контактов
        client.childNodes[11].innerHTML = '';
    }

    // верстка контакта
    function contactLayout(data, i) {
        const contactsField = document.querySelectorAll('.clients__table-contacts');
        if (data[i].contacts.length > 0) {
            for (let j = 0; j < data[i].contacts.length; j++) {
                if (data[i].contacts[j].value.length > 0) {
                    const contactNew = document.createElement('a');
                    contactNew.getAttribute('href');
                    let typeName;

                    // задаем путь ссылки для каждого контакта
                    switch (data[i].contacts[j].type) {
                        case 'tel':
                            contactNew.href = `tel:${data[i].contacts[j].value}`;
                            typeName = selectPromts[0];
                            break;
                        case 'email':
                            contactNew.href = `mailto:${data[i].contacts[j].value}`;
                            typeName = selectPromts[1];
                            break;
                        case 'fb':
                            contactNew.href = `https://www.:${data[i].contacts[j].value}`;
                            typeName = selectPromts[2];
                            break;
                        case 'vk':
                            contactNew.href = `https://www.:${data[i].contacts[j].value}`;
                            typeName = selectPromts[3];
                            break;
                        case 'inst':
                            contactNew.href = `https://www.:${data[i].contacts[j].value}`;
                            typeName = selectPromts[4];
                            break;
                        case 'tg':
                            contactNew.href = `https://www.:${data[i].contacts[j].value}`;
                            typeName = selectPromts[5];
                            break;
                        case 'wa':
                            contactNew.href = `https://www.:${data[i].contacts[j].value}`;
                            typeName = selectPromts[6];
                            break;
                        default:
                            contactNew.href = `${data[i].contacts[j].value}`;
                            typeName = selectPromts[7];
                            break;
                    }

                    contactNew.classList.add('clients__contact');

                    contactNew.innerHTML = `
                        <div class="clients__contact-name"><span>${typeName}:&ensp;</span><span>${data[i].contacts[j].value}</span></div>
                        <svg class="clients__contact-icon">
                            <use xlink:href="/sprite.svg#${data[i].contacts[j].type}-icon"></use>
                        </svg>
                    `;

                    contactsField[i].append(contactNew);
                }
            }
        }
    }

    // перебираем и добавляем всех клиентов в верстку
    function displayAllClients(data) {
        for (let i = 0; i < data.length; i++) {
            const clientsTable = document.querySelector('.clients__table');
            const clientAddBtn = document.querySelector('.clients__add-client');
            const client = document.createElement('div');
            client.classList.add('clients__table-row');
            let id = data[i].id.toString();

            clientLayout(data, i, id, client);

            client.classList.add('add-client');
            clientsTable.append(client);

            setTimeout(function() {
                client.classList.remove('add-client');
                clientAddBtn.classList.remove('add-client');
            }, 150);

            // добавляем контакты каждому клиенту
            contactLayout(data, i);
        }
        // отображаем кнопку нового клиента при отсутствии клиентов в таблице
        if (data.length === 0) {
            const clientAddBtn = document.querySelector('.clients__add-client');
            setTimeout(function() {
                clientAddBtn.classList.remove('add-client');
            }, 150);
        }
    }

    // закрываем модальное окно
    function closePopup() {
        const popupActive = document.querySelector('.popup.open');
        popupActive.classList.remove('open');

        // очищаем селекты
        const select = document.querySelectorAll('.popup__select');
        select.forEach(el => {
            el.classList.remove('active');
        });

        // очищаем выпадающие меню
        const menu = document.querySelectorAll('.popup__select-menu');
        menu.forEach(el => {
            el.classList.remove('open');
        });

        // убираем hash
        history.pushState(null, null, '/index.html');

        // обнуляем прелоадеры
        // для модального окна редактирования клиента
        const preloaderEdit = document.getElementById('edit-preloader');
        if (preloaderEdit.classList.contains('done')) {
            preloaderEdit.classList.remove('done'); // включаем прелоадер
        }
        // для модального окна открытия клиента
        const preloaderOpen = document.getElementById('open-preloader');
        if (preloaderOpen.classList.contains('done')) {
            preloaderOpen.classList.remove('done'); // включаем прелоадер
        }

        // сбрасываем верстку модальных окон
        popupReset();
    }

    // заполняем контакты модального окна
    function popupContacts(data, i, j, modifier) {
        const contactInputs = document.querySelectorAll(`.popup__input${modifier}`);
        const contactSelects = document.querySelectorAll(`.popup__select${modifier}`);

        /**
        * типы контактов:
        * tel - телефон
        * email - электронная почта
        * fb - facebook
        * vk - вконтакте
        * inst - instagram
        * tg - телеграмм
        * wa - whatsapp
        * any - другое
        */
        switch (data[i].contacts[j].type) {
            case 'tel':
                contactSelects[j].textContent = selectPromts[0];
                break;
            case 'email':
                contactSelects[j].textContent = selectPromts[1];
                break;
            case 'fb':
                contactSelects[j].textContent = selectPromts[2];
                break;
            case 'vk':
                contactSelects[j].textContent = selectPromts[3];
                break;
            case 'inst':
                contactSelects[j].textContent = selectPromts[4];
                break;
            case 'tg':
                contactSelects[j].textContent = selectPromts[5];
                break;
            case 'wa':
                contactSelects[j].textContent = selectPromts[6];
                break;
            case 'any':
                contactSelects[j].textContent = selectPromts[7];
                break;
        }

        inputMasks(contactSelects[j], contactInputs[j]);

        contactInputs[j].disabled = false;
        contactInputs[j].value = data[i].contacts[j].value;
    }

    // фунционал изменения клиента по клику
    function editPopup() {
        const editClientBtn = document.querySelectorAll('.clients__table-edit');
        const editConfirmBtn = document.querySelector('.popup__edit-btn');
        let clientID;
        const inputNameEdit = document.getElementById('form-name--edit');
        const inputSurnameEdit = document.getElementById('form-surname--edit');
        const inputLastNameEdit = document.getElementById('form-last-name--edit');
        const editID = document.querySelector('.popup__edit-id');

        editClientBtn.forEach(el => {
            el.addEventListener('click', async function() {
                const response = await fetch('http://localhost:3000/api/clients');
                const data = await response.json();
                clientID = el.dataset.id;

                popupPreload('edit', response);

                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === clientID) {
                        editID.textContent = clientID;
                        inputNameEdit.value = data[i].name;
                        inputSurnameEdit.value = data[i].surname;
                        inputLastNameEdit.value = data[i].lastName;

                        // сбрасываем поле контактов
                        document.querySelector('.popup__contacts--edit').innerHTML = `
                            <div class="popup__contact popup__contact--edit new-contact new-contact--edit"></div>
                        `;

                        // добавляем контакты клиента
                        for (let j = 0; j < data[i].contacts.length; j++) {
                            addContact('--edit');

                            popupContacts(data, i, j, '--edit');
                        }
                    }
                }

                popupLabels('--edit');
            });
        });

        // сбрасываем обработчик событий путем клонирования, чтобы избежать наложения событий
        const editConfirmClone = editConfirmBtn.cloneNode(true);
        const editForm = document.querySelector('.popup__form-edit');
        editForm.append(editConfirmClone);
        editConfirmBtn.remove();

        editConfirmClone.addEventListener('click', function() {
            // включаем прелоадер
            document.getElementById('edit-confirm-preloader').classList.remove('done');
            document.getElementById('edit-preloader-background').classList.remove('done');

            getClient('--edit', 'PATCH', clientID);
        });
    }

    // фунционал удаления клиента по клику
    function deletePopup() {
        const deleteClientBtn = document.querySelectorAll('.clients__table-delete');
        const deleteConfirmBtn = document.querySelector('.popup__delete-btn');
        let clientID;

        deleteClientBtn.forEach(el => {
            el.addEventListener('click', function() {
                clientID = el.dataset.id;
            });
        });

        // сбрасываем обработчик событий путем клонирования, чтобы избежать наложения событий
        const deleteConfirmClone = deleteConfirmBtn.cloneNode(true);
        const deleteForm = document.querySelector('.popup__buttons');
        deleteForm.append(deleteConfirmClone);
        deleteConfirmBtn.remove();

        deleteConfirmClone.addEventListener('click', function() {
            deleteClient(clientID);
        });
    }

    // функционал открытия клиента по клику
    function openPopup() {
        const openClientBtn = document.querySelectorAll('.clients__open-client');
        const openID = document.querySelector('.popup__open-id');
        const inputNameOpen = document.getElementById('form-name--open');
        const inputSurnameOpen = document.getElementById('form-surname--open');
        const inputLastNameOpen = document.getElementById('form-last-name--open');
        const inputURL = document.querySelector('.popup__open-input');
        let clientID;

        openClientBtn.forEach(el => {
            el.addEventListener('click', async function() {
                const response = await fetch('http://localhost:3000/api/clients');
                const data = await response.json();
                clientID = el.dataset.id;

                popupPreload('open', response);

                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === clientID) {
                        openID.textContent = clientID;
                        inputNameOpen.value = data[i].name;
                        inputSurnameOpen.value = data[i].surname;
                        inputLastNameOpen.value = data[i].lastName;

                        // сбрасываем поле контактов
                        document.querySelector('.popup__contacts--open').innerHTML = `
                            <div class="popup__contact popup__contact--open new-contact new-contact--open"></div>
                        `;

                        // скрываем / оставляем "нет контактов"
                        if (data[i].contacts.length > 0) {
                            document.querySelector('.popup__none-contact').classList.add('disabled');
                        } else {
                            document.querySelector('.popup__none-contact').classList.remove('disabled');
                        }

                        // добавляем контакты клиента
                        for (let j = 0; j < data[i].contacts.length; j++) {
                            displayContact();

                            popupContacts(data, i, j, '--open');
                        }

                        // вставляем url клиента
                        history.pushState(null, null, `/index.html#${clientID}`); // передаем hash в виде id
                        inputURL.value = window.location.href; // добавляем url клиента в верстку
                    }
                }

                // поднимаем лейбл, если инпут имени заполнен
                document.querySelectorAll('.popup__form-item--open').forEach(item => {
                    if (item.childNodes[3].value.length > 0) {
                        item.childNodes[1].classList.remove('empty');
                    }
                });
            });
        });
    }

    // проверяем hash и открываем нужного клиента, если требуется
    function clientPopup(data) {
        const clients = document.querySelectorAll('.clients__open-client');
        const popup = document.getElementById('popup-open');
        if (window.location.hash) {
            for (let i = 0; i < data.length; i++) {
                const hash = window.location.hash.substring(1); // сохраняем текущий hash
                if (hash === data[i].id) {
                    for (let j = 0; j < clients.length; j++) {
                        if (hash === clients[j].dataset.id) {
                            popup.classList.add('open');
                            // добавляем возможность закрыть модальное окно кликом вне области
                            popup.addEventListener('click', function(e) {
                                if (!e.target.closest('.popup__content')) {
                                    closePopup();
                                }
                            });
                            // заполняем данные
                            document.getElementById('popup-open-id').textContent = data[i].id;
                            document.getElementById('form-surname--open').value = data[i].surname;
                            document.getElementById('form-name--open').value = data[i].name;
                            document.getElementById('form-last-name--open').value = data[i].lastName;
                            // скрываем / оставляем "нет контактов"
                            if (data[i].contacts.length > 0) {
                                document.querySelector('.popup__none-contact').classList.add('disabled');
                            } else {
                                document.querySelector('.popup__none-contact').classList.remove('disabled');
                            }
                            // добавляем контакты клиента
                            for (let k = 0; k < data[i].contacts.length; k++) {
                                displayContact();

                                popupContacts(data, i, k, '--open');
                            }
                            // вставляем url клиента
                            history.pushState(null, null, `/index.html#${data[i].id}`);
                            document.getElementById('popup-open-link').value = window.location.href;
                            // поднимаем лейбл, если инпут имени заполнен
                            document.querySelectorAll('.popup__form-item--open').forEach(item => {
                                if (item.childNodes[3].value.length > 0) {
                                    item.childNodes[1].classList.remove('empty');
                                }
                            });
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }

    // добавляем клиентов в верстку
    async function addClient() {
        const response = await fetch('http://localhost:3000/api/clients');
        data = await response.json();

        // отключение / включение скролла
        adaptiveScroll();

        displayAllClients(data); // отображаем всех клиентов

        // задаем id для нового клиента
        let newID = Date.now().toString();
        newID = newID.substring(0, newID.length - 7) + '...';

        document.querySelector('.popup__new-id').textContent = newID;

        // подключаем функционал модальных окон
        popup();

        // изменяем клиента по клику
        editPopup();

        // удаляем клиента по клику
        deletePopup();

        // открываем клиента по клику
        openPopup();

        // проверяем hash и открываем нужное модальное окно, если нужно
        clientPopup(data);
        // закрываем прелоадер, если модальное окно открыто
        popupPreload('open', response);
    }

    addClient();

    // запрещаем вводить цифры в поля ввода имени
    const popupNameInputs = document.querySelectorAll('.popup__form-input');
    popupNameInputs.forEach(el => {
        el.addEventListener('input', function() {
            el.value = el.value.replace(/[0-9]/g, '');
            el.value = el.value.substring(0, 1).toUpperCase() + el.value.substring(1).toLowerCase();
        });
    });

    // создаем переменные для всех селектов и выпадающих меню (чтобы обновлять их при добавлении нового контакта)
    let selects = document.querySelectorAll('.popup__select');
    let menus = document.querySelectorAll('.popup__select-menu');

    // добавляем select нужным элементам
    // модификаторы: 
    // --create - для модального окна, добавляющего клиента
    // --edit - для модального окна, изменяющего клиента
    function addSelect(modifier) {
        const contactNew = document.querySelector(`.new-contact${modifier}`);
        const select = contactNew.childNodes[1].childNodes[1];
        const menu = select.nextElementSibling;
        const menuItems = menu.querySelectorAll('.popup__select-item');
        const input = select.parentNode.nextElementSibling;

        // функция для работы с поведением селектов и выпадающих меню
        function changeSelectState(el, commonEl, state) {
            if (el.classList.contains(state)) {
                el.classList.remove(state);
            } else {
                commonEl.forEach(el => {
                    el.classList.remove(state);
                });
                el.classList.add(state);
            }
        }

        // клик-событие для текущего селекта
        select.addEventListener('click', function() {
            changeSelectState(select, selects, 'active');
            changeSelectState(menu, menus, 'open');
        });

        // задаем поведение контакта при выборе его типа
        menuItems.forEach(el => {
            el.addEventListener('click', function() {
                select.textContent = el.textContent;
                inputMasks(select, input);
                select.classList.toggle('active');
                menu.classList.toggle('open');
            });
        });
    }

    // добавляем контакт пользователя
    // модификаторы: 
    // --create - для модального окна, добавляющего клиента
    // --edit - для модального окна, изменяющего клиента
    function addContact(modifier) {
        const contacts = document.querySelector(`.popup__contacts${modifier}`);
        const contact = document.querySelectorAll('.popup__contact');
        const contactAmount = document.querySelectorAll(`.popup__contact${modifier}`);
        const contactNew = document.createElement('div');
        contactNew.classList.add('popup__contact');
        contactNew.classList.add(`popup__contact${modifier}`);
        contactNew.classList.add('new-contact');
        contactNew.classList.add(`new-contact${modifier}`);
        const MAX_CONTACT_LENGTH = 10;
        const addContactBtn = document.getElementById(`add-contact${modifier}`);
        const contactsError = document.querySelector(`.popup__max-contacts${modifier}`);

        if (contactAmount.length >= MAX_CONTACT_LENGTH) {
            addContactBtn.classList.add('disabled');
            contactsError.classList.add('active');
        } else {
            addContactBtn.classList.remove('disabled');
            contactsError.classList.remove('active');
        }

        contact.forEach(el => {
            if (el.classList.contains(`new-contact${modifier}`)) {
                el.innerHTML = `
                    <div class="popup__select-wrapper">
                        <div class="popup__select popup__select${modifier}">${selectPromts[0]}</div>
                        <ul class="popup__select-menu">
                            <li class="popup__select-item">${selectPromts[0]}</li>
                            <li class="popup__select-item">${selectPromts[1]}</li>
                            <li class="popup__select-item">${selectPromts[2]}</li>
                            <li class="popup__select-item">${selectPromts[3]}</li>
                            <li class="popup__select-item">${selectPromts[4]}</li>
                            <li class="popup__select-item">${selectPromts[5]}</li>
                            <li class="popup__select-item">${selectPromts[6]}</li>
                            <li class="popup__select-item">${selectPromts[7]}</li>
                        </ul>
                    </div>
                    <input type="tel" class="popup__input popup__input${modifier}">
                    <div class="popup__delete-contact">
                        <svg class="popup__delete-icon">
                            <use xlink:href="/sprite.svg#delete-icon"></use>
                        </svg>
                    </div>
                    <span class="popup__contact-error disabled"></span>
                `;

                // удаление контакта по клику на Х
                const deleteContactBtn = el.childNodes[5];
                const TIMEOUT = 300;

                deleteContactBtn.addEventListener('click', function() {
                    el.classList.add('new-contact');
                    el.classList.add(`new-contact${modifier}`);
                    setTimeout(function() {
                        deleteContactBtn.parentNode.remove();
                    }, TIMEOUT);
                    if (contactAmount.length > MAX_CONTACT_LENGTH) {
                        addContactBtn.classList.add('disabled');
                        contactsError.classList.add('active');
                    } else {
                        addContactBtn.classList.remove('disabled');
                        contactsError.classList.remove('active');
                    }
                });

                // обновляем переменные с селектами и выпадающими меню
                selects = document.querySelectorAll('.popup__select');
                menus = document.querySelectorAll('.popup__select-menu');

                // добавляем элемент
                addSelect(modifier);
                inputMasks(el.childNodes[1].childNodes[1], el.childNodes[3]);
                el.classList.remove('new-contact');
                el.classList.remove(`new-contact${modifier}`);
            }
        });
        contacts.append(contactNew);
    }

    // отображаем контакты в режиме просмотра
    function displayContact() {
        const contacts = document.querySelector('.popup__contacts--open');
        const contact = document.querySelectorAll('.popup__contact');
        const contactNew = document.createElement('div');
        contactNew.classList.add('popup__contact');
        contactNew.classList.add('popup__contact--open');
        contactNew.classList.add('new-contact');
        contactNew.classList.add('new-contact--open');

        contact.forEach(el => {
            if (el.classList.contains('new-contact--open')) {
                el.innerHTML = `
                    <div class="popup__select-wrapper">
                        <div class="popup__select--open">${selectPromts[0]}</div>
                    </div>
                    <input type="text" class="popup__input popup__input--open" disabled>
                `;

                // добавляем элемент
                el.classList.remove('new-contact');
                el.classList.remove('new-contact--open');
            }
        });

        contacts.append(contactNew);
    }

    // добавляем контакт
    // для модального окна с добавлением нового клиента
    document.getElementById('add-contact--create').addEventListener('click', function() {
        addContact('--create');
    });
    // для модального окна с изменением клиента
    document.getElementById('add-contact--edit').addEventListener('click', function() {
        addContact('--edit');
    });

    // добавляем пользователя на сайт
    document.querySelector('.popup__add-btn').addEventListener('click', function(e) {
        // включаем прелоадер
        document.getElementById('add-confirm-preloader').classList.remove('done');
        document.getElementById('add-preloader-background').classList.remove('done');
        // добавляем клиента в data
        getClient('--create', 'POST', '');
    });
    popupLabels('--create');

    // очищаем таблицу
    function clearAllClients() {
        const tableRow = document.querySelectorAll('.clients__table-row');
    
        tableRow.forEach(row => {
            if (!row.classList.contains('clients__table-header')) {
                row.remove();
            }
        });
    }

    // сортировка по id
    function sortID(type) {
        data.sort((a, b) => {
            const idA = a.id, idB = b.id;

            if (idA < idB) //сортируем строки по возрастанию / убыванию
                return type === 'ascending' ? -1 : 1;
            if (idA > idB)
                return type === 'ascending' ? 1 : -1;
            return 0; // Никакой сортировки
        });
    }

    // сортировка по ФИО
    function sortName(type) {
        data.sort((a, b) => {
            const surnameA = a.surname.toLowerCase(), surnameB = b.surname.toLowerCase();
      
            if (surnameA < surnameB) //сортируем строки по возрастанию / убыванию
                return type === 'ascending' ? -1 : 1;
            if (surnameA > surnameB)
                return type === 'ascending' ? 1 : -1;
            if (surnameA === surnameB) {
                const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      
                if (nameA < nameB) //сортируем строки по возрастанию / убыванию
                    return type === 'ascending' ? -1 : 1;
                if (nameA > nameB)
                    return type === 'ascending' ? 1 : -1;
                if (nameA === nameB) {
                    const lastNameA = a.lastName.toLowerCase(), lastNameB = b.lastName.toLowerCase();
      
                    if (lastNameA < lastNameB) //сортируем строки по возрастанию / убыванию
                        return type === 'ascending' ? -1 : 1;
                    if (lastNameA > lastNameB)
                        return type === 'ascending' ? 1 : -1;
                    return 0;
                };
                return 0;
            };
            return 0; // Никакой сортировки
        });
    }

    // сортировка по дате / времени
    function sortDate(prop, type) {
        let dateA, dateB;

        data.sort((a, b) => {
            switch (prop) {
                case 'created':
                    dateA = a.createdAt, dateB = b.createdAt;
                    break;
                case 'updated':
                    dateA = a.updatedAt, dateB = b.updatedAt;
                    break;
            }

            if (dateA < dateB) //сортируем строки по возрастанию / убыванию
                return type === 'ascending' ? -1 : 1;
            if (dateA > dateB)
                return type === 'ascending' ? 1 : -1;
            return 0; // Никакой сортировки
        });
    }

    // работа с классами кнопок сортировки
    function sortBtns(btn) {
        if (btn.classList.contains('active')) {
            btn.classList.add('active-reverse');
            btn.classList.remove('active');
        } else if (btn.classList.contains('active-reverse')) {
            btn.classList.add('active');
            btn.classList.remove('active-reverse');
        } else {
            btn.classList.add('active');
        }
    }

    // создаем события для всех видов сортировки
    sortIDBtn.addEventListener('click', function() {
        if (data.length > 1) {
            const clientAddBtn = document.querySelector('.clients__add-client');

            sortBtns(sortIDBtn);

            clientAddBtn.classList.add('add-client');
            sortNameBtn.classList.remove('active');
            sortNameBtn.classList.remove('active-reverse');
            sortCreatedBtn.classList.remove('active');
            sortCreatedBtn.classList.remove('active-reverse');
            sortUpdatedBtn.classList.remove('active');
            sortUpdatedBtn.classList.remove('active-reverse');
            clearAllClients();

            if (sortIDBtn.classList.contains('active')) {
                sortID('ascending');
            } else if (sortIDBtn.classList.contains('active-reverse')) {
                sortID('descending');
            }

            displayAllClients(data);
            popup();
            editPopup();
            deletePopup();
            openPopup();

            setTimeout(() => {
                clientAddBtn.classList.remove('add-client');
            }, 150);
        }
    });

    sortNameBtn.addEventListener('click', function() {
        if (data.length > 1) {
            const clientAddBtn = document.querySelector('.clients__add-client');

            sortBtns(sortNameBtn);

            clientAddBtn.classList.add('add-client');
            sortIDBtn.classList.remove('active');
            sortIDBtn.classList.remove('active-reverse');
            sortCreatedBtn.classList.remove('active');
            sortCreatedBtn.classList.remove('active-reverse');
            sortUpdatedBtn.classList.remove('active');
            sortUpdatedBtn.classList.remove('active-reverse');
            clearAllClients();

            if (sortNameBtn.classList.contains('active')) {
                sortName('ascending');
            } else if (sortNameBtn.classList.contains('active-reverse')) {
                sortName('descending');
            }

            displayAllClients(data);
            popup();
            editPopup();
            deletePopup();
            openPopup();

            setTimeout(() => {
                clientAddBtn.classList.remove('add-client');
            }, 150);
        }
    });

    sortCreatedBtn.addEventListener('click', function() {
        if (data.length > 1) {
            const clientAddBtn = document.querySelector('.clients__add-client');

            sortBtns(sortCreatedBtn);

            clientAddBtn.classList.add('add-client');
            sortIDBtn.classList.remove('active');
            sortIDBtn.classList.remove('active-reverse');
            sortNameBtn.classList.remove('active');
            sortNameBtn.classList.remove('active-reverse');
            sortUpdatedBtn.classList.remove('active');
            sortUpdatedBtn.classList.remove('active-reverse');
            clearAllClients();

            if (sortCreatedBtn.classList.contains('active')) {
                sortDate('created', 'ascending');
            } else if (sortCreatedBtn.classList.contains('active-reverse')) {
                sortDate('created', 'descending');
            }

            displayAllClients(data);
            popup();
            editPopup();
            deletePopup();
            openPopup();

            setTimeout(() => {
                clientAddBtn.classList.remove('add-client');
            }, 150);
        }
    });

    sortUpdatedBtn.addEventListener('click', function() {
        if (data.length > 1) {
            const clientAddBtn = document.querySelector('.clients__add-client');

            sortBtns(sortUpdatedBtn);

            clientAddBtn.classList.add('add-client');
            sortIDBtn.classList.remove('active');
            sortIDBtn.classList.remove('active-reverse');
            sortNameBtn.classList.remove('active');
            sortNameBtn.classList.remove('active-reverse');
            sortCreatedBtn.classList.remove('active');
            sortCreatedBtn.classList.remove('active-reverse');
            clearAllClients();

            if (sortUpdatedBtn.classList.contains('active')) {
                sortDate('updated', 'ascending');
            } else if (sortUpdatedBtn.classList.contains('active-reverse')) {
                sortDate('updated', 'descending');
            }

            displayAllClients(data);
            popup();
            editPopup();
            deletePopup();
            openPopup();

            setTimeout(() => {
                clientAddBtn.classList.remove('add-client');
            }, 150);
        }
    });

    // настраиваем отображение hover состояний контактов / id при скролле таблицы
    document.querySelector('.clients__table').addEventListener('scroll', function() {
        function scrollHover(elements, modifier) {
            for (let i = 0; i < elements.length; i++) {
                // проскроленное расстояние
                const scrollTop = document.querySelector('.clients__table').scrollTop;
                // расстояние до элемента
                switch (modifier) {
                    case 'contact':
                        elementOffset = elements[i].parentNode.parentNode.offsetTop;
                        break;
                    case 'id':
                        elementOffset = elements[i].parentNode.offsetTop;
                        break;
                }
                // проскроленное расстояние до элемента
                distance = elementOffset - scrollTop;

                if (distance < 7) {
                    elements[i].childNodes[1].classList.add('hover-bottom');
                } else {
                    elements[i].childNodes[1].classList.remove('hover-bottom');
                }
            }
        }

        // для контактов
        scrollHover(document.querySelectorAll('.clients__contact'), 'contact');

        // для id
        scrollHover(document.querySelectorAll('.clients__table-id'), 'id');
    });

    // копирование ссылки клиента
    document.querySelector('.popup__copy-btn').addEventListener('click', function() {
        // копируем ссылку в буфер обмена
        const inputValue = document.querySelector('.popup__open-input').value;
        if (inputValue) {
            navigator.clipboard.writeText(inputValue);
        }

        // включаем / отключаем класс анимации
        const message = document.querySelector('.popup__copy-msg');
        message.classList.add('show');
        setTimeout(function() {
            message.classList.remove('show');
        }, 1500);
    });

    // заполнение списка с автодополнением именами клиентов
    function autoFill(data) {
        const autoList = document.querySelector('.search__auto-list');
        autoList.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            const newListEl = document.createElement('li');
            newListEl.classList.add('search__auto-element');
            // скрываем все элементы, индекс которых больше максимального
            const MAX_EL_INDEX = 4;
            if (i > MAX_EL_INDEX) {
                newListEl.classList.add('filter');
            }
            newListEl.textContent = `${data[i].surname} ${data[i].name} ${data[i].lastName}`;
            clickClient(newListEl);
            autoList.append(newListEl);
        }
    }

    // функционал поиска клиента
    function findClient(clients, list) {
        for (let i = 0; i < clients.length; i++) {
            // пропускаем первую итерацию цикла, поскольку она отвечает за шапку таблицы
            if (i === 0) {
                continue;
            }

            if (searchInput.value === clients[i].childNodes[5].childNodes[1].textContent) {
                list.classList.remove('active');
                clients[i].classList.add('filter');
                clients[i].setAttribute('tabindex', '-1');
                clients[i].focus();
                clients[i].removeAttribute('tabindex');
                setTimeout(function() {
                    clients[i].classList.remove('filter');
                }, 1200);
            }
        }
    }

    // выбираем нужного клиента в таблице по клику в списке с автодополнением
    function clickClient(client) {
        const autoCompletion = document.querySelector('.search__auto-completion');
        const clients = document.querySelectorAll('.clients__table-row');
        client.addEventListener('click', function() {
            searchInput.value = client.textContent;
            findClient(clients, autoCompletion);
        });
    }

    // фильтр для списка с автодополнением
    function autoFilter(filter) {
        const autoElements = document.querySelectorAll('.search__auto-element');

        if (autoElements.length > 0) {
            let filterArr = []; // массив для подсчёта отображаемых элементов
            for (let i = 0; i < autoElements.length; i++) {
                if (!autoElements[i].textContent.toLowerCase().includes(filter.toLowerCase())) {
                    autoElements[i].classList.add('filter');
                    autoElements[i].innerHTML = autoElements[i].textContent; // возращаем исходный текст
                } else {
                    autoElements[i].classList.remove('filter');
                    const str = autoElements[i].textContent; // промежуточная переменная для подсветки символов
                    autoElements[i].innerHTML = insertMark(str, autoElements[i].textContent.toLowerCase().search(filter.toLowerCase()), filter.length); // подсветка символов
                    // скрываем элемент, если число отображаемых элементов больше максимального
                    if (!autoElements[i].classList.contains('filter')) {
                        filterArr.push(autoElements[i]);
                        const MAX_ARR_LENGTH = 5;
                        if (filterArr.length > MAX_ARR_LENGTH) {
                            autoElements[i].classList.add('filter');
                        }
                    }
                }
            }
        }
    }
    // подсветка символов
    function insertMark(string, pos, len) {
        return string.slice(0, pos) + '<span class="search__input-mark">' + string.slice(pos, pos + len) + '</span>' + string.slice(pos + len);
    }

    // убираем выделения элементов списка
    let highlighted = false; // переменная определяющая есть ли выделенные элементы в списке
    function highlightCancel() {
        highlighted = false;
        const autoElements = document.querySelectorAll('.search__auto-element');
        autoElements.forEach(el => {
            el.classList.remove('active');
        });
    }

    // функционал для выбора элементов кнопкой "вниз"
    function downPress(autoElements) {
        for (let i = 0; i < autoElements.length; i++) {
            // выбираем все показанные элементы
            if (!autoElements[i].classList.contains('filter')) {
                // если в списке отсутствует / присутствует выделенный элемент
                if (!highlighted) {
                    autoElements[i].classList.add('active');
                    searchInput.value = autoElements[i].textContent;
                    highlighted = true; // вкл выделение
                    break;
                } else {
                    if (autoElements[i].classList.contains('active')) {
                        autoElements[i].classList.remove('active'); // снимаем выделение с элемента
                        // если элемент является фактически последним, то используем рекурсию
                        if (i + 1 === autoElements.length) {
                            highlighted = false; // откл выделение
                            downPress(autoElements);
                        }
                        // проверяем оставшиеся элементы на соответствие
                        for (let j = i + 1; j < autoElements.length; j++) {
                            if (!autoElements[j].classList.contains('filter')) {
                                autoElements[j].classList.add('active');
                                searchInput.value = autoElements[j].textContent;
                                break;
                            }
                            // если элемент является последним отображаемым, то используем рекурсию
                            if (j + 1 === autoElements.length && autoElements[j].classList.contains('filter')) {
                                highlighted = false;
                                downPress(autoElements);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    // функционал для выбора элементов кнопкой "вверх"
    function upPress(autoElements) {
        for (let i = 0; i < autoElements.length; i++) {
            // выбираем все показанные элементы
            if (!autoElements[i].classList.contains('filter')) {
                // если в списке отсутствует / присутствует выделенный элемент
                if (!highlighted) {
                    break;
                } else {
                    if (autoElements[i].classList.contains('active')) {
                        autoElements[i].classList.remove('active'); // снимаем выделение с элемента
                        // если элемент является фактически первым, то выделяем последний
                        if (i === 0) {
                            for (let k = autoElements.length - 1; k >= 0; k--) {
                                if (!autoElements[k].classList.contains('filter')) {
                                    autoElements[k].classList.add('active');
                                    searchInput.value = autoElements[k].textContent;
                                    break;
                                }
                            }
                        }
                        // проверяем оставшиеся выше элементы на соответствие
                        for (let j = i - 1; j >= 0; j--) {
                            if (!autoElements[j].classList.contains('filter')) {
                                autoElements[j].classList.add('active');
                                searchInput.value = autoElements[j].textContent;
                                break;
                            }
                            // если элемент является первым отображаемым, то выделяем последний
                            if (j === 0 && autoElements[j].classList.contains('filter')) {
                                for (let p = autoElements.length - 1; p >= 0; p--) {
                                    if (!autoElements[p].classList.contains('filter')) {
                                        autoElements[p].classList.add('active');
                                        searchInput.value = autoElements[p].textContent;
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    // добавляем поиск с автодополнением
    // открываем список с автодополнением при клике на инпут
    searchInput.addEventListener('click', function(e) {
        if (data.length > 0) {
            highlightCancel();
            const autoCompletion = document.querySelector('.search__auto-completion');
            autoCompletion.classList.add('active');
            if (searchInput.value === '') {
                autoFill(data); // добавляем имена клиентов в список автодополнения
            } else {
                autoFilter(searchInput.value.trim().replace(/\s+/g, ' '));
            }
        }
    });
    // открываем список с автодополнением при фокусе на инпут
    searchInput.addEventListener('focus', function() {
        if (data.length > 0) {
            highlightCancel();
            const autoCompletion = document.querySelector('.search__auto-completion');
            autoCompletion.classList.add('active');
            if (searchInput.value === '') {
                autoFill(data); // добавляем имена клиентов в список автодополнения
            } else {
                autoFilter(searchInput.value.trim().replace(/\s+/g, ' '));
            }
        }
    });
    // закрываем список с автодополнением при клике не по рабочей области формы
    document.addEventListener('mousedown', function(e) {
        highlightCancel();
        const target = e.target;
        const form = document.querySelector('.search__form');
        const autoCompletion = document.querySelector('.search__auto-completion');
  
        if (!(target === form || form.contains(target)) && autoCompletion.classList.contains('active')) {
            autoCompletion.classList.remove('active');
            searchInput.value = ''; // очищаем инпут
        }
    });
    // запускаем фильтр списка с автодополнением при вводе
    searchInput.addEventListener('input', function() {
        highlightCancel();
        autoFilter(searchInput.value.trim().replace(/\s+/g, ' '));
    });
    // выполняем поиск клиента при нажатии "Enter"
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            highlightCancel();
            const autoCompletion = document.querySelector('.search__auto-completion');
            const clients = document.querySelectorAll('.clients__table-row');
            findClient(clients, autoCompletion);
        }
    });
    // реализуем управление списком через клавиатуру
    searchInput.addEventListener('keydown', function(e) {
        const autoCompletion = document.querySelector('.search__auto-completion');
        if (autoCompletion.classList.contains('active')) {
            const autoElements = document.querySelectorAll('.search__auto-element');
            switch(e.key) {
                case 'Down':
                case 'ArrowDown':
                    downPress(autoElements);
                    break;
                case 'Up':
                case 'ArrowUp':
                    upPress(autoElements);
                    break;
            }
        }
    });

    // адаптивные свойства
    // функция для адаптивного скролла
    function adaptiveScroll() {
        if (window.innerWidth >= 1024) {
            if (data.length < 6) {
                document.querySelector('.clients__table').classList.add('stop-scrolling');
            } else {
                document.querySelector('.clients__table').classList.remove('stop-scrolling');
            }
        }

        if (window.innerWidth < 1024) {
            if (data.length < 4) {
                document.querySelector('.clients__table').classList.add('stop-scrolling');
            } else {
                document.querySelector('.clients__table').classList.remove('stop-scrolling');
            }
        }

        if (window.innerWidth < 768) {
            if (data.length < 5) {
                document.querySelector('.clients__table').classList.add('stop-scrolling');
            } else {
                document.querySelector('.clients__table').classList.remove('stop-scrolling');
            }
        }
    }

    window.addEventListener('resize', () => {
        // убираем фильтр на мобильных устройствах
        if (window.innerWidth < 768) {
            searchInput.value = '';
            autoFilter('');
        }
        // отключение / включение скролла
        adaptiveScroll();
    });
});
