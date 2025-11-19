# Chat API

## Características

- ✅ API REST para gestión de usuarios, salas y mensajes
- ✅ WebSocket en tiempo real para notificaciones de mensajes
- ✅ Arquitectura Hexagonal con DDD y CQRS
- ✅ MongoDB como base de datos
- ✅ Docker para desarrollo

## WebSockets

Esta API incluye soporte para WebSockets usando Socket.IO para notificaciones en tiempo real de mensajes.

**Documentación completa**: Ver [WEBSOCKET_DOCUMENTATION.md](./WEBSOCKET_DOCUMENTATION.md)

**Endpoint WebSocket**: `ws://localhost:3000/messages`

**Eventos principales**:
- `joinRoom`: Unirse a una sala para recibir notificaciones
- `leaveRoom`: Salir de una sala
- `newMessage`: Recibir notificación cuando se crea un mensaje

## Cómo ejecutar la aplicación

### Configuración inicial

**Importante:** Antes de ejecutar la aplicación, debes crear un archivo `.env` en la raíz del proyecto basado en el archivo `.env.example`:

```bash
cp .env.example .env
```

Luego, edita el archivo `.env` con los valores correspondientes a tu entorno.

### Opción 1: Con Docker (Recomendado)

La primera vez que ejecutes la aplicación, usa:

```bash
npm run dev:up:build
```

Para ejecuciones posteriores, simplemente usa:

```bash
npm run dev:up
```

**Importante:** Al usar Docker, la variable de ambiente para la base de datos debe incluir `mongo` en lugar de `localhost`:

```
MONGODB_URI=mongodb://mongo:27017/chat-db
```

### Opción 2: Sin Docker (desarrollo local)

Si prefieres ejecutar la aplicación sin Docker usando el comando por defecto de NestJS:

```bash
npm run start
```

**Importante:** Al ejecutar sin Docker, la variable de ambiente de la URI de la base de datos debe usar `localhost` y deberas levantar la base de datos de manera separada en algun servidor local o remoto:

```
MONGODB_URI=mongodb://localhost:27017/chat-db
```

### Nota sobre el Frontend

**Importante:** Este proyecto solo incluye el backend de la aplicación. Para probar la funcionalidad completa (WebSockets, interfaz de usuario, etc.), debes levantar el frontend de forma independiente.

El frontend se encuentra en un repositorio separado y debe ejecutarse en paralelo con este backend.

## Arquitectura

Esta aplicación está construida siguiendo los principios de **Arquitectura Hexagonal (Ports and Adapters)**, **Domain-Driven Design (DDD)** y **CQRS (Command Query Responsibility Segregation)**.

### Capas de la Arquitectura

#### 1. **Domain (Dominio)**
La capa más interna que contiene la lógica de negocio pura, independiente de cualquier framework o tecnología externa.

- **Entities**: Entidades del dominio que representan los conceptos centrales del negocio (ej: `user.entity.ts`)
- **Ports**: Interfaces que definen contratos para la comunicación con el exterior (ej: `user-repository.port.ts`)
  - Define qué operaciones necesita el dominio sin especificar cómo se implementan

#### 2. **Application (Aplicación)**
Capa que orquesta los casos de uso de la aplicación siguiendo el patrón CQRS.

- **Commands**: Operaciones que modifican el estado del sistema (ej: `login.command.ts`)
- **Queries**: Operaciones de solo lectura que obtienen información del sistema
- **Handlers**: Implementan la lógica de los casos de uso, procesando comandos y queries (ej: `login.handler.ts`)
  - Coordinan las entidades del dominio y los ports

#### 3. **Infrastructure (Infraestructura)**
Capa que contiene las implementaciones concretas de los adaptadores, tanto de entrada como de salida.

##### **Adapters Inbound (Entrada)**
Adaptadores que permiten que el mundo exterior interactúe con la aplicación:

- **Controllers**: Puntos de entrada HTTP/REST que reciben las peticiones (ej: `user.controller.ts`)
- **DTOs**: Data Transfer Objects que definen la estructura de datos de entrada/salida (ej: `login.dto.ts`)

##### **Adapters Outbound (Salida)**
Adaptadores que implementan los ports del dominio para interactuar con servicios externos:

- **Persistence**: Capa de persistencia de datos
  - **Repositories**: Implementaciones concretas de los ports del repositorio (ej: `user.repository.ts`)
  - **Schemas**: Definición de esquemas de base de datos (ej: `user.schema.ts`)
  - **Mappers**: Transforman entre entidades de dominio y modelos de persistencia (ej: `user.mapper.ts`)

### Beneficios de esta Arquitectura

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara y bien definida
- **Independencia de frameworks**: El dominio no depende de NestJS, MongoDB u otras tecnologías
- **Testabilidad**: Fácil de testear gracias a la inversión de dependencias
- **Mantenibilidad**: Cambios en la infraestructura no afectan al dominio
- **Escalabilidad**: CQRS permite optimizar lecturas y escrituras de forma independiente
