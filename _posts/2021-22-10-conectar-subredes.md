---
date: 2021-10-18T18:07:05.000Z
layout: post
comments: true
title: Comunicar subredes
subtitle: 'en Packet Tracer'
description: >-
image: >-
  http://imgfz.com/i/WgNH4sB.jpeg
optimized_image: >-
  http://imgfz.com/i/WgNH4sB.jpeg
category: redes
tags:
  - IPv4
  - Cisco
  - Packettracer
author: Felipe Canales Cayuqueo
paginate: true
---
Tenemos los siguientes datos:

>Para ver tabla completa moverse con las flechas del teclado. En caso de estar en un dispositivo móvil o similar, simplemente deslize.

| Subred | Dirección IP | Dirección inicial disponible | Dirección final disponible | Dirección broadcast | Máscara |
| :--------: | :--------: | :-------: | :-------: | :-------: | :-------: |
| 1 | 192.168.16.32/27 | 192.168.16.33 | 192.168.16.62 | 192.168.16.63 | 255.255.255.224 |
| 2 | 192.168.16.64/27 | 192.168.16.65 | 192.168.16.94 | 192.168.16.95 | 255.255.255.224 |

Primero queremos comunicar las [subredes](https://nptg24.github.io/subredes/) dadas, y lo haremos conectando un router (1841) a ambos switches con un cable de cobre directo y por medio de sus respectivos "Fast Ethernet" (el switch 1 al FastEthernet0/0 y el switch 2 al FastEthernet0/1):

![1](http://imgfz.com/i/q2mIHzv.png)

Ahora configuramos cada PC con sus respectivas direcciones IPv4 de ambas subredes, en dónde la primera dirección disponible lo consideraremos como el "default gateway" o puerta de enlace.

![2](http://imgfz.com/i/XyxMDBw.png)

![3](http://imgfz.com/i/Ts5MuEv.png)

Una vez asignamos todas las direcciones de los PCs, configuramos el router a través de su ```CLI```, asignando como dirección IP sus respectivas puertas de enlace y como máscara la que corresponda a su conexión "Fast Ethernet":

```cli
Router>en
Router#configure terminal
Router(config)#configure terminal
Router(config)#interface FastEthernet0/0
Router(config-if)#ip address 192.168.16.33 255.255.255.224
Router(config-if)#no shutdown
Router(config-if)#interface FastEthernet0/1
Router(config-if)#ip address 192.168.16.65 255.255.255.224
Router(config-if)#no shutdown
```

Finalmente para comunicar ambas subredes, necesitamos realizar un ping desde las PCs de la subred 1 con cada una de las PCs de la subred 2:

![PC14](http://imgfz.com/i/bsZKydu.png)
![PC15](http://imgfz.com/i/X9vMLHG.png)
![PC16](http://imgfz.com/i/uafVcAM.png)
![PC17](http://imgfz.com/i/pBFj1lh.png)

Y así sucesivamente el PC0 deberá realizar el mismo proceso, al igual que el PC2 y el PC3 en este caso, o sea deberán realizar un ping cada una a los PCs 4,5,6 y 7. Y una vez terminado todo, ambas subredes se podrán comunicar.

![ICMP](http://imgfz.com/i/yJd4SkB.png)
