---
date: 2023-06-04T04:31:05.000Z
layout: post
comments: true
title: "Enumeración basada en el host"
subtitle: 'footprinting'
description: >-
image: >-
  http://imgfz.com/i/USJprIG.jpeg
optimized_image: >-
  http://imgfz.com/i/USJprIG.jpeg
category: ciberseguridad
tags:
  - FTP
  - NFS
  - DNS
  - SMTP
  - IMAP
  - POP3
  - SNMP
  - MySQL
  - MSSQL
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

La enumeración basada en el host, se refiere al proceso de recopilación de información detallada sobre un sistema o host específico dentro de una red. Esto implica identificar y enumerar los servicios, puertos abiertos, protocolos de red y otra información relacionada con el host objetivo. Es una técnica utilizada para obtener un mayor conocimiento del sistema objetivo y descubrir posibles vulnerabilidades o puntos de entrada.

## FTP

File Transfer Protocol (FTP) es uno de los protocolos más antiguos de Internet, utilizado para la transferencia de archivos. Funciona en la capa de aplicación de la pila de protocolos TCP/IP, al igual que HTTP y POP. El objetivo principal del FTP es permitir la transferencia de archivos entre un cliente y un servidor.

El FTP utiliza los puertos estándar 20 y 21 para establecer la conexión entre el cliente y el servidor. El puerto 21 se utiliza para el control de comandos, donde el cliente envía instrucciones al servidor, mientras que el puerto 20 se utiliza para la transferencia real de datos.

### Vectores

#### TFTP

El Trivial File Transfer Protocol (TFTP) es un protocolo más simple que el FTP y se utiliza para realizar transferencias de archivos entre procesos de cliente y servidor. A diferencia del FTP, el TFTP no proporciona autenticación de usuario ni otras características avanzadas que son compatibles con el FTP.

Una diferencia fundamental entre el TFTP y el FTP es el protocolo de transporte que utilizan. Mientras que el FTP utiliza el protocolo TCP para garantizar una comunicación confiable, el TFTP utiliza el protocolo UDP, lo que lo convierte en un protocolo menos confiable. Debido a la naturaleza no confiable del UDP, el TFTP implementa una recuperación de capa de aplicación asistida por UDP para manejar posibles pérdidas de datos durante la transferencia.

El TFTP no requiere la autenticación del usuario y no admite el inicio de sesión protegido mediante contraseñas. En su lugar, los límites de acceso se basan únicamente en los permisos de lectura y escritura de un archivo en el sistema operativo. Esto significa que el TFTP opera exclusivamente en directorios y archivos que han sido compartidos con todos los usuarios, permitiendo el acceso de lectura y escritura a nivel global. Debido a la falta de mecanismos de seguridad, el TFTP solo se utiliza en redes locales y protegidas, ya que no es adecuado para entornos donde se requiere una transferencia segura de archivos.

Ejemplos de comandos para navegar por TFTP:

| Comando   | Utilidad                                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `connect` | Establece el host remoto y, opcionalmente, el puerto para las transferencias de archivos.                                     |
| `get`     | Transfiere un archivo o conjunto de archivos desde el host remoto al host local.                                              |
| `put`     | Transfiere un archivo o conjunto de archivos del host local al host remoto.                                                   |
| `quit`    | Sale de tftp.                                                                                                                 |
| `status`  | Muestra el estado actual de tftp, incluido el modo de transferencia actual (ascii o binario), el estado de conexión, el valor de tiempo de espera, etc. |
| `verbose` | Activa o desactiva el modo detallado, que muestra información adicional durante la transferencia de archivos.                  |

A diferencia del cliente FTP, TFTP no tiene la funcionalidad de listado de directorios.

#### Anonymous

"Existen diversas configuraciones relacionadas con la seguridad que se pueden aplicar en cada servidor FTP. Estas configuraciones tienen diferentes propósitos, como probar conexiones a través de firewalls, verificar rutas y evaluar mecanismos de autenticación. Uno de estos mecanismos de autenticación es el uso del usuario ```anonymous```. Este método se utiliza frecuentemente para permitir que los usuarios dentro de una red interna compartan archivos y datos sin tener acceso a las computadoras de los demás.

```bash
┌──(root㉿kali)-[/ftp]
└─ ftp 10.1.1.10

Connected to 10.1.1.10.
220 "Welcome to the vsFTP service."
Name (10.1.1.10:user): anonymous

230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.

ftp>
```

Comandos claves de FTP:

| Comando                       | Utilidad                                                         |
| ----------------------------- | ---------------------------------------------------------------- |
| `ls`                          | Muestra el contenido del directorio remoto.                      |
| `status`                      | Muestra el estado actual del cliente FTP.                         |
| `debug`                       | Activa el modo de depuración para ver mensajes detallados.        |
| `trace`                       | Registra y muestra la secuencia de comandos FTP enviados.         |
| `ls -R`                       | Muestra el contenido del directorio remoto de forma recursiva.    |
| `get Important\passwords.txt` | Descarga el archivo "Important\passwords.txt" del servidor remoto. |
| `put test.txt`                | Sube el archivo "test.txt" desde el cliente al servidor remoto.    |
| `exit`                        | Cierra la conexión FTP y finaliza el cliente.                     |

Para descargar todos los archivos disponibles:

```bash
┌──(root㉿kali)-[/ftp]
└─ wget -m --no-passive ftp://anonymous:anonymous@10.1.1.10
```

## NFS

El Network File System (NFS) es un sistema de archivos de red desarrollado por Sun Microsystems que cumple una función similar al SMB. Su objetivo principal es permitir el acceso a sistemas de archivos a través de una red, como si estuvieran ubicados localmente. Sin embargo, utiliza un protocolo completamente diferente. El NFS se utiliza principalmente en sistemas Linux y Unix, lo que implica que los clientes NFS no pueden comunicarse directamente con los servidores SMB.

El NFS es un estándar de Internet que establece los procedimientos para un sistema de archivos distribuido. Mientras que el protocolo NFS versión 3.0 (NFSv3), utilizado durante muchos años, autentica la computadora cliente, esto cambia con el NFSv4. En el caso del NFSv4, al igual que ocurre con el protocolo SMB de Windows, el usuario también debe autenticarse, lo que brinda una capa adicional de seguridad.

La versión 4.1 del Network File System (NFS), según se describe en el RFC 8881, tiene como objetivo proporcionar soporte de protocolo para aprovechar las implementaciones de servidores de clúster, incluida la capacidad de ofrecer acceso paralelo escalable a archivos distribuidos en varios servidores (mediante la extensión pNFS). Además, NFSv4.1 incluye un mecanismo de enlace troncal de sesión, también conocido como rutas múltiples NFS. Una ventaja significativa de NFSv4 sobre sus versiones anteriores es que utiliza el puerto 2049 tanto para TCP como para UDP, lo que simplifica el uso del protocolo en los firewalls.

En cuanto a su arquitectura, NFS se basa en el protocolo de llamada a procedimiento remoto (ONC-RPC/SUN-RPC) expuesto en los puertos 111 de TCP y UDP. Utiliza el formato de datos externos (XDR) para el intercambio de datos independiente del sistema. Es importante destacar que el protocolo NFS no proporciona un mecanismo específico para la autenticación ni la autorización. En su lugar, se delega completamente la autenticación a las opciones del protocolo RPC. Por otro lado, la autorización se basa en la información disponible en el sistema de archivos donde el servidor se encarga de traducir la información del usuario proporcionada por el cliente y convertirla en la sintaxis requerida por el sistema de archivos, asegurándose de aplicar la autorización adecuada según las políticas de UNIX.

### Vectores

#### NMAP

El script rpcinfo NSE recupera una lista de todos los servicios RPC actualmente en ejecución, proporcionando sus nombres, descripciones y los puertos que utilizan. Esto nos permite verificar si el recurso compartido de destino está conectado a la red en todos los puertos requeridos. Además, para NFS, Nmap cuenta con varios scripts NSE que pueden ser utilizados en escaneos. Estos scripts nos permiten, por ejemplo, obtener el contenido del recurso compartido (contents) y sus estadísticas (stats).

```bash
┌──(root㉿kali)-[/nfs]
└─ nmap --script nfs* 10.1.1.10 -sV -p111,2049
```

#### Mostrar recursos compartidos de NFS disponibles

```bash
┌──(root㉿kali)-[/nfs]
└─ showmount -e 10.1..1.10
Export list for 10.1.1.10:
/home/user    *
/var/www/html *
```

#### Montaje de recursos compartidos de NFS desactivando bloqueo NFS

```bash
┌──(root㉿kali)-[/nfs]
└─ mkdir web_server

┌──(root㉿kali)-[/nfs]
└─ mount -t nfs 10.1.1.10:/var/www/html ./web_server/ -o nolock

┌──(root㉿kali)-[/nfs]
└─ cd web_server

┌──(root㉿kali)-[/nfs/web_server]
└─ tree .
```

#### Montaje de recursos compartidos clásico

```bash
┌──(root㉿kali)-[/nfs]
└─ mkdir web_server

┌──(root㉿kali)-[/nfs]
└─ mount -t nfs 10.1.1.10:/var/www/html /web_server

┌──(root㉿kali)-[/nfs]
└─ cd web_server

┌──(root㉿kali)-[/nfs/web_server]
└─ tree .
```

También se puede hacer lo mismo pero en otra carpeta distinta para el caso de ```/home/user```.

#### Comandos usados

| Comando       | Utilidad                                                                                               |
|---------------|-------------------------------------------------------------------------------------------------------|
| `mount`       | Comando para montar un sistema de archivos.                                                            |
| `-t nfs`      | Especifica el tipo de sistema de archivos a montar, en este caso, NFS (Network File System).          |
| `./web_server` | Directorio local donde se montará el recurso compartido NFS.                                          |
| `-o nolock`   | Opción para deshabilitar el bloqueo de archivos durante el montaje del recurso compartido.            |

#### Desmontar NFS

```bash
┌──(root㉿kali)-[/nfs/web_server]
└─ cd ..

┌──(root㉿kali)-[/nfs]
└─ unmount ./web_server
```

## SMTP

Simple Mail Transfer Protocol (SMTP) es un protocolo utilizado para enviar correos electrónicos en una red IP. Se establece una comunicación entre un cliente de correo electrónico y un servidor de correo saliente, o entre dos servidores SMTP. En muchos casos, se combina con los protocolos IMAP o POP3, que permiten recibir y enviar correos electrónicos.

El SMTP sigue un enfoque cliente-servidor, aunque también puede utilizarse entre un cliente y un servidor, así como entre dos servidores SMTP, donde uno de ellos actúa como cliente. Los servidores SMTP generalmente aceptan solicitudes de conexión en el puerto 25, pero en la actualidad, los servidores más modernos también pueden usar otros puertos, como el puerto TCP 587, para mejorar la seguridad y el rendimiento.

### Parámetros importantes

| Parámetro   | Descripción                                                             |
|-------------|-------------------------------------------------------------------------|
| AUTH PLAIN  | AUTH es una extensión de servicio utilizada para autenticar al cliente. |
| HELO        | El cliente inicia sesión con su nombre de equipo y así inicia la sesión. |
| MAIL FROM   | El cliente especifica el remitente del correo electrónico.               |
| RCPT TO     | El cliente especifica el destinatario del correo electrónico.            |
| DATA        | El cliente inicia la transmisión del correo electrónico.                |
| RSET        | El cliente aborta la transmisión iniciada pero mantiene la conexión entre cliente y servidor. |
| VRFY        | El cliente verifica si hay un buzón disponible para la transferencia de mensajes. |
| EXPN        | El cliente verifica si hay un buzón disponible para enviar mensajes con este comando. |
| NOOP        | El cliente solicita una respuesta del servidor para evitar la desconexión por tiempo de espera. |
| QUIT        | El cliente termina la sesión.                                           |


### Vectores

#### SMTP Relay

Podemos utilizar el script NSE smtp-open-relay para identificar si el servidor SMTP de destino actúa como un relé abierto. Este script realiza 16 pruebas diferentes para detectar la configuración de relé abierto del servidor. El objetivo es determinar si el servidor permite el reenvío de correos electrónicos sin autenticación, lo cual puede representar un riesgo de abuso por parte de spammers o atacantes. Al ejecutar el script, obtendremos información sobre la configuración del servidor SMTP y si está configurado de forma segura o si existe una posible vulnerabilidad de relé abierto.

```bash
┌──(root㉿kali)-[/smtp]
└─ sudo nmap 10.129.14.128 -p25 --script smtp-open-relay -v
Starting Nmap 7.80 ( https://nmap.org ) at 2021-09-30 02:29 CEST
NSE: Loaded 1 scripts for scanning.
NSE: Script Pre-scanning.
Initiating NSE at 02:29
Completed NSE at 02:29, 0.00s elapsed
Initiating ARP Ping Scan at 02:29
Scanning 10.129.14.128 [1 port]
Completed ARP Ping Scan at 02:29, 0.06s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 02:29
Completed Parallel DNS resolution of 1 host. at 02:29, 0.03s elapsed
Initiating SYN Stealth Scan at 02:29
Scanning 10.129.14.128 [1 port]
Discovered open port 25/tcp on 10.129.14.128
Completed SYN Stealth Scan at 02:29, 0.06s elapsed (1 total ports)
NSE: Script scanning 10.129.14.128.
Initiating NSE at 02:29
Completed NSE at 02:29, 0.07s elapsed
Nmap scan report for 10.129.14.128
Host is up (0.00020s latency).
PORT   STATE SERVICE
25/tcp open  smtp
| smtp-open-relay: Server is an open relay (16/16 tests)
|  MAIL FROM:<> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@nmap.scanme.org> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@ESMTP> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest%nmap.scanme.org@[10.129.14.128]>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest%nmap.scanme.org@ESMTP>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<"relaytest@nmap.scanme.org">
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<"relaytest%nmap.scanme.org">
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest@nmap.scanme.org@[10.129.14.128]>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<"relaytest@nmap.scanme.org"@[10.129.14.128]>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<relaytest@nmap.scanme.org@ESMTP>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<@[10.129.14.128]:relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<@ESMTP:relaytest@nmap.scanme.org>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<nmap.scanme.org!relaytest>
|  MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<nmap.scanme.org!relaytest@[10.129.14.128]>
|_ MAIL FROM:<antispam@[10.129.14.128]> -> RCPT TO:<nmap.scanme.org!relaytest@ESMTP>
MAC Address: 00:00:00:00:00:00 (VMware)
NSE: Script Post-scanning.
Initiating NSE at 02:29
Completed NSE at 02:29, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 0.48 seconds
           Raw packets sent: 2 (72B) | Rcvd: 2 (72B)
```

#### Detección de usuarios

#### VRFY para enumeración de usuarios

El comando VRFY se utiliza para enumerar los usuarios existentes en un sistema. Sin embargo, es importante tener en cuenta que su funcionamiento puede variar. Dependiendo de la configuración del servidor SMTP, este comando puede devolver el código 252 y confirmar la existencia de un usuario incluso si en realidad no existe en el sistema. Por lo tanto, no se puede confiar completamente en el resultado del comando VRFY para verificar la existencia de usuarios. Es recomendable utilizar otras técnicas y métodos de validación adicionales para obtener información precisa sobre la existencia de usuarios en un sistema.

```bash
┌──(root㉿kali)-[/smtp]
└─ telnet 10.129.14.128 25

Trying 10.129.14.128...
Connected to 10.129.14.128.
Escape character is '^]'.
220 ESMTP Server 

VRFY root

252 2.0.0 root


VRFY cry0l1t3

252 2.0.0 cry0l1t3


VRFY testuser

252 2.0.0 testuser


VRFY aaaaaaaaaaaaaaaaaaaaaaaaaaaa

550 5.1.1 aaaaaaaaaaaaaaaaaaaaaaaaaaaa... User unknown
```

También se puede realizar lo mismo con ```EXPN```:

```bash
┌──(root㉿kali)-[/smtp]
└─ telnet 10.129.14.128 25

Trying 10.129.14.128...
Connected to 10.129.14.128.
Escape character is '^]'.
220 ESMTP Server 

EXPN root

252 2.0.0 root


EXPN cry0l1t3

252 2.0.0 cry0l1t3


EXPN testuser

252 2.0.0 testuser


EXPN aaaaaaaaaaaaaaaaaaaaaaaaaaaa

550 5.1.1 aaaaaaaaaaaaaaaaaaaaaaaaaaaa... User unknown
```

También se puede automatizar la detección de usuarios con ```nmap```.

```bash
┌──(root㉿kali)-[/smtp]
└─ nmap --script smtp-enum-users 10.129.14.128 -p25
Starting Nmap 7.92 ( https://nmap.org ) at 2023-06-06 22:46 EDT
Nmap scan report for 10.129.14.128
Host is up (0.14s latency).
PORT   STATE SERVICE
25/tcp open  smtp
| smtp-enum-users:
|   root
|   admin
|   administrator
|   webadmin
|   sysadmin
|   netadmin
|   guest
|   user
|   web
|_  test
Nmap done: 1 IP address (1 host up) scanned in 11.00 seconds
```

Se tiene otra opción por medio de ```metasploit```:

```bash
msf6 > use auxiliary/scanner/smtp/smtp_enum
msf6 auxiliary(scanner/smtp/smtp_enum) > options
Module options (auxiliary/scanner/smtp/smtp_enum):
   Name       Current Setting                                                Required  Description
   ----       ---------------                                                --------  -----------
   RHOSTS                                                                    yes       The target host(s), see https://github.com/rapid7/metasploit-framework/wiki/Using-Metasploit
   RPORT      25                                                             yes       The target port (TCP)
   THREADS    1                                                              yes       The number of concurrent threads (max one per host)
   UNIXONLY   true                                                           yes       Skip Microsoft bannered servers when testing unix users
   USER_FILE  /usr/share/metasploit-framework/data/wordlists/unix_users.txt  yes       The file that contains a list of probable users accounts.
msf6 auxiliary(scanner/smtp/smtp_enum) > set RHOST 10.129.130.57
RHOST => 10.129.130.57
msf6 auxiliary(scanner/smtp/smtp_enum) > run
```

#### Envío de correos electrónicos sin asunto

```bash
┌──(root㉿kali)-[/smtp]
└─ telnet 10.129.14.128 25

Trying 10.129.14.128...
Connected to 10.129.14.128.
Escape character is '^]'.
220 ESMTP Server

HELO test.com 

250 test.com [(10.129.14.128)]

HELP
214 - Enter one of the following commands:
214 - HELO EHLO MAIL RCPT DATA RSET NOOP QUIT
214 HELP

MAIL FROM: usuario1@test.com
250 usuario1@test.com... Sender OK

RCPT TO: usuario2@auditoría.com
250 usuario2@auditoría.com... Recipient OK

DATA
354 Enter message, end with "." on a line by itself
Hola mundo
.
250 Message accepted for delivery

QUIT

221 Bye
Connection closed by foreign host.
```

#### Envío de correos electrónicos con asunto

Para proporcionar información más detallada en el correo electrónico, se deben mantener los parámetros anteriores y agregar el siguiente contenido en la sección DATA:

```bash
┌──(root㉿kali)-[/smtp]
└─ telnet 10.129.14.128 25

Trying 10.129.14.128...
Connected to 10.129.14.128.
Escape character is '^]'.
220 ESMTP Server

...

DATA
354 Enter message, end with "." on a line by itself
From: <usuario1@test.com>
To: <usuario2@auditoría.com>
Subject: Esto es una prueba
Date: Tue, 06 Jun 2023 16:32:51 +0200
Hola mundo
.
250 Message accepted for delivery

QUIT

221 Bye
Connection closed by foreign host.
```

## IMAP/POP3

El Internet Message Access Protocol (IMAP) permite acceder a correos electrónicos desde un servidor de correo. A diferencia del Post Office Protocol (POP3), IMAP permite la administración en línea de correos electrónicos directamente en el servidor y admite estructuras de carpetas. Por lo tanto, es un protocolo de red para la gestión en línea de correos electrónicos en un servidor remoto. El protocolo está basado en cliente-servidor y permite la sincronización de un cliente de correo electrónico local con el buzón en el servidor, proporcionando una especie de sistema de archivos de red para correos electrónicos, lo que permite una sincronización sin problemas entre varios clientes independientes, es decir, al copiar los correos electrónicos enviados en una carpeta IMAP, todos los clientes tienen acceso a todos los correos enviados, independientemente de la computadora desde la que se enviaron. IMAP utiliza el puerto 143 para conexiones no seguras y el puerto 993 para conexiones seguras con SSL/TLS.

Por otro lado, el Protocolo de Oficina de Correos versión 3 (POP3, por sus siglas en inglés) no tiene la misma funcionalidad que IMAP y solo proporciona listas, recuperación y eliminación de correos electrónicos como funciones en el servidor de correo electrónico. POP3 utiliza el puerto 110 para conexiones no seguras y el puerto 995 para conexiones seguras con SSL/TLS.

Por lo tanto, los protocolos como IMAP deben usarse para funcionalidades adicionales, como buzones jerárquicos directamente en el servidor de correo, acceso a múltiples buzones durante una sesión y preselección de correos electrónicos.

### Comandos importantes en IMAP

| Parámetro                   | Descripción                                                                                  |
|-----------------------------|----------------------------------------------------------------------------------------------|
| `LOGIN username password`   | Inicio de sesión del usuario con un nombre de usuario y una contraseña especificados.         |
| `LIST "" *`                 | Lista todos los directorios.                                                                 |
| `CREATE "INBOX"`            | Crea un buzón con un nombre especificado.                                                    |
| `DELETE "INBOX"`            | Elimina un buzón.                                                                            |
| `RENAME "ToRead" "Important"` | Cambia el nombre de un buzón.                                                               |
| `LSUB "" *`                 | Devuelve un subconjunto de nombres del conjunto de nombres que el Usuario ha declarado como activo o suscrito. |
| `SELECT INBOX`              | Selecciona un buzón para acceder a los mensajes del buzón.                                  |
| `UNSELECT INBOX`            | Sale del buzón seleccionado.                                                                |
| `FETCH <ID> all`            | Recupera datos asociados con un mensaje en el buzón.                                         |
| `CLOSE`                     | Elimina todos los mensajes con la bandera "Deleted".                                        |
| `LOGOUT`                    | Cierra la conexión con el servidor IMAP.                                                    |


### Comandos importantes en POP3

| Parámetro        | Descripción                                                                              |
|------------------|------------------------------------------------------------------------------------------|
| `USER username`  | Identifica al usuario.                                                                    |
| `PASS password`  | Realiza la autenticación del usuario utilizando su contraseña.                             |
| `STAT`           | Solicita al servidor la cantidad de correos electrónicos almacenados.                      |
| `LIST`           | Solicita al servidor el número y tamaño de todos los correos electrónicos.                 |
| `RETR id`        | Solicita al servidor la entrega del correo electrónico especificado por su ID.             |
| `DELE id`        | Solicita al servidor eliminar el correo electrónico especificado por su ID.                |
| `CAPA`           | Solicita al servidor mostrar las capacidades disponibles.                                  |
| `RSET`           | Restablece la información transmitida al servidor.                                         |
| `QUIT`           | Cierra la conexión con el servidor POP3.                                                   |


### Conexión por cURL

```bash
┌──(root㉿kali)-[/imaps]
└─ curl -k 'imaps://10.1.1.10' --user usuario1:1234 -v
```

### Conexión por OpenSSL

Para el caso de POP3, se debe realizar lo siguiente:

```bash
┌──(root㉿kali)-[/pop3]
└─ openssl s_client -connect 10.1.1.10:pop3s
```

Para el caso de IMAP, se debe realizar lo siguiente:

```bash
┌──(root㉿kali)-[/imaps]
└─ openssl s_client -connect 10.1.1.10:imaps
```

### Caso práctico de ataque (IMAP)

```bash
┌──(root㉿kali)-[/imaps]
└─ openssl s_client -connect 10.129.42.195:imaps -crlf
CONNECTED(00000003)
Can't use SSL_get_servername
depth=0 C = UK, ST = London, L = London, O = InlaneFreight Ltd, OU = DevOps Dep\C3\83artment, CN = dev.inlanefreight.htb, emailAddress = cto.dev@dev.inlanefreight.htb
verify error:num=18:self signed certificate
verify return:1
depth=0 C = UK, ST = London, L = London, O = InlaneFreight Ltd, OU = DevOps Dep\C3\83artment, CN = dev.inlanefreight.htb, emailAddress = cto.dev@dev.inlanefreight.htb
verify return:1
---
Certificate chain
 0 s:C = UK, ST = London, L = London, O = InlaneFreight Ltd, OU = DevOps Dep\C3\83artment, CN = dev.inlanefreight.htb, emailAddress = cto.dev@dev.inlanefreight.htb
   i:C = UK, ST = London, L = London, O = InlaneFreight Ltd, OU = DevOps Dep\C3\83artment, CN = dev.inlanefreight.htb, emailAddress = cto.dev@dev.inlanefreight.htb
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIEUzCCAzugAwIBAgIUDf35PqFuv6Uv0EECM8dFmNSZoY8wDQYJKoZIhvcNAQEL
BQAwgbcxCzAJBgNVBAYTAlVLMQ8wDQYDVQQIDAZMb25kb24xDzANBgNVBAcMBkxv
bmRvbjEaMBgGA1UECgwRSW5sYW5lRnJlaWdodCBMdGQxHDAaBgNVBAsME0Rldk9w
cyBEZXDDg2FydG1lbnQxHjAcBgNVBAMMFWRldi5pbmxhbmVmcmVpZ2h0Lmh0YjEs
MCoGCSqGSIb3DQEJARYdY3RvLmRldkBkZXYuaW5sYW5lZnJlaWdodC5odGIwIBcN
MjExMTA4MjMxMDA1WhgPMjI5NTA4MjMyMzEwMDVaMIG3MQswCQYDVQQGEwJVSzEP
MA0GA1UECAwGTG9uZG9uMQ8wDQYDVQQHDAZMb25kb24xGjAYBgNVBAoMEUlubGFu
ZUZyZWlnaHQgTHRkMRwwGgYDVQQLDBNEZXZPcHMgRGVww4NhcnRtZW50MR4wHAYD
VQQDDBVkZXYuaW5sYW5lZnJlaWdodC5odGIxLDAqBgkqhkiG9w0BCQEWHWN0by5k
ZXZAZGV2LmlubGFuZWZyZWlnaHQuaHRiMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAxvMwFE6m+iBUSujb5d6DUy1xDYR5awzQRwddyvq6iBrMxbnptSrn
+j0UOKWHCOpD5LREwP26ghUg0lVJzfo+v5pQJGnxEXKg0OFlzWEd8xgx/JWW/z1/
rDsWlNa2yYZkCy68YWJlC7UZxvcDFrI0V0pDJIkrjForw26laoYDkrh1A5F8uUXD
1TwRLLYo+NGmtNHT3BADJpv6aFUZ4CGrqBQNi7XpsTZ948WLhUwQvWmebiK06Dai
TvMNKBctjWAiNI4xvq34W9hIUaPxT1JJzuujRslep6nHGHW00QEWTWgyOMYThc3b
HtKIHMfDLTUMz7s8RhVVwlWE6+ly1DMRgQIDAQABo1MwUTAdBgNVHQ4EFgQUGDTC
9B5KCKPWT7vXbnMunL/mEE4wHwYDVR0jBBgwFoAUGDTC9B5KCKPWT7vXbnMunL/m
EE4wDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEADh0v5XWCf3KO
atrWcoiIOC67Z0ZIO7yEF+fQo8z+Wx1dWzmCFVu7u4+l7slcdJICCGBbOX8eItWS
chwzgnWJToyX8PWY8lSaB8ifMDQcr457Y7O6NmvgU35sRcLnYYqXzu2oh0lxsFLR
vL1wpyDLPhhoI++j1fELhiJ3GWiUQrb0vfJPcbSkHTgzf0hm7mLJTaqt3WfS/Gr2
8Oh7vSfzvqvHLE7HHAO0G5Q81zo+wWsrQF0s40HEF/raEMfOy2Htm79YjyjAlLWf
ueS+u8rX2smOYdRIpL3UPx7+yZPGu47vYoetde1Z5cfTCgmeS05BQ2qMOp6Tw6+G
xUuqg8nK1Q==
-----END CERTIFICATE-----
subject=C = UK, ST = London, L = London, O = InlaneFreight Ltd, OU = DevOps Dep\C3\83artment, CN = dev.inlanefreight.htb, emailAddress = cto.dev@dev.inlanefreight.htb
issuer=C = UK, ST = London, L = London, O = InlaneFreight Ltd, OU = DevOps Dep\C3\83artment, CN = dev.inlanefreight.htb, emailAddress = cto.dev@dev.inlanefreight.htb
---
No client certificate CA names sent
Peer signing digest: SHA256
Peer signature type: RSA-PSS
Server Temp Key: X25519, 253 bits
---
SSL handshake has read 1667 bytes and written 373 bytes
Verification error: self signed certificate
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server public key is 2048 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 18 (self signed certificate)
---
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: B5BA52F666B11A8F04D56A08FEBC789825DB36F5216C7DBF0959908D3519E0ED
    Session-ID-ctx:
    Resumption PSK: 47C7904DB805B439097BBD69659ED377A4583BAE83FBD13AC2C7FD587F568B63D27D768287755797E4C32BD4F715E306
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 7200 (seconds)
    TLS session ticket:
    0000 - 25 85 e0 cc da 3c 2e af-f1 f1 d9 a8 05 95 00 22   %....<........."
    0010 - 7d ef ed 80 2f 9c a8 8c-bb d1 0f 99 e7 cc db 9e   }.../...........
    0020 - 88 55 77 99 67 6e 70 eb-71 e8 7d ef 52 37 ab a6   .Uw.gnp.q.}.R7..
    0030 - 50 bf ed b9 4a 47 07 b9-ee 9a 53 3e fc ca a3 67   P...JG....S>...g
    0040 - 30 fc d0 a3 a7 f2 37 f2-58 b1 8f 3a bc 74 3d 0e   0.....7.X..:.t=.
    0050 - 27 b3 4e 12 2b e9 a8 fb-8f 07 a2 81 01 2a 8c 47   '.N.+........*.G
    0060 - 0d 33 f9 37 7e 0b 2d 81-40 1f 98 91 9c fb cd 70   .3.7~.-.@......p
    0070 - 75 bd 40 f8 5e 07 8d 15-3d 0d 30 ff 28 f7 1a 0a   u.@.^...=.0.(...
    0080 - 95 8e 68 e3 d9 1e 8f d8-b5 76 af 31 8a f1 db 31   ..h......v.1...1
    0090 - 5c 3d 1d 79 3c 03 de e2-91 b2 c4 b6 ce a1 23 f9   \=.y<.........#.
    00a0 - 1f 59 3f a5 0a d3 f0 39-e7 16 e1 e2 84 19 35 74   .Y?....9......5t
    00b0 - e8 ac eb c1 65 a5 73 97-cc 30 b1 4a 30 94 b1 1d   ....e.s..0.J0...
    Start Time: 1659256536
    Timeout   : 7200 (sec)
    Verify return code: 18 (self signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: 37E6AFDB2DBB2FE66E775D1B8F2D5F62BCAE9CAE29ECDB113C921A5D655D1615
    Session-ID-ctx:
    Resumption PSK: 65529C286BE9F224EDA68165A4DBAF1E41641360D85FB29412F54DD7BB50A395D92A5F430B6B2CE6603BF0BBA9E8BBBD
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 7200 (seconds)
    TLS session ticket:
    0000 - 25 85 e0 cc da 3c 2e af-f1 f1 d9 a8 05 95 00 22   %....<........."
    0010 - 68 39 18 57 49 9d 9b f8-6f 5e 4b f5 4a bd 98 d9   h9.WI...o^K.J...
    0020 - ab f2 5b be b6 13 98 44-a9 80 65 56 dc 6d 67 8f   ..[....D..eV.mg.
    0030 - cb aa 1e 9d e3 c9 68 43-b1 58 04 0a c8 94 37 0a   ......hC.X....7.
    0040 - b4 d6 4a 10 b2 fb 67 e5-e7 7a 5b 64 e1 b1 39 92   ..J...g..z[d..9.
    0050 - 40 b7 9b 86 bc 52 04 67-b8 72 7d 94 83 37 d5 de   @....R.g.r}..7..
    0060 - 25 5c 1d af d1 74 d4 bb-28 49 44 fc 02 3d 4a 3a   %\...t..(ID..=J:
    0070 - d1 ca 36 9a 29 a4 31 8b-c7 ea 1c cf 66 cb 66 22   ..6.).1.....f.f"
    0080 - df 93 8c 83 e9 c5 a8 7e-b9 19 8c f9 28 74 34 93   .......~....(t4.
    0090 - ad b1 7b e1 65 68 87 8f-79 09 14 13 dd 73 96 98   ..{.eh..y....s..
    00a0 - e5 dd 2c e2 6c d8 0c 46-b4 d0 18 99 97 da e7 11   ..,.l..F........
    00b0 - 5a 1b 39 69 8e c0 98 f2-1a 10 70 33 5b b7 4d 15   Z.9i......p3[.M.
    Start Time: 1659256536
    Timeout   : 7200 (sec)
    Verify return code: 18 (self signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
* OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ AUTH=PLAIN] HTB{test1}

a001 login robin robin

a001 OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE SORT SORT=DISPLAY THREAD=REFERENCES THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED I18NLEVEL=1 CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN CONTEXT=SEARCH LIST-STATUS BINARY MOVE SNIPPET=FUZZY PREVIEW=FUZZY LITERAL+ NOTIFY SPECIAL-USE] Logged in

a002 list "" *

* LIST (\Noselect \HasChildren) "." DEV
* LIST (\Noselect \HasChildren) "." DEV.DEPARTMENT
* LIST (\HasNoChildren) "." DEV.DEPARTMENT.INT
* LIST (\HasNoChildren) "." INBOX
a002 OK List completed (0.001 + 0.000 secs).

a002 select DEV.DEPARTMENT.INT

* FLAGS (\Answered \Flagged \Deleted \Seen \Draft)
* OK [PERMANENTFLAGS (\Answered \Flagged \Deleted \Seen \Draft \*)] Flags permitted.
* 1 EXISTS
* 0 RECENT
* OK [UIDVALIDITY 1636414279] UIDs valid
* OK [UIDNEXT 2] Predicted next UID
a002 OK [READ-WRITE] Select completed (0.001 + 0.000 secs).

a002 FETCH 1 full

* 1 FETCH (FLAGS (\Seen) INTERNALDATE "08-Nov-2021 23:51:24 +0000" RFC822.SIZE 167 ENVELOPE ("Wed, 03 Nov 2021 16:13:27 +0200" "Flag" (("CTO" NIL "devadmin" "inlanefreight.htb")) (("CTO" NIL "devadmin" "inlanefreight.htb")) (("CTO" NIL "devadmin" "inlanefreight.htb")) (("Robin" NIL "robin" "inlanefreight.htb")) NIL NIL NIL NIL) BODY ("text" "plain" ("charset" "us-ascii") NIL NIL "7bit" 34 1))
a002 OK Fetch completed (0.003 + 0.000 + 0.002 secs).

a002 FETCH 1 BODY[TEXT]

* 1 FETCH (BODY[TEXT] {34}
HTB{test2}
)
a002 OK Fetch completed (0.001 + 0.000 secs).
```

## SNMP

El Simple Network Management Protocol (SNMP) fue creado con el propósito de monitorear dispositivos de red. Además de su función de monitoreo, este protocolo también permite realizar tareas de configuración y cambios remotos en la configuración de los dispositivos. Los dispositivos habilitados para SNMP incluyen enrutadores, conmutadores, servidores, dispositivos IoT y muchos otros, los cuales pueden ser consultados y controlados mediante este protocolo estándar. En resumen, SNMP es utilizado para monitorear y administrar dispositivos de red, así como para gestionar tareas de configuración y ajustes remotos. La versión más reciente es SNMPv3, la cual mejora la seguridad del protocolo, aunque también incrementa su complejidad de uso.

Además de la transmisión de información, SNMP utiliza agentes para enviar comandos de control a través del puerto UDP 161. El cliente puede establecer valores específicos en el dispositivo y realizar cambios en opciones y configuraciones mediante estos comandos. A diferencia de la comunicación clásica, en la que el cliente solicita activamente la información al servidor, SNMP también permite el uso de los denominados traps en el puerto UDP 162. Estos traps son paquetes de datos enviados desde el servidor SNMP al cliente sin una solicitud explícita. Si un dispositivo está configurado de manera adecuada, enviará un trap SNMP al cliente cuando ocurra un evento específico en el lado del servidor.

### MIB (Management Information Base)

El MIB, o Base de Información de Administración, fue creado para garantizar el funcionamiento del acceso SNMP entre fabricantes y diferentes combinaciones de cliente-servidor. Es un formato independiente utilizado para almacenar información del dispositivo. Un archivo MIB es un archivo de texto que enumera todos los objetos SNMP consultables de un dispositivo en una jerarquía de árbol estandarizada. Cada objeto SNMP tiene un identificador único conocido como Object Identifier (OID), que proporciona información sobre su tipo, derechos de acceso y una descripción. Los archivos MIB están escritos en un formato de texto basado en Abstract Syntax Notation One (ASN.1). Los MIB no contienen datos en sí, pero indican dónde encontrar la información y cómo se representa, qué valores devuelve para un OID específico y qué tipo de datos se utiliza.

### OID (Object Identifier)

Un OID representa un nodo en un espacio de nombres jerárquico. Cada nodo se identifica de forma única mediante una secuencia de números, lo que permite determinar su posición en el árbol. Cuanto más larga sea la secuencia, más específica será la información asociada. Muchos nodos en el árbol OID no contienen información propia, sino que hacen referencia a los nodos inferiores. Los OID consisten en números enteros y se concatenan mediante notación de puntos. Podemos buscar en el Registro de Identificadores de Objetos (OID) para encontrar muchos MIB asociados a los OID correspondientes.

### Tipos de SNMP

| Versión | Seguridad | Rendimiento | Descripción |
|---------|-----------|-------------|-------------|
| SNMPv1  | Seguridad basada en community string, autenticación en texto plano. | Maneja un objeto a la vez debido a su estructura de datos escalar. | SNMPv1 es la primera versión de SNMP. Aunque logró su objetivo de ser un protocolo estándar abierto, se encontró que carecía en áreas clave para ciertos usos. |
| SNMPv2c | Seguridad basada en community string, similar a SNMPv1. | Introdujo la operación GetBulk, que permite solicitar grandes cantidades de datos a la vez. | SNMPv2c es una subversión de SNMPv2. Su mejora principal sobre la versión 1 es la introducción de las operaciones masivas de SNMP. Esto permite la recuperación de grandes cantidades de datos a la vez, mejorando el rendimiento en redes grandes. |
| SNMPv3  | Introdujo el modelo de seguridad basado en usuario (USM), que permite el cifrado de datos y la autenticación. | Mantiene las mejoras de rendimiento de SNMPv2c. | SNMPv3 es la versión más reciente de SNMP. Su principal adición es el modelo de seguridad basado en usuario. |


### Community string

Es un elemento de seguridad utilizado para autenticar y controlar el acceso a los dispositivos de red. Es una cadena de texto que actúa como una contraseña o clave de acceso, permitiendo a los administradores y agentes SNMP comunicarse de manera segura.

En SNMPv1 y SNMPv2c, el community string se utiliza como un mecanismo simple de autenticación. Consiste en una cadena alfanumérica que debe coincidir exactamente en ambos extremos de la comunicación, es decir, en el dispositivo de administración y en el dispositivo de red que se va a administrar. La coincidencia exitosa del community string permite que el dispositivo de administración acceda y gestione el dispositivo de red mediante el envío de comandos SNMP.

### Vectores

#### Formas de obtener un community string

Por medio de WireShark podemos filtrar por ```snmp``` y detectaremos la community string en texto claro:

[![snmp](/images/communitystring.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/communitystring.png)

También podemos realizar un ataque por diccionario por medio de ```onesixtyone``` de la siguiente forma:

```bash
┌──(root㉿kali)-[/snmp]
└─ apt install onesixtyone

┌──(root㉿kali)-[/snmp]
└─ onesixtyone -c /usr/share/wordlists/SecLists/Discovery/SNMP/snmp.txt 10.1.1.10
```

Frecuentemente, las community strings de SNMP están asociadas con nombres relacionados con los hosts a los que están vinculadas. A veces, incluso se añaden símbolos a estos nombres para incrementar su seguridad y dificultar su descubrimiento. No obstante, en una red amplia, como podría ser una que cuente con más de 100 servidores gestionados mediante SNMP, es probable que estas community strings sigan algún patrón detectable. Por lo tanto, podemos aplicar distintas reglas para intentar prever estas cadenas. Para apoyar esta labor, la herramienta ```Crunch``` puede ser extremadamente útil al permitirnos generar listas personalizadas de palabras. Una vez tenemos la community string podremos realizar los siguientes pasos.

#### SNMPwalk

SNMPWalk es una herramienta de línea de comandos que se usa para verificar y listar un conjunto de valores en un dispositivo de red administrado por SNMP (Simple Network Management Protocol). El nombre "SNMPWalk" se deriva del método que esta herramienta utiliza para recorrer la lista de valores o la "estructura de árbol" de un dispositivo de red.

Técnicamente, SNMPWalk utiliza las operaciones GETNEXT o GETBULK (en SNMPv2c y SNMPv3) para consultar una serie de Objetos de Administración o OIDs (Object Identifiers) en el MIB (Management Information Base) de un dispositivo.

* Comienza con un OID: Cuando ejecutas SNMPWalk, le das un OID (Object Identifier). Este OID es un identificador único que apunta a una variable específica en el MIB del dispositivo.

* Usa GETNEXT o GETBULK: SNMPWalk entonces utiliza la operación GETNEXT (o GETBULK para SNMPv2c y SNMPv3) para pedir al dispositivo el valor del próximo OID en el MIB.

* Recorre el MIB: SNMPWalk sigue pidiendo el próximo OID hasta que ha recorrido todo el MIB o ha alcanzado un límite que especificaste.

* Muestra los valores: Los valores de cada OID se muestran a medida que son recuperados.

Su uso se realiza de la siguiente forma: 

```bash
┌──(root㉿kali)-[/snmp]
└─ snmpwalk -v2c -c public 10.1.1.10
```

Otra opción a snmpwalk es con la siguiente herramienta:
  * snmp-check 10.1.1.10 -p 161 -c public
  * snmp-check -v2c -c public 10.1.1.10

| Parámetros | Descripción |
| ---------- | ----------- |
| `-v` | Especifica la versión de SNMP a utilizar. En este caso, se utiliza SNMPv2c. También se pueden -v1 y -v3. |
| `-c` | Define la cadena de comunidad (community string) a utilizar para la autenticación. En este caso, se utiliza "public". |

Para ver los procesos en texto claro se debe realizar lo siguiente:

```bash
┌──(root㉿kali)-[/snmp]
└─ apt install snmp-mibs-downloader

┌──(root㉿kali)-[/snmp]
└─ nano /etc/snmp/snmp.conf
mibs :  #Normal

┌──(root㉿kali)-[/snmp]
└─ nano /etc/snmp/snmp.conf
# mibs :  #Se ven los procesos
```

Y después se realiza el mismo procedimiento.

#### Braa

Una vez que conocemos una community string, podemos usarla con ```braa``` para aplicar fuerza bruta a los OID individuales y enumerar la información detrás de ellos.

```bash
┌──(root㉿kali)-[/snmp]
└─ apt install braa

┌──(root㉿kali)-[/snmp]
└─ braa public@10.1.1.10:.1.3.6.*
```

## MySQL

MySQL es un sistema de gestión de bases de datos relacional (RDBMS) de código abierto que utiliza SQL (Structured Query Language) para el acceso y manejo de datos. SQL es el lenguaje de programación más comúnmente usado para interactuar con bases de datos, por lo que MySQL puede ser utilizado con una amplia gama de aplicaciones y servicios.

El puerto por defecto utilizado por MySQL para las conexiones es el 3306. Este puerto se utiliza para las conexiones TCP/IP a la base de datos. No obstante, este valor puede ser cambiado en la configuración de MySQL si es necesario. Al igual que con cualquier servicio de red, es importante asegurarse de que este puerto esté protegido y que solo se permita el acceso a los clientes autorizados para prevenir accesos no autorizados.

Además, MySQL soporta varias características de seguridad, incluyendo la autenticación basada en contraseñas, el cifrado SSL para las conexiones de red, y la posibilidad de establecer permisos de acceso a nivel de usuario para las diferentes tablas y bases de datos.

### NMAP

```bash
┌──(root㉿kali)-[/mysql]
└─ nmap 10.1.1.10 -sV -sC -p3306 --script mysql*
```

### Conexión de forma remotar al servidor de MySQL

```bash
┌──(root㉿kali)-[/mysql]
└─ mysql -u root -pP4SSw0rd -h 10.1.1.0
```

### Consultas (Ejemplos prácticos)

- **Obtener bases de datos**:
    ```sql
    SHOW DATABASES; 
    ```
    Este comando muestra todas las bases de datos disponibles en el servidor MySQL.

- **Obtener nombres de tablas en una base de datos específica**:
    ```sql
    USE Libreria; 
    SHOW TABLES;
    ```
    Primero seleccionamos la base de datos 'Libreria' y luego mostramos todas las tablas en ella.

- **Obtener la lista de usuarios**:
    ```sql
    SELECT User, Host FROM mysql.user;
    ```
    Este comando muestra una lista de todos los usuarios en el servidor MySQL.

- **Crear un nuevo usuario**:
    ```sql
    CREATE USER 'hacker'@'localhost' IDENTIFIED BY 'P@ssword456!';
    GRANT ALL PRIVILEGES ON *.* TO 'hacker'@'localhost';
    FLUSH PRIVILEGES;
    ```
    Este comando crea un nuevo usuario llamado 'hacker' con la contraseña 'P@ssword456!', otorga a ese usuario todos los privilegios y luego actualiza los cambios de privilegios.

- **Seleccionar un dato específico**:
    ```sql
    USE Libreria;
    SELECT nombre, contrasena
    FROM cuentasdev
    WHERE nombre = 'CTF';
    ```
    Primero seleccionamos la base de datos 'Libreria'. Luego, esta consulta selecciona las columnas 'nombre' y 'contrasena' de la tabla 'cuentasdev', pero solo para los registros donde el 'nombre' es igual a 'CTF'.

Ejemplo de salida:

    nombre  | contrasena
    ------------------------------
    CTF   | nBxh7ehrgJl37AlqZPK5zGT


## MSSQL (SQL Server)

Microsoft SQL Server (MS SQL) es un sistema de gestión de bases de datos relacional (RDBMS) desarrollado por Microsoft. Se utiliza para manejar y organizar grandes cantidades de datos. MS SQL ofrece una amplia gama de servicios, incluyendo almacenamiento de datos, procesamiento de transacciones y análisis.

MS SQL es popular en aplicaciones empresariales y se utiliza comúnmente en diferentes tipos de industrias. Ofrece una variedad de herramientas para administración de datos, procesamiento de transacciones, análisis de datos, etc.

El puerto predeterminado que utiliza MS SQL Server para las conexiones es el 1433. Este puerto se utiliza para las conexiones TCP/IP a la base de datos. Sin embargo, es posible cambiar el puerto predeterminado según las necesidades de tu organización. También es importante tener en cuenta que, en general, este puerto debería estar protegido por un firewall para prevenir accesos no autorizados.

### NMAP

```bash
┌──(root㉿kali)-[/mssql]
└─ nmap 10.1.1.10 --script ms-sql-info,ms-sql-empty-password,ms-sql-xp-cmdshell,ms-sql-config,ms-sql-ntlm-info,ms-sql-tables,ms-sql-hasdbaccess,ms-sql-dac,ms-sql-dump-hashes --script-args mssql.instance-port=1433,mssql.username=sa,mssql.password=,mssql.instance-name=MSSQLSERVER -sV -p 1433
```

### Conexión de forma remotar al servidor MSSQL

Si se tienen las credenciales válidas, es posible interactuar con las bases de datos usando T-SQL, por medio de ```mssqlclient.py``` de Impacket.

#### Conexión simple

```bash
┌──(root㉿kali)-[/mssql]
└─ python3 mssqlclient.py Administrator@10.1.1.10 -windows-auth
```

#### Conexión con dominio

```bash
┌──(root㉿kali)-[/mssql]
└─ python3 mssqlclient.py DOMINIO/Administrator:'contrase\ña'@10.1.1.10
```

> -windows-auth indica que se debe utilizar la autenticación de Windows para conectarse al servidor MSSQL. Esto significa que el script intentará utilizar las credenciales actuales de Windows para autenticarse con el servidor MSSQL.

### Consultas (Ejemplos prácticos)

- **Obtener bases de datos**:
    ```sql
    SELECT name FROM master.dbo.sysdatabases; 
    ```
    Este comando consulta los nombres de todas las bases de datos disponibles en el servidor.

- **Obtener nombres de tablas en una base de datos específica**:
    ```sql
    SELECT * FROM Biblioteca.INFORMATION_SCHEMA.TABLES; 
    ```
    Este comando muestra información sobre todas las tablas en la base de datos 'Biblioteca'.

- **Listar servidores vinculados**:
    ```sql
    EXEC sp_linkedservers;
    SELECT * FROM sys.servers;
    ```
    Estos comandos muestran información sobre los servidores vinculados al servidor actual.

- **Listar usuarios**:
    ```sql
    SELECT sp.name AS login, sp.type_desc AS login_type, sl.password_hash, sp.create_date, sp.modify_date, 
           CASE WHEN sp.is_disabled = 1 THEN 'Inhabilitado' ELSE 'Habilitado' END AS estado 
    FROM sys.server_principals sp 
    LEFT JOIN sys.sql_logins sl ON sp.principal_id = sl.principal_id 
    WHERE sp.type NOT IN ('G', 'R') 
    ORDER BY sp.name;
    ```
    Esta consulta muestra una lista de los usuarios en el servidor, junto con información como el tipo de inicio de sesión, el hash de la contraseña, las fechas de creación y modificación, y el estado del inicio de sesión.

- **Crear un usuario con privilegios de sysadmin**:
    ```sql
    CREATE LOGIN pirata WITH PASSWORD = 'P@ssword456!';
    sp_addsrvrolemember 'hacker', 'sysadmin';
    ```
    Este comando crea un nuevo usuario llamado 'hacker' con la contraseña 'P@ssword456!', y luego le otorga el rol de 'sysadmin'.

- **Seleccionar un dato específico**:
    ```sql
    USE Biblioteca;
    SELECT [nombre], [contrasena]
    FROM [usuarios].[dbo].[cuentasdev]
    WHERE [nombre]='CTF';
    ```
    En este caso, primero seleccionamos la base de datos 'Biblioteca' con el comando `USE`. Luego, esta consulta selecciona la columna 'nombre' y 'contrasena' de la tabla 'cuentasdev' en la base de datos 'usuarios', pero sólo para los registros donde el 'nombre' es igual a 'CTF'. 

Ejemplo de salida:

    nombre  | contrasena
    ------------------------------
    CTF   | nBxh7ehrgJl37AlqZPK5zGT


> Se referencian los artículos en que se encuentran enumeraciones pertenecientes a [SMB](https://nptg24.github.io/Active-Directory/#enumeraci%C3%B3n-null-session-attack) y [DNS](https://nptg24.github.io/recoleccion-web/#enumeraci%C3%B3n-de-dns).
