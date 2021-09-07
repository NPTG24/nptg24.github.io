---
date: 2021-09-07T00:22:05.000Z
layout: post
comments: true
title: Permisos en Linux
subtitle: 'y sus identificadores'
description: >-
image: >-
  http://imgfz.com/i/0RPpWCa.png
optimized_image: >-
  http://imgfz.com/i/0RPpWCa.png
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
Si comenzamos realizando un 	```$ls -l /ruta``` obtendremos algo como la imagen de arriba. La pregunta es que significa las letras de la izquierda, si observamos primero detectaremos que se muestra un primer carácter, el cual representa el tipo de archivo:

| Letra | Tipo de archivo |
| :--------: | :-------: |
| - | Archivo común |
| d | Directorio |
| b | Bloques especiales (bin) |
| c | Carácteres especiales |
| l | Enlace (link) |

Las siguientes letras que se aprecian son las que asignan los permisos y se agrupan en grupos de 3:

| Propietario(User)[u] | Grupos[g] | Otros usuarios[o] |
| :--------: | :-------: | :--------: |
| rwx | rwx | rwx |

La pregunta aquí es ¿qué es r, w y x?, esto se responde con la siguiente tabla:

| Letra | Tipo de permiso |
| :--------: | :-------: |
| - | Sin permiso |
| r | Lectura(read) |
| w | Escritura(write) |
| x | Ejecución(execution) |

En el caso de los último dos se pueden entender mejor de la siguiente forma:

| Letra | Archivos | Directorios |
| :--------: | :-------: | :--------: |
| w | Adquieren permisos para modificarlos | Adquieren permisos para crear archivos en estos |
| x | En el caso de ser un fichero puede ejecutarlo | Puede ingresar a estos por ejemplo con un ```$cd ruta``` |

Todo esto se puede expresar en formato decimal, aplicando conversión a binario, o sea si contiene un carácter(rwx) es igual a 1 y si no tiene nada(-) es un 0 por ejemplo:

| Ejemplo | conversión a binario |
| :--------: | :-------: |
| rwx r-x r-- | 111 101 100 |
| rwx r-x r-x | 111 101 101 |
| r-x r-- r-- | 101 100 100 |
| rwx rwx rwx | 111 111 111 |

Bien ahora es bueno recordar la conversión de binario a decimal:

| 2<sup>7</sup> | 2<sup>6</sup> | 2<sup>5</sup> | 2<sup>4</sup> | 2<sup>3</sup> | 2<sup>2</sup> | 2<sup>1</sup> | 2<sup>0</sup> |
| :--------: | :-------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: |
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

Si es 1 se cuenta, en cambio si es un 0 se pasa al siguiente...

Ejemplo:

> Si tenemos el binario  101 esto se leerá de derecha a izquierda, entonces:

| 1 | 0 | 1 |
| :--------: | :-------: | :-------: |
| 2<sup>2</sup> | 2<sup>1</sup> | 2<sup>0</sup> |
| 4 * 1 | 2 * 0 | 1 * 1 |

> Ahora se suman los resultados multiplicados por el binario:

| Resultado final............|
| :--------: |
| 4 + 0 + 1 |
| 5 |

Ahora que sabemos como transformar de binario a decimal podemos transformar los ejemplos de los casos rwx, pero en esta ocasión será respetando sus respectivos grupos:

| Ejemplo | conversión a binario | decimal propietario | decimal grupo | decimal otros | resultado |
| :--------: | :-------: | :-------: | :-------: | :-------: | :-------: |
| rwx r-x r-- | 111 101 100 | 7 | 5 | 4 | 754 |
| rwx r-x r-x | 111 101 101 | 7 | 5 | 5 | 755 |
| r-x r-- r-- | 101 100 100 | 5 | 4 | 4 | 544 |
| rwx rwx rwx | 111 111 111 | 7 | 7 | 7 | 777 |

Podemos concluir de la tabla que los valores siempre serán los mismos:
```
 r = 4
 w = 2
 x = 1
```

y para que sirve esto...Pues sirve para asignar de una manera más cómoda a través de ```chmod``` el cual es un comando en Linux para asignar permisos. Ejemplo:
```user
Si queremos convertir el siguiente permiso al directorio:

[drwxr--r--]

user> chmod 755 directorio
Daría como permisos al directorio [drwxr-xr-x]

O si nos complica hacer esto también podemos hacerlo ocupando las letras:

user> chmod g+x,o+x
Daría como permisos al directorio exactamente lo mismo [drwxr-xr-x]
```

También tenemos otra serie de privilegios especiales como por ejemplo, el caso de ```chattr``` que nos permite controlar permisos avanzados:
```user
user> chattr +i -V apuntes.txt
---
Flags of apuntes.txt set as ----i---------------
```
Esto se vería solo con ```$lsattr apuntes.txt```. Pues este privilegio nos hace proteger el recurso, hasta el punto de que ni siquiera el usuario root pueda eliminarlo.
