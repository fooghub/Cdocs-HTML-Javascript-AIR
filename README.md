# Cdocs-HTML-Javascript-AIR

![Imagen](md/img/icon_64.png "CDOCS")

**CDOCS** (Comprueba Documentos) es una aplicación divulgativa, de escritorio, gratuita y de Código Abierto. Para **Windows** y **Mac** OS, con el motor de ejecución  **Adobe® AIR®**.

Mediante el cálculo del dígito o dígitos de control, pretende comprobar la consistencia o veracidad de los números de algunos documentos de identificación personal, fiscal y laboral, de la Administración española. También la de algunos códigos de identificación financiera, en el ámbito internacional.

>Los resultados ofrecidos por la aplicación son sólo orientativos, nunca deben considerarse exactos ni mucho menos vinculantes.

###### **• Programación:**
----
**CDOCS** está programada con lenguajes estándar del desarrollo Web: **HTML**, **CSS**, **JAVASCRIPT** de propósito general y específico para la **API** de **AIR**. También **XML** y **ActionScript**.

Fue compilada, firmada y empaquetada para su distribución con **Adobe® Flex® 4.6 SDK**. 

También puede utilizarse **Adobe® AIR® SDK**.

**HTML**

El archivo **index.html** (página principal), en el directorio raíz de aplicación y los incluidos en el directorio  **/html**  contienen esta clase de código, tipificado para **HTML5** `<!DOCTYPE html>` sólo en el caso de páginas completas.
 
Los archivos del subdirectorio **/forms**, encierran fragmentos que serán introducidos de forma interactiva en el documento principal mediante técnicas **AJAX**.

**HOJA DE ESTILO CSS:**

Los archivos **index.css** y **humane-original-foog.css** contienen el código **CSS**<sub>3</sub> convencional.
 
En la programación **CSS** conviene definir algunas propiedades con la sintaxis exclusiva para **WebKit** como proveedor, para conseguir  los efectos deseados.

<sup>**WebKit** es el motor de "*renderización*" incluido en Adobe AIR *runtime*</sup>

**JAVASCRIPT con la API de AIR:**

En el archivo principal (comentado) **index.js**, se encuentra el código **JAVASCRIPT** con algunas de las propuestas de la extensa interfaz de **AIR**, como por ejemplo:

* Creación, posicionamiento y manejo de la ventana nativa principal y de ventanas secundarias, de los tipos “normal” y “utilidad”.
* Construcción de menús, emergente en el caso del principal y contextuales asociados a los iconos que aparecen en la bandeja del sistema o en el “Dock” (**Mac** OS).
* Lectura de la base de datos local.
* Lectura del archivo descriptor (**XML**) y de otros archivos con este mismo formato.
* Monitorización del estado de Internet (precisa de **servicemonitor.swf**) 
* Llamadas al navegador (por defecto) instalado en el equipo para la presentación de las páginas web (externas).
* Gestión del sistema de ficheros.
* Apertura de archivos con su programa determinado por defecto en el sistema.
* Actualizaciones desde un servidor remoto (descarga e instalación del paquete instalador \[.air] con la versión solicitada). 
* Visor local de Código Fuente (con **AIRSourceViewer.js**).
* Características “capacidades” del software, en el equipo del usuario. 
* Eventos de conexión, error, progreso de descarga y estado de ventanas.
… etc.

<sup>Además del citado **index.js** se añade el archivo auxiliar **index-aux.js** con código **JAVASCRIPT** convencional, separado del principal (*index.js*) por motivos de legibilidad.</sup>

**Recursos JAVASCRIPT de AIR incluidos en la aplicación:**

Con el mencionado **AIRSourceViewer.js**, incluimos también: **AIRAliases.js**. Proporciona definiciones de **“alias”** que permiten acceder a las clases *runtime* reduciendo su sintaxis.

En tiempo de desarrollo conviene utilizar **AIRIntrospector.js**, que ofrece numerosas funciones útiles y una interfaz gráfica para ayudar en la construcción y depuración de aplicaciones basadas en **HTML**.

> **Importante**: Es necesario eliminar el acceso a **AIRIntrospector.js** y el código relacionado con él, antes de empaquetar y distribuir la aplicación.
 
<sup> — **servicemonitor.swf**, **AIRSourceViewer.js**, **AIRAliases.js** y **AIRIntrospector.js**. Se encuentran dentro de los kits  **AIR** y **Flex**.</sup>

**PDF con ALIVEPDF(*ActionScript 3 Open-Source PDF Library*):**

**CDOCS** contiene algunas librerías ALIVEPDF. Archivo: **alivePDFlib.swf** que, con su correspondiente envoltura **JAVASCRIPT**, archivos: **alivePDFWrapper.js** y **alivePDFgenerator.js**. Consigue la creación de documentos **PDF** "al vuelo".

<sup>Para visualizar documentos PDF desde una aplicación **AIR**, es necesario que el equipo disponga de una versión actualizada (8.1 ó superior) del visor estándar (genuino) **Adobe READER**.</sup>

**XML**

El archivo descriptor: **cdocs-app.xml** (manifiesto).

Todas las aplicaciones de **AIR** requieren un archivo descriptor. El archivo descriptor es un documento **XML** especial que define las propiedades básicas de la aplicación.

El archivo descriptor puede tener cualquier nombre. Al combinar la aplicación en un paquete, el nombre de este archivo cambia al de, **application.xml** y se coloca en un directorio especial en el paquete de distribución.

###### **• Desarrollo de una aplicación AIR con HTML y JAVASCRIPT:**
----

**Herramientas necesarias:**

**JAVA** *Development Kit* (**JDK**) o **JAVA** *Runtime Environment* (**JRE**). Plataforma **JAVA** estándar para desarrolladores y motor de ejecución **JAVA** para usuarios finales, respectivamente.

**Adobe® AIR® SDK** ó **Adobe® Flex® SDK**. Conjunto de herramientas de desarrollo de software para aplicaciones **AIR**.

**Lanzamiento en pruebas de una aplicación AIR:**

El Código Fuente de **CDOCS** en **GitHub** está estructurado para que sea posible lanzar la aplicación en modo de pruebas con la orden **ADL** (*AIR Debug Launcher*). Desde la línea de comandos:

`$ adl cdocs-app.xml`

Donde **cdocs-app.xml**, es el **archivo descriptor** de la aplicación.

**Distribución de una aplicación AIR:**

Todos los archivos (paquetes de instalación) **AIR** \[.air], deben incluir necesariamente una firma digital que identifica a su editor.

**AIR** ofrece la posibilidad de crear un certificado de firma automática, con la herramienta multiusos: **ADT** (*AIR Developer Tool*) incluida en el SDK.

Con **ADT** y su opción **-package** también podemos combinar un paquete de distribución e instalación con nuestro proyecto **AIR**.

<sup>La carpeta **Installer Package** incluye un paquete instalable de la aplicación: **cdocs.air**

> Para más información puedes leer: CDOCS : Documentación.

Saludos.

----

<sup>2004 – 2016 Foog.Software</sup>

<sup>Marzo 2016</sup>

<sup>[www.foog.es](http://www.foog.es/ "www.foog.es")</sup>
