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
  - enumeración
  - ciberseguridad
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
000010825:   200        9 L      35 W       2385 Ch      "admin"                       
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

También se puede dar el caso de querer filtrar por carácteres(Ch), y esto se hace a través del comando ```--sh```:
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -t 400 --sh=2385 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ
```

En el caso de filtrar por "Lines", en vez de una H se reemplaza por una L e incluso recordar que se pueden combinar los tipos de filtros. Por ejemplo:
```bash
┌─[root@kali]─[/Documents/machines/demo/]
└──╼ wfuzz -c -t 400 --hc=404 --sl=9 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt http://10.10.10.112/FUZZ
```
 Y así sucesivamente...
 Para abrir el manual de Wfuzz```man wfuzz```.
