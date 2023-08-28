---
date: 2023-03-09T04:22:05.000Z
layout: post
comments: true
title: ARP Spoofing (Poisoning)
subtitle: 'Con la herramienta arpspoof'
description: >-
image: >-
    http://imgfz.com/i/nPtSm8s.png
optimized_image: >-
    http://imgfz.com/i/nPtSm8s.png
category: ciberseguridad
tags: 
  - hacking
  - redes
  - arpspoof
  - mitm
  - intermediario
  - man-in-the-middle
author: Felipe Canales Cayuqueo
paginate: true
---

ARP spoofing es una técnica utilizada para manipular el protocolo de resolución de direcciones ARP (Address Resolution Protocol) de una red. Este ataque implica enviar mensajes ARP falsificados en la red para vincular la dirección MAC del atacante con la dirección IP de otra máquina en la red, lo que permite al atacante interceptar y modificar el tráfico de red entre las máquinas.

ARP poisoning, por otro lado, es el resultado del ataque de ARP spoofing, donde un atacante ha envenenado la caché ARP de una víctima con información falsa. La caché ARP es una tabla que se utiliza para almacenar las asociaciones de direcciones MAC y direcciones IP de los dispositivos en una red. Cuando la tabla ARP de una máquina se envenena, la máquina comienza a enviar tráfico a la dirección MAC falsificada del atacante en lugar de la dirección MAC legítima del destino real.

### Protocolo de Resolución de Direcciones (ARP)

Como punto de partida debemos comprender lo siguiente:

  * Para enviar un paquete IP, un host necesita conocer la dirección MAC del siguiente salto. El siguiente salto puede ser un router, un switch, o el host de destino.

Para identificar la dirección MAC de un host en la misma red, los ordenadores utilizan el Protocolo de Resolución de Direcciones (ARP por sus siglas en inglés) enviando una solicitud de ARP broadcast. Esta solicitud se envía a todas las direcciones MAC de la red local, incluida la dirección MAC FF:FF:FF:FF:FF:FF, que es conocida como la dirección de difusión (broadcast) a nivel de capa de enlace.

[![arp1](/images/arp1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/arp1.png)

Una vez que el dispositivo objetivo recibe la solicitud de ARP broadcast, responde con su dirección MAC, que el dispositivo solicitante puede utilizar para establecer una conexión con el dispositivo objetivo.

[![arp2](/images/arp2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/arp2.png)

Al completar la resolución de la dirección MAC, los hosts guardan la dirección de destino en su tabla de caché ARP.

[![arp3](/images/arp3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/arp3.png)
### Habilitar enrutamiento de paquetes

Por defecto, un sistema Linux está configurado para no enrutar paquetes IP (IP forwarding) entre interfaces de red. Esto significa que los paquetes que llegan a una interfaz de red no se envían automáticamente a otra interfaz de red. Para habilitarlo se debe realizar con el siguiente comando:

```bash
┌─[root@kali]─[/home/user/arp]
└──╼ echo 1 > /proc/sys/net/ipv4/ip_forward
```

Al habilitar el enrutamiento de paquetes IP, se le indica al sistema que permita el tráfico de red entrante y saliente entre las interfaces de red. Esto es necesario en un ataque de ARP Spoofing o Man-in-the-Middle (MitM) ya que el atacante actúa como un intermediario entre la víctima y el gateway, y debe enrutar los paquetes de una interfaz de red a otra para que el tráfico fluya adecuadamente.


### ¿Cómo funciona el ataque?

Si un atacante encuentra la forma de manipular la caché ARP, también podrá recibir tráfico destinado a otras direcciones IP. Esto puede ocurrir porque, mientras una dirección MAC de destino esté en la tabla de caché ARP, el remitente no necesita ejecutar ARP para llegar a ese host de destianción. Si el atacante manipula las tablas ARP de las dos partes implicadas en una comunicación, podrá husmear toda la comunicación, realizando así un ataque man-in-the-middle (MitM). Esto puede hacerse enviando respuestas ARP gratuitas.

Primero el atacante de suplantación de ARP pretende ser ambos lados de un canal de comunicación de red (en la misma red que la víctima). El objetivo principal del ataque es hacer creer a la víctima que la dirección MAC del atacante es la dirección MAC del gateway, y viceversa. De esta forma, el atacante puede interceptar todo el tráfico entre la víctima y el gateway, y manipularlo a su antojo.

[![arp7](/images/arp7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/arp7.png)

El proceso de ARP Spoofing comienza con el atacante enviando paquetes ARP falsificados a la red. Estos paquetes anuncian que la dirección MAC del atacante es la dirección MAC del gateway, o de cualquier otro dispositivo en la red. Los dispositivos de la red actualizan su tabla ARP con la información proporcionada por el atacante, lo que permite al atacante interceptar y manipular el tráfico de la víctima. El atacante puede utilizar esta técnica para robar información, realizar ataques de Man-in-the-Middle (MitM) o Denegación de Servicio (DoS). En este caso, se utiliza la herramienta "arpspoof" para enviar paquetes ARP falsificados desde la interfaz de red "tap0". El parámetro "-t" especifica la dirección IP de la víctima, mientras que el parámetro "-r" especifica la dirección IP del gateway o router.

```bash
┌─[root@kali]─[/home/user/arp]
└──╼ arpspoof -i tap0 -t 192.168.16.35 -r 192.168.16.33
```

[![arp9](/images/arp9.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/arp9.png)


### Recomendación

Para protegerse contra los ataques de ARP Spoofing y ARP Poisoning, es importante implementar medidas de seguridad, como el uso de técnicas de detección y prevención de ARP Spoofing, la implementación de autenticación de protocolos de red, y el uso de soluciones de seguridad en capas. Además, se recomienda mantener el software y los sistemas actualizados, y educar a los usuarios sobre los riesgos de seguridad en la red.


