# Frontier Scum ES para Foundry VTT

> Adaptación al castellano del sistema **Frontier Scum** para **Foundry VTT**, con interfaz temática, hojas personalizadas, catálogo de objetos, diarios de reglas y automatizaciones listas para jugar.

<img width="2048" height="999" alt="image" src="https://github.com/user-attachments/assets/31bfdef6-29ed-4118-ae35-065aa7d3d011" />


## Qué es este proyecto

Este repositorio publica una versión en castellano del sistema **Frontier Scum** para **Foundry VTT**, pensada para ofrecer una experiencia de juego más cómoda, más clara y visualmente coherente dentro de mesa virtual.

El objetivo de esta edición es que puedas crear personajes, gestionar equipo, lanzar chequeos y jugar partidas con una presentación totalmente integrada en Foundry, manteniendo el tono sucio, fronterizo y despiadado del juego.

## Qué incluye

### Interfaz y hojas personalizadas
- Hoja de **personaje** con estética *Se Busca*
- Hojas específicas para **PNJ** y **monturas**
- Hoja de **objeto** adaptada al sistema
- Estilo visual unificado, inspirado en la identidad del juego

### Objetos y contenido listo para usar
- Catálogo inicial de objetos sembrado automáticamente para empezar a jugar rápido
- Tipos de objeto para:
  - armas
  - equipo
  - protección
  - munición
  - material médico
  - condiciones
  - objetos generales

### Herramientas de juego integradas
- **Chequeos de atributo** desde la propia hoja
- Uso de **habilidades** como ventaja cuando corresponde
- Gestión de **Ases** para repetir tiradas desde el chat
- **Chequeos de caída** y **chequeos de muerte**
- Tiradas de **reacción** y **moral**
- Descanso tras refriega y descanso completo
- Uso de objetos de curación
- Aplicación de daño desde el chat sobre el objetivo marcado

### Combate y recursos
- Lógica base de **ataques con armas** para PJ
- Consumo básico de **munición**
- Recuperación básica de munición tras el combate
- Reducción automática de daño por **armadura** y **escudo**
- Posibilidad de **sacrificar el sombrero** para bloquear un ataque
- Recuperación posterior del sombrero mediante **Suerte**

### Ayudas para dirección y preparación
- **Diarios de reglas** generados automáticamente dentro de Foundry
- **Generación aleatoria de personajes**
- Localización en **castellano** e **inglés**
- Compatibilidad declarada con **Foundry VTT v11–v13**

## Estado actual

Esta publicación ofrece una base funcional, instalable y plenamente jugable.

Automatiza ya una parte importante del flujo de juego, aunque algunas áreas siguen siendo parciales o manuales según el enfoque ligero y sucio propio del sistema. Entre los elementos todavía no totalmente automatizados están algunos detalles de refriega, ciertas rarezas de armas o criaturas, partes del inventario por ranuras y algunos procedimientos de ciudad, viaje o duelo.

## Instalación en Foundry

En Foundry VTT:

1. Abre **Game Systems**
2. Pulsa **Install System**
3. Pega esta URL de manifest:

```txt
https://raw.githubusercontent.com/ManuRomera/FrontierScum-ES-/main/system.json
