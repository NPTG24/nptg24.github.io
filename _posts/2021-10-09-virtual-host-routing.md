---
date: 2021-09-10T18:51:05.000Z
layout: post
comments: true
title: Virtual Host Routing
subtitle: 'y su respuesta'
description: >-
image: >-
  http://imgfz.com/i/DP3e7hZ.png
optimized_image: >-
  http://imgfz.com/i/DP3e7hZ.png
category: ciberseguridad
tags:
  - virtual host routing
  - linux
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

Un virtual host routing es tradicionalmente un concepto del lado del servidor: un servidor que responde a las solicitudes de uno o más servidores virtuales. Para darle un poco más de contexto, un "nombre lógico" se define como un nombre de marcador de posición que se asigna a un nombre físico cuando se realiza una solicitud.

Entonces esto se podría "explotar" cuando una máquina no nos está entregando respuestas al hacer click en un dominio. El cual se puede ver haciendo ```ctrl + u``` en donde se abrirá el view-source:dirección-ip. Tras ver el código se puede apreciar el dominio en el cual no nos deja entrar. Este dominio también se puede encontrar en los diversos escaneos con nmap por ejemplo. Entonces para que nos funcione, simplemente hay que hacer lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/]
└──╼ nano /etc/hosts
```

Añade las entradas que desees al final del archivo. Por ejemplo, si detectas un servidor (como Apache o Nginx) ejecutándose y quieres que mi-sitio.web apunte a una dirección en específico, agregarías:

```/etc/hosts
10.10.0.5 mi-sitio.web
```

Y con esto la página debería responder sin problema.
