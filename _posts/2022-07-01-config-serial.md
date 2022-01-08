---
date: 2022-01-07T21:21:05.000Z
layout: post
comments: true
title: Configuración de interfaz serial
subtitle: 'packet tracer'
description: >-
image: >-
  http://imgfz.com/i/2U0WLZp.png
optimized_image: >-
  http://imgfz.com/i/2U0WLZp.png
category: redes
tags:
  - IPv4
  - Serial
  - PacketTracer
  - Cisco
  - Clockrate
author: Felipe Canales Cayuqueo
paginate: true
---

Para la configuración de un interfaz del router como DCE, hay que configurar el reloj que se encargue de la sincronización entre los dos dispositivos. Para ello se utilizará el comando: 

```
router(config-if)#clock rate <ratio>
```

El comando clock activa la sincronización y fija la velocidad. Las velocidades de sincronización disponibles (en bits por segundo) son:

* 1200
* 2400
* 9600
* 38400
* 56000
* 64000
* 72000
* 125000
* 148000
* 500000
* 800000
* 1000000
* 1300000
* 2000000
* 4000000

Ahora la configuración sería de la siguiente forma:

```
router>en
router#configure terminal
router(config)#interface Serial 0/0/0
router(config-if)#ip address 172.16.4.1 255.255.255.0
router(config-if)#clock rate 2000000
router(config-if)#no shutdown

router(config)#interface Serial 0/0/1
router(config-if)#ip address 172.16.5.1 255.255.255.0
router(config-if)#clock rate 128000
router(config-if)#no shutdown
```

Hay que destacar que dependiendo de las características de las interfaces serial es posible que algunas de estas velocidades no estén disponibles.

