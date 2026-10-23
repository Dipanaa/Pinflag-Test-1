# Pinflag-Test

Repositorio principal para el proyecto **Pinflag-Test**, compuesto por los módulos de backend y frontend para el **Motor de Resolución de Reglas de Despacho y Checkout con Detección de Colisiones**.

---

## Estructura del Proyecto

```text
Pinflag-Test/
├── BackEnd-Pinflag-test/
│   └── pinflag-control/       # Aplicación backend desarrollada con NestJS (Puerto 3000)
├── FrontEnd-Pinflag-test/
│   └── pinflag-frontend/      # Aplicación frontend con React, Tailwind CSS y Lucide (Puerto 5173)
└── README.MD                   # Guía de configuración e instalación general
```

---

## Alcance de proyecto

El proyecto prototipo de la problematica analizada comprendera las siguientes situaciones abordadas:

- Creación de pedidos con simulador basado en costo, peso, distancia en m (asumiendo cobertura) y tipo de delivery.
- Creación de reglas para aplicar a pedidos que lo requieran ordenadas por prioridad con sistema de mitigacion drag and drop dictado por el cliente.
- Simulación de pedidos para verificar colisiones y registros de reglas con conflictos.
- Registro obligatorio de regla fallback para evitar pedidos huerfanos dictado por el cliente.
- No permite registro de reglas sin opciones de retiro, despacho o retiro en punto.

---

## Stack tecnologico utilizado

* **Backend:** NestJS (TypeScript, Arquitectura Modular y Controladores/Servicios).
* **Frontend:** React (Vite, Axios, TanStack React Query y Tailwind CSS).
* **ORM:** TypeORM (Manejo transaccional con `QueryRunner` y mapeo de entidades).
* **Base de Datos:** PostgreSQL (Soporte de tipos nativos `UUID` y almacenamiento `JSONB`).
* **Gestor de Paquetes:** Yarn.
* **Herramientas de IA:** Gemini & Gemini CLI (Modelos de razonamiento Low y High para asistencia técnica, diseño y generación de código).



---

## Requisitos Previos

Antes de comenzar, asegúrate de contar con las siguientes herramientas instaladas en tu sistema:

- **Node.js**: v18 o superior (se recomienda v20 LTS).
- **Yarn**: Administrador de paquetes (versión 1.22.x o superior).
  - Si no tienes Yarn instalado, puedes instalarlo globalmente con:
    ```bash
    npm install -g yarn
    ```
    O habilitarlo mediante Corepack (en Node.js >= 16.9):
    ```bash
    corepack enable
    ```
- **PostgreSQL**: Servidor de base de datos activo (para la persistencia de datos de reglas, órdenes y auditoría de colisiones).

---

## Puertos de Ejecución y URLs Locales

El sistema trabaja con dos aplicaciones que se comunican entre sí:

| Módulo | Directorio | Puerto | URL Local | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | `BackEnd-Pinflag-test/pinflag-control` | **`3000`** | `http://localhost:3000/api` | API REST en NestJS (Motor de Reglas y Pedidos) |
| **Frontend** | `FrontEnd-Pinflag-test/pinflag-frontend` | **`5173`** | `http://localhost:5173/` | Interfaz administrativa, simulador y auditoría |


---

## Guía Paso a Paso para Ejecutar el Proyecto

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Pinflag-Test
```

---

### 2. Configurar y Ejecutar el Backend (Terminal 1)

El backend está construido sobre el framework **NestJS** utilizando **TypeORM** y **PostgreSQL**.

#### A. Navegar al directorio del backend
```bash
cd BackEnd-Pinflag-test/pinflag-control
```

#### B. Instalar dependencias
```bash
yarn install
```

#### C. Configurar Variables de Entorno (`.env`)
Crea un archivo `.env` en la raíz de `BackEnd-Pinflag-test/pinflag-control/` con los datos de conexión a tu servidor PostgreSQL local:

```env
PORT=3000

# Configuración de Base de Datos PostgreSQL (Tus parámetros)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=pinflag_db
```

> **Importante**: Debes tener tu base de datos de PostgreSQL creada con los parámetros de configuración listos en tu entorno para que TypeORM sincronice las tablas de `reglas`, `pedidos` y `reglas_colisionadas`.

#### D. Iniciar el Backend en Modo Desarrollo
```bash
yarn start:dev
```
El servidor backend iniciará en `http://localhost:3000` con el prefijo global `/api`.

#### E. Comandos Disponibles en el Backend

| Comando | Descripción |
| :--- | :--- |
| `yarn start:dev` | Inicia la aplicación en modo desarrollo con recarga automática (*watch mode*) |
| `yarn start` | Inicia la aplicación en modo estándar |
| `yarn build` | Compila la aplicación TypeScript a JavaScript en la carpeta `dist/` |

---

### 3. Configurar y Ejecutar el Frontend (Terminal 2)

El frontend es un panel administrativo moderno desarrollado con **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons** y **Vite**.

#### A. Navegar al directorio del frontend
```bash
cd FrontEnd-Pinflag-test/pinflag-frontend
```

#### B. Instalar dependencias
Ejecuta el siguiente comando para instalar React 19, Tailwind CSS, Lucide React y las dependencias de desarrollo:

```bash
yarn install
```

#### C. Iniciar el Servidor de Desarrollo de Vite
```bash
yarn dev
```
La aplicación abrirá en el puerto **`5173`**:
```
  VITE v8.3.x  ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en: **`http://localhost:5173/`**

#### D. Comandos Disponibles en el Frontend

| Comando | Descripción |
| :--- | :--- |
| `yarn dev` | Inicia el servidor de desarrollo de Vite con Hot Module Replacement (HMR) en el puerto `5173` |
| `yarn build` | Valida TypeScript (`tsc -b`) y compila los paquetes optimizados para producción en `dist/` |
| `yarn preview` | Previsualiza localmente la compilación de producción |
| `yarn lint` | Ejecuta el análisis de linter con Oxlint |

---

## Verificación de Compilación

Para comprobar que ambos módulos compilan sin errores de tipos ni dependencias:

```bash
# 1. Verificar compilación del Backend
cd BackEnd-Pinflag-test/pinflag-control
yarn build

# 2. Verificar compilación del Frontend
cd ../../FrontEnd-Pinflag-test/pinflag-frontend
yarn build
```

Si ambos comandos finalizan con código de éxito (`Done in ...s`), los entornos están listos para desarrollo y despliegue.
