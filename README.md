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

На всякий случай _**pip list**_ для сверки версий, под которыми у меня всё работало  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/6.pip_list.png)

### **Установка Redis**

### Для работы проекта понадобится Redis. Я воспользовался альтернативой - хранилищем данных [Memurai](https://www.memurai.com/get-memurai/), совместимым с Redis и отлично работающим под Windows.  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/7.memurai.png)  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/7.memurai_download.png)

После установки потребуется перезагрузка, чтобы слуюба стартовала  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/7.memurai_service.png)

Для проверки работы службы можно воспользоваться клиентом Redis'а, либо клиентом мемурая  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/8.check_redis.png)

### **Запуск back-end'а**

**python manage.py runserver**  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/9.runserver.png)

### **Работа front-end'а**

Переход по ссылке на локальный адрес [http://127.0.0.1:8000/](http://127.0.0.1:8000/) перенаправит на страницу авторизации/регистрации  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/10.open_link.png)

В приложении зарегистрированы следующие пользователи:

<table><tbody><tr><td><strong>login</strong></td><td><strong>password</strong></td></tr><tr><td>admin</td><td>admin</td></tr><tr><td>user1</td><td>1</td></tr><tr><td>user2</td><td>2</td></tr><tr><td>user3</td><td>3</td></tr><tr><td>user4</td><td>4</td></tr></tbody></table>

После входа откроется web-приложение на первом из списка чатов авторизованного пользователя.

А пока иллюстрации работы API

<table><tbody><tr><td><figure class="image"><img src="https://github.com/meaningless-word/MiniMe/blob/master/readme.images/11.api_page.png"></figure></td><td><figure class="image"><img src="https://github.com/meaningless-word/MiniMe/blob/master/readme.images/12.user_list.png"></figure></td></tr><tr><td><figure class="image"><img src="https://github.com/meaningless-word/MiniMe/blob/master/readme.images/13.chat_list.png"></figure></td><td><img src="https://github.com/meaningless-word/MiniMe/blob/master/readme.images/13.messages_of_selected_chat.png"></td></tr></tbody></table>

Внешний вид приложения  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/14.application.png)

В базе данных сохранены "игровые" диалоги

И, так, на всякий случай... у меня запускается без ошибок  
![](https://github.com/meaningless-word/MiniMe/blob/master/readme.images/15.no_errors.png)