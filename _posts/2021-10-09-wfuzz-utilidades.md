---
date: 2021-09-09T00:22:05.000Z
layout: post
comments: true
title: Wfuzz
subtitle: 'y algunas de sus utilidades'
description: >-
image: >-
  http://imgfz.com/i/hdiYgWy.png
optimized_image: >-
  http://imgfz.com/i/hdiYgWy.png
category: ciberseguridad
tags:
  - wfuzz
  - linux
  - fuzzing
  - fuerzabruta
  - diccionario
  - wordlists
  - enumeración
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

Wfuzz ha sido creado para facilitar la tarea en la evaluación de aplicaciones web y se basa en un concepto simple: reemplaza cualquier referencia a la palabra clave ```FUZZ``` por el valor de una carga útil determinada.

Una carga útil en Wfuzz es una fuente de datos.

Este simple concepto permite inyectar cualquier entrada en cualquier campo de una solicitud HTTP, permitiendo realizar complejos ataques de seguridad web en diferentes componentes de la aplicación web como: parámetros, autenticación, formularios, directorios/archivos, encabezados, etc. Algunos de sus usos son los siguientes:

```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c --hc=404 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ

********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://10.10.10.112/FUZZ
Total requests: 220560

=====================================================================
ID           Response   Lines    Word       Chars       Payload                        
=====================================================================

000000007:   302        0 L      0 W        0 Ch        "# license, visit http://creati
                                                        vecommons.org/licenses/by-sa/3.
                                                        0/"                            
000000005:   302        0 L      0 W        0 Ch        "# This work is licensed under 
                                                        the Creative Commons"          
000000006:   302        0 L      0 W        0 Ch        "# Attribution-Share Alike 3.0 
                                                        License. To view a copy of this
                                                        "                              
000000004:   302        0 L      0 W        0 Ch        "#"                            
000000001:   302        0 L      0 W        0 Ch        "# directory-list-2.3-medium.tx
                                                        t"                             
000000009:   302        0 L      0 W        0 Ch        "# Suite 300, San Francisco, Ca
                                                        lifornia, 94105, USA."         
000000003:   302        0 L      0 W        0 Ch        "# Copyright 2007 James Fisher"
000000008:   302        0 L      0 W        0 Ch        "# or send a letter to Creative
                                                         Commons, 171 Second Street,"  
000000014:   302        0 L      0 W        0 Ch        "http://10.10.10.112/"       
000000002:   302        0 L      0 W        0 Ch        "#"                            
000000013:   302        0 L      0 W        0 Ch        "#"                            
000000012:   302        0 L      0 W        0 Ch        "# on atleast 2 different hosts
                                                        "                              
000000010:   302        0 L      0 W        0 Ch        "#"                            
000000090:   301        9 L      35 W       413 Ch      "docs"                         
000000011:   302        0 L      0 W        0 Ch        "# Priority ordered case sensat
                                                        ive list, where entries were fo
                                                        und"                           
000001080:   301        9 L      35 W       417 Ch      "external"                     
000001490:   301        9 L      35 W       415 Ch      "config"                       
000002808:   301        9 L      35 W       424 Ch      "about"              
000010825:   200        9 L      35 W       2385 Ch     "admin"                       
000095524:   200        52 L     308 W      2863 Ch     "server-status"                

Total time: 0
Processed Requests: 220560
Filtered Requests: 220539
Requests/sec.: 0

```

Parámetros usados:

| Parámetro | Utilidad |
| :--------: | :-------: |
| -c | Output en formato de colores. |
| --hc | Oculta el código de estado. |
| -w | Indicar el diccionario que vamos a ocupar. |

Se le puede indicar también con cuántos hilos trabajar o peticiones web simultáneas, a través de un ```-t```, al hacer esto ```Wfuzz``` trabaja de forma más rápida:

```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -t 400 --hc=404 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ
```

Para hacer un "follow-redirect" para que así se mueva hasta el código de estado final, se especifica el parámetro ```-L```. Esto se suele hacer cuando un "Ch" (carácteres) se entrega como 0:
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -L -t 400 --hc=404 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ
```

Si ahora se quiere ver un código de estado especifico, se puede hacer a través del parámetro ```--sc```:
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -t 400 --sc=200 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ
```

También se puede dar el caso de querer filtrar por carácteres(Ch), y esto se hace a través del comando ```--hh```:
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -t 400 --hh=2385 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ
```

En el caso de filtrar por "Lines", en vez de una H se reemplaza por una L e incluso recordar que se pueden combinar los tipos de filtros. Por ejemplo:
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -t 400 --hc=404 --sl=9 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ
```
 Y así sucesivamente...
 
 Si queremos agregar una wordlist con extensiones se puede realizar lo siguiente:
 
 ```bash
 Primero creamos una wordlist con las extensiones que nosotros queremos
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ nano extensions.txt
```
```extensions.txt
txt
php
html
```
Ahora lo podemos ejecutar de la siguiente forma:
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -L -t 400 --hc=404 --hh=7561 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -w extensions.txt http://10.10.10.112/FUZZ.FUZ2Z
```
 Se puede apreciar que en el final se agregó un ```.FUZ2Z```, si por ejemplo añadimos otro wordlist, pues se tendrá también que agregar en este caso con un 3 otro ```.FUZ3Z```.
 
 Para encontrar subdominios, se realiza lo siguiente:
 
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt --hc 400,404,302 -H "Host: FUZZ.forge.htb" -u http://forge.htb -t 200
```

Ahora si queremos visualizar el contenido del subdominio, realizamos lo siguiente:

 ```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ curl -s http://forge.htb -H "Host: test.forge.htb"
```

WFUZZ en Local File Inclusion(LFI):

 ```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c --hc=404 -w /usr/share/wordlists/SecLists/Fuzzing/LFI/LFI-Jhaddix.txt -u "http://10.10.10.249/admin../admin_staging/index.php?page=../../../../../../FUZZ"
```

Ataque por diccionario para obtener credenciales de una API:

```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -d '{"email":"test@forge.htb","password":"FUZZ"}' -H 'Content-Type: application/json' -z file,/usr/share/wordlists/rockyou.txt -u http://10.10.10.249/identity/api/auth/login --hc 405
```

Para abrir el manual de Wfuzz se ocupa ```man wfuzz```.
