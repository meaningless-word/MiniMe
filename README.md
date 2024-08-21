# Задание

В качестве итогового проекта вам необходимо разработать проект, состоящий из клиента на JavaScript и бэкенда на Django Rest Framework.

Ваше задание очень простое: нужно реализовать базовый мессенжер со следующими функциями:

*   отправка и получение сообщений;
*   создание, редактирование и удаление групповых чатов и переписка в них (подсказка — управлять чатами лучше по REST API, а переписываться так же, как в обычных чатах, но с использованием на сервере идеологии «комнат»);
*   редактирование личной информации пользователя (имя и аватар);
*   просмотр списка других пользователей с переходом на отправку им сообщений

### **Клонирование**

### В папке, куда будет помещен проект выполнить команду   
_**gin clone**_ [_**https://github.com/meaningless-word/MiniMe.git**_](https://github.com/meaningless-word/MiniMe.git)  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/1.git_clone.png)

### **Подготовка виртуального окружения**

Войти в папку проекта и выполнить команду создания виртуального окружения  
_**python -m venv .venv**_  
_**![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/2.venv.png)**_

Запустить скрипт для активации  
_**.vemv\\scripts\\activate**_  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/3.venv_activate.png)

Установить зависимости  
_**pip install -r requirements.txt**_  
_**![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/4.pip_install.png)**_  
...  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/4.pip_install_end.png)

Можно проапгрейдить установщик  
_**python.exe -m pip install --upgrade pip**_  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/5.pip_upgrade.png)

### **Для запуска....**

1.  После клонирования в папке проекта выполнить команду создания виртуального окружения  
    _**python -m venv .venv**_
2.  Выполнить установку пакетов библиотек  
     
3.  Для работы проекта понадобится Redis. Я использоваk альтернативу - хранилищем данных [Memurai](https://www.memurai.com/get-memurai/), совместимым с Redis и отлично работающие под Windows
4.  Заупск - **python manage.py runserver**

В проекте зарегистрированы пользователи:

<table><tbody><tr><td>login</td><td>password</td></tr><tr><td>admin</td><td>admin</td></tr><tr><td>user1</td><td>1</td></tr><tr><td>user2</td><td>2</td></tr><tr><td>user3</td><td>3</td></tr><tr><td>user4</td><td>4</td></tr></tbody></table>

Так же в базе данных сохранены диалоги