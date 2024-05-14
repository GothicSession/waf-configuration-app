FROM centos:7

# Установите зависимости
RUN yum clean all && yum update -y && yum install -y \
    gcc pcre-devel openssl-devel wget perl make procps \
    readline-devel ncurses-devel

# Установка Python 3 и необходимых модулей
RUN yum install -y epel-release && yum install -y python36 python36-devel python36-pip

# Создание рабочей директории
RUN mkdir /code
COPY ./ /code/
WORKDIR /code

# Копирование файлов для openresty
COPY ./wafservice/frontend/dist/waf-configuration-app/browser/. /opt/wafservice/openresty/nginx/html
RUN sed -i 's+<base href="/">+<base href="/wafservice/">+g' /opt/wafservice/openresty/nginx/html/index.html

# Создание группы и пользователя nginx
RUN groupadd -r nginx && useradd -r -g nginx nginx

# Создание необходимых директорий
RUN mkdir -p /opt/wafservice/wafservice/configs

# Установка openresty и wafservice
RUN python3 install.py install

# Открытие порта 80
EXPOSE 80

# Запуск nginx
CMD ["/opt/wafservice/openresty/nginx/sbin/nginx", "-g", "daemon off; error_log /dev/stderr info;"]
