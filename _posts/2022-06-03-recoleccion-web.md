---
date: 2022-03-06T06:00:12.000Z
layout: post
comments: true
title: Recolección de información de páginas web
subtitle: 'herramientas'
description: >-
image: >-
  http://imgfz.com/i/TNjFwpm.jpeg
optimized_image: >-
  http://imgfz.com/i/TNjFwpm.jpeg
category: ciberseguridad
tags:
  - extracción
  - enumeración
  - dnsenum
  - dns
  - dnsrecords
  - dig
  - nslookup
  - ping
  - whois
  - theharvester
  - whatweb
  - waf
  - mantra
  - traceroute
  - Hacking
author: Felipe Canales Cayuqueo
paginate: true
---
La extracción de información web es una técnica para extraer grandes cantidades de datos de sitios web en Internet.

## Extensiones recomendadas

* [Wappalyzer](https://www.wappalyzer.com/): es una extensión del navegador que descubre las tecnologías utilizadas en los sitios web. Detecta sistemas de administración de contenido, tiendas web, servidores web, marcos de JavaScript, herramientas de análisis y muchos más.
* [IP Address and Domain Information](https://dnslytics.com/browser-extensions-addons-accelerators): esta extensión muestra información detallada acerca de cada dirección IP, nombre de dominio y proveedor.
* [Shodan](https://chrome.google.com/webstore/detail/shodan/jjalcfnidlmpjhdfepjhjbhnhkbgleap): La extensión de Shodan le dice dónde está alojado el sitio web (país, ciudad), quién es el propietario de la IP y qué otros servicios/puertos están abiertos.
* [Netcraft](https://www.netcraft.com/apps/browser/): es una herramienta que permite una fácil búsqueda de información relacionada con los sitios que visita y brinda protección contra el phishing y JavaScript malicioso, incluido el ciberdelito relacionado con el coronavirus(Esta extensión da problemas con ciertos buscadores).

## Obtención IP de dominio

```bash
┌─[root@kali]─[/home/user/]
└──╼ ping <dirección web>
```

También se pueden obtener los saltos que se tienen desde nuestra IP hasta llegar a la conexión con la dirección seleccionada, por medio de ```traceroute```:

```bash
┌─[root@kali]─[/home/user/]
└──╼ traceroute <dirección web>
```
## Detección de tecnologías

```bash
┌─[root@kali]─[/home/user/]
└──╼ whatweb -v <dirección web>
```

| Parámetro | Utilidad |
| :--------: | :-------: |
| -v | Muestra la salida de forma más detallada. |

## DNS Records

| Registro DNS | Descripción |
| :--------: | :-------: |
| A | Devuelve como resultado una dirección IPv4 del dominio solicitado. |
| AAA | Devuelve una dirección IPv6 del dominio solicitado. |
| MX | Devuelve los servidores de correo responsables como resultado. |
| NS | Devuelve los servidores DNS (nameservers) del dominio. |
| TXT | 	Este registro puede contener diversa información. El "all-rounder" se puede utilizar, por ejemplo, para validar Google Search Console o validar certificados SSL. Además, las entradas SPF y DMARC están configuradas para validar el tráfico de correo y protegerlo del spam. |
| CNAME | Este registro sirve como un alias. Si el dominio www.google.com debe apuntar a la misma IP, y creamos un registro A para uno y un registro CNAME para el otro. |
| PTR | El registro PTR funciona al revés. Convierte direcciones IP en nombres de dominio válidos. |
| SOA | Proporciona información sobre la "DNS Zone" correspondiente. |


## Detección de datos de servidor whois

Whois se trata de una lista de registros de Internet ampliamente utilizada que identifica quién posee un dominio y cómo ponerse en contacto con ellos.

```bash
┌─[root@kali]─[/home/user/]
└──╼ whois <dirección web o dirección IP>

## No todas las direcciones cuentan con servidor whois
```

## Enumeración de DNS

Esto se realiza a través de un script Perl multiproceso para enumerar la información de DNS de un dominio y descubrir bloques de IP no contiguos . El objetivo principal es recopilar la mayor cantidad de información posible sobre un dominio.

```bash
┌─[root@kali]─[/home/user/]
└──╼ dnsenum <dirección web>
```

>Página recomendada: [Robtex](https://www.robtex.com/dns-lookup/)

## Consulta de registros A

```
┌──(root㉿kali)-[/home/user/]
└─# nslookup <dirección web>
```
Otra opción es por medio de ```dig```:

```
┌──(root㉿kali)-[/home/user/]
└─# dig google.com @8.8.8.8
```

### Subdominios

Para consultar registros A en subdominios, se debe realizar lo siguiente:

```
┌──(root㉿kali)-[/home/user/]
└─# nslookup -query=A <dirección web>
```
Otra opción es por medio de ```dig```:

```
┌──(root㉿kali)-[/home/user/]
└─# dig a facebook.com @1.1.1.1
```

## Consulta de registros PTR

```
┌──(root㉿kali)-[/home/user/]
└─# nslookup -query=PTR <dirección IP>
```
Otra opción es por medio de ```dig```:

```
┌──(root㉿kali)-[/home/user/]
└─# dig -x 31.13.92.36 @1.1.1.1
```

## Consulta de registros MX

```
┌──(root㉿kali)-[/home/user/]
└─# nslookup -query=MX facebook.com
```
Otra opción es por medio de ```dig```:

```
┌──(root㉿kali)-[/home/user/]
└─# dig mx facebook.com @1.1.1.1
```

## Consulta de registros TXT

```
┌──(root㉿kali)-[/home/user/]
└─# nslookup -query=TXT google.com
```
Otra opción es por medio de ```dig```:

```
┌──(root㉿kali)-[/home/user/]
└─# dig txt google.com @8.8.8.8
```

## Consulta de cualquier registro existente

```
┌──(root㉿kali)-[/home/user/]
└─# nslookup -query=ANY facebook.com
```
Otra opción es por medio de ```dig```:

```
┌──(root㉿kali)-[/home/user/]
└─# dig any google.com @8.8.8.8
```

## Obtención de correos electrónicos

Desde google una manera sencilla es realizando la siguiente búsqueda:

```
"@example.com" -example.com
```

Aunque una manera más completa de realizarlo es por medio de la herramienta ```theHarvester``` la cual recopila correos electrónicos, nombres, subdominios, IP y URL.

```bash
┌─[root@kali]─[/home/user/]
└──╼ theHarvester -d <dominio> -l 500 -b google
```

| Parámetro | Utilidad |
| :--------: | :-------: |
| -d | Se indica el dominio web. |
| -l | Indica la cantidad de búsquedas que va a realizar. |
| -b | Se selecciona el buscador. |

Con el parámetro ```-f``` se pueden guardar los resultados en un archivo .html.

## Detección de WAF

Un WAF es un firewall de aplicaciones web que ayuda a proteger las aplicaciones web filtrando y monitoreando el tráfico HTTP entre una aplicación web e Internet. Este crea una defensa contra una variedad de vectores de ataque.

```bash
┌─[root@kali]─[/home/user/]
└──╼ wafw00f <dirección web>
```

## Obtención de directorios

Para esto se recomienda leer el artículo de [Wfuzz](https://nptg24.github.io/wfuzz-utilidades/).

## Otras herramientas

* [CentralOps](https://centralops.net/): página web de información general recomendada.
* [OWASP Mantra](https://www.kali.org/tools/owasp-mantra-ff/): es un navegador especialmente diseñado para pruebas de seguridad de aplicaciones web.
