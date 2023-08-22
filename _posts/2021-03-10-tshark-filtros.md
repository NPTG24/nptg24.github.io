---
date: 2021-10-03T21:20:12.000Z
layout: post
comments: true
title: Tshark
subtitle: 'Y algunos de sus filtros'
description: >-
image: >-
  http://imgfz.com/i/ckLrBwA.png
optimized_image: >-
  http://imgfz.com/i/ckLrBwA.png
category: ciberseguridad
tags:
  - Wifi
  - paquetes
  - hacking
  - pcap
  - cap
  - redes
author: Felipe Canales Cayuqueo
paginate: true
---

TShark es un analizador de protocolos de red. Le permite capturar datos de paquetes de una red en vivo o leer paquetes de un archivo de captura previamente guardado, ya sea imprimiendo una forma decodificada de esos paquetes en la salida estándar o escribiendo los paquetes en un archivo.

# Filtrar paquetes por Probe Request

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==4" 2>/dev/null
```

# Filtrar paquetes por Probe Response

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==5" 2>/dev/null
```

# Filtrar paquetes por Association Request

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==0" 2>/dev/null
```

# Encontrar MAC de dispositivos autenticados

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==0" -Tfields -e wlan.addr 2>/dev/null | tr ',' '\n' | sort -u 
```

# Filtrar paquetes por Association Response

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==1" 2>/dev/null
```

# Filtrar paquetes por Beacon

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==8" 2>/dev/null
```

Aquí viaja información importante de una estación por lo que se puede analizar realizando lo siguiente:

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==8" -Tjson 2>/dev/null
```

# Filtrar paquetes de Autenticación

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==11" 2>/dev/null
```

# Filtrar paquetes de Deautenticación

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==12" 2>/dev/null
```
Si queremos revisar los paquetes que desautenticamos nosotros previamente con un ataque de deautenticación global, podemos hacer lo siguiente:

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-04.cap -Y "wlan.fc.type_subtype==12" -Tjson 2>/dev/null | grep -i "FF:FF:FF:FF:FF:FF"
```

Podemos encontrar los puntos de acceso realizando lo siguiente:

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==12" -Tfields -e wlan.da 2>/dev/null | sort -u
```

# Filtrar paquetes de Desasociación

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==10" 2>/dev/null
```

# Filtrar paquetes por CTS Frame

```bash
┌─[root@kali]─[/Documents/WiFi/demo/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==28" 2>/dev/null
```

# Otro ejemplo de uso con WiFi

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airdecap-ng -e Testing -p Hello123 Captura-01.cap

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http" 2>/dev/null

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "dns" 2>/dev/null

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http.request.method==POST" 2>/dev/null

#Para ver el contenido

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http.request.method==POST" -Tjson 2>/dev/null

#Otra forma una vez encontramos credenciales

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http.request.method==POST" -Tfields -e http.file_data 2>/dev/null
```

>Recordar que todos estos filtros se pueden realizar desde WireShark.
