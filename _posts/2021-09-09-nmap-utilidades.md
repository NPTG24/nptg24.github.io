---
date: 2021-09-09T00:22:05.000Z
layout: post
comments: true
title: NMAP
subtitle: 'y algunas de sus utilidades'
description: >-
image: >-
  http://imgfz.com/i/R63q8CT.jpeg
optimized_image: >-
  http://imgfz.com/i/R63q8CT.jpeg
category: ciberseguridad
tags:
  - nmap
  - linux
  - enumeración
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

Nmap ("Network Mapper") es un código abierto y gratuito que sirve para el descubrimiento de redes y auditorías de seguridad. Muchos administradores de sistemas y redes también lo encuentran útil para tareas como el inventario de la red, la gestión de los programas de actualización del servicio y la supervisión del tiempo de actividad del host o del servicio. Nmap utiliza paquetes de IP sin procesar de formas novedosas para determinar qué hosts están disponibles en la red, qué servicios (nombre y versión de la aplicación) ofrecen esos hosts, qué sistemas operativos (y versiones de SO) están ejecutando, qué tipo de filtros de paquetes / firewalls están en uso y decenas de otras características. Fue diseñado para escanear rápidamente redes grandes, pero funciona bien contra hosts únicos. Este contiene múltiples utilidades, en donde algunas de ellas son las siguientes:
>https://nmap.org/

## Escaneo general

Para enumerar los 1000 puertos más comunes y ver los puertos abiertos:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap 10.x.x.xxx -n -Pn --open -oG allPorts
```

Para enumerar los 65535 puertos de una maquina y así ver los que están abiertos, se realiza lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap 10.x.x.xxx -p- --open -v -n -Pn -oG allPorts
```

O también se podría controlar la velocidad de escaneo con el parámetro ```-T```:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap 10.x.x.xxx -p- --open -T5 -v -n -Pn -oG allPorts
```

Parámetros usados:

| Parámetro | Utilidad |
| :--------: | :-------: |
| -p- | Para indicar que escanee todos los puertos. |
| --open | Para indicar los puertos abiertos. |
| -T | Para indicar la velocidad, el cual va desde 0 hasta 5, en donde 5 es lo más rápido y ruidoso (en entorno controlado es recomendado). |
| -v | Va reportando los puertos durante el proceso. |
| -n | No aplicar resolución DNS. (Esto es para ahorrar tiempo en el escaneo) |
| -oG | Los resultados se exportan en formato grepeable al fichero allPorts. |

Maneras para agilizar nuestros escaneos en el caso de que sea lento con el método anterior, destacando que en entornos reales genera bastante ruido:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -sS --open -vvv -n -Pn -p- 10.x.x.xxx -oG allPorts
```

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -sS --min-rate 5000 --open -vvv -n -Pn -p- 10.x.x.xxx -oG allPorts
```

| Parámetro | Utilidad |
| :--------: | :-------: |
| -sS | Realiza un escaneo TCP SYN. |
| --min-rate | Indica cuantos paquetes por segundo emite durante el escaneo. |
| -vvv | Triple verbose(-v). |
| -Pn | No aplica descubrimiento de host a través del protocolo de resolución de direcciones(ARP). |

Para ver los puertos abiertos de manera cómoda se puede ocupar lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ cat allPorts | grep -oP '\d{1,5}/open'
22/open
80/open
```

## Copiar puertos

En el caso de que hubieran varios puertos abiertos y para evitar el estar copiando 1 a 1 los puertos, se puede ocupar la siguiente función:

```bash
function extractPorts(){
	ports="$(cat $1 | grep -oP '\d{1,5}/open' | awk '{print $1}' FS='/' | xargs | tr ' ' ',')"
	ip_address="$(cat $1 | grep -oP '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' | sort -u | head -n 1)"
	echo -e "\n[*] Extracting information...\n" > extractPorts.tmp
	echo -e "\t[*] IP Address: $ip_address"  >> extractPorts.tmp
	echo -e "\t[*] Open ports: $ports\n"  >> extractPorts.tmp
	echo $ports | tr -d '\n' | xclip -sel clip
	echo -e "[*] Ports copied to clipboard\n"  >> extractPorts.tmp
	cat extractPorts.tmp; rm extractPorts.tmp
}
```

```extractPorts``` se debe pegar en el siguiente directorio:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nano ~/.bashrc
```

En algunos casos debe ser en este directorio:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nano ~/.zshrc
```

Para el funcionamiento de esta función se debe instalar ```xclip``` realizando lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ sudo apt-get -y install xclip
```

```extractPorts``` se ocupa de la siguiente forma, destacando que el nmap de puertos debe ser siempre en formato ```-oG```:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ extractPorts <nombre de fichero oG>

#En nuestro caso sería

┌─[root@kali]─[/home/user/demo/nmap]
└──╼ extractPorts allPorts

[*] Extracting information...

	[*] IP Address: 10.x.x.xxx
	[*] Open ports: 22,80

[*] Ports copied to clipboard
```

## Escaneo de versiones

Ahora si queremos detectar la versión y servicio que corren en los puertos:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -sC -sV -p22,80 10.x.x.xxx -oN targeted
```

Se pueden resumir el ```-sC``` y ```-sV``` en ```-sCV```.

Parámetros usados:

| Parámetro | Utilidad |
| :--------: | :-------: |
| -sC | Es un atajo para --script default que ejecutará todos los scripts NSE en la categoría predeterminada. |
| -sV | Detecta la versión. |
| -p | Para seleccionar que puertos se quieren escanear. |
| -oN | Guarda un archivo de texto con el escaneo en targeted. |

## Escaneo de puertos UDP

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap 10.x.x.xxx -sUV -p- --open -Pn -v -n -oG allPortsUDP
```
## Escaneo de listado

Si se requiere escanear un listado como por ejemplo el siguiente:
```
# cat list.txt

192.168.10.1
192.168.10.100
192.168.10.101
```

Realizamos lo siguiente, a través de ```-iL```:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -sCV -p- --open -Pn -v -n -iL list.txt -oN listScan
```

## Ver informe HTML

Para ver un informe como el siguiente:

![html](/images/nmap-html.png)

Se debe realizar lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -sVC 10.10.10.5 -p22,80,110,139,143,445,31337 -T5 -oX Targeted
Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-21 05:02 EDT
Nmap scan report for 10.10.10.5
Host is up (0.14s latency).

PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 71:c1:89:90:7f:fd:4f:60:e0:54:f3:85:e6:35:6c:2b (RSA)
|   256 e1:8e:53:18:42:af:2a:de:c0:12:1e:2e:54:06:4f:70 (ECDSA)
|_  256 1a:cc:ac:d4:94:5c:d6:1d:71:e7:39:de:14:27:3c:3c (ED25519)
80/tcp    open  http        Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
110/tcp   open  pop3        Dovecot pop3d
|_pop3-capabilities: CAPA UIDL SASL RESP-CODES AUTH-RESP-CODE PIPELINING TOP
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp   open  imap        Dovecot imapd
|_imap-capabilities: more SASL-IR ID capabilities Pre-login OK IMAP4rev1 listed IDLE LOGIN-REFERRALS post-login LITERAL+ have LOGINDISABLEDA0001 ENABLE
445/tcp   open  netbios-ssn Samba smbd 4.3.11-Ubuntu (workgroup: WORKGROUP)
31337/tcp open  Elite?
Service Info: Host: NIX-NMAP-DEFAULT; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: mean: -38m02s, deviation: 1h09m16s, median: 1m56s
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_nbstat: NetBIOS name: NIX-NMAP-DEFAUL, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb2-security-mode: 
|   3.1.1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2022-07-21T09:07:36
|_  start_date: N/A
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.3.11-Ubuntu)
|   Computer name: nix-nmap-default
|   NetBIOS computer name: NIX-NMAP-DEFAULT\x00
|   Domain name: \x00
|   FQDN: nix-nmap-default
|_  System time: 2022-07-21T11:07:36+02:00

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 178.24 seconds


┌─[root@kali]─[/home/user/demo/nmap]
└──╼ xsltproc Targeted -o target.html
```

## Detección de banners

A veces nmap puede perder alguna información, sin embargo, si realizamos lo siguiente podemos obtener información adicional en el escaneo:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap 10.10.10.5 -p- -sV -Pn -n --disable-arp-ping --packet-trace
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-16 20:10 CEST
<SNIP>
NSOCK INFO [0.4200s] nsock_trace_handler_callback(): Callback: READ SUCCESS for EID 18 [10.10.10.5:25] (35 bytes): 220 inlane ESMTP Postfix (Ubuntu)..
Service scan match (Probe NULL matched with NULL line 3104): 10.10.10.5:25 is smtp.  Version: |Postfix smtpd|||
NSOCK INFO [0.4200s] nsock_iod_delete(): nsock_iod_delete (IOD #1)
...
```

En este caso se detecta Linux Ubuntu como distribución. Aunque también tenemos otra forma de obtener información que es por medio de ```tcpdump``` y ```netcat```.

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ tcpdump -i tun0 host 10.129.124.226           
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
23:32:46.202998 IP 10.10.14.99.51982 > 10.129.124.226.31337: Flags [S], seq 4264028568, win 64240, options [mss 1460,sackOK,TS val 3178733957 ecr 0,nop,wscale 7], length 0
23:32:46.339591 IP 10.129.124.226.31337 > 10.10.14.99.51982: Flags [S.], seq 3947683085, ack 4264028569, win 28960, options [mss 1337,sackOK,TS val 220297 ecr 3178733957,nop,wscale 7], length 0
23:32:46.339623 IP 10.10.14.99.51982 > 10.129.124.226.31337: Flags [.], ack 1, win 502, options [nop,nop,TS val 3178734094 ecr 220297], length 0
23:32:52.470973 IP 10.10.14.99.51982 > 10.129.124.226.31337: Flags [P.], seq 1:2, ack 1, win 502, options [nop,nop,TS val 3178740225 ecr 220297], length 1
23:32:52.607053 IP 10.129.124.226.31337 > 10.10.14.99.51982: Flags [.], ack 2, win 227, options [nop,nop,TS val 221864 ecr 3178740225], length 0
23:33:06.499472 IP 10.129.124.226.31337 > 10.10.14.99.51982: Flags [P.], seq 1:32, ack 2, win 227, options [nop,nop,TS val 225337 ecr 3178740225], length 31
23:33:06.499492 IP 10.10.14.99.51982 > 10.129.124.226.31337: Flags [.], ack 32, win 502, options [nop,nop,TS val 3178754254 ecr 225337], length 0
23:33:06.499863 IP 10.129.124.226.31337 > 10.10.14.99.51982: Flags [P.], seq 32:78, ack 2, win 227, options [nop,nop,TS val 225337 ecr 3178740225], length 46
23:33:06.499872 IP 10.10.14.99.51982 > 10.129.124.226.31337: Flags [.], ack 78, win 502, options [nop,nop,TS val 3178754254 ecr 225337], length 0
23:33:16.543052 IP 10.10.14.99.51982 > 10.129.124.226.31337: Flags [F.], seq 2, ack 78, win 502, options [nop,nop,TS val 3178764297 ecr 225337], length 0
23:33:16.678983 IP 10.129.124.226.31337 > 10.10.14.99.51982: Flags [F.], seq 78, ack 3, win 227, options [nop,nop,TS val 227882 ecr 3178764297], length 0
23:33:16.679034 IP 10.10.14.99.51982 > 10.129.124.226.31337: Flags [.], ack 79, win 502, options [nop,nop,TS val 3178764433 ecr 227882], length 0
```
```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nc -nv 10.129.124.226 31337
(UNKNOWN) [10.129.124.226] 31337 (?) open

220 HTB{flag}
```

## Scripts de NMAP para detección de vulnerabilidades

NMAP cuenta con una series de scripts ya definidos que si queremos ver con sus respectivas categorías se podría realizar lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ updatedb

┌─[root@kali]─[/home/user/demo/nmap]
└──╼ locate .nse | xargs grep "categories"
```

Si se quieren ver las categorias que hay de una manera ordenada:
```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ locate .nse | xargs grep "categories" | grep -oP'".*?"' | sort -u
```

Un ejemplo de como se ocupan este tipo de scripts es lo siguiente:

* Analizar vulnerabilidades:
```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -p445 10.x.x.yyy --script vuln -oN vulnScan
```

* Analizar vulnerabilidades y ejecución de scripts no intrusivos:
```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -p445 10.x.x.yyy --script "vuln and safe" -oN vulnsafeScan
```

* Analizar las versiones de TLS y los tipos de cifrado en SSL:
```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap -p443 10.x.x.yyy --script ssl-enum-ciphers -oN tlsScan
```

* Analizar directorios principales de un entorno web:
```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap --script http-enum -p80 10.x.x.yyy -oN webScan 
```

## Evasión de firewall

Para intentar evadir el firewall en un puerto que aparece como ```filtered``` o simplemente no aparece, se puede realizar lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap --mtu 8 10.x.x.yyy
```

Para escanear los 65535 puertos
```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap --mtu 8 -p- 10.x.x.yyy
```
El ```mtu``` establece la unidad máxima de transmisión y este creará paquetes con tamaño basado en el número que le daremos, el cual debe ser múltiplo de 8 (8,16, 24,32,etc), como en este caso se le asigna 8, entonces nmap creará paquetes de 8 bytes, causando una confusión en el firewall. 

Recordar que se pueden combinar las categorias como en algunos ejemplos mostrados. Y para ver el manual de NMAP realizar ```man nmap```

