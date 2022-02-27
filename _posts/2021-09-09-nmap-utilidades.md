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

Para enumerar los 65535 puertos de una maquina y así ver los que están abiertos, se realiza lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nmap 10.x.x.xxx -p- --open -T5 -v -n -oG allPorts
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

Maneras para agilizar nuestros escaneos en el caso de que sea lento con el método anterior:

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

