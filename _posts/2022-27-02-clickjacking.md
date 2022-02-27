---
date: 2022-02-27T17:23:12.000Z
layout: post
comments: true
title: Clickjacking
subtitle: 'comprobar vulnerabilidad'
description: >-
image: >-
  http://imgfz.com/i/YeTFDBR.png
optimized_image: >-
  http://imgfz.com/i/YeTFDBR.png
category: ciberseguridad
tags:
  - jack
  - vulnerabilidad
  - http
  - exploit
  - ataque
  - Hacking
author: Felipe Canales Cayuqueo
paginate: true
---
Es un ataque basado en la interfaz, el cual utilizar múltiples capas transparentes u opacas para engañar a un usuario para que haga clic en un botón o enlace en otra página, básicamente el atacante estará "secuestrando" clics destinados a la página real y enrutándolos a otra página, muy probablemente propiedad de otra aplicación, dominio o ambos.

Esta vulnerabilidad se puede comprobar a través de la herramienta [Jack](https://github.com/sensepost/jack), la cual se inicia a través de un index.html del repositorio.

![carpeta](http://imgfz.com/i/8H4LWGA.png)

Ahora se abre el index.html en nuestro navegador favorito:

![openfile](http://imgfz.com/i/WQp3rhi.png)

Como se aprecia se podrán arrastrar aquellos que dicen "Drag me", es simplemente para comprobar de mejor forma el clickjacking. Ahora para comprobar si una página es vulnerable o no debemos ingresar el link en URL.

![novuln](http://imgfz.com/i/Kh3QFjL.png)

Si no aparece nada en pantalla como es este caso significa que no es vulnerable a clickjacking. Ahora si es vulnerable pasará lo siguiente:

![vuln](http://imgfz.com/i/gl9YntT.png)

La página cargará y se mostrará en pantalla. Para evitar este tipo de ataques, en el sitio vulnerable se debe incluir un encabezado HTTP x-frame-options que evite que el contenido de su sitio se cargue en un marco (etiqueta) o iframe (etiqueta). Además de validar que el sitio se encuentre protegido ante soluciones "Web Application Firewall" (WAF)
