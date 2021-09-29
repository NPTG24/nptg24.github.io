---
date: 2021-09-28T21:03:05.000Z
layout: post
comments: true
title: Protocolos
subtitle: 'de redes'
description: >-
image: >-
  http://imgfz.com/i/Ynw7V0H.jpeg
optimized_image: >-
  http://imgfz.com/i/Ynw7V0H.jpeg
category: redes
tags:
  - Protocolos
  - IP
  - ARP
  - ICMP
  - FTP
  - SSH
  - SMTP
  - DNS
  - HTTP
  - TCP
  - POP3
  - Telnet
  - UDP
  - Puertos
author: Felipe Canales Cayuqueo
paginate: true
---

Parecería que para integrar un equipo a una red de ordenadores bastaría con interconectarlos entre sí con ayuda de un cable de LAN, pero los sistemas informáticos no tienen la capacidad de intercambiar paquetes de datos sin ayuda, y no pueden, por ello, establecer ninguna conexión de datos. Esta tarea le corresponde a los protocolos de red, que, en conjunto con sus respectivas familias de protocolo, actúan en la llamada capa de mediación o de red, el nivel 3 en el [modelo OSI](https://nptg24.github.io/modelo-osi/). Antes de pasar con los protocolos es bueno entender que es un paquete de red.

# Paquete de red

El objetivo principal de la creación de redes es intercambiar información entre computadoras en red; esta información es transportada por paquetes. Los paquetes no son más que flujos de bits que se ejecutan como señales eléctricas en medios físicos utilizados para la transmisión de datos. Dichos medios pueden ser un cable en una LAN o el aire en una red WiFi. Estas señales eléctricas se interpretan luego como bits (0,1) que componen la información.

Estos tienen la siguiente estrcuctura:

![packets](http://imgfz.com/i/VdvqcNG.png)

* Cabecera(header): tiene una estructura específica de protocolo, esto asegura que el host receptor pueda interpretar correctamente la carga útil y manejar la comunicación general.

* Área de datos(payload): es la información que se quiere trasladar en tiempo real. Podría ser algo así como parte de un mensaje de correo electrónico o el contenido de un archivo durante la descarga.

* Cola(trailer): además de los dos anteriores incluir este último que incluye código de detección de errores.

# Capa de acceso al medio (físico)

## Address Resolution Protocol (ARP)

Es un protocolo o procedimiento que conecta una dirección de Protocolo de Internet (IP) en constante cambio a una dirección de máquina física fija, también conocida como dirección de control de acceso a medios (MAC), en una red de área local (LAN). 

Este procedimiento de mapeo es importante porque las longitudes de las direcciones IP y MAC difieren, y se necesita una traducción para que los sistemas puedan reconocerse entre sí. La IP más utilizada en la actualidad es la versión 4 de IP (IPv4). Una dirección IP tiene una longitud de 32 bits. Sin embargo, las direcciones MAC tienen una longitud de 48 bits. ARP traduce la dirección de 32 bits a 48 y viceversa.

>La dirección MAC también se conoce como capa de enlace de datos, que establece y finaliza una conexión entre dos dispositivos conectados físicamente para de esa forma permitir la transferencia de datos.

El punto débil de este protocolo es que no es posible comprobar si la resolución es correcta, lo que implica el riesgo de ARP spoofing o envenenamiento de tablas ARP.

En síntesis, se encarga de la resolución de direcciones (encontrar la dirección MAC para la dirección IP correspondiente) en IPv4, cuya interfaz entre las capas 2 y 3 con función propia de memoria caché.

# Capa de red

## Internet Protocol (IP)

Es un protocolo , o conjunto de reglas, para enrutar y direccionar paquetes de datos para que puedan viajar a través de las redes y llegar al destino correcto. La información de IP se adjunta a cada paquete y esta información ayuda a los enrutadores a enviar paquetes al lugar correcto. A cada dispositivo o dominio que se conecta a Internet se le asigna una dirección IP y, a medida que los paquetes se dirigen a la dirección IP adjunta, los datos llegan a donde se necesitan. Una vez que los paquetes llegan a su destino, se manejan de manera diferente dependiendo del protocolo de transporte que se use en combinación con IP. Los protocolos de transporte más comunes son TCP y UDP.

La cuarta versión de IP (IPv4 para abreviar) se introdujo en 1983. Sin embargo, así como hay un número limitado de permutaciones posibles para los números de matrícula de automóviles y deben reformatearse periódicamente, el suministro de direcciones IPv4 disponibles se ha agotado. Las direcciones IPv6 tienen muchos más caracteres y, por lo tanto, más permutaciones; sin embargo, IPv6 aún no se ha adoptado por completo y la mayoría de los dominios y dispositivos todavía tienen direcciones IPv4. 

El punto débil de este protocolo es que tiene una pila de protocolos muy extensa; las funciones de seguridad no están implementadas desde el principio (IPv4).

En síntesis, se encarga del enrutamiento y el direccionamiento.

## Internet Control Message Protocol (ICMP)

Es una parte necesaria de cada implementación de IP. ICMP maneja los mensajes de error y control para IP.

Este protocolo permite a las pasarelas y los sistemas principales enviar informes de problemas a la máquina que envía un paquete. ICMP realiza lo siguiente:

* Prueba si un destino está activo y es alcanzable.
* Informa de los problemas de parámetros en una cabecera de datagrama.
* Realiza la sincronización de reloj y las estimaciones de tiempo de tránsito.
* Obtiene direcciones de Internet y máscaras de subred.

ICMP proporciona información de retorno sobre problemas en el entorno de comunicaciones, pero no hace que IP sea fiable. Es decir, ICMP no garantiza que un paquete IP se entregue de forma fiable o que un mensaje ICMP se devuelva al sistema principal de origen cuando un paquete IP no se entrega o se entrega incorrectamente.

Los mensajes ICMP se pueden enviar en cualquiera de las situaciones siguientes:

* Cuando un paquete no puede alcanzar el destino.
* Cuando un sistema principal de pasarela no tiene la capacidad de almacenamiento intermedio para reenviar un paquete.
* Cuando una pasarela puede indicar a un sistema principal que envíe el tráfico en una ruta más corta.

El punto débil de este protocolo es que puede ser usado para llevar a cabo ataques DoS/DDos.

En síntesis, se encarga del intercambio de notificaciones de información y de errores.

# Capa de transporte

## Transmission Control Protocol (TCP)

Es un estándar de comunicaciones que permite que los programas de aplicación y los dispositivos informáticos intercambien mensajes a través de una red. Está diseñado para enviar paquetes a través de Internet y garantizar la entrega exitosa de datos y mensajes a través de las redes. Definen las reglas de Internet y está incluido dentro de los estándares definidos por Internet Engineering Task Force (IETF). Es uno de los protocolos más utilizados en las comunicaciones de redes digitales y garantiza la entrega de datos de un extremo a otro.

TCP organiza los datos para que puedan transmitirse entre un servidor y un cliente. Garantiza la integridad de los datos que se comunican a través de una red. Antes de transmitir datos, TCP establece una conexión entre una fuente y su destino, que asegura que permanece activa hasta que comienza la comunicación. Luego divide grandes cantidades de datos en paquetes más pequeños, al tiempo que garantiza que la integridad de los datos esté en su lugar durante todo el proceso. Como resultado, todos los protocolos de alto nivel que necesitan transmitir datos utilizan el protocolo TCP, como el caso de que es el complemento ideal para el protocolo IP porque los datagramas del protocolo IP no están diseñados para establecer un sistema recíproco de verificación entre los dispositivos que intercambian la información. 

Los ejemplos incluyen métodos de intercambio de igual a igual como el Protocolo de transferencia de archivos (FTP), Secure Shell (SSH) y Telnet. También se utiliza para enviar y recibir correo electrónico a través del Protocolo de acceso a mensajes de Internet (IMAP), el Protocolo de oficina postal (POP) y el Protocolo simple de transferencia de correo (SMTP), y para el acceso web a través del Protocolo de transferencia de hipertexto (HTTP). 

## User Datagram Protocol (UDP)

Es un protocolo de comunicación que se usa en Internet para transmisiones especialmente sensibles al tiempo, como la reproducción de video o las búsquedas de DNS . Acelera las comunicaciones al no establecer formalmente una conexión antes de que se transfieran los datos. Esto permite que los datos se transfieran muy rápidamente, pero también puede hacer que los paquetes se pierdan en tránsito y crear oportunidades de explotación en forma de ataques DDoS.

Este se encarga de transferir datos entre dos computadoras en una red. En comparación con otros protocolos, UDP realiza este proceso de una manera simple: envía paquetes (unidades de transmisión de datos) directamente a una computadora de destino, sin establecer una conexión primero, indicando el orden de dichos paquetes o verificando si llegaron como se esperaba. (Los paquetes UDP se denominan 'datagramas').

UDP es más rápido pero menos confiable que TCP , otro protocolo de transporte común. En una comunicación TCP, las dos computadoras comienzan estableciendo una conexión a través de un proceso automatizado llamado "apretón de manos". Solo una vez que se haya completado este apretón de manos, una computadora realmente transferirá paquetes de datos a la otra.

Las comunicaciones UDP no pasan por este proceso. En cambio, una computadora puede simplemente comenzar a enviar datos a la otra.

Para más información de estos protocolos, puede dirigirse a la sección de TCP y UDP del artículo "[Modelo OSI y sus capas](https://nptg24.github.io/modelo-osi/#niveles-osi-orientados-a-red)".

# Capa de aplicación

## Hypertext Transfer Protocol (HTTP)

Es el conjunto de reglas para transferir archivos, como texto, imágenes, sonido, video y otros archivos multimedia, a través de la web. Tan pronto como un usuario abre su navegador web, indirectamente está usando HTTP. HTTP es un protocolo de aplicación que se ejecuta sobre el   conjunto de protocolos TCP / IP , que forma la base de Internet.

Las versiones del protocolo HTTP (o "versiones HTTP") comúnmente utilizadas en Internet son [HTTP / 1.0](https://datatracker.ietf.org/doc/html/rfc1945), que es un protocolo anterior que incluye menos funciones, y [HTTP / 1.1](https://datatracker.ietf.org/doc/html/rfc2616), que es un protocolo posterior que incluye más funciones. El cliente y el servidor pueden utilizar diferentes versiones del protocolo HTTP. Tanto el cliente como el servidor deben indicar la versión HTTP de su solicitud o respuesta en la primera línea de su mensaje.

>Los vínculos adjuntos en HTTP 1.0 y 1.1, corresponden a los documentos de solicitud de comentarios de Internet Society e IETF (Internet Engineering Task Force) (conocidos como RFC), quienes proporcionan las definiciones oficiales para el protocolo HTTP.

A través del protocolo HTTP, los recursos se intercambian entre los dispositivos del cliente y los servidores a través de Internet. Los dispositivos cliente envían solicitudes a los servidores de los recursos necesarios para cargar una página web; los servidores envían respuestas al cliente para cumplir con las solicitudes. Las solicitudes y respuestas comparten subdocumentos, como datos sobre imágenes, texto, diseños de texto, etc., que un navegador web cliente reúne para mostrar el archivo completo de la página web.

Además de los archivos de página web que puede servir, un  servidor web contiene un demonio HTTP (un programa que espera las solicitudes HTTP y las maneja cuando llegan). Un navegador web es un cliente HTTP que envía solicitudes a los servidores. Cuando el usuario del navegador ingresa solicitudes de archivos "abriendo" un archivo web escribiendo una URL o haciendo clic en un enlace de hipertexto, el navegador genera una solicitud HTTP y la envía a la dirección de Protocolo de Internet (dirección IP) indicada por la URL. El demonio HTTP en el servidor de destino recibe la solicitud y devuelve el archivo solicitado o los archivos asociados con la solicitud.

El protocolo HTTP tiene como base a TCP, el cual implementa un modelo de comunicación cliente-servidor. Existen tres tipos de mensajes que HTTP utiliza:

* HTTP GET: Se envía un mensaje al servidor que contiene una URL con o sin parámetros. El servidor responde retornando una página web al navegador, el cual es visible por el usuario solicitante.

* HTTP POST: Se envía un mensaje al servidor que continee datos en la sección «body» de la solicitud. Esto es hecho para evitar el envío de datos a través de la propia URL. Así como sucede con el HTTP GET.

* HTTP HEAD: Aquí se hace énfasis en la respuesta por parte del servidor. Este mensaje restringe lo que el servidor responde para que solamente responda con la información de la cabecera.

Recordar que también existe HTTPS el cual usa "Secure Sockets Layer" (SSL) o Transport Layer Security (TLS) como una subcapa en las capas de aplicaciones HTTP normales. HTTPS cifra y descifra las solicitudes de página HTTP del usuario, así como las páginas que devuelve el servidor web.

## Domain Name System (DNS)

Es la agenda telefónica de Internet. Las personas acceden a la información en línea mediante los nombres de dominio. Los navegadores web interactúan mediante direcciones de protocolo de Internet (IP), y este traducirá los nombres de dominio a direcciones IP para que los navegadores puedan cargar los recursos de Internet.

Cada dispositivo conectado a Internet tiene una dirección IP única que pueden usar otras máquinas para encontrar el dispositivo. Con los servidores DNS, no es necesario que las personas memoricen direcciones IP, tales como 192.168.1.1 (en IPv4) o nuevas direcciones IP alfanuméricas más complejas, tales como 2400:cb00:2048:1::c629:d7a2 (IPv6).

Se involucran en este proceso servidores DNS como:

* DNS recursor.
* Root nameserver.
* TLD nameserver.
* Authoritative nameserver.

## File Transfer Protocol (FTP)

Es un protocolo de red ampliamente utilizado para transferir archivos entre computadoras a través de una red basada en TCP/IP, como Internet. FTP permite que las personas y las aplicaciones intercambien y compartan datos dentro de sus oficinas y a través de Internet. FTP fue una de las primeras tecnologías desarrolladas para resolver esta necesidad común y sigue siendo, con varias generaciones de mejoras, el segundo protocolo más popular utilizado en la actualidad (después de HTTP o la "World Wide Web").

El Protocolo de transferencia de archivos funciona en un modelo cliente-servidor donde un servidor FTP y un cliente FTP realizan la operación de transferencia de archivos. Se configura un servidor FTP en la red y se identifica una ubicación de almacenamiento de archivos específica (carpeta/sistema) para convertirse en el almacenamiento compartido, que albergará los archivos que desea compartir. Los usuarios finales accederán a este servidor de archivos a través de FTP para comenzar a copiar los archivos en su carpeta/sistema local.

FTP requiere una red TCP/IP para funcionar y se basa en el uso de uno o más clientes FTP. El cliente FTP actúa como agente de comunicación para interactuar con el servidor y descargar o cargar archivos. En otras palabras, el cliente FTP envía conexiones al servidor FTP. Al escuchar la solicitud del cliente para cargar o descargar un archivo, el servidor FTP realiza la operación de transferencia de archivos.

## Simple Mail Transfer Protocol (SMTP)

Es un protocolo TCP/IP que se utiliza para enviar y recibir correo electrónico. Por lo general, se usa con POP3 o Protocolo de acceso a mensajes de Internet para guardar mensajes en un buzón de correo del servidor y descargarlos periódicamente del servidor para el usuario.

El cliente que desea enviar el correo abre una conexión TCP al servidor SMTP y luego envía el correo a través de la conexión. El servidor SMTP siempre está en modo de escucha. Tan pronto como escucha una conexión TCP de cualquier cliente, el proceso SMTP inicia una conexión a través del puerto 25. Después de establecer con éxito una conexión TCP, el proceso del cliente envía el correo instantáneamente. 

## Post-Office Protocol Version 3 (POP3)

El Protocolo de oficina de correos versión 3 (POP3) proporciona mecanismos para almacenar los mensajes enviados a cada usuario y recibidos por SMTP en un receptáculo llamado buzón de correo. Un servidor POP3 almacena mensajes para cada usuario hasta que el usuario se conecta para descargarlos y leerlos utilizando un cliente POP3 como Microsoft Outlook 98, Microsoft Outlook Express o Microsoft Mail and News.

Para recuperar un mensaje de un servidor POP3, un cliente POP3 establece una sesión de Protocolo de control de transmisión (TCP) utilizando el puerto TCP 110, se identifica en el servidor y luego emite una serie de comandos POP3:

* stat: pregunta al servidor la cantidad de mensajes que esperan ser recuperados.
* lis: determina el tamaño de cada mensaje que se va a recuperar.
* retr: recupera mensajes individuales.
* quit: finaliza la sesión POP3.

## Internet Message Access Protocol (IMAP)

Es un protocolo para acceder al correo electrónico o a los mensajes del tablero de anuncios desde un servidor o servicio de correo (posiblemente compartido). IMAP permite que un programa de correo electrónico de un cliente acceda a los almacenes de mensajes remotos como si fueran locales. El correo electrónico almacenado en un servidor IMAP se puede manipular desde una estación de trabajo en la oficina, una computadora de escritorio en casa o una computadora portátil mientras viaja, sin requerir la transferencia de mensajes o archivos entre estas computadoras.

## Telecomunication Network (Telnet)

Proporciona un método estándar para que los dispositivos de terminal y los procesos orientados a terminal intercambien información.

Normalmente los programas de emulación de terminal que le permiten iniciar la sesión en un sistema principal remoto utilizan TELNET. Sin embargo, TELNET se puede utilizar para las comunicaciones de terminal a terminal y las comunicaciones entre procesos. TELNET también lo utilizan otros protocolos (por ejemplo FTP) para establecer un canal de control de protocolo.

TCP/IP implementa TELNET en los mandatos de usuario tn, telnet o tn3270. El daemon telnetd no proporciona ninguna API en TELNET.

TCP/IP soporta las siguientes opciones de TELNET que se negocian entre el cliente y el servidor.

## Secure Shell (SSH)

Es un método para el inicio de sesión remoto seguro desde una computadora a otra. Proporciona varias opciones alternativas para una autenticación sólida y protege la seguridad e integridad de las comunicaciones con un cifrado sólido. Es una alternativa segura a los protocolos de inicio de sesión no protegidos (telnet, rlogin) y los métodos de transferencia de archivos inseguros (como FTP).

El protocolo funciona en el modelo cliente-servidor, lo que significa que la conexión la establece el cliente SSH que se conecta al servidor SSH. El cliente SSH dirige el proceso de configuración de la conexión y utiliza criptografía de clave pública para verificar la identidad del servidor SSH. Después de la fase de configuración, el protocolo SSH utiliza un cifrado simétrico fuerte y algoritmos hash para garantizar la privacidad e integridad de los datos que se intercambian entre el cliente y el servidor.

# Puertos de protocolos

Puertos usados por la capa de transporte (TCP/UDP). 

| Protocolo | Puerto |
| :--------: | :-------: |
| FTP | 21/TCP |
| SSH | 22/TCP |
| Telnet | 23/TCP |
| SMTP | 25/TCP |
| DNS | 53/UDP/TCP |
| HTTP | 80/TCP |
| POP3 | 110/TCP |
| IMAP | 143/TCP |
| HTTPS/SSL | 443/TCP |
| microsoft-ds | 445/TCP |
