---
date: 2021-11-15T01:14:05.000Z
layout: post
comments: true
title: Escalar privilegios
subtitle: 'para obtener acceso a root'
description: >-
image: >-
  http://imgfz.com/i/pLYBOku.png
optimized_image: >-
  http://imgfz.com/i/pLYBOku.png
category: ciberseguridad
tags:
  - escalada
  - privilegios
  - root
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

El usuario root en Linux es el usuario que posee mayor nivel de privilegios. De hecho, es el único que tiene privilegios sobre todo el sistema en su globalidad, así como el responsable de las tareas administrativas.

De este modo, cuando tu, o cualquier programa, quiera llevar a cabo una acción que requiera permisos de superusuario, de alguna manera se les tendrá que conceder o denegar estos privilegios. Pero la pregunta es si soy un usuario común, ¿puedo ser root, sin necesidad de contraseña?. La respuesta es que si con ciertos pasos que veremos a continuación aprovechando las vulnerabilidades que dejan los usuarios administradores.

## Sudo

Una manera de escalar privilegios es a través del siguiente comando:

```bash
┌─[user@user]─[/]
└──╼ sudo -l
```

y ahí aparecerá un binario en el cuál podremos obtener acceso root siguiendo los pasos que nos indican en [GTFOBins](https://gtfobins.github.io/).

## SUID

Otra manera es buscando en /usr/bin, algún binario que contenga un permiso cuyo carácter sea ```s``` en lugar de ```x```.

```bash
┌─[user@user]─[/]
└──╼ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 45420 May 17  2017 /usr/bin/passwd
```

Ahora también podemos buscar todos los binarios SUID a través de ```find```, con el siguiente comando:

```bash
┌─[user@user]─[/]
└──╼ find / -type f -user root -perm -4000 2>/dev/null
/var/htb/bin/emergency
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/bin/chsh
/usr/bin/passwd
/usr/bin/chfn
/usr/bin/pkexec
/usr/bin/newgrp
/usr/bin/traceroute6.iputils
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/mtr
/usr/sbin/pppd
/bin/ping
/bin/ping6
/bin/su
/bin/fusermount
/bin/mount
/bin/umount
```

## Puertos abiertos en la máquina

```bash
┌─[user@user]─[/]
└──╼ ss -lnpt
State     Recv-Q    Send-Q       Local Address:Port        Peer Address:Port    Process                                                                         
LISTEN    0         128                0.0.0.0:23               0.0.0.0:*        users:(("python3",pid=829,fd=3))                                               
LISTEN    0         4096             127.0.0.1:631              0.0.0.0:*                                                                                       
LISTEN    0         4096                 [::1]:631                 [::]:*                                                                                       
```
En este caso hay una página web en la máquina la cual podremos visualizar por medio de [chisel](https://github.com/jpillora/chisel).
