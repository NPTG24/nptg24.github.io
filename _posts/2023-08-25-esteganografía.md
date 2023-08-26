---
date: 2023-08-25T21:15:05.000Z
layout: post
comments: true
title: Esteganografía
subtitle: 'Uso de algunas herramientas'
description: >-
image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/Stegnographyimage.jpg
optimized_image: >-
    https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/Stegnographyimage.jpg
category: ciberseguridad
tags: 
  - hacking
  - snow
  - steghide
  - exiftool
  - strings
  - MD5
  - hashid
  - john
  - hashcat
  - base64
author: Felipe Canales Cayuqueo
paginate: true
---

La esteganografía es la ciencia de ocultar un mensaje dentro de otro de manera que sólo el destinatario deseado pueda detectar y recuperar el mensaje oculto. A diferencia de la criptografía, que se centra en hacer que un mensaje sea ininteligible a menos que se disponga de una clave para descifrarlo, la esteganografía trata de ocultar el hecho mismo de que se está enviando un mensaje.

### Snow

Es una herramienta de esteganografía que se utiliza para ocultar mensajes en archivos de texto mediante el uso de espacios en blanco al final de las líneas. 

La idea básica detrás de Snow es que los espacios en blanco al final de las líneas en un documento de texto suelen pasar desapercibidos para la mayoría de los lectores y editores de texto. Snow aprovecha este hecho para ocultar información en esos espacios en blanco. El mensaje se codifica como una serie de espacios y tabulaciones al final de las líneas en el archivo de texto "portador". A un observador casual, el archivo de texto parecerá normal y no levantará sospechas. Sin embargo, alguien que sepa que se está utilizando Snow y tenga la clave adecuada podría extraer el mensaje oculto. Por ejemplo tenemos el siguiente archivo de texto.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ cat readme.txt 
Esto es una prueba           
```

A continuación comprimiremos el mensaje con la contraseña "agua" y generaremos un nuevo archivo llamado readme2.txt.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ ./snow -C -m "Mi credencial de acceso es 1345ad344" -p "agua" readme.txt readme2.txt
Compressed by 33.33%
Message exceeded available space by approximately 814.29%.
An extra 6 lines were added.           
```

Como se puede apreciar en este caso es muy evidente que hay algo oculto dado que es con fines de prueba.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ cat readme2.txt 
Esto es una prueba	  	       	 	   	       	       	 
    	  	      	     		      	   	   	      	    
	     	   	 	 	       	      	     	     	 
	     	      	     		 	      	    	    	   
 		       	 	   	       	       	   	    	   
   	  	       	  	  	       	     	   		       
       	       		 	     	 		
                                                                            
```

Ahora para descomprimir el archivo y ver el mensaje oculto realizamos lo siguiente:

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ ./snow -C -p "agua" readme2.txt                                                     
Mi credencial de acceso es 1345ad344     
```

### Imágenes

Steghide es una herramienta de esteganografía especializada en la ocultación de datos dentro de diversos formatos de archivos de imagen y audio, tales como JPEG, BMP, WAV y AU. Además de incrustar información de manera segura, el programa también ofrece funcionalidades para extraer datos previamente ocultos y cifrados de estos tipos de archivos.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ apt install steghide     
```

Con el siguiente comando podremos incrustar el contenido del archivo de texto "hackerman.txt" dentro de la imagen "hackerman.jpg". 

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ steghide embed -cf hackerman.jpg -ef hackerman.txt
```

[![hackerman](/images/hackerman.jpg){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/master/images/hackerman.jpg)

> Además se le debe agregar o no una contraseña.

Por medio del siguiente comando steghide buscará y extraerá el mensaje o los datos ocultos de la imagen y los guardará en un archivo, cuyo nombre generalmente será el que se especificó originalmente durante el proceso de incrustación. Sin embargo en este caso no será posible pues no contamos con una contraseña.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ steghide extract -sf hackerman.jpg 
Enter passphrase: 
steghide: could not extract any data with that passphrase!    

```

El comando "info" no extraerá los datos ocultos, sino que ofrecerá detalles como el tipo de algoritmo de cifrado utilizado, el tamaño del mensaje oculto, y otros atributos relacionados con la esteganografía.


```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ steghide info hackerman.jpg
"hackerman.jpg":
  format: jpeg
  capacity: 5.8 KB
Try to get information about embedded data ? (y/n) y
Enter passphrase: 
steghide: could not extract any data with that passphrase!     
```

ExifTool es un programa de línea de comandos que permite leer, escribir y editar metadatos en una amplia variedad de archivos, incluyendo imágenes, audios y vídeos. Estos pueden incluir información como la fecha de creación del archivo, las dimensiones de la imagen, el modelo de la cámara que tomó la fotografía, configuraciones de exposición, y muchos otros detalles técnicos y descriptivos. También puede mostrar información sobre si la imagen ha sido modificada y en qué software.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ ./exiftool hackerman.jpg 
ExifTool Version Number         : 12.65
File Name                       : hackerman.jpg
Directory                       : ..
File Size                       : 122 kB
File Modification Date/Time     : 2017:07:26 02:52:10-04:00
File Access Date/Time           : 2023:08:25 04:35:41-04:00
File Inode Change Date/Time     : 2023:08:25 04:35:17-04:00
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Image Width                     : 960
Image Height                    : 540
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:4:4 (1 1)
Image Size                      : 960x540
Megapixels                      : 0.518     

```

La utilidad strings es útil para encontrar información legible incrustada en archivos binarios. En el contexto de un archivo de imagen como hackerman.jpg, este comando podría revelar metadatos, información sobre el software que creó o modificó la imagen, u otras cadenas de texto que puedan estar incrustadas en el archivo.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ strings hackerman.jpg > hackermanstrings.txt
```

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ cat hackermanstrings.txt
..........
tS|M
cs3P
eCdt
]?IV
P;qIR.
~'xj)0D
ccnO
ZB63
q]Q9$
;9>!h!
64Ut(
Icpw
#LF"
i2~\
(y3q
dcfkX
ovju
:{VN
T60.
+7sfh
n?ZH
g?6:
R`S_/
J7$&
jo+b
'r]+
,g52
o3n=
2<co;
5634275d694f8665957746c9619132f0
```

Como se puede apreciar al final encontramos una cadena interesante que podemos analizar, por lo que la guardamos en un archivo.


```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ echo -n "5634275d694f8665957746c9619132f0" > hash.txt      
```

Primero evaluamos si podemos ver de que tipo de hash estamos tratando con la herramienta hashid.


```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ hashid hash.txt                        
--File 'hash.txt'--
Analyzing '5634275d694f8665957746c9619132f0'
[+] MD2 
[+] MD5 
[+] MD4 
[+] Double MD5 
[+] LM 
[+] RIPEMD-128 
[+] Haval-128 
[+] Tiger-128 
[+] Skein-256(128) 
[+] Skein-512(128) 
[+] Lotus Notes/Domino 5 
[+] Skype 
[+] Snefru-128 
[+] NTLM 
[+] Domain Cached Credentials 
[+] Domain Cached Credentials 2 
[+] DNSSEC(NSEC3) 
[+] RAdmin v2.x 
--End of file 'hash.txt'--       
```

Con la información obtenida intentaremos probar con el formato MD5 descifrar el contenido. Probamos con las herramientas ```john``` y ```hashcat``` y ambas nos entregan los mismos resultados.


```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ john --wordlist=/usr/share/wordlists/rockyou.txt --format=Raw-MD5 hash.txt
Using default input encoding: UTF-8
Loaded 1 password hash (Raw-MD5 [MD5 256/256 AVX2 8x3])
Warning: no OpenMP support for this hash type, consider --fork=4
Press 'q' or Ctrl-C to abort, almost any other key for status
almost           (?)     
1g 0:00:00:00 DONE (2023-08-25 05:28) 11.11g/s 128000p/s 128000c/s 128000C/s camaleon..snuffy
Use the "--show --format=Raw-MD5" options to display all of the cracked passwords reliably
Session completed.      

```

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt 
hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 3.1+debian  Linux, None+Asserts, RELOC, SPIR, LLVM 15.0.6, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]
==================================================================================================================================================
* Device #1: pthread-sandybridge-Intel(R) Core(TM) i5-9400F CPU @ 2.90GHz, 6940/13944 MB (2048 MB allocatable), 4MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Early-Skip
* Not-Salted
* Not-Iterated
* Single-Hash
* Single-Salt
* Raw-Hash

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 1 MB

Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344392
* Bytes.....: 139921507
* Keyspace..: 14344385
* Runtime...: 2 secs

5634275d694f8665957746c9619132f0:almost                   
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Hash.Target......: 5634275d694f8665957746c9619132f0
Time.Started.....: Fri Aug 25 05:32:00 2023 (0 secs)
Time.Estimated...: Fri Aug 25 05:32:00 2023 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:   118.7 kH/s (0.34ms) @ Accel:1024 Loops:1 Thr:1 Vec:8
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 12288/14344385 (0.09%)
Rejected.........: 0/12288 (0.00%)
Restore.Point....: 8192/14344385 (0.06%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#1....: total90 -> hawkeye
Hardware.Mon.#1..: Util: 26%

Started: Fri Aug 25 05:31:57 2023
Stopped: Fri Aug 25 05:32:01 2023     
```

Ahora volvemos con la herramienta steghide para probar la posible credencial encontrada.

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ steghide extract -sf hackerman.jpg 
Enter passphrase: 
wrote extracted data to "hackerman.txt". 
```

La contraseña es correcta y la operación de extracción se ha completado con éxito; los datos ocultos ahora se encuentran almacenados en un archivo de texto denominado "hackerman.txt".

```bash
┌─[root@kali]─[/home/user/Stegnography]
└──╼ cat hackerman.txt                                     
SFRCezN2MWxfYzBycH0=

┌─[root@kali]─[/home/user/Stegnography]
└──╼ echo -n "SFRCezN2MWxfYzBycH0=" | base64 -d            
HTB{3v1l_c0rp}    
```

Como se aprecia se identifica la codificación base 64, que al decodificarla obtenemos la flag.


