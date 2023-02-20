---
date: 2023-02-19T23:22:05.000Z
layout: post
comments: true
title: Cracking de contraseñas
subtitle: 'Hashcat y John'
description: >-
image: >-
    http://imgfz.com/i/9TVjux6.png
optimized_image: >-
    http://imgfz.com/i/9TVjux6.png
category: ciberseguridad
tags: 
  - hacking
  - hashcat
  - john
  - bruteforce
  - dictionary
  - diccionario
  - bruta
  - fuerza
  - mask
  - unshadow
  - passwd
  - shadow
author: Felipe Canales Cayuqueo
paginate: true
---

El cracking de contraseñas es el proceso de recuperación de contraseñas en texto claro a partir de su hash. Se trata básicamente de un proceso de adivinación; el atacante intenta adivinar la contraseña, le aplica el hash y luego compara el resultado con el archivo de contraseñas.

Como puedes imaginar, intentar descifrar manualmente una contraseña es más que impracticable. Para automatizar este tipo de procesos, existen dos estrategias principales:

* Ataques de fuerza bruta
* Ataques de diccionario

### John the Ripper

Es una herramienta de descifrado de contraseñas escrita para sistemas operativos basados en Unix. Puede realizar ataques de fuerza bruta y basados en diccionario contra una base de datos de contraseñas. La herramienta es extremadamente rápida gracias al elevado uso de la paralelización. También puede utilizar muchas estrategias de descifrado diferentes durante un ataque de fuerza bruta, y puedes especificar diferentes conjuntos de caracteres de contraseñas, como solo letras o solo números. Para comprobar la cantidad de formatos de cifrado que tiene disponibles, se debe realizar lo siguiente:

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ john --list=formats
```

### Hashcat (Windows)

Es una herramienta de cracking de contraseñas basada en GPU, lo que significa que utiliza la potencia de procesamiento de la tarjeta gráfica de un ordenador para probar una gran cantidad de contraseñas en poco tiempo. Es un programa diseñado específicamente para realizar ataques de fuerza bruta y diccionario, con el objetivo de descifrar contraseñas encriptadas.

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ hashcat.exe -h
```

#### Fuerza Bruta

Un ataque por fuerza bruta es una técnica utilizada por los hackers para intentar descifrar contraseñas o claves de acceso mediante la prueba de todas las combinaciones posibles de caracteres hasta encontrar la correcta. Este tipo de ataque se realiza de forma repetitiva y sistemática, lo que puede llevar mucho tiempo, especialmente si la contraseña es larga y compleja. La principal desventaja de este tipo de ataque es que es muy lento, ya que se trata de un proceso que implica realizar una gran cantidad de intentos antes de tener éxito. Además, si la contraseña es suficientemente larga y compleja, el proceso de descifrarla puede tomar días, semanas o incluso meses.

Por ejemplo si tuvieramos acceso a los archivos ```/etc/passwd``` y ```/etc/shadow```, que contienen información sobre las cuentas de usuario y los hashes de las contraseñas respectivamente, podriamos realizar lo siguiente para realizar el proceso de cracking:

Primero debemos tener en el mismo archivo el hash de username y el de password. Esto se consigue con la herramienta unshadow de la siguiente forma:

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ unshadow /etc/passwd /etc/shadow > crackme
```

Normalmente, un archivo de contraseñas contiene contraseñas de varios usuarios. Si sólo te interesa descifrar algunas de ellas, puedes utilizar la opción ```-users```. Y para finalmente realizar un ataque de fuerza bruta puro, tienes que utilizar la siguiente sintaxis:

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ john -incremental -users:<lista de usuarios> <archivo para crackear>
```

Para forzar la contraseña del usuario ```test```, hay que realizar lo siguiente y obtendermos la contraseña en texto claro:

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ john -incremental -users:test crackme
```

Para ver o recuperar la contraseña extraída, debemos realizar lo siguiente:

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ john --show crackme
```

En el caso de ```hashcat``` (para windows), hacemos lo siguiente:

```cmd
C:\Users\cracking>type hashcat.potfile 
```

#### Fuerza Bruta (mask attack)

Un ataque de máscara siempre es específico para una longitud de contraseña. Por ejemplo, si usamos la máscara “?l?l?l?l?l?l?l?l” solo podemos descifrar una contraseña de longitud 8. Pero si la contraseña que intentamos descifrar tiene una longitud de 7, no lo encontrara Es por eso que tenemos que repetir el ataque varias veces, cada vez con un marcador de posición agregado a la máscara. Esto se automatiza de forma transparente mediante el uso de la bandera "--increment".

```cmd
C:\Users\cracking>hashcat.exe -m 0 -a 3 <archivo para crackear> ?l?l?l?l?l?l?l?l?a
```

#### Diccionario

Los ataques de diccionario son más rápidos que los ataques de fuerza bruta pura porque incluso un diccionario grande, en orden de magnitud, es menor que el número de posibles contraseñas válidas para una cuenta.

Para este ataque, realizamos lo siguiente:

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ john --wordlist=<diccionario> <archivo para crackear> 
```

En el caso de ```hashcat``` (para windows), hacemos lo siguiente:

```cmd
C:\Users\cracking>hashcat.exe -m 0 -a 0 -D2 <archivo para crackear> <diccionario>
```

Parámetros usados:

| parámetro | Descripción |
| :--------: | :-------: |
| -m | Se utiliza para especificar el tipo de hash que se va a atacar. El valor ```0``` se utiliza para indicar que se está atacando un hash de tipo MD5. Otros valores comunes son 100 para hashes de tipo SHA1, ```1400``` para hashes de tipo SHA256, y ```1800``` para hashes de tipo bcrypt. |
| -a | Se utiliza para especificar el modo de ataque a utilizar. El valor ```0``` se utiliza para especificar el modo de ataque por diccionario, que es el método en el que se prueba una lista de posibles contraseñas hasta encontrar una que coincida con el hash objetivo. |
| -D | Se utiliza para especificar el tipo de dispositivo a utilizar. El valor ```2``` se utiliza para indicar que se está utilizando una GPU de nivel avanzado. Otros valores comunes son ```1``` para una GPU de nivel básico y ```3``` para una CPU. |


También puede aplicar algunas modificaciones utilizando el parámetro ```-rules``` (por ejemplo que pruebe con mayúsculas y minúsculas):

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ john --wordlist=<diccionario> -rules <archivo para crackear> 
```

En el caso de ```hashcat``` (para windows), hacemos lo siguiente:

```cmd
C:\Users\cracking>hashcat.exe -m 0 -a 0 -D2 <archivo para crackear> <diccionario> -r rules\custom.rule
```

En donde ```custom.rule```, es un archivo previamente creado con letras, símbolos, números, entre otros.

Si queremos seleccionar ciertos usuarios, podemos incorporar el parámetro ```-users```:

```bash
┌─[root@kali]─[/home/user/cracking]
└──╼ john --wordlist=miDiccionario -users=test,test2 crackme 
```

La seguridad de una contraseña depende en gran medida de su complejidad y longitud. Cuanto más larga y compleja sea la contraseña, más difícil será para un atacante descifrarla mediante técnicas de cracking.

Sin embargo, incluso las contraseñas fuertes pueden ser vulnerables si se utilizan técnicas de ataque adecuadas, como el uso de diccionarios y la ingeniería social para adivinar contraseñas basadas en información personal del usuario. 
