---
date: 2025-10-20T21:51:05.000Z
layout: post
comments: true
title: "Server-Side Includes Injection"
subtitle: 'SSI'
description: >-
image: >-
  /images/ssilogo.png
optimized_image: >-
  /images/ssilogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - php
  - ssi
author: Felipe Canales Cayuqueo
paginate: true
---

**Server-Side Includes (SSI)** es una técnica usada por servidores web para insertar contenido dinámico en páginas HTML estáticas mediante directivas especiales (por ejemplo `<!--#include ...-->`). Habitualmente aparece en archivos con extensiones como `.shtml`, `.shtm` o `.stm`, aunque el servidor puede configurarse para procesarlas en otras extensiones.

La **inyección SSI** ocurre cuando un atacante logra que directivas SSI controladas por él se escriban o sirvan desde el servidor (por ejemplo subiendo un archivo con directivas al directorio raíz web o haciendo que la app guarde entrada del usuario en un archivo servible). Si el servidor procesa esas directivas, el atacante puede ejecutar comandos, incluir archivos o filtrar variables de entorno, lo que implica riesgo de divulgación de información o ejecución remota.

### Payloads

#### Printenv 

Directiva que imprime variables de entorno.

```
<!--#printenv -->
```

#### Config

Esta directiva cambia la configuración de SSI especificando los parámetros correspondientes.

```
<!--#config errmsg="Error!" -->
```

#### Eco

Esta directiva imprime el valor de cualquier variable dada en el var parámetro. 

* DOCUMENT_NAME: el nombre del archivo actual.
* DOCUMENT_URI: la URI del archivo actual.
* LAST_MODIFIED: marca de tiempo de la última modificación del archivo actual.
* DATE_LOCAL: hora del servidor local.

```
<!--#echo var="DOCUMENT_NAME" var="DATE_LOCAL" -->
```

#### Exec

Esta directiva ejecuta comandos en el sistema.

```
<!--#exec cmd="whoami" -->
```

#### Include

Esta directiva permite la inclusión de archivos en el directorio raíz web.

```
<!--#include virtual="index.html" -->
```

### Recomendaciones

Las principales medidas de prevención frente a la inyección SSI consisten en que los desarrolladores valíden y desinfecten rigurosamente toda entrada del usuario, especialmente aquella que pueda insertarse en archivos procesados por el servidor. También deben configurar el servidor web para limitar el uso de SSI únicamente a ciertas extensiones o directorios autorizados, reduciendo así la superficie de ataque. Además, es recomendable restringir o deshabilitar directivas peligrosas como exec cuando no sean estrictamente necesarias, y aplicar políticas de configuración seguras que impidan la ejecución o inclusión de código no autorizado dentro de las páginas servidas.



