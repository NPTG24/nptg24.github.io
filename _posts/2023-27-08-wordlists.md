---
date: 2023-08-27T04:15:05.000Z
layout: post
comments: true
title: Creación de diccionarios
subtitle: 'Con las herramientas CeWL y Crunch'
description: >-
image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/wordlistimage.png
optimized_image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/wordlistimage.png
category: ciberseguridad
tags: 
  - hacking
  - cewl
  - crunch
author: Felipe Canales Cayuqueo
paginate: true
---


### CEWL

CeWL (Custom Word List Generator) es una herramienta desarrollada en Ruby que se especializa en explorar una URL específica hasta un nivel de profundidad definido. Su objetivo es recopilar una lista de palabras únicas que pueden ser empleadas posteriormente en herramientas de cracking de contraseñas, como John the Ripper.

Adicionalmente, CeWL tiene la capacidad de identificar direcciones de correo electrónico presentes en los enlaces de correo del sitio web analizado. Estas direcciones pueden ser útiles como nombres de usuario cuando se realizan ataques de fuerza bruta.

#### Ejemplos de uso

Para rastrear palabras de una URL y guardarlas en un archivo debemos realizar lo siguiente:

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl http://10.1.1.15/index.php -w dict.txt               
CeWL 6.1 (Max Length) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
```

Como se puede apreciar en este caso nos quedarían las siguientes palabras.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cat dict.txt 
Damn
Vulnerable
Web
DVWA
App
Login
Username
Password
Application
RandomStorm
OpenSource
project
end
align
div

```

Ahora para generar un contraseña con una longitud de al menos 7 caracteres ocuparemos el parámetro ```-m```.


```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl http://10.1.1.15/index.php -m 7 -w dict.txt 
CeWL 6.1 (Max Length) Robin Wood (robin@digi.ninja) (https://digi.ninja/)

```

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cat dict.txt                                     
Vulnerable
Username
Password
Application
RandomStorm
OpenSource
project

```

Para contar el número de palabras repetidas en el diccionario de un sitio web usaremos la opción ```-c```.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl http://10.1.1.15/index.php -c   
CeWL 6.1 (Max Length) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
Damn, 2
Vulnerable, 2
Web, 2
DVWA, 2
App, 1
Login, 1
Username, 1
Password, 1
Application, 1
RandomStorm, 1
OpenSource, 1
project, 1
end, 1
align, 1
div, 1

```

Si deseamos aumentar la profundidad de rastreo (predeterminado es 2) del rastreador para generar archivos de diccionario más grandes, podemos usar el parámetro ```-d```.


```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl http://10.1.1.15/index.php -d 3
```

Para generar diccionarios que contengan números y caracteres:


```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl http://10.1.1.15/index.php --with-numbers
```

Para opciones de autenticación tenemos lo siguientes parámetros:

* --auth_type Digest: Este parámetro indica que se debe usar el tipo de autenticación HTTP Digest para acceder a la página. Digest es un método de autenticación que es más seguro que el método Basic porque cifra las credenciales.

* --auth_user admin: Este es el nombre de usuario que se utilizará para la autenticación. En este caso, es admin.

* --auth_pass password: Esta es la contraseña que se utilizará para la autenticación. En este caso, es password.

* -v: Este es un indicador para el modo "verbose", que proporcionará detalles adicionales durante la ejecución de CeWL. En esta parte se indica que la página web devolvió un código de respuesta HTTP 200, que generalmente significa que la página se cargó con éxito.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl http://10.1.1.15/login.php --auth_type Digest --auth_user admin --auth_pass password -v
CeWL 6.1 (Max Length) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
Starting at http://10.1.1.15/login.php
Visiting: http://10.1.1.15/login.php, got response code 200
```

Si el sitio web que se desea analizar con CeWL está detrás de un servidor proxy, el comando estándar de CeWL no podrá acceder al sitio para extraer palabras y generar la lista. En estas circunstancias, es necesario emplear la opción --proxy, seguida de la dirección del servidor proxy, para que CeWL pueda navegar correctamente hasta el sitio web objetivo.

Al hacer esto, CeWL redirige sus solicitudes a través del servidor proxy especificado, lo que le permite acceder al sitio web de destino y realizar su tarea de recopilación de palabras. Este ajuste es esencial para asegurar que la herramienta funcione como se espera en entornos que requieren el uso de un servidor proxy.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl --proxy_host 10.1.1.14 --proxy_port 4646 -w dict.txt http://10.1.1.14/wordpress/

```

Para encontrar direcciones de correo elctrónico podemos usar la opción ```-e``` para habilitar el parámetro del correo electrónico y usar la opción ```-n``` para ocultar el diccionario de contraseñas generado por la herramienta durante el proceso de rastreo: 

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cewl https://10.1.1.14/ -n -e
```

### Crunch

Crunch es un generador de listas de palabras donde puede especificar un juego de caracteres estándar o un juego de caracteres que usted especifique. crunch puede generar todas las combinaciones y permutaciones posibles según criterios dados. Los datos que procesan los resultados se pueden mostrar en la pantalla, guardarse en un archivo o canalizarse a otro programa.

#### Ejemplos de uso

El siguiente comando genera todas las combinaciones posibles de números de longitud 1 a 2 utilizando los dígitos del 0 al 9 y los guarda en un archivo con datos como por ejemplos ```0```, ```76```, ```99```, entre otros. 

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ crunch 1 2 0123456789 -o numeros09.txt
```

Para el caso de letras, se generará una lista con combinaciones de caracteres del conjunto abc y longitudes que varían desde 2 hasta 5 caracteres, es decir ```aa```, ```ccccc```, entre otros.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ crunch 2 5 abc -o abc.txt
```

Si se quiere limitar la cantidad de palabras de la lista, realizamos lo siguiente:

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ crunch 5 5 testing -c 24 -o limit.txt
```

Esta lista por lo tanto tendrá solo 24 líneas generadas:

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cat limit.txt 
gggst
gggse
gggss
gggsi
gggsn
gggsg
gggit
gggie
gggis
gggii
gggin
gggig
gggnt
gggne
gggns
gggni
gggnn
gggng
ggggt
gggge
ggggs
ggggi
ggggn
ggggg
```

En el siguiente caso, se generarán palabras de exactamente 10 caracteres de longitud, en donde el patrón que Crunch utilizará para generar la lista de palabras cada carácter especial (^, %, @, ,) se sustituirá por un tipo específico de caracteres:

* % se reemplaza por un número (del 0 al 9).
* @ se reemplaza por una letra en minúscula (de 'a' a 'z').
* , se reemplaza por una letra en mayúscula (de 'A' a 'Z').
* ^ se reemplaza por un carácter especial (como '!', '@', '#', etc.).

Entonces, cada palabra generada seguirá el patrón "test", seguido por un número, una letra en minúscula, una letra en mayúscula y un carácter especial. Por ejemplo, algunas de las palabras que podrían generarse incluyen ```test!2oK```, ```test!2oL```, ```test!2oM```, entre otras.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ crunch 8 8 -t test^%@, -o test.txt
```

Si necesitamos ingresar un patrón con algún carácter especial, podemos con el parámetro ```-l``` especificar la estructura de la longitud y el carácter de las palabras generadas. Es decir, si la estructura es ```a@aaaaa``` mantendremos el formato ingresado quedando palabras como ```p@ssA3*```, ```p@ssK7```-, ```p@ssZ9/```, entre otras:

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ crunch 7 7 -o prueba.txt -t p@ss,%^ -l a@aaaaa
```

A continuación se indica que Crunch debe generar permutaciones de las palabras proporcionadas en lugar de seguir las reglas de longitud mínima y máxima.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ crunch 0 0 -o perm.txt -p test prueba auto
Crunch will now generate approximately the following amount of data: 90 bytes
0 MB
0 GB
0 TB
0 PB
Crunch will now generate the following number of lines: 6 
```

Debido a ```-p```, crunch ignora los valores de tamaño mínimo y máximo y mostrará todas las permutaciones posibles.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ cat perm.txt                          
autopruebatest
autotestprueba
pruebaautotest
pruebatestauto
testautoprueba
testpruebaauto
```

Por último ocuparemos los siguientes parámetros:

* -d 1@ -d 2%: Estos argumentos limitan la cantidad de veces que un carácter específico puede aparecer en una palabra generada. En este caso, el carácter @ (que representa letras minúsculas) puede aparecer como máximo 1 vez, y el carácter % (que representa números) puede aparecer como máximo 2 veces.

* -b 1mb: Este argumento especifica que el tamaño máximo de cada archivo de salida será de 1 megabytes.

```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ ls -l
total 145676
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'ab!001-af+299.txt'
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'af+300-aj"599.txt'
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'aj"600-ao$899.txt'
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'ao$900-as[199.txt'
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'as[200-aw,499.txt'
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'aw,500-bc*799.txt'
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'bc*800-bg|099.txt'
-rw-r--r-- 1 root root 999999 Aug 27 03:38 'bg|100-bk 399.txt'
....
```

* -o START: Este argumento indica que el primer archivo de salida se llamará START (como START.txt), y si se generan más archivos debido a la restricción de tamaño, se seguirán numerando en orden (por ejemplo, START-1.txt, START-2.txt, etc.).


```bash
┌─[root@kali]─[/home/user/wordlists]
└──╼ crunch 6 6 -t @@^%%% -d 1@ -d 2% -b 1mb -o START
```

Estos darían salidas como:

* xk/273
* zw^433
* af+300
* ws~998

Recordar que:

* @@: Representa dos letras minúsculas, pero debido a la restricción -d 1@, no más de 1 de estas letras puede ser igual, es decir como se vio anteriormente en el ls -l, ninguna letra se repitió.
* %%%: Representa tres números, pero debido a la restricción -d 2%, no más de 2 de estos números pueden ser iguales. Por ejemplo se saltaría el número 888 y quedaría ```ws~887, ws~889```.
