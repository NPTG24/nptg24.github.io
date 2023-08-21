---
date: 2021-09-08T05:22:05.000Z
layout: post
comments: true
title: Valores TTL
subtitle: 'comunes'
description: >-
image: >-
  https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/ttl.png
optimized_image: >-
  https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/ttl.png
category: ciberseguridad
tags:
  - ping
  - linux
  - enumeración
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

TTL es un valor en un paquete de Protocolo de Internet (IP) que le dice a un enrutador de red cuando el paquete ha estado en la red por demasiado tiempo y debe descartarse.

| TTL | Sistema | Versión | Protocolo |
| :--------: | :-------: | :-------: | :-------: |
| 32 | Windows | for Workgroups | TCP/UDP |
| 32 | Windows | 95/NT 3.51 | TCP/UDP |
| 32 | Windows | 98 | ICMP |
| 60 | MacOS/MacTCP | 2.0.x | TCP/UDP |
| 64 | Linux | 2.0.x kernel | ICMP |
| 64 | Linux | Red Hat 9 | ICMP/TCP |
| 64 | MacOS/MacTCP | X(10.5.6) | ICMP/TCP/UDP |
| 64 | Netgear FVG318 |  | ICMP/UDP |
| 128 | Windows | Server 2003 |  |
| 128 | Windows | 98 | TCP |
| 128 | Windows | 98/98 SE/NT 4 WRKS SP 3/SP 6a/NT 4 Server SP4/ME/2000 family | ICMP |
| 128 | Windows | NT 4.0 | TCP/UDP |
| 128 | Windows | 2000 pro/XP/Vista/7/Server 2008/10 | ICMP/TCP/UDP |
| 254 | Cisco |  | ICMP |
| 255 | Linux | 2.2.14 kernel/2.4 kernel | ICMP |
| 255 | AIX | 3.2/4.1 | ICMP |
| 255 | Solaris | 2.5.1/2.6/2.7/2.8 | ICMP |



Versión corta...

| TTL | Sistema |
| :--------: | :-------: |
| 64 | Linux/Unix |
| 128 | Windows |
| 254 | Solaris/AIX |

Para saber el TTL de una máquina se puede realizar lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo]
└──╼ ping -c 1 <ip-address>
```
