# 🛡️ DEFENSA ANTE EL JURADO — BANCO DE PREGUNTAS ASESINAS Y RESPUESTAS (FAQ)
## Manual de Supervivencia Técnica, Social y Financiera — XENTRA OTB v3.0

> Este documento contiene las **12 preguntas más duras y escépticas** que un jurado de hackathon (inversores, ingenieros senior, sociólogos y evaluadores de impacto) puede formularte, junto con **respuestas contundentes, fundamentadas y de alto impacto**.

---

### PREGUNTA 1: ¿Por qué no usar simplemente un grupo de WhatsApp y una hoja de Excel compartida en Google Drive?

**Respuesta Contundente:**
> *"El 90% de las OTBs ya intentó usar WhatsApp y Excel, y fracasó rotundamente por tres razones críticas:*
> 1. **Vulneración de Seguridad y Privacidad (Zero-PII):** Publicar listas de deudores en WhatsApp expone nombres, números de teléfono y direcciones exactas, convirtiendo a las familias en blanco de extorsiones o préstamos informales. Xentra anonimiza la identidad y permite consultas individuales privadas.
> 2. **Cero Integridad Contable:** En un Excel compartido, cualquier dirigente puede editar una celda por descuido o mala fe y cambiar montos sin dejar rastro verificable. En Xentra, el **Protocolo TRACE** sella cada recibo con un **hash criptográfico SHA-256** inmutable.
> 3. **Pérdida de la Información:** Cuando cambia la directiva cada 2 años, el nuevo presidente recibe carpetas dispersas o enlaces caídos. En Xentra, la OTB conserva su padrón histórico, censal y contable de por vida institucional.*"

---

### PREGUNTA 2: Los dirigentes y vecinos propietarios suelen tener entre 40 y 60 años. ¿Cómo garantizan que realmente lo usen y no haya resistencia al cambio?

**Respuesta Contundente:**
> *"No diseñamos la plataforma pensando en usuarios de 20 años ni en interfaces complicadas de Silicon Valley. Diseñamos bajo el estándar internacional de **Ingeniería de Accesibilidad Senior (WCAG AAA)**:*
> 1. **Vista Cómoda Nativa Directa (Sin Botones de Configuración):** Desde el primer segundo, el texto se renderiza en **18px-20px base** y el contraste fondo/texto es **7:1 (WCAG AAA)** por defecto, garantizando legibilidad inmediata ante problemas de presbicia o cataratas sin exigirle al usuario que active ninguna opción.
> 2. **Objetivos Táctiles Gigantes:** Los botones tienen áreas de toque de **56px a 64px**, evitando clics erróneos en dedos con temblores o artritis.
> 3. **Eliminación Total de Anglicismos:** Sustituimos tecnicismos por expresiones del barrio boliviano: *'Cuentas Claras'*, *'Aporte al Día'*, *'Recibo Sellado'*, *'Muro Vecinal'*.
> 4. **Didáctica de Pago QR:** El 80% de los adultos mayores no sabe cómo escanear un QR que está en la misma pantalla de su celular. Implementamos el botón verde **'📥 Guardar QR en Galería'** con una guía visual de 4 pasos para abrir su banca móvil y pagar sin frustración.*"

---

### PREGUNTA 3: ¿Qué pasa en barrios periurbanos donde la cobertura de internet móvil es inestable o nula?

**Respuesta Contundente:**
> *"Xentra fue arquitecturado bajo la filosofía **Offline-First (Primero Sin Conexión)**:*
> 1. **Almacenamiento Local Criptográfico:** Mediante **DexieDB / IndexedDB** en la web y SQLite local en la App Móvil, los vecinos pueden consultar sus recibos anteriores, estatutos y teléfonos de auxilio incluso si se corta la fibra óptica o se les acaban los megas.
> 2. **Cola de Sincronización en Segundo Plano:** Si un vecino realiza un reporte o envía un comprobante sin internet, la aplicación lo encola localmente y lo sincroniza de manera automática e idéntica en cuanto detecta conectividad Wi-Fi o datos móviles.*"

---

### PREGUNTA 4: ¿Cómo es viable financieramente el proyecto? ¿Requiere subsidios de la Alcaldía o fondos del gobierno para mantenerse vivo?

**Respuesta Contundente:**
> *"Xentra es **100% autosustentable** desde el día uno y no depende de subsidios:*
> 1. **Modelo de Micro-canon Comunal:** Se financia con una tarifa de **Bs. 1 al mes por lote**, incluida dentro de la expensa habitual de la OTB.
> 2. **Economía Unitaria Positiva:** Una OTB promedio de 300 lotes genera **Bs. 300 mensuales ($43 USD)**. Nuestros costos de infraestructura en la nube (Vercel Edge Functions, Supabase PostgreSQL, almacenamiento S3 de recibos) promedian menos de **$3 USD mensuales por OTB**. El margen operativo bruto supera el **90%**.
> 3. **Alianzas Estratégicas:** No cobramos comisión bancaria alguna al vecino ni a la OTB, garantizando la aprobación unánime de las asambleas vecinales.*"

---

### PREGUNTA 5: ¿Es legal este recibo digital en Bolivia? ¿Cumple con la Ley 1551 de Participación Popular?

**Respuesta Contundente:**
> *"Totalmente legal y alineado a la normativa boliviana:*
> 1. **Ley 1551 de Participación Popular y Ley Marco de Autonomías (Ley 031):** Reconocen la personería jurídica y la autonomía de gestión de las OTBs y Juntas Vecinales para administrar sus aportes comunales internos (cuotas de agua, alumbrado, seguridad, canchas).
> 2. **Ley 164 de Telecomunicaciones y Tecnologías de Información (Firma y Documentos Digitales):** Valida la equivalencia jurídica de los registros electrónicos, hashes criptográficos y códigos de verificación digital.
> 3. **Función de Rendición de Cuentas:** Xentra genera la ficha de solvencia oficial imprimible con código QR de verificación instantánea y casillas físicas para las tres firmas normativas: **Presidente**, **Tesorero** y **Socio Conforme**.*"

---

### PREGUNTA 6: ¿Xentra custodia el dinero de las OTBs o cobra comisiones por transacción?

**Respuesta Contundente:**
> *"No, y esa es nuestra mayor ventaja legal y de confianza:*
> 1. **Cero Custodia:** Xentra **no es una pasarela de pago ni una entidad de intermediación financiera (ASFI)**. No tocamos ni un solo centavo del dinero comunal.
> 2. **Canal Directo por QR Simple:** Los fondos van **directamente de la cuenta bancaria del vecino a la cuenta oficial de la OTB** en Banco Unión, BancoSol, BNB o BCP mediante el sistema nacional de QR Simple de ASOBAN / Red Enlace.
> 3. **Cero Comisiones Bancarias:** El vecino y la OTB transfieren con **0% de comisión**, a diferencia de cobradores o pasarelas que retienen del 3% al 7% del aporte comunal.*"

---

### PREGUNTA 7: ¿Cómo evitan fraudes internos? ¿Qué impide que un tesorero suba comprobantes falsos o invente gastos?

**Respuesta Contundente:**
> *"Implementamos una arquitectura antifraude de 3 capas:*
> 1. **Conciliación de Vouchers con Inspección Visual:** El vecino sube la captura de su transferencia QR. El tesorero debe cotejar el número de operación y remitente antes de aprobar la emisión del recibo.
> 2. **Cadena Criptográfica TRACE (Tokenized Receipt & Audit Engine):** Cada transacción genera un token criptográfico SHA-256 encadenado cronológicamente. Si alguien alterara una base de datos directamente, el hash de validación no coincidirá con el QR público y la alerta de inconsistencia saltará de inmediato.
> 3. **Portal de Transparencia Comunitaria en Vivo:** Cada vecino puede abrir la sección **'Cuentas Claras'** y auditar el saldo real en caja, las cuotas recaudadas y la lista de facturas o descargos de cada centavo gastado.*"

---

### PREGUNTA 8: ¿Una OTB puede espiar los datos de otra OTB vecina? ¿Cómo manejan el aislamiento multi-tenant?

**Respuesta Contundente:**
> *"El aislamiento es absoluto a nivel de arquitectura y base de datos:*
> 1. **Multi-Tenancy por Row-Level Security (RLS) en PostgreSQL:** Cada registro de vecinos, pagos, encuestas y reportes de auxilio está indexado con un UUID estricto de `otb_id`.
> 2. **Políticas de Acceso Aisladas:** Un dirigente o vecino de la OTB Villa Esperanza (Cochabamba) no tiene credenciales ni permisos para consultar a los vecinos de Los Pinos (La Paz) o Barrio Lindo (Santa Cruz).
> 3. **Rol Superadministrador Nacional:** Es el único perfil con vista de supervisión consolidada para dar de alta nuevas OTBs o auditar reportes interjurisdiccionales.*"

---

### PREGUNTA 9: ¿Por qué desarrollaron un APK nativo de Android en lugar de quedarse solo con una página web?

**Respuesta Contundente:**
> *"Por la realidad del parque de dispositivos móviles en Bolivia:*
> 1. **Dominio de Xiaomi, Samsung y Motorola de gama media y baja:** Miles de vecinos no tienen espacio para instalar aplicaciones pesadas de la Play Store ni cuentan con cuentas de Google configuradas con tarjeta de crédito.
> 2. **Acceso Dual Inclusivo:**
>    - **PWA Ultraligera:** Funciona al instante en Chrome sin ocupar almacenamiento.
>    - **APK Standalone Compilado con Hermes:** Un instalador nativo de alto rendimiento que corre fluidamente incluso en teléfonos antiguos (Android 8+).*
> 3. **Pipeline CI/CD Automatizado:** Gracias a nuestro workflow en **GitHub Actions (`build-apk.yml`)**, cada mejora se compila, firma y publica automáticamente en una release oficial descargable en segundos.*"

---

### PREGUNTA 10: ¿El botón de pánico y los reportes de auxilio no van a saturar a la policía o provocar alertas falsas?

**Respuesta Contundente:**
> *"No, porque el sistema cuenta con filtros comunitarios de validación:*
> 1. **Filtro de Evidencia Obligatoria:** Para incidentes barriales (fugas de agua, luminarias quemadas, altercados en la cancha) es obligatorio adjuntar fotografía y ubicación GPS satelital.
> 2. **Canalización en Dos Niveles:** Los reportes alertan primero a la **Mesa Directiva y Rondas Vecinales**, quienes verifican el suceso en el Muro Comunitario y cambian su estado (*'En Camino'* o *'Atendiendo'*).
> 3. **Marcación Telefónica Directa:** Las llamadas a **Radio Patrullas 110**, **SAMU 165** o **Bomberos 119** se ejecutan como enlaces telefónicos directos con confirmación de un toque, respetando los protocolos oficiales de los centros de despacho policial de cada departamento.*"

---

### PREGUNTA 11: ¿Qué tecnologías usaron y qué garantiza que el sistema soporte miles de usuarios simultáneos?

**Respuesta Contundente:**
> *"Utilizamos una arquitectura moderna, reactiva y de ultra bajo consumo de recursos:*
> - **Frontend Web:** React 19 + TypeScript + Vite + Tailwind CSS v4, desplegado en la red Edge global de **Vercel** con tiempos de respuesta sub-100ms.
> - **App Móvil:** React Native 0.76 + Expo SDK 52 con motor de bytecode nativo **Hermes**.
> - **Base de Datos & Auth:** Supabase PostgreSQL con autenticación JWT, Row-Level Security y suscripciones en tiempo real mediante WebSockets.
> - **Criptografía:** Generador de tokens SHA-256 descentralizado para comprobantes inmutables.
> - **Escalabilidad:** Al no procesar procesamiento de pagos internamente ni mantener servidores dedicados costosos, la arquitectura serverless escala de 100 a 100.000 usuarios sin cuellos de botella.*"

---

### PREGUNTA 12: ¿Cuál es su estrategia de entrada al mercado (Go-To-Market) para conseguir las primeras 100 OTBs?

**Respuesta Contundente:**
> *"Nuestra estrategia de expansión consta de 3 fases:*
> 1. **Piloto Barrial con Directivas Clave (Mes 1):** Comenzamos con 5 OTBs de Cochabamba (Distritos 4 y 6) con las que ya validamos el dolor de los cobros por QR y las convocatorias a asambleas.
> 2. **Efecto Red Comunal:** En los consejos distritales de juntas vecinales, los presidentes se reúnen mensualmente. Al ver que una OTB erradicó las peleas en asamblea y aumentó su recaudación al 92%, los dirigentes vecinos solicitan su incorporación a través de nuestro botón *'Solicitar Registro de mi OTB'*.
> 3. **Convenios con Direcciones de Seguridad Ciudadana:** Presentamos las métricas de respuesta de luminarias y agua a las alcaldías para homologar la plataforma como canal digital barrial oficial.*"
