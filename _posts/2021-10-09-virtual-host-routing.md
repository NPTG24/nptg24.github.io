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
  - ciberseguridad
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

Un virtual host routing es tradicionalmente un concepto del lado del servidor: un servidor que responde a las solicitudes de uno o más servidores virtuales. Para darle un poco más de contexto, un "nombre lógico" se define como un nombre de marcador de posición que se asigna a un nombre físico cuando se realiza una solicitud.

Entonces esto se podría explotar cuando una máquina no nos está entregando respuestas al hacer click en un link. El cual se puede ver haciendo ```ctrl + u``` en donde se abrirá el view-source:dirección-ip. Tras ver el código se puede apreciar el link el cual no nos deja entrar. Entonces para que nos funcione, simplemente hay que hacer lo siguiente:

```bash
┌─[root@kali]─[/home/user/demo/nmap]
└──╼ nano /etc/hosts
```

```/etc/hosts
<dirección-ip> link
```

Y con esto la página debería responder sin problema.
