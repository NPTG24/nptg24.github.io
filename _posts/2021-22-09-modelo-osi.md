---
date: 2021-09-22T22:00:05.000Z
layout: post
comments: true
title: Modelo OSI
subtitle: 'y sus capas'
description: >-
image: >-
  http://imgfz.com/i/YPZsJpw.jpeg
optimized_image: >-
  http://imgfz.com/i/YPZsJpw.jpeg
category: redes
tags:
  - OSI
  - capas
  - TCP
  - UDP
  - redes
author: Felipe Canales Cayuqueo
paginate: true
---

El modelo de interconexión de sistemas abiertos (OSI, por sus siglas en inglés) es un modelo conceptual, creado por la Organización Internacional de Normalización (ISO), que permite que diversos sistemas de comunicación se comuniquen usando protocolos estándar. En resumidas cuentas, el modelo OSI proporciona a los diferentes sistemas informáticos un estándar para comunicarse entre sí.

El modelo OSI se puede entender como un lenguaje universal de comunicación entre sistemas de redes informáticas que consiste en dividir un sistema de comunicación en siete capas abstractas, apiladas en vertical, para definir la funcionalidad de cada uno de ellos y conseguir un estándar.

>https://www.cloudflare.com/es-es/learning/ddos/glossary/open-systems-interconnection-model-osi/

![Modelo OSI](http://imgfz.com/i/upXOSz1.jpeg)

Este está dividido por niveles los que están diseñados para realizar funciones específicas, que se relacionan tanto con el anterior como el posterior en su escala. Estos son:

## Niveles OSI orientados a red

| Capa | Función | Ejemplo |
| :--------: | :-------: | :-------: |
| 1.Física | Se encarga de los elementos físicos de la conexión, gestionando los procedimientos a nivel electrónico para que la cadena de bits de información viaje desde el transmisor al receptor sin recibir ningún tipo de alteración. | En cuanto a la transmisión tenemos cables de pares trenzados, cable coaxial, fibra óptica, etc. Una norma es la ISO 2110. |
| 2.Enlace de datos | Proporciona los medios para establecer la comunicación de los elementos físicos, ocupándose del direccionamiento físico de los datos, el acceso al medio y la detección de errores durante la transmisión. | Switch, Router(que reciba y envíe datos desde un transmisor a un receptor).  Protocolo conocido es el IEEE 802(LAN) e IEEE 802.11(WiFi). | 
| 3.Red | Identifica el enrutamiento entre las redes conectadas, haciendo que los datos puedan llegar desde el transmisor al receptor siendo capaz de realizar conmutaciones y encaminamientos necesarios para que el mensaje llegue. | Protocolo IP. |
| 4.Transporte | Este nivel se encarga de realizar el transporte de datos que se encuentran dentro del paquete de transmisión desde el origen a su destino. Esto se realiza de forma independiente al tipo de red que haya detectado el nivel inferior. La unidad de información o PDU antes vista, también le llamamos Datagrama si trabaja con el protocolo UDP orientado al envío sin conexión, o Segmento, si trabaja con el protocolo TCP orientado a la conexión. | Puertos lógicos como el 80, 443, etc. |

> TCP => Responde a las siglas Transfer Control Protocol y es el más habitual por tratarse de un protocolo de transporte ‘orientado a conexión’. Esto quiere decir que el protocolo TCP está diseñado no solo para transmitir una determinada información entre un dispositivo y otro, sino también para verificar la correcta recepción de la información transmitida entre un dispositivo y otro, o, dicho de otro modo, es un protocolo para manejar conexiones de extremo a extremo. Es el complemento ideal para el protocolo IP porque los datagramas del protocolo IP no están diseñados para establecer un sistema recíproco de verificación entre los dispositivos que intercambian la información. Da soporte a los protocolos HTTP, SMTP, SSH y FTP.

![TCP](http://imgfz.com/i/xMlIgUH.gif)

> UDP => Responde a las siglas User Diagram Protocol y funciona de manera similar al protocolo TCP, pero no es un protocolo de transporte orientado a conexión. Esto quiere decir que el protocolo UDP no verifica la recepción de los datos transmitidos entre un dispositivo y otro. Por esto, se articula en un nivel de capa inferior al protocolo TCP, con lo que el sistema de verificación de la recepción de los datos debe implementarse en las capas superiores. La principal ventaja del protocolo UDP consiste en su velocidad. Al prescindir de un sistema de verificación de ida y vuelta entre el dispositivo emisor y el dispositivo receptor, el protocolo UDP permite una velocidad de transferencia superior a la del protocolo TCP. Por esto, el protocolo UDP es el más utilizado por los servicios de transmisión de voz o vídeo en streaming, donde la velocidad de la transmisión es más importante que una posible pérdida de datos puntual.


![UDP](http://imgfz.com/i/UiSD9Im.gif)

### Diferencias

| Parámetro | TCP | UDP |
| :--------: | :-------: | :-------: |
| Seguridad. | Alta | Más baja |
| Velocidad. | Más baja | Alta |
| Método de transferencia. | Los paquetes se envían en una secuencia. | Los paquetes se envían en un flujo. |
| Deteción y corrección de errores. | Sí. | No. |
| Control de congestión. | Sí. | No. |
| Acuse de recibo. | Sí. | Solo el checksum(detectar cambios accidentales). |

> https://www.redeszone.net/tutoriales/internet/tcp-udp-caracteristicas-uso-diferencias/

## Niveles OSI orientados a aplicación

| Capa | Función | Ejemplo |
| :--------: | :-------: | :-------: |
| 5.Sesión | Controla y mantiene activo el enlace entre las máquinas que están transmitiendo información para que así se encuentre establecida la conexión hasta que finalice la transmisión.  | Mapeo de la dirección de sesión (Pasa a direcciones de transportes). |
| 6.Presentación | Se encarga de la representación de la información transmitida y que los datos sean entendibles para el usuario. | Contenido útil que nosotros queremos ver. |
| 7.Aplicación | Permite a los usuarios ejecutar acciones y comandos en sus propias aplicaciones. Permite también la comunicación entre el resto de las capas inferiores.| Enviar un email o archivos por FTP (Protocolo SMTP). |

## Ejemplo de uso
Si una persona está recibiendo una respuesta para una página web desde un servidor web, siguiendo la perspectiva del cliente el orden para decodificar la transmisión recibida es el siguiente:

```
 Se inicia con Ethernet debido a que este formatea el paquete de IP para comenzar la transmisión. Luego sigue la IP porque tiene que entregar el mejor camino para llegar al destino. Continuando con TCP que gestiona la relación entre servidor web y cliente. Finalmente, HTTP hace que interactúe el servidor web con el cliente [Ethernet -> IP -> TCP -> HTTP].  
```

## Resumen
![OSI](http://imgfz.com/i/1nWNShK.png)
