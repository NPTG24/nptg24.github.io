---
date: 2023-08-28T02:30:05.000Z
layout: post
comments: true
title: Wireshark
subtitle: 'Filtros importantes'
description: >-
image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/wireshark-1.png
optimized_image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/wireshark-1.png
category: ciberseguridad
tags: 
  - hacking
  - redes
  - mitm
  - intermediario
  - man-in-the-middle
  - DDoS
  - DoS
author: Felipe Canales Cayuqueo
paginate: true
---

Wireshark es un analizador de protocolos de red de código abierto que se utiliza para capturar y examinar el tráfico de datos que pasa a través de una red. Al utilizar Wireshark para capturar paquetes en la red, el atacante puede analizarlos para obtener información sobre las direcciones MAC y las direcciones IP de los dispositivos de la red y el tráfico de la red, lo que permite obtener información sensible, como nombres de usuario, contraseñas, hashes, cookies de sesión, entre otros datos. Algunas opciones de filtros a considerar son los siguientes:

* Filtrar por IP

  ```
   ip.addr == 192.168.16.35
  ```

* Filtrar por IP de destino

  ```
   ip.dst == 192.168.16.35
  ```

* Filtrar por rangos de IP

  ```
   ip.addr >= 192.168.16.33 and ip.addr <= 192.168.16.62
  ```

* Filtrar por puerto TCP

  ```
   tcp.port == 1433
  ```

* Filtrar por puerto UDP

  ```
   udp.port == 161
  ```

* Filtrar por puerto de destino

  ```
   tcp.dstport == 80
  ```

* Filtrar por dirección IP y puerto

  ```
   ip.addr == 192.168.16.35 and tcp.port == 80
  ```

* Filtrar por dirección MAC

  ```
   eth.addr == 00:60:f4:23:18:c3
  ```

* Filtrar por consultas o credenciales SQL Server

  ```
   tds
  ```

* Filtrar para encontrar hashes kerberos

  ```
   kerberos
  ```

* Filtrar por cookies

  ```
   http.cookie
  ```

* Filtrar para encontrar hashes NTLM y NTLMv2

  ```
   ntlmssp
  ```

* Filtrar contraseñas por el protocolo HTTP

  ```
   http contains password
  ```

* Otra forma de filtrar contraseñas por HTTP

  ```
   http.request.method == "POST"
  ```

> El filtro "contains" se utiliza para mostrar sólo los paquetes que contienen una cadena de texto específica en su contenido o en alguna de sus cabeceras.

* Filtrar por el community string en SNMP

  ```
   snmp.community
  ```

* Filtrar por credenciales POP

  ```
   pop.request.command == "USER" || pop.request.command == "PASS"
  ```

> El símbolo ```||``` se utiliza como operador lógico para combinar varios filtros en una sola expresión.

* Filtrar por credenciales IMAP

  ```
   imap.request contains "login"
  ```

* Filtrar por credenciales SMTP

  ```
   smtp.req.command == "AUTH"
  ```

* Filtrar por el protocolo de mensajeria MQTT (IoT)

  ```
   mqtt
  ```

## DDoS y DoS

### Filtro para identificar paquetes SYN

El filtro `tcp.flags.syn == 1 and tcp.flags.ack == 0` en Wireshark se utiliza para identificar paquetes TCP con el bit SYN establecido y el bit ACK no establecido. Estos paquetes son típicamente el primer paso en el establecimiento de una conexión TCP.

#### Cómo determinar cuántas máquinas están enviando paquetes SYN

1. **Ir a Estadísticas de Direcciones IPv4 (Statistics IPv4 addresses)**: Esta es una funcionalidad en Wireshark que te permite ver estadísticas relacionadas con direcciones IPv4.
  
2. **Origen y Destino (Source and Destination)**: En esta sección, puedes ver las direcciones IP de origen y destino del tráfico capturado.

3. **Aplicar el filtro dado**: Una vez que estés en la sección de estadísticas de direcciones IPv4, puedes aplicar el filtro `tcp.flags.syn == 1 and tcp.flags.ack == 0` para identificar cuántas máquinas diferentes están intentando iniciar conexiones TCP.

### Para determinar qué máquina podría estar realizando un ataque DoS

Aplicar el filtro `tcp.flags.syn == 1` te mostrará todos los paquetes con el bit SYN establecido, independientemente del estado del bit ACK. Si observas una gran cantidad de estos paquetes provenientes de una sola dirección IP, podría ser un indicador de un intento de ataque de Denegación de Servicio (DoS).

### Ejemplo de análisis de tráfico en Wireshark para identificación de ataques

#### Identificación de ataque DoS (Denegación de Servicio)

Aplicamos el filtro `tcp.flags.syn == 1 and tcp.flags.ack == 0` y observamos el siguiente comportamiento:

| Dirección IP de Origen | Conteo de Paquetes SYN |
| ---------------------- | ---------------------- |
| 192.168.1.1            | 5                      |
| 192.168.1.2            | 8                      |
| 10.0.0.1               | 1500                   |

##### Observaciones:

- La dirección IP `10.0.0.1` ha enviado una cantidad inusualmente alta de paquetes SYN. 

**Dirección IP atacante en el caso DoS**: La dirección IP `10.0.0.1` es un fuerte indicador de que esta máquina podría estar llevando a cabo un ataque de DoS.


#### Identificación de ataque DDoS (Ataque Distribuido de Denegación de Servicio)

Aplicamos el mismo filtro `tcp.flags.syn == 1 and tcp.flags.ack == 0` y observamos el siguiente comportamiento:

| Dirección IP de Origen | Conteo de Paquetes SYN |
| ---------------------- | ---------------------- |
| 192.168.1.1            | 5                      |
| 192.168.1.2            | 400                    |
| 192.168.1.3            | 390                    |
| 10.0.0.1               | 380                    |
| 172.16.0.1             | 375                    |

##### Observaciones:

- Varios hosts están enviando una cantidad elevada de paquetes SYN. 

**Número total de máquinas atacantes en el caso DDoS**: Podemos identificar 4 direcciones IP (`192.168.1.2`, `192.168.1.3`, `10.0.0.1`, `172.16.0.1`) que están enviando una cantidad elevada de paquetes SYN, lo que podría indicar un ataque DDoS en el que múltiples máquinas están involucradas.

**Nota**: Estos son solo indicadores y no pruebas concluyentes de actividad maliciosa. Se requieren análisis adicionales para determinar la intención detrás de estos paquetes.


Estos son algunos ejemplos de como usar el filtrado de Wireshark, destacando que la utilización de operadores lógicos permite construir expresiones de filtro más complejas y específicas, lo que facilita la tarea de encontrar la información deseada en una sesión de captura de paquetes. Además la utilización de filtros puede ayudar a reducir el ruido y el volumen de datos que se capturan en una sesión de captura de paquetes, lo que permite al usuario enfocarse en la información específica que está buscando.
