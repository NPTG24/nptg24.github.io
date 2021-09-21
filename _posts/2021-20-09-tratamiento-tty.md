---
date: 2021-09-09T00:22:05.000Z
layout: post
comments: true
title: Tratamiento de la TTY
subtitle: 'tras la intrusión'
description: >-
image: >-
  http://imgfz.com/i/XR8vuUG.png
optimized_image: >-
  http://imgfz.com/i/XR8vuUG.png
category: ciberseguridad
tags:
  - post-intrusión
  - linux
  - TTY
  - ciberseguridad
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---
Una vez realizamos una intrusión y obtenemos acceso a la maquina victima, esta nos devuelve una terminal la cual no nos deja realizar por ejemplo ```ctrl + c``` o desplazarnos cómodamente en ella, por lo tanto ahora veremos como solucionar este problema con los siguientes pasos:
```bash
www-data@box:/var/www/html$ script /dev/null -c bash
script /dev/null -c bash
Script started, file is /dev/null
```
Ahora realizar ```ctrl + z```, para colocarlo en segundo plano:
```bash
www-data@box:/var/www/html$ ^Z
[1]+  Stopped                 nc -nlvp 443
```
Una vez realizado el procedimiento anterior, ahora se escribe lo siguiente para reiniciar la configuración de la terminal:
```bash
┌─[root@kali]─[/home/user/demo]
└──╼ stty raw -echo; fg
nc -nlvp 443
            |
```
Confirmamos el reinicio escribiendo reset y luego nos pregunta que tipo de terminal queremos:
```bash
┌─[root@kali]─[/home/user/demo]
└──╼ stty raw -echo; fg
nc -nlvp 443
            reset
reset: unknown terminal type unknown
Terminal type? xterm
```
En mi caso prefiero ```xterm```. Una vez se reinicia configuramos los valores de TERM y SHELL:
```bash
www-data@box:/var/www/html$ export TERM=xterm
www-data@box:/var/www/html$ export SHELL=bash
www-data@box:/var/www/html$ 
```
Finalmente configuramos las filas y columnas para que queden del tamaño correcto de nuestro monitor, cuyos valores se obtienen del comando ```stty -a``` :
```bash
www-data@box:/var/www/html$ stty rows 46 columns 187
www-data@box:/var/www/html$ 
```
Y listo! obtenemos una consola completamente interactiva tras la intrusión.

