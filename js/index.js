/********************************************************
* Cdocs // index.js - Javascript
* Versión 0.1.0
* Fecha de edición/revisión: 31/01/2016
* Foog.Software
** Dependencias Javascript:
* AIRAliases.js, AIRSourceViewer.js,
* alivePDFgenerator.js, alivePDFWrapper.js,
* humane.js, iban.js, index-aux.js
** Dependencias SWF:
* servicemonitor.swf, alivePDFlib.swf
**
* Licencia MIT.
*********************************************************/
/********************************************************
* Declaración de variables globales:
*********************************************************/

// JAVASCRIPT de propósito general:
var fechaSistema; 
var formularios = ["home", "iban", "ccc", "ntc", "nif", "dni", "nie", "naf", "cccss", "update", "about", "download"];
var botones = ["botones-mnu", "botones-inicio", "botones-nuevo", "botones-imprimir", "botones-validar"];
var teclasRestringidas = [8, 9, 16, 17, 18, 19, 20, 27, 34, 35, 36, 37, 38, 39, 40, 44, 45, 46];
var errorValidar = false;
var errorAJAX = false;
var plantillaAlertaEspera = "<span><img src='images/gear_14.png' alt='' title='' class='alerta-imagen-info'></span><span class='alerta-texto-info'> ... creando archivo PDF. Un momento por favor.</span></span>";
var plantillaAlertaInfo = "<span><img src='images/info_14.png' alt='' title='' class='alerta-imagen-info'></span><span class='alerta-texto-info'> ... pulsa &#171;IM<u>P</u>RIMIR&#187; para más detalles (PDF).</span></span>";
var formularioActivo = "";
var urlEntidad = "";
var formularioValorOculto = "";
var erroresIBAN;
var contador = 0;
var transferencia;
var solicitud, almacenamientoDescarga = "";
var matrizBytes;
var actualizacionesTarea = "";
var procesandoActualizaciones = false;
var precargarImagen = function(){
	var imagen=new Image();
	imagen.src="images/giro_48.gif";
};
var protector = {
	activo: false,	
	abrir: function(){
		this.activo = true;
		document.getElementById("protector").style.display = "block";
		document.getElementById("protector-imagen").style.display = "block";
	},	
	cerrar: function(){
		this.activo = false;
		document.getElementById("protector-imagen").style.display = "none";
		document.getElementById("protector").style.display = "none";
	}
};
// JAVASCRIPT con la API de AIR:
var ventanaPrincipalMinimizada = false;
var mnuEmergente;
var monitor, internetDisponible = false;
var propiedadesPrograma = {
	versiones : {larga:"",
	corta:"",
	tipo:"",
	actualizaciones:"",
	actualizacionesMensaje: "",
	actualizacionesError:"",
	actualizacionesDisponibles: false,
	actualizacionesPeso : 0,
	actualizacionesDescriptor : "http://www.foog.es/download/air/cdocs/updateDescriptor.xml",
	actualizacionesAlmacenamiento: "",
	actualizacionesRepositorio : "",
	actualizacionesPaquete : "",
	},
	tirada: "Marzo 2016",
	serie: "FHYG-N2XS-6GM6",
	identificador : "",
	nombre : "cdocs",
	baseDatosFecha	: "Diciembre 2015",
};
var propiedadesEquipo = {
	tipo: air.Capabilities.playerType,
	sistemaOperativo : air.Capabilities.os,
	sistemaOperativoNombreComercial : "",
	sistemaOperativoNombreInterno : "",
	sistemaOperativoAlias : (/^mac/i.test(air.Capabilities.os) ? "mac" : /^win/i.test(air.Capabilities.os) ? "win" : /^linux/i.test(air.Capabilities.os) ? "lnx" : /^and/i.test(air.Capabilities.os) ? "and" : /^iphone/i.test(air.Capabilities.os) ? "iph" : "otros" ),
	idioma : (documentarIdioma(air.Capabilities.language) === "undefined" ?  air.Capabilities.language : "<span>" + air.Capabilities.language + "</span><span></span>&#160;&#8212;&#160;<span>" + documentarIdioma(air.Capabilities.language).capitalizarPrimeraLetra() + "</span>"),
	pantalla : air.Capabilities.screenResolutionX + " x " + air.Capabilities.screenResolutionY + " píxeles",
	inputMethodEditor : air.Capabilities.hasIME,
	motorAIR : air.NativeApplication.nativeApplication.runtimeVersion,
	motorAIRcomercial : air.NativeApplication.nativeApplication.runtimeVersion.match(/\d+\.\d+/)[0],
	visorPDF : "",
	flashPlayer : air.Capabilities.version,
	webkit: ((navigator.userAgent && navigator.userAgent.match(/applewebkit\/(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)/ig) !== null) ? navigator.userAgent.match(/applewebkit\/(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)/ig)[0].replace(/applewebkit\//i,"") : " ... ")		
	};

/********************************************************
* Funciones globales JAVASCRIPT de propósito general:
*********************************************************/

/**
* Función - eliminarEspaciosEnBlanco - Elimina todos los espacios en blanco de una cadena en cualquier posición. 
**/
String.prototype.eliminarEspaciosEnBlanco = function(){
	return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,"").replace(/\s+/g,"");
};

/**
* Función - noEsCifra - Comprueba si una cadena es un número.
* Devuelve: {boolean}
**/
String.prototype.noEsNum = function(){
	if (!/^\d+$/.test(this) || isNaN(this)){return true;} else {return false;}
};

/**
* Función - asociarEventos - Asociación de escucha de los eventos necesarios, elementos y estado de los formularios, una vez cargados.
**/
function asociarEventos(formulario){
	for(contador = 0; contador< document.forms[0].length; contador++){if(document.forms[0].elements[contador].type == "text"){document.forms[0].elements[contador].focus();break;}}
	switch(formulario){
		case "home" :
			document.getElementById("iban-home").addEventListener("click", function(){cargarFormulario("iban");}, false);
			document.getElementById("ccc-home").addEventListener("click", function(){cargarFormulario("ccc");}, false);
			document.getElementById("ntc-home").addEventListener("click", function(){cargarFormulario("ntc");}, false);
			document.getElementById("nif-home").addEventListener("click", function(){cargarFormulario("nif");}, false);
			document.getElementById("dni-home").addEventListener("click", function(){cargarFormulario("dni");}, false);
			document.getElementById("nie-home").addEventListener("click", function(){cargarFormulario("nie");}, false);
			document.getElementById("naf-home").addEventListener("click", function(){cargarFormulario("naf");}, false);
			document.getElementById("cccss-home").addEventListener("click", function(){cargarFormulario("cccss");}, false);
		break;
		case "iban" :
			urlEntidad = "";
			document.forms[formulario].elements[0].addEventListener("keydown",function(){permitirSolo(event,"letra");}, false);
			document.forms[formulario].elements[0].addEventListener("keyup",function(){capitalizar(this); tabular(event, 0); borrarAlerta(event);}, false);
			document.forms[formulario].elements[1].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[1].addEventListener("keyup",function(){tabular(event, 1); borrarAlerta(event);}, false);
			document.forms[formulario].elements[2].addEventListener("keydown",function(){permitirSolo(event,"numLetra");}, false);
			document.forms[formulario].elements[2].addEventListener("keyup",function(){capitalizar(this);borrarAlerta(event);}, false);
		break;
		case "ccc" :
			urlEntidad = "";
			document.forms[formulario].elements[0].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[0].addEventListener("keyup",function(){capitalizar(this); tabular(event, 0); borrarAlerta(event);}, false);
			document.forms[formulario].elements[1].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[1].addEventListener("keyup",function(){tabular(event, 1); borrarAlerta(event);}, false);
			document.forms[formulario].elements[2].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[2].addEventListener("keyup",function(){tabular(event, 2); borrarAlerta(event);}, false);
			document.forms[formulario].elements[3].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[3].addEventListener("keyup",function(){borrarAlerta(event);}, false);
		break;
		case "ntc" :
		case "naf":
		case "cccss":
			document.forms[formulario].elements[0].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[0].addEventListener("keyup",function(){borrarAlerta(event);}, false);
		break;
		case "dni" :
			document.forms[formulario].elements[1].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[1].addEventListener("keyup",function(){tabular(event, 1); borrarAlerta(event);}, false);
			document.forms[formulario].elements[2].addEventListener("keydown",function(){permitirSolo(event,"letra");}, false);
			document.forms[formulario].elements[2].addEventListener("keyup",function(){capitalizar(this); borrarAlerta(event);}, false);
		break;
		case "nie" :
			document.forms[formulario].elements[0].addEventListener("change",function(){cambiarPropiedadesNIE();}, false);
			document.forms[formulario].elements[1].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[1].addEventListener("keyup",function(){tabular(event, 1); borrarAlerta(event);}, false);
			document.forms[formulario].elements[2].addEventListener("keydown",function(){permitirSolo(event,"letra");}, false);
			document.forms[formulario].elements[2].addEventListener("keyup",function(){capitalizar(this); borrarAlerta(event);}, false);		
		break;
		case "nif" :
			document.forms[formulario].elements[0].addEventListener("change",function(){cambiarPropiedadesNIF();}, false);
			document.forms[formulario].elements[1].addEventListener("keydown",function(){permitirSolo(event,"num");}, false);
			document.forms[formulario].elements[1].addEventListener("keyup",function(){tabular(event, 1); borrarAlerta(event);}, false);
			document.forms[formulario].elements[2].addEventListener("keydown",function(){permitirSolo(event,"numLetra");}, false);
			document.forms[formulario].elements[2].addEventListener("keyup",function(){capitalizar(this); borrarAlerta(event);}, false);		
		break;
		case "about" :
			propiedadesEquipo.visorPDF = !detectarComplementoVisorPDF() ? " ... " : detectarComplementoVisorPDF();
			var mensajeCapacidadPDF = comprobarCapacidadPDF() === 0 ? "<span class='texto-capital'>" + propiedadesEquipo.visorPDF + "</span>" : "<span class='texto-capital'>" + propiedadesEquipo.visorPDF + "</span><div style='width:90%;margin-top:6px;font-size:x-small;text-align:justify' class='texto-falsa-negrita'>Para visualizar el contenido de los archivos PDF desde cualquier aplicación AIR, necesitas tener previamente instalado el -genuino- reproductor estándar Adobe READER (versión 8.1 ó superior). Que puedes obtener gratis desde la página oficial: <a id='about-reader' href='#' class='enlaceTexto'>https://get.adobe.com/es/reader/</a></div>";
			document.getElementById("about-versiones").innerHTML = propiedadesPrograma.versiones.tipo;
			document.getElementById("about-tirada").innerHTML = propiedadesPrograma.tirada;
			document.getElementById("about-id").innerHTML = propiedadesPrograma.identificador;
			document.getElementById("about-base-datos").innerHTML = propiedadesPrograma.baseDatosFecha;
			document.getElementById("registro-BE").addEventListener("click",function(){abrirEnNavegador("http://www.bde.es/bde/es/secciones/servicios/Particulares_y_e/Registros_de_Ent/");}, false);			
			document.getElementById("about-so").innerHTML = propiedadesEquipo.sistemaOperativoNombreComercial;
			document.getElementById("about-so-interno").innerHTML = propiedadesEquipo.sistemaOperativoNombreInterno;
			document.getElementById("about-idioma").innerHTML = propiedadesEquipo.idioma;
			document.getElementById("about-pantalla").innerHTML = propiedadesEquipo.pantalla;
			document.getElementsByClassName("about-runtime")[0].innerHTML = propiedadesEquipo.motorAIR;
			document.getElementsByClassName("about-runtime")[1].innerHTML = propiedadesEquipo.motorAIRcomercial;
			document.getElementById("about-flash").innerHTML = propiedadesEquipo.flashPlayer;
			document.getElementById("about-webkit").innerHTML = propiedadesEquipo.webkit;			
			document.getElementById("about-visor-pdf").innerHTML = mensajeCapacidadPDF;				
			document.getElementById("about-enlace-doc").addEventListener("click",function(){abrirArchivoConProgramaDeterminado();}, false);
			document.getElementById("about-enlace-github").addEventListener("click",function(){abrirEnNavegador("https://github.com/fooghub/Cdocs-HTML-Javascript-AIR");}, false);
			document.getElementById("about-enlace-visor-fuente").addEventListener("click",function(){verRecursos();}, false);			
			document.getElementById("about-enlace-licencia").addEventListener("click",function(){abrirNuevaVentanaNativa("html/LICENSE/license.html", null, "applicationDirectory", "utilidad");}, false);
			document.getElementById("about-enlace-licencia-air").addEventListener("click",function(){abrirNuevaVentanaNativa("html/print/containerPDF.html", "app:/pdf/air_sdk_license.pdf", "applicationDirectory", "normal");}, false);
			document.getElementById("about-enlace-web").addEventListener("click",function(){abrirEnNavegador("http://www.foog.es/");}, false);
			if(document.getElementById("about-reader")){
				document.getElementById("about-reader").addEventListener("click",function(){abrirEnNavegador("https://get.adobe.com/es/reader/");}, false);
			}
		break;
		case "update" :
		document.getElementById("update-so").innerHTML = propiedadesEquipo.sistemaOperativoNombreComercial;
		document.getElementById("update-runtime").innerHTML = propiedadesEquipo.motorAIR;
		document.getElementById("update-versiones-instalada").innerHTML = propiedadesPrograma.versiones.larga;
		document.getElementById("update-versiones-actualizaciones").innerHTML = propiedadesPrograma.versiones.actualizaciones;
		document.getElementById("update-mensaje").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
		document.getElementById("alerta-update").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
		break;
		case "download" :
		document.getElementById("download-so").innerHTML = propiedadesEquipo.sistemaOperativoNombreComercial;
		document.getElementById("download-runtime").innerHTML = propiedadesEquipo.motorAIR;
		document.getElementById("download-versiones-instalada").innerHTML = propiedadesPrograma.versiones.larga;
		document.getElementById("download-versiones-actualizaciones").innerHTML = propiedadesPrograma.versiones.actualizaciones;
		descargarActualizaciones();
		break;
	}
}

/**
* Función - cambiarEstadoBotones - Botones: MENÚ, INICIO, NUEVO, IMPRIMIR, VALIDAR. Recorrido : -1 Oculto, 0 Inactivo, 1 Activo, 2 Dejar como está.
**/
function cambiarEstadoBotones(estado){
	estado = estado || "inicial";
	var formulariosInformativos = ["home", "about", "update", "download"]; 
	var botonesOcultos = (formulariosInformativos.indexOf(formularioActivo,0) === -1) ? false : true;
	var recorrido = [2,2,2,2,2];
	var etiqueta3 = "", etiqueta4 = "";
	switch(estado){
		case "inicial" :
		if(formularioActivo){ 
			if(formularioActivo === ""){
				recorrido = [1,1,-1,-1,1];
				etiqueta4 = "SALIR";
			}else if(formularioActivo === "home"){
				recorrido = [1,-1,-1,-1,1];
				etiqueta4 = "INFORMACIÓN";				
			}else if(formularioActivo === "about"){
				recorrido = [1,1,-1,-1,1];
				etiqueta4 = "ACTUALIZAR";
				botonesOcultos = true;
			}else if(formularioActivo === "update"){
				if(propiedadesPrograma.versiones.actualizacionesDisponibles){
					etiqueta4 = "DESCARGAR";
				}else{
					etiqueta4 = "CANCELAR";
				}				
				recorrido = [1,-1,-1,-1,1];
			}else if(formularioActivo === "download"){
				etiqueta4 = "CANCELAR";
				recorrido = [-1,-1,-1,-1,1];
			}else{
				recorrido = [1,1,0,0,1];
				etiqueta4 = "VALIDAR";				
			}
		}else{
			recorrido = [1,1,-1,-1,1];
			etiqueta4 = "SALIR";
		}
		break;
		case "procesando" :
		recorrido = [0,0,0,0,0];
		break;
		case "acierto" :
		recorrido = [1,1,1,1,0];
		break;
		case "error":
		recorrido = [1,1,1,0,0];
		break;
		case "mnu-activo" :
		recorrido = [1,2,2,2,2];
		break;
		case "mnu-inactivo" :
		recorrido = [0,2,2,2,2];
		break;
		case "descarga-cancelada" : 
		recorrido = [1,-1,-1,-1,1];
		etiqueta4 = "INICIO";
		break;		
	}
	
	for(contador = 0; contador < botones.length; contador++){
		var cambio = recorrido[contador];
		switch(cambio){
			case - 1 :
			document.getElementById(botones[contador]).className = "";
			document.getElementById(botones[contador]).className = "botones-oculto";
			break;
			case 0 :
			
			if(botonesOcultos){
				if(document.getElementById(botones[contador]).className !== "botones-oculto"){
				document.getElementById(botones[contador]).className = "";
				document.getElementById(botones[contador]).className = "botones-inactivo";
				}
			}else{
				document.getElementById(botones[contador]).className = "";
				document.getElementById(botones[contador]).className = "botones-inactivo";
			}
			
			
			break;
			case 1 :
			document.getElementById(botones[contador]).className = "";
			document.getElementById(botones[contador]).className = "botones-activo";
			break;
		}
	}
	if(etiqueta3 !== "") document.getElementById(botones[3]).innerHTML = etiqueta3;
	if(etiqueta4 !== "") document.getElementById(botones[4]).innerHTML = etiqueta4;
}

/**
* Función - capturarPulsacionesTeclado - Llamada a las funciones validarFormulario() e imprimirFormulario(),
* si se captura la pulsación de la tecla "INTRO" o las teclas Alt+P, respectivamente.
**/
function capturarPulsacionesTeclado(event){
	event.stopPropagation();
	var elemento;
	if(!event.altKey && event.keyCode === 13){
		elemento = document.getElementById("botones-validar");
		if(elemento.className === "botones-activo" && elemento.innerHTML === "VALIDAR"){
			if(formularioActivo){
				validarFormulario(formularioActivo);
			}
		}
	}else if(event.altKey && event.keyCode === 80){
		elemento = document.getElementById("botones-imprimir");
		if(elemento.className === "botones-activo" && /rimir$/i.test(elemento.innerHTML)){
			if(formularioActivo){
				imprimirFormulario(formularioActivo);
			}
		}	
	}
}

/**
* Función - validarFormulario - Llamada a las funciones de cálculo de dígitos de control para verificar
* los datos introducidos.
**/
function validarFormulario(){
	if(document.getElementById("botones-validar").className === "botones-inactivo" || document.getElementById("botones-validar").className === "botones-oculto") return;
	
	if( formularioActivo === "" && document.getElementById("botones-validar").innerHTML === "SALIR"){
		salir();
		return;
	}
	
	if(document.getElementById("botones-validar").innerHTML === "INFORMACIÓN"){
		cargarFormulario("about");
		return;
	}else if(document.getElementById("botones-validar").innerHTML === "INICIO"){
		  cargarFormulario("home");
		return;
	}else if(document.getElementById("botones-validar").innerHTML === "ACTUALIZAR"){
		  comprobarActualizaciones();
		return;	
	                                                                   
  }else if(document.getElementById("botones-validar").innerHTML === "DESCARGAR"){
		cargarFormulario("download");
		return;	
	} else if(document.getElementById("botones-validar").innerHTML === "CANCELAR"){
		if(formularioActivo === "update"){
			cargarFormulario("home");
		}
		
		if(formularioActivo === "download"){
			if(actualizacionesTarea === "descarga"){
				cancelarDescargaActualizaciones();
			
			}else{
				eliminarArchivosResiduales("update");
				cargarFormulario("home");				
			}
		}
		return;
	}		
	for(contador = 0; contador < document.forms[formularioActivo].length; contador++){
	if((document.forms[formularioActivo].elements[contador].type === "text")&&(document.forms[formularioActivo].elements[contador].value === "")){document.forms[formularioActivo].elements[contador].focus();return;}
	}
	for(contador = 0; contador < document.forms[formularioActivo].length; contador++){
		if(document.forms[formularioActivo].elements[contador].type === "text"){document.forms[formularioActivo].elements[contador].value = document.forms[formularioActivo].elements[contador].value.eliminarEspaciosEnBlanco();}
	}
	cambiarEstadoBotones("procesando");
	switch(formularioActivo){
		case "iban" :
		verificarIBAN(document.forms[0].elements[0].value , document.forms[0].elements[1].value,  document.forms[0].elements[2].value);
		break;
		case "ccc" :
		document.forms.ccc.elements[0].value = rellenarConCeros(document.forms.ccc.elements[0].value,4);
		document.forms.ccc.elements[1].value = rellenarConCeros(document.forms.ccc.elements[1].value,4);
		document.forms.ccc.elements[2].value = rellenarConCeros(document.forms.ccc.elements[2].value,2);
		document.forms.ccc.elements[3].value = rellenarConCeros(document.forms.ccc.elements[3].value,10);
		verificarCCC(document.forms.ccc.elements[0].value, document.forms.ccc.elements[1].value, document.forms.ccc.elements[2].value, document.forms.ccc.elements[3].value);
		break;
		case "ntc" :
		verificarNTC(document.forms.ntc.elements[0].value);
		break;
		case "dni" :
		document.forms.dni.elements[1].value = rellenarConCeros(document.forms.dni.elements[1].value,8);
		verificarDNI_NIE("dni", document.forms.dni.elements[1].value+document.forms.dni.elements[2].value);
		break;
		case "nie":
		document.forms.nie.elements[1].value = rellenarConCeros(document.forms.nie.elements[1].value,7);
		verificarDNI_NIE("nie", document.forms.nie.elements[0].value+document.forms.nie.elements[1].value+ document.forms.nie.elements[2].value);
		break;
		case "nif":
		document.forms.nif.elements[1].value = rellenarConCeros(document.forms.nif.elements[1].value, document.getElementById("valor-nif").maxLength);
		verificarNIF(document.forms.nif.elements[0].value+document.forms[0].elements[1].value+ document.forms.nif.elements[2].value);
		break;
		case "naf" :
		verificarNAF_CCCSS("naf", document.forms.naf.elements[0].value);
		break;
		case "cccss" :
		verificarNAF_CCCSS("cccss", document.forms.cccss.elements[0].value);
		break;
	}
}

/**
* Función - anunciarError - Visualiza un mensaje de error.
**/
function anunciarError(formulario, mensaje, numError){
	numError = numError || null;
	document.getElementById("imagen-estado").src="images/icono_2.png";	
	document.getElementById("alerta-" + formulario).innerHTML = mensaje;
	switch (formulario){
		case "iban" :
		if(numError === 1){
			document.forms.iban.elements[0].focus();	
		}else if (numError === 2){
			document.forms.iban.elements[1].focus();		
		}else if (numError === 3){
			document.forms.iban.elements[2].focus();
		}else if (numError === 4){
			seleccionarTexto(document.forms.iban.elements[2], 0, document.forms.iban.elements[2].value.length);	
		}else if(numError === 5){
			seleccionarTexto(document.forms.iban.elements[0], 0, 2);	
		}else if(numError === 6){
			seleccionarTexto(document.forms.iban.elements[1], 0, 2);	
		}else{
			document.forms.iban.elements[2].focus();
		}
		break;
		case "ntc" :
		case "naf" :
		case "cccss" :
		var largo = (formulario === "cccss") ? 11 : 12;
		var resta = (formulario === "ntc") ? 1 : 2;
		if(document.forms[formulario].elements[0].value.length < largo) {
			document.forms[formulario].elements[0].focus();
		}else{
			seleccionarTexto(document.forms[formulario].elements[0], document.forms[formulario].elements[0].value.length - resta, document.forms[formulario].elements[0].value.length);
		}
		break;
		case "dni":
		case "nie":
		case "nif":
		seleccionarTexto(document.forms[formulario].elements[2], 0,1);
		break;
		case "ccc":
		seleccionarTexto(document.forms.ccc.elements[2], 0,2);
		break;
	}
	cambiarEstadoBotones("error");
}

/**
* Función - seleccionarTexto - Selección de un fragmento de texto entre las posiciones indicadas.
**/
function seleccionarTexto(elemento,desde,hasta) {
	if ("selectionStart" in elemento) {
		elemento.selectionStart = desde;
		elemento.selectionEnd = hasta;
		elemento.focus ();
	}
}

/**
* Función - mostrarAcierto - Visualiza la información relacionada con una verificación acertada.
**/
function mostrarAcierto(formulario, mensaje){
	document.getElementById("imagen-estado").src="images/icono_1.png";
	var resultados = document.getElementById("salida-" + formulario);
	resultados.innerHTML = resultados.innerHTML + mensaje;
	for(contador = 0; contador < document.forms[formulario].length; contador++){
		if(document.forms[formulario].elements[contador].type === "text"){
			document.forms[formulario].elements[contador].readOnly = true;
		}
		else if(document.forms[formulario].elements[contador].type === "select-one"){
			document.forms[formulario].elements[contador].disabled = true;
		}else if(document.forms[formulario].elements[contador].type === "hidden"){
			document.forms[formulario].elements[contador].value = formularioValorOculto;
		}
		if(document.forms[formulario].elements[contador].value.length > 1) document.forms[formulario].elements[contador].style.textAlign = "center";
	}
	document.getElementById("verificado-" + formulario).style.visibility = "visible";
	if((formulario === "iban" || formulario === "ccc") && urlEntidad !== ""){
		if (document.getElementById("enlaceEntidad-" + formulario)) document.getElementById("enlaceEntidad-" + formulario).addEventListener("click",function(){abrirEnNavegador(urlEntidad);},false);
	}
	document.getElementById("alerta-" + formulario).innerHTML =plantillaAlertaInfo;
	cambiarEstadoBotones("acierto");	
}

/**
* Función - restaurarFormulario - Devuelve el formulario activo a su estado inicial.
**/
function restaurarFormulario(){
	if(document.getElementById("botones-nuevo").className === "botones-inactivo" || document.getElementById("botones-nuevo").className === "botones-oculto" || formularioActivo === "") return;
	var formulario = formularioActivo;
	for(contador = 0; contador < document.forms[formulario].length; contador++){
		if(document.forms[formulario].elements[contador].type === "text"){
			document.forms[formulario].elements[contador].readOnly = false;
			if(document.forms[formulario].elements[contador].getAttribute("maxlength") > 1) document.forms[formulario].elements[contador].style.textAlign = "left";
			document.forms[formulario].elements[contador].value = "";
		}else if(document.forms[formulario].elements[contador].type === "select-one"){
			document.forms[formulario].elements[contador].disabled = false;
		}else if(document.forms[formulario].elements[contador].type === "hidden"){
			document.forms[formulario].elements[contador].value = "";
		}
	}
	document.getElementById("verificado-" + formulario).style.visibility = "hidden";
	document.getElementById("imagen-estado").src="images/icono_0.png";
	urlEntidad = "";
	if(document.getElementById("salida-" + formulario).parentNode.length > 1){
		document.getElementById("salida-" + formulario).removeChild(document.getElementById("salida-" + formulario).lastChild);
	}
	if(formulario === "nif"){
		document.getElementById("texto-informativo-nif").innerHTML = "SIETE NÚMEROS";
		document.getElementById("valor-nif").maxLength = "7";
		document.getElementById("letra-nif").placeholder = "(N/L)";		
	}
	for(contador = 0; contador < document.forms[0].length; contador++){
		if((document.forms[formulario].elements[contador].type === "text")&&(document.forms[formulario].elements[contador].value === "")){document.forms[formulario].elements[contador].focus(); break;}
	}
	borrarAlertaVoluntario(formulario);
	document.getElementById(formulario).reset();
	cambiarEstadoBotones("inicial");
}


/**
* Función - permitirSolo - Permite la entrada de sólo números, letras y letras/números.
**/
function permitirSolo(eventoTeclado,caracteres){
	var tecla=eventoTeclado.keyCode;
	for(contador=0;contador<=teclasRestringidas.length;contador++){if(tecla===teclasRestringidas[contador]){return;}}
	switch(caracteres){
		case "num" :
		if (eventoTeclado.altKey || eventoTeclado.ctrlKey || eventoTeclado.shiftKey){eventoTeclado.returnValue = false;}
		if(tecla<48){eventoTeclado.returnValue = false;}
		else if(tecla>=48 && tecla<=57){return;}
		else if(tecla>57 && tecla<96){eventoTeclado.returnValue = false;}
		else if(tecla>=96 && tecla<=105){return;}
		else{eventoTeclado.returnValue = false;}
		break;
		case "letra" :
		if (eventoTeclado.altKey || eventoTeclado.ctrlKey){eventoTeclado.returnValue = false;}
		if(tecla < 65 || tecla > 90){eventoTeclado.returnValue = false;}else{return;}
		break;
		case "numLetra" :
		if (eventoTeclado.altKey || eventoTeclado.ctrlKey){eventoTeclado.returnValue = false;}
		if(eventoTeclado.shiftKey && tecla <= 57 && tecla >= 48){eventoTeclado.returnValue = false;} 
		if(tecla < 48){eventoTeclado.returnValue = false;}
		else if(tecla >= 48 && tecla <= 57){return;}
		else if(tecla > 57 && tecla < 65){eventoTeclado.returnValue = false;}
		else if(tecla >= 65 && tecla <= 90){return;}
		else if(tecla > 90 && tecla < 96){eventoTeclado.returnValue = false;}
		else if(tecla >= 96 && tecla <= 105){return;}
		else{eventoTeclado.returnValue = false;}
		break;
	}
}

/**
* Función - capitalizar - Convierte a mayúsculas los caracteres alfabéticos del valor de un campo.
**/
function capitalizar(campo){
	campo.value=campo.value.toString().toUpperCase();
}

/**
* Función - rellenarConCeros - Rellena con ceros "0" el valor de un campo hasta alcanzar la longitud máxima permitida.
**/
function rellenarConCeros(cadena,ceros){
	var salida = String("");
	cadena = cadena.toString();
	if (cadena.length < parseInt(ceros, 10)){
		for (var i=ceros; i > cadena.length; i--){salida = salida+"0";}
	}
	return salida.concat(cadena);
}

/**
* Función - tabular - Tabulación derecha entre campos (vacíos).
**/
function tabular(eventoTeclado,elemento){
	var key = eventoTeclado.keyCode;
	for(contador = 0;contador <= teclasRestringidas.length;contador++){if(key==teclasRestringidas[contador]){return;}}
	var largoMax=document.forms[0].elements[elemento].getAttribute("maxlength");
	var largoValor=document.forms[0].elements[elemento].value.length;
	if(largoValor == largoMax){
		elemento=++elemento;
		largoMax = document.forms[0].elements[elemento].getAttribute("maxlength");
		largoValor = document.forms[0].elements[elemento].value.length;
		if(largoValor == largoMax){return;}else{document.forms[0].elements[elemento].focus();}
	}
}

/**
* Función - borrarAlerta - Elimina automáticamente el mensaje informativo cuando recibe una pulsación del teclado.
**/
function borrarAlerta(eventoTeclado){
	var tecla = eventoTeclado.keyCode;
	if(tecla != 13 && errorValidar === true){
		var espera;
		clearTimeout(espera);
		espera = setTimeout(function(){document.getElementById("alerta-" + formularioActivo).innerHTML = "&#160;"; errorValidar=false; document.getElementById("imagen-estado").src="images/icono_0.png";cambiarEstadoBotones("inicial");},10);
	}
}

/**
* Función - borrarAlertaVoluntario - Elimina el mensaje informativo.
**/
function borrarAlertaVoluntario(formulario){
	document.getElementById("alerta-" + formulario).innerHTML = "&#160;";
	errorValidar=false;
	document.getElementById("imagen-estado").src="images/icono_0.png";
	cambiarEstadoBotones("inicial");		
}

/**
* Función - lanzarEvento - Despacha el evento (nombreEvento) solicitado, sobre el elemento indicado.
**/
function lanzarEvento(elemento,nombreEvento){
	var evento = document.createEvent("HTMLEvents");
	evento.initEvent(nombreEvento, true, true );
	return !elemento.dispatchEvent(evento);
}

/**
* Función - notificarConHumanJS - Visualiza mensajes de notificación tipo "toast".
* Dependencias: humane-min.js
* Humanized Messages for Notifications
* @author Marc Harter (@wavded)
* @license MIT
* See more usage examples at: http://wavded.github.com/humane-js/
**/
function notificarConHumanJS(mensaje,tipo,espera){
	var argumentos = arguments.length;
	switch(argumentos){
	case 1 :
	tipo = "normal";
	espera = 2500;
	break;
	case 2 :
	espera = (tipo == "normal") ? 2500 : 5000;
	break;
	}
	var clase =  (tipo == "normal") ? "humane-original" : "humane-original-error";
	humane.log(mensaje, { timeout: espera, clickToClose: true, addnCls: clase }, function(){cambiarEstadoBotones("mnu-activo");});
}

/**
* Función - cargarFormulario - Carga de contenidos en la ventana principal. AJAX tradicional.
**/
function cargarFormulario(formulario){
	
	if(formulario === "portada"){
		if(document.getElementById("botones-inicio").className === "botones-inactivo" || document.getElementById("botones-inicio").className === "botones-oculto"){
			return;
		}else{
			formulario = "home";
		} 
	}	
	document.getElementById("imagen-estado").src="images/icono_0.png";
	formularioActivo= ""; errorAJAX = false; formularioValorOculto = "";
	var errorSolicitudMensaje = "ninguno";
	var formularioEnMnu = formularios.indexOf(formulario,0);
	desactivarElementoMnu(formularioEnMnu);
	var solicitud = new XMLHttpRequest();
	solicitud.onreadystatechange = function(){
		if (solicitud.readyState === 4 && solicitud.status == 200) {
			document.getElementById("contenido").innerHTML = solicitud.responseText;
			formularioActivo = formulario;
			cambiarTitularVentanaNativa(formulario);
			asociarEventos(formulario);
			cambiarEstadoBotones("inicial");
			errorAJAX = false;
			if(formulario === "about"){
				document.getElementById("pie").style.visibility = "visible";
			}else{
				document.getElementById("pie").style.visibility = "hidden";
			}
		}
	};
	solicitud.open("GET","html/forms/" + formulario + ".html",false);
	try{
		solicitud.send(null);
	}catch(error){
		errorSolicitudMensaje = error;
	}finally{
		document.getElementById("pie-anualidad-corriente").innerHTML = fechaSistema.aaaa;
		if(protector.activo) protector.cerrar();
		if(errorSolicitudMensaje !== "ninguno"){
			errorAJAX = true;
			var errorAJAXtexto = "<div class='errorAJAX'><img src='images/alerta_128.png' alt='' title='' /><div>¡¡ATENCIÓN!!</div><p>" + errorSolicitudMensaje + "</p><p>Recurso - app:/html/forms/" + formulario + ".html</p></div>";
			solicitud.abort();
			document.getElementById("contenido").innerHTML = errorAJAXtexto;
			cambiarTitularVentanaNativa(formulario);
			cambiarEstadoBotones("inicial");
			document.getElementById("pie").style.visibility = "hidden";
		}		
	}
}	

/**
* Función - obtenerFecha - Formato de un objeto fecha.
**/
function obtenerFecha (objetoFecha){
	objetoFecha = objetoFecha || null;
	var fecha, D, M, A;
	if(objetoFecha !== null){
	if(isNaN(objetoFecha)){
		if(/^\d{1,2}[./-]\d{1,2}[./-]\d{4,}$/.test(objetoFecha)){
			objetoFecha = objetoFecha.replace(/\/|\./g,"-");
			objetoFecha = objetoFecha.split("-").reverse().join("-");
		}else if(/^\d{4,}[./-]\d{1,2}[./-]\d{1,2}$/.test(objetoFecha)){
			objetoFecha = objetoFecha.replace(/\/|\./g,"-");
		}else{
			notificarConHumanJS("ERROR FECHA:<BR />Wrong date format", "error");
		}
		D = objetoFecha.split("-")[2]; 
		M = objetoFecha.split("-")[1];
		A = objetoFecha.split("-")[0];
		if(A < 1000) A = 1000;
		if(A > 9999) A = 9999;
		if (M < 1) M  = 1;
		if (M > 12) M = 12;
		if (D < 1) D = 1;
		if (D > new Date(A, M, 0).getDate()) D = new Date(A, M, 0).getDate();
		if(D < 1 || D > 31 || M < 1 || M > 12){
			notificarConHumanJS("ERROR FECHA:<BR />Wrong date format", "error");
		}
		if(A < 1000 || A > 9999){
			notificarConHumanJS("ERROR FECHA:<BR />Date out of ranget", "error");
		}
		fecha = new Date(A, M -1, D);
	}else{
		if(parseInt(objetoFecha,10) < -30610227600000 || parseInt(objetoFecha,10) > 253402210800000){
			notificarConHumanJS("ERROR FECHA:<BR />Date out of ranget", "error");
		}else{
			fecha =  new Date(parseInt(objetoFecha,10));
		}
	}
	}else{
		fecha = new Date();
	}
	var semana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
	var weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]; 
	var meses =  ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
	var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
	this.d = fecha.getDate();
	this.dd = ((this.d < 10) ? "0" + this.d : this.d);
	this.nDs =  fecha.getDay(); //Número de día de la semana
	this.dsemana = semana[this.nDs];
	this.wd = weekdays[this.nDs];
	this.m = fecha.getMonth() + 1;
	this.mm = ((this.m < 10) ? "0" + this.m : this.m);
	this.mes = meses[fecha.getMonth()];
	this.mo = months[fecha.getMonth()];
	this.aaaa = fecha.getFullYear();
	this.bisiesto = (new Date(this.aaaa, 2, 0).getDate() === 29) ? true : false;
	this.horas = ((fecha.getHours() < 10) ? "0" + fecha.getHours() : fecha.getHours());
	this.minutos = ((fecha.getMinutes() < 10) ? "0" + fecha.getMinutes() : fecha.getMinutes());
	this.segundos = ((fecha.getSeconds() < 10) ? "0" + fecha.getSeconds() : fecha.getSeconds());
	this.uDm = new Date(this.aaaa, this.m, 0).getDate(); //Último día del mes
	this.pDm = new Date(this.aaaa, this.m - 1, 1).getDay(); //Día de la semana del primero del mes	
	this.marcaTemporal = Date.parse(fecha);		
}

/**
* Función - detectarComplementoVisorPDF - Intenta detectar la marca y el tipo de plugin instalado
* en el equipo para visualizar archivos PDF (devuelve 'false' si no detecta nada).
**/
function detectarComplementoVisorPDF(){
	var complementoPDF = (navigator.mimeTypes && navigator.mimeTypes["application/pdf"]);
	var complementoDatos = []; 
	if (typeof complementoPDF !== 'undefined') {
		if (complementoPDF.enabledPlugin){
			if(complementoPDF.enabledPlugin.name){
				complementoDatos[0] = complementoPDF.enabledPlugin.name;
			}
			if(complementoPDF.enabledPlugin.version){
				complementoDatos[1] = complementoPDF.enabledPlugin.version;
			}else{
				if(complementoPDF.enabledPlugin.description && /\d/g.test(complementoPDF.enabledPlugin.description)){
					complementoDatos[1] = complementoPDF.enabledPlugin.description.replace(/[^\d\.]/g, '');
				}
			}				
		}
	}
	if(complementoDatos.length === 0){
		complementoDatos = false;
	}else if(complementoDatos.length === 2){
		complementoDatos = complementoDatos[0] + " " + complementoDatos[1];
	}else{
		complementoDatos = complementoDatos[0];
	}	
	return complementoDatos;	
}

/**
* Función - cambiarPropiedadesNIF - Cambia las propiedades de entrada del formulario 'nif'.
**/
function cambiarPropiedadesNIF(){	
	var seleccionado = document.getElementById("selector-nif").value;
	if(seleccionado === "I"){ //DNI
		document.getElementById("texto-informativo-nif").innerHTML = "OCHO NÚMEROS";
		document.getElementById("valor-nif").maxLength = "8";
		document.getElementById("letra-nif").placeholder = "LETRA";
	}else{
		document.getElementById("texto-informativo-nif").innerHTML = "SIETE NÚMEROS";
		document.getElementById("valor-nif").maxLength = "7";
		document.getElementById("letra-nif").placeholder = "(N/L)";
	}
	if(document.getElementById("valor-nif").value !== "") document.getElementById("valor-nif").value = "";
	if(document.getElementById("letra-nif").value !== "") document.getElementById("letra-nif").value = "";
	document.getElementById("valor-nif").focus();
	borrarAlertaVoluntario("nif");	
}

/**
* Función - cambiarPropiedadesNIE - Restaura el formulario 'nie', si detecta un cambio en el selector de la primera letra.
**/
function cambiarPropiedadesNIE(){	
//var seleccionado = document.getElementById("selector-nie").value;
if(document.getElementById("valor-nie").value !== "") document.getElementById("valor-nie").value = "";
if(document.getElementById("letra-nie").value !== "") document.getElementById("letra-nie").value = "";
document.getElementById("valor-nie").focus();
borrarAlertaVoluntario("nie");	
}

/**
* Funciones de cálculo:
**/

/**
* Función - verificarIBAN - 
* Dependencias : iban.js
* https://github.com/arhs/iban.js/tree/master 
**/
function verificarIBAN(lugar, dc, cuenta){
	var iban = lugar + dc + cuenta, acierto = false, errorIBANjs = "", separador = " " , ccc, fromccc, consistenciaCuenta = false, ibanTexto, ibanElec, mensaje = ""; 
	if(document.forms.iban.elements[0].value.length < 2) {
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El código (ISO) del país está formado por DOS caracteres alfabéticos.</span></span>";
		errorValidar=true;
		anunciarError("iban", mensaje, 1);
		return;
	}
	if(document.forms.iban.elements[1].value.length < 2) {
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>En el IBAN los dígitos de control (DC) son DOS números.</span></span>";
		errorValidar=true;
		anunciarError("iban", mensaje, 2);
		return;
	}
	if(document.forms.iban.elements[0].value === "ES" && document.forms.iban.elements[2].value.length !== 20) {
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El Código de cuenta (en España) está formado por VEINTE números.</span></span>";
		errorValidar=true;
		anunciarError("iban", mensaje, 3);
		return;
	}

	if(document.forms.iban.elements[0].value === "ES" && isNaN(document.forms.iban.elements[2].value)) {
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El Código de cuenta (en España) sólo admite NÚMEROS. Gracias.</span></span>";
		errorValidar=true;
		anunciarError("iban", mensaje, 4);
		return;
	}

	try{
		acierto =  IBAN.isValid(iban) ;
		ccc = IBAN.toBBAN(iban, separador);
		//fromccc = IBAN.fromBBAN(lugar, ccc);
		consistenciaCuenta = IBAN.isValidBBAN(lugar, ccc);
		ibanTexto =  IBAN.printFormat(iban, separador);
		//ibanElec = IBAN.electronicFormat(iban);
	}catch(error){
		errorIBANjs = error;	
	}finally{
		if(errorIBANjs !== ""){
			if(/No country with code/.test(errorIBANjs)){	 
				mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>La aplicación no registra ningún país con el código: &#8220;<span class='alerta-texto-error-dc'>"+lugar+"</span>&#8221;.</span>";
				errorValidar=true;
				anunciarError('iban', mensaje, 5);
				return;	
			}else if(/^TypeError: Result of expression \'this\.\_regex\(\)\.exec\(iban.slice\(4\)\)\' \[null\] is not an object\.$/.test(errorIBANjs) || /Invalid BBAN/.test(errorIBANjs)){
				mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>Formato de Código de Cuenta inadecuado para país con código: &#8220;" + lugar + "&#8221.</span></span>";
				errorValidar=true;
				anunciarError("iban", mensaje, 4);
				return;		
			}else{
				mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + errorIBANjs + ".</span></span>";
				errorValidar=true;
				anunciarError("iban", mensaje);
				return;	
			}
		}else{
			if(!acierto){
				mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>IBAN erróneo. Por favor, revisa TODOS los datos introducidos.</span></span>";
				errorValidar=true;
				if(consistenciaCuenta){
					anunciarError("iban", mensaje,6);
					return;	
				}else{
					anunciarError("iban", mensaje,4);
					return;	
				}		
			}else{
				//Acierto
				if(lugar !== "ES"){
					var lugarNombre = (obtenerPaises(lugar) && obtenerPaises(lugar) !== "DESCONOCIDO") ? obtenerPaises(lugar) : "DESCONOCIDO";
					mensaje = "<div class='formulario-salida-resultados'><hr class='separador' /><div>Código de Cuenta : " + ccc + "</div><div style='margin-top:6px;'>País: " + lugar + " &#8212; " + lugarNombre + ".</div></div>";
					formularioValorOculto = ibanTexto + "|" + ccc + "|" + lugarNombre;
				}else{
					var entidadBancaria = buscarEntidadBancaria(cuenta.substr(0, 4));
					if(entidadBancaria){
						if(entidadBancaria === "DESCONOCIDA"){
							formularioValorOculto = ibanTexto + "|" + ccc + "|" + "DESCONOCIDA";
							mensaje = "<div class='formulario-salida-resultados'><hr class='separador' /><div>Entidad: DESCONOCIDA</div></div>";	
						}else{
							var datos = entidadBancaria.split("|");
							formularioValorOculto = ibanTexto + "|" + ccc + "|" + datos[5] + " (España)|" + datos[3] + "|" + datos[4];
							if(datos[3] === ""){
								urlEntidad="http://app.bde.es/ren/app/Search?CFG=ConsultaDetalleEntidadCon.xml&TipoFormato=XSL&Paginate=OPEN&CODBE="+datos[0]+"&DONDE=11&RADIO=0&VDETALLE=S";			
								mensaje = "<div class='formulario-salida-resultados'><hr class='separador' /><div><a href='#' id='enlaceEntidad-iban' class='enlaceTexto'>"+datos[5]+"</a></div></div>";	
							}else{
								mensaje = "<div class='formulario-salida-resultados'><hr class='separador' /><div>" +datos[5] +"</div></div>";
							}
						}
					}else{
						formularioValorOculto = ibanTexto + "|" + ccc + "|" + "DESCONOCIDA";
						mensaje = "<div class='formulario-salida-resultados'><hr class='separador' /><div>Entidad: DESCONOCIDA</div></div>";
					} 
				}
				mostrarAcierto("iban", mensaje);
			}	
		}
	}
}

/**
* Función - verificarCCC - (Código Cuenta Cliente, bancario. España).
**/
function verificarCCC(banco,oficina,ddcc,cuenta){
	var docNum = "", docDC = "", mensaje = "", iban = "" , valorOculto="", ibanDC, sum1 = 0, sum2 = 0, multiplicador, dc1, dc2, mod;
	docNum = "00" + banco + oficina + cuenta;
	docDC = ddcc; 
	multiplicador = [1,2,4,8,5,10,9,7,3,6];
	for(var d = 0; d < docNum.length; d++){
		if (d <  10)	{sum1 += parseInt(docNum.charAt(d), 10) * multiplicador[d];}
		if (d >= 10)	{sum2 += parseInt(docNum.charAt(d), 10) * multiplicador[d - 10];}
	}
	dc1 = ((11 - (sum1 % 11)) >= 10) ? (11 - (11 - (sum1 % 11))).toString() : (11 - (sum1 % 11)).toString();
	dc2 = ((11 - (sum2 % 11)) >= 10) ? (11 - (11 - (sum2 % 11))).toString() : (11 - (sum2 % 11)).toString();
	if (docDC === (dc1 + dc2)){
		iban = banco+oficina;
		mod = parseInt(iban,10)%97;
		iban = mod.toString() + dc1 + dc2 + oficina.substring(0,2);
		mod = parseInt(iban,10)%97;
		iban = mod.toString()+ cuenta.substring(2,docNum.length) + "142800";
		mod = parseInt(iban,10)%97;
		ibanDC = ((98-mod) < 10) ? ("0" + (98-mod)) : (98-mod).toString();
		iban="ES"+ibanDC+banco+oficina+dc1+dc2+cuenta;
		//Acierto: 			
		valorOculto = "ES" + ibanDC + "|";
		var entidadBancaria = buscarEntidadBancaria(banco);
		if(entidadBancaria){
			if(entidadBancaria === "DESCONOCIDA"){
				valorOculto = valorOculto + "DESCONOCIDA";
				mensaje = "<div class='formulario-salida-resultados'><div>Entidad: DESCONOCIDA</div><div style='margin-top:12px;'>IBAN: " + iban + "</div></div>";	
			}else{
				var datos = entidadBancaria.split("|");
				if(datos[3] === ""){
					valorOculto = valorOculto + datos[1];
					urlEntidad="http://app.bde.es/ren/app/Search?CFG=ConsultaDetalleEntidadCon.xml&TipoFormato=XSL&Paginate=OPEN&CODBE="+datos[0]+"&DONDE=11&RADIO=0&VDETALLE=S";			
					mensaje = "<div class='formulario-salida-resultados'><div><a href='#' id='enlaceEntidad-ccc' class='enlaceTexto'>"+datos[5]+"</a></div><div style='margin-top:12px;'>IBAN: "+ iban + "</div></div>";	
				}else{
					valorOculto = valorOculto + datos[1] + "|" + datos[3] + "|" + datos[4];
					mensaje = "<div class='formulario-salida-resultados'><div>" +datos[5] +"</div><div style='margin-top:12px;'>IBAN: " + iban + "</div></div>";
				}
			}
		}else{
			mensaje = "<div class='formulario-salida-resultados'><div>Entidad: DESCONOCIDA</div><div style='margin-top:12px;'>IBAN: " + iban + "</div></div>";
		} 
		formularioValorOculto = valorOculto;
		mostrarAcierto("ccc", mensaje);
	}else{
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El Dígito de Control (DC) debería ser igual a &#8220;<span class='alerta-texto-error-dc'>" + (dc1 + dc2) + "</span>&#8221.</span>";
		errorValidar=true;
		anunciarError("ccc", mensaje);
	}
}


/**
* Función - verificarNTC - (Número de Tarjeta de Crédito/ Débito).
**/
function verificarNTC(valor){
	var docNum = "", docDC = "", emisora = "", entidad =  "", entidad1 =  "", mensaje = "", sum1 = 0, multiplicador, dc1, mod;
	if (valor.length >= 12){
		var luhn = [], entidadesPosibles = [];
		var entidades = [
		[/^3[47]\d{13}$/, "American Express",""],
		[/^(?:62|88)\d{14,17}$/, "China UnionPay", ""], 
		[/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, "Diners Club",""],
		[/^3(?:0[0-5][0-9]{11}|[68][0-9]{12}$)/, "Diners Club", "Carte Blanche"],
		[/^(?:2014|2149)\d{11}/, "Diners Club","enRoute"],
		[/^6(?:011\d{12}|5\d{14}|4[4-9]\d{13}|22(?:1(?:2[6-9]|[3-9]\d)|[2-8]\d{2}|9(?:[01]\d|2[0-5]))\d{10})$/, "Discover", ""],  
		[/^600833\d{10,13}$/, "El Corte Inglés", ""],
		[/^6(?:37|38|39)\d{13}$/, "InstantPayment", ""],
		[/^(?:3[0-9]{15}|(2100|2131|1800)[0-9]{11})$/, "JCB", ""], 
		[/^6(?:304|706|709|771)\d{12,15}$/, "Laser", ""],
		[/^5[1-5]\d{14}$/, "MasterCard"],
		[/(?:5018|5020|5038|6304|6759|676[123])\d{12,15}$/, "MasterCard - Maestro", ""],
		[/((?:6334|6767)\d{12}(?:\d\d)?\d?)/, "MasterCard - Maestro", "Solo"],
		[/(?:(?:(?:4903|4905|4911|4936|6333|6759)\d{12})|(?:(?:564182|633110)\d{10})(\d\d)?\d?)/, "MasterCard - Maestro", "Switch"],
		[/^(4\d{12}(?:\d{3})?)$/, "VISA", ""],
		[/^5019\d{12}/, "Dankort", "VISA"],
		[/^8699\d{11}/, "Voyager", ""]	
		];
		docDC = parseInt(valor.charAt(valor.length-1), 10);
		docNum = (valor.length %2 === 0)? valor : "0" + valor;
		for(var lu = 0; lu < docNum.length; lu++){
			multiplicador = (parseInt(docNum.charAt(lu), 10) * 2 < 10)? parseInt(docNum.charAt(lu), 10) * 2  : (parseInt(docNum.charAt(lu), 10) * 2) - 9;				
			if (lu & 0x01){luhn.unshift(parseInt(docNum.charAt(lu), 10));}else{luhn.unshift(multiplicador);}				
		}
		luhn.forEach(function(valor){sum1 += valor;});
		mod = sum1%10;
		if (mod === 0){
			for(var ent = 0; ent < entidades.length; ent++){			
				if (entidades[ent][0].test(valor)){ 
					entidad = entidades[ent][1];
					entidad1 = entidades[ent][2];//modi
					if (entidadesPosibles.length === 0){
						if(entidad && entidad !== "" ) entidadesPosibles.unshift(entidad);
						if(entidad1 && entidad1 !== "" ){entidadesPosibles.unshift(entidad1);}
					}else{
						if(entidadesPosibles.length < 2){
							if(entidadesPosibles.indexOf(entidad) === -1) entidadesPosibles.unshift(entidad);
							if(entidadesPosibles.indexOf(entidad1) === -1) entidadesPosibles.unshift(entidad1);
						}
					}	
				}					
			}
			if(entidadesPosibles.length > 0){
				emisora = (entidadesPosibles[1] && entidadesPosibles[1] !== "") ? entidadesPosibles[0] + " / " + entidadesPosibles[1] : entidadesPosibles[0];
			}else{
				emisora = "DESCONOCIDA";
			}
			mensaje = "<div class='formulario-salida-resultados'><hr class='separador' /><div>TARJETA : " + emisora + "</div></div>";
			formularioValorOculto = emisora;
			mostrarAcierto("ntc", mensaje);
		}else{
			dc1 = ((10 - ((sum1 - docDC) % 10)) === 10) ? '0': (10 - ((sum1 - docDC) % 10)).toString();
			mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El Dígito de Control debería ser igual a &#8220;<span class='alerta-texto-error-dc'>" + dc1 + "</span>&#8221.</span>";
			errorValidar=true;
			anunciarError("ntc", mensaje);
		}
	}else{
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>Mínimo DOCE números. Gracias.</span>";
		errorValidar=true;
		anunciarError("ntc", mensaje);
	}		
}

/**
* Función - verificarDNI_NIE - (Comprueba el dígito de control de un DNI o NIE -España-).
**/
function verificarDNI_NIE(documento,valor){
	var letrasFinales = "TRWAGMYFPDXBNJZSQVHLCKE", cifras = "" , letraFinalEntrada = "", letraDC = "", mensaje= "", letraInicial = "";
	if (documento == "dni"){
		cifras = valor.substr(0,8);
		letraFinalEntrada = valor.substr(8,1);
		letraDC = letrasFinales.substr((parseInt(cifras,10)%23),1);
	}else{
		letraInicial = valor.substr(0,1);
		cifras = valor.substr(1,7);
		letraFinalEntrada = valor.substr(8,1);
		var valorInicial = "";
		if(letraInicial == "X"){valorInicial="0";}else if(letraInicial=="Y"){valorInicial="1";}else{valorInicial="2";}
		letraDC=letrasFinales.substr(parseInt(valorInicial+cifras,10)%23,1);
	}
	if(letraFinalEntrada==letraDC){
		mensaje = (documento === "dni") ? "<div class='formulario-salida-resultados' style='font-size:12px;text-align:justify;'>El DNI es un documento público, personal e intransferible, emitido por el Ministerio del Interior, que acredita la identidad y los datos personales de su titular, así como la nacionalidad española del mismo.</div>" : (letraInicial === "X") ? "<div class='formulario-salida-resultados'><hr class='separador' /><div style='font-size:12px;'>NIE asignado antes de julio de 2008.</div></div>" : "<div class='formulario-salida-resultados'><hr class='separador' /><div style='font-size:12px;'>NIE asignado después de julio de 2008.</div></div>";
		mostrarAcierto(documento, mensaje);
	}else{
		errorValidar = true;
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>La letra final (Dígito de Control) debería ser igual a &#8220;<span class='alerta-texto-error-dc'>" + letraDC + "</span>&#8221;.</span>";
		anunciarError(documento, mensaje);
	}
}

/**
* Función - verificarNAF_CCCSS - Comprueba los dígitos de control de un Número de Afiliación o Cuenta de Cotización (a la Seguridad Social, España).
**/
function verificarNAF_CCCSS(documento, valor){
	var docNum = "", docDC ="", mensaje = "", provinciaTexto = "", dividendo = 0, provincia, dc1;
	if (documento === "naf" && valor.length < 12){
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>Introduce DOCE números. Gracias!</span>";
		errorValidar=true;
		anunciarError("naf", mensaje);
		return;			
	}
	else if (documento === "cccss" && valor.length < 11){
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>Introduce ONCE números. Gracias!</span>";
		errorValidar=true;
		anunciarError("cccss", mensaje);
		return;
	}else{
		provincia = parseInt(valor.substr(0,2),10); 
	}	
	if (documento === "naf"){
		docNum = valor.substr(2,8);
		docDC = valor.substr(10,11);
	}else{
		docNum = valor.substr(2,7);
		docDC = valor.substr(9,10);
	}
	dividendo = (parseInt(docNum,10) < 10000000) ? provincia * 10000000 + parseInt(docNum,10) : provincia + parseInt(docNum,10);
	dc1 = ((dividendo%97) < 10) ? "0" + (dividendo%97) :  (dividendo%97).toString();
	if(docDC === dc1){
		provinciaTexto = (provincia > 57) ? "DESCONOCIDA" : obtenerProvincia(provincia);
		formularioValorOculto = provinciaTexto;
		mensaje =(documento === "naf") ? "<div class='formulario-salida-resultados'><hr class='separador' /><div>Provincia de afiliación : " + provinciaTexto.toUpperCase() + "</div></div>" :"<div class='formulario-salida-resultados'><hr class='separador' /><div>Provincia de actividad : " + provinciaTexto.toUpperCase() + "</div></div>";
		mostrarAcierto(documento, mensaje);
	}else{
		mensaje = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>La serie de números debería terminar en &#8220;<span class='alerta-texto-error-dc'>" + dc1 + "</span><span>&#8221; (DC).</span></span>";
		errorValidar=true;
		anunciarError(documento, mensaje);
	}
}

/**
* Función - verificarNIF - Número de Identificación Fiscal (incluye NIE y DNI). España.
**/
function verificarNIF(valor){
	var entidad = "", entidadTexto = "", mensaje = "", provinciaTexto = "DESCONOCIDA", tipoNIF = "", persona = false, sum1 = 0, sum2 = 0, dc1, dc2,dniNieDC = "TRWAGMYFPDXBNJZSQVHLCKE", nieInicial= ["X","Y","Z"];	
	entidad = valor.substr(0, 1);
	var docNum = valor.substr(1, valor.length -2);
	var provincia = docNum.substr(0, 2);
	var docDC = valor.substr(valor.length -1, 1);
	var nifDC = "JABCDEFGHI";
	if (/^[XYZI]$/.test(entidad)){	
		persona = true;	
		if(entidad !== "I"){
		entidadTexto = entidad;
		for(var prefijo in nieInicial){
		if (entidad === nieInicial[prefijo]) entidad = prefijo.toString();
		}
		}else{
		entidadTexto = "DNI";
		entidad = ""; //DNI
		}
		dc2 = dniNieDC.charAt((parseInt(entidad + docNum, 10)%23));
		mensaje = (docDC === dc2) ? "ACIERTO" : "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>La letra final debería ser igual a &#8220;<span class='alerta-texto-error-dc'>" + dc2 + "</span><span>&#8221;.</span></span>";
	}else{			
		for(var p = 0; p  < docNum.length; p++){					
			if (p % 2 === 0){						
				sum1 += ((parseInt(docNum.charAt(p),10) * 2) > 9) ? (parseInt(docNum.charAt(p),10) * 2) -9 : (parseInt(docNum.charAt(p),10) * 2);
			}else{
				sum2 += parseInt(docNum.charAt(p),10);
			}						
		}
		dc1 = ((sum1 + sum2) > 9)? 10 - ((sum1+sum2)%10) : 10 - (sum1+sum2);
		dc1 = (dc1 === 10) ? 0 : dc1;
		dc2 = nifDC.charAt(dc1);
		if (/^[ABEHU]$/.test(entidad)){
			entidadTexto = entidad;
			mensaje = (docDC === dc1.toString()) ? "ACIERTO" : "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El carácter final (de control) debería ser el número &#8220;<span class='alerta-texto-error-dc'>" + dc1 + "</span><span>&#8221;.</span></span>";
		}
		else if (/^[KLMPQRS]$/.test(entidad)){
			if(/^[KLM]$/.test(entidad)) persona = true;
			entidadTexto = entidad;
			mensaje = (docDC === dc2) ? "ACIERTO" : "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El carácter final (de control) debería ser la letra &#8220;<span class='alerta-texto-error-dc'>" + dc2 + "</span><span>&#8221;.</span></span>";
		}else{
			entidadTexto = entidad;
			mensaje = (docDC === dc1.toString() || docDC === dc2 ) ? "ACIERTO" : "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>El carácter final (de control) debería ser el número &#8220;<span class='alerta-texto-error-dc'>" + dc1 + "</span><span>&#8221; ó la letra &#8220;</span><span class='alerta-texto-error-dc'>" + dc2 + "&#8221;.</span>";
		}
	}	
	if(mensaje === "ACIERTO"){
		if(persona === false){
			provinciaTexto = (obtenerProvincia(provincia) && obtenerProvincia(provincia) !== "DESCONOCIDA") ? obtenerProvincia(provincia) : "DESCONOCIDA";			 
		}
		tipoNIF = "<span>Tipo &#8220;<span class='texto-capital'>" +  entidadTexto + "</span>&#8221; : </span>";
		if(entidadTexto === "DNI") entidadTexto = "I";
		mensaje = (provinciaTexto === "DESCONOCIDA") ? "<div class='formulario-salida-resultados-nif'><div>" + tipoNIF + buscarTipoNIF(entidadTexto) + "</div></div>" : "<div class='formulario-salida-resultados-nif'><div>" + tipoNIF + buscarTipoNIF(entidad) + "</div><div>Con sede (si el NIF fue asignado antes de 2009) en la provincia de " + provinciaTexto.toUpperCase() + ".</div></div>";
		formularioValorOculto = buscarTipoNIF(entidadTexto) + "|" + provinciaTexto; 
		mostrarAcierto("nif", mensaje);
	}else{
		errorValidar = true;
		anunciarError("nif", mensaje);
	}
}				

/********************************************************
* Funciones globales JAVASCRIPT con la API de AIR:
*********************************************************/

/**
* Función - obtenerNombreComercialSO - Obtiene el nombre comercial de SO (en Mac).
**/
function obtenerNombreComercialSO(){
	var nombreComercial = "";
	var nombreAIR = propiedadesEquipo.sistemaOperativo;
	var versionesNumeral="";
	var diccionario_versiones_osx = {
		"1.0" :"Hera",
		"10.0":"Cheetah",
		"10.1":"Puma",
		"10.2":"Jaguar",
		"10.3":"Panther",
		"10.4":"Tiger",
		"10.5":"Leopard",
		"10.6":"Snow Leopard",
		"10.7":"Lion",
		"10.8":"Mountain Lion",
		"10.9":"Mavericks",
		"10.10":"Yosemite",
		"10.11":"El Capitan"  //Sin tilde.
	 };
	 
	 switch(propiedadesEquipo.sistemaOperativoAlias){
		case  "mac" :
		versionesNumeral = 
			vesionesNumeral = nombreAIR.match(/\d+\.\d+/i)[0];
			if (diccionario_versiones_osx.hasOwnProperty(vesionesNumeral)){
				propiedadesEquipo.sistemaOperativoNombreComercial = "OS X " + diccionario_versiones_osx[vesionesNumeral];	
				
			}else{
				propiedadesEquipo.sistemaOperativoNombreComercial = nombreAIR;
			}
		break;
		case "lnx" : 
			propiedadesEquipo.sistemaOperativoNombreComercial = "Linux";
		break;
		case "and" :
			propiedadesEquipo.sistemaOperativoNombreComercial = "Android";
		break;
		case "iph" :
			propiedadesEquipo.sistemaOperativoNombreComercial = "iPhone";
		break;
		default:
		propiedadesEquipo.sistemaOperativoNombreComercial = nombreAIR;		
		break;
	 }
	 if(propiedadesEquipo.sistemaOperativoNombreComercial !== nombreAIR){		 
		propiedadesEquipo.sistemaOperativoNombreInterno = nombreAIR; 
	 }	 
}

/**
* Función - cambiarTitularVentanaNativa - Cambia el título de la ventana principal.
**/
function cambiarTitularVentanaNativa(formulario){
switch(formulario){
case "home":
window.nativeWindow.title = "CDOCS";
break;
case "cccss" :
window.nativeWindow.title = "CDOCS : CCC (ss)";
break;
case "about" :
window.nativeWindow.title = "CDOCS : ACERCA DE ...";
break;
case "update" :
window.nativeWindow.title = "CDOCS : ACTUALIZACIONES";
break;
case "download" :
window.nativeWindow.title = "CDOCS : ACTUALIZACIONES - DESCARGA";
break;
default:
window.nativeWindow.title = "CDOCS : " + formulario.toUpperCase();
break;
}
if(errorAJAX) window.nativeWindow.title = "CDOCS : ERROR"; 
}
/**
* Función - comprobarCapacidadPDF - Comprueba si el equipo dispone de Adobe READER (genuíno).Necesario
* para visualizar documentos PDF mediante las aplicaciones AIR.
**/
function comprobarCapacidadPDF(){
	var numErrorPDF = 0;
	if (air.HTMLLoader.pdfCapability !== air.HTMLPDFCapability.STATUS_OK) {
		if(air.HTMLLoader.pdfCapability === air.HTMLPDFCapability.ERROR_INSTALLED_READER_NOT_FOUND){
			numErrorPDF = 3201;
		}else if(air.HTMLLoader.pdfCapability === air.HTMLPDFCapability.ERROR_INSTALLED_READER_TOO_OLD){
			numErrorPDF = 3202;
		}else if(air.HTMLLoader.pdfCapability === air.HTMLPDFCapability.ERROR_PREFERRED_READER_TOO_OLD){
			numErrorPDF = 3203;	
		}else if(air.HTMLLoader.pdfCapability === air.HTMLPDFCapability.ERROR_CANNOT_LOAD_READER){
			numErrorPDF = 3204;
		}else{
			numErrorPDF = 3205;	
		}
	}
	return numErrorPDF;
}

/**
* Función - imprimirFormulario - Escribe un archivo PDF con los resultados de la verificación, en el caso de acierto.
**/
function imprimirFormulario(){
	if(document.getElementById("botones-imprimir").className === "botones-inactivo" || document.getElementById("botones-imprimir").className === "botones-oculto" || formularioActivo === "") return;
	var demora, intervalo = 500, formulario = formularioActivo;
	borrarAlertaVoluntario(formulario);
	document.getElementById("alerta-" + formulario).innerHTML = plantillaAlertaEspera; 
	cambiarEstadoBotones("procesando");
	
	var numError =  comprobarCapacidadPDF(); 
	if (numError !== 0){
		clearTimeout(demora);
		borrarAlertaVoluntario(formulario);
		demora = setTimeout(function(){abrirNuevaVentanaNativa("html/print/errorPDF.html", numError.toString() + "|", "applicationDirectory", "utilidad");borrarAlertaVoluntario(formulario);cambiarEstadoBotones("acierto");},intervalo);
	}else{
		clearTimeout(demora);
		demora = setTimeout(function(){crearArchivoPDF(formulario);},intervalo);
	}
}

/**
* Función - buscarEntidadBancaria - Realiza una búsqueda en la base de datos local entidades_financieras_ES.db.
**/
function buscarEntidadBancaria(codEntidad){
	codEntidad = parseInt(codEntidad,10);
	codEntidad = codEntidad.toString();
	var resultado = "DESCONOCIDA";
	var errorDB = "";
	try{
		var enlace = new air.SQLConnection();
		var baseDatos = air.File.applicationDirectory.resolvePath("db/entidades_financieras_ES.db");
		baseDatos = enlace.open(baseDatos);
		var consulta=new air.SQLStatement();
		consulta.sqlConnection=enlace;
		consulta.addEventListener(air.SQLEvent.RESULT, function(){
		var respuesta=consulta.getResult();
		if(respuesta.data !== null){
			resultado =  respuesta.data[0].COD_BE + "|" +  respuesta.data[0].NOMBRE_50 + "|" + respuesta.data[0].NOMBRE_105 + "|" + respuesta.data[0].FECHA_BAJA + "|" + respuesta.data[0].MOTVO_BAJA + "|" + respuesta.data[0].NOMBRE_35 + "|" + respuesta.data[0].ANAGRAMA; 		
		}
		enlace.close();
		});
		consulta.text = 'select * FROM entidades WHERE COD_BE="'+ codEntidad+'"';
		consulta.execute();
	}catch(error){
		errorDB = error;	
	}finally{
		if(errorDB !== ""){
			notificarConHumanJS("¡ATENCIÓN!<BR />" + errorDB, "error");
		}
	}
	return resultado;
}

/**
* Función - construirMnuEmergente - Menú principal de la aplicación (tipo 'popup') - función constructora.
**/
function construirMnuEmergente(){
	mnuEmergente = new air.NativeMenu();
	mnuEmergente.addEventListener(air.Event.SELECT,gestionarElementoSeleccionado);
	var mnuHome = mnuEmergente.addItem(new air.NativeMenuItem("Inicio"));
	var mnuIBAN = mnuEmergente.addItem(new air.NativeMenuItem("IBAN"));
	var mnuCCC = mnuEmergente.addItem(new air.NativeMenuItem("CCC"));
	var mnuNTC = mnuEmergente.addItem(new air.NativeMenuItem("NTC"));
	var mnuNIF = mnuEmergente.addItem(new air.NativeMenuItem("NIF"));
	var mnuDNI = mnuEmergente.addItem(new air.NativeMenuItem("DNI"));
	var mnuNIE = mnuEmergente.addItem(new air.NativeMenuItem("NIE"));
	var mnuNAF = mnuEmergente.addItem(new air.NativeMenuItem("NAF"));
	var mnuCCCSS = mnuEmergente.addItem(new air.NativeMenuItem("CCC (SS)"));
	var separador0 = mnuEmergente.addItem(new air.NativeMenuItem("", true));
	var mnuACT = mnuEmergente.addItem(new air.NativeMenuItem("Actualizaciones"));
	var mnuINFO = mnuEmergente.addItem(new air.NativeMenuItem("Acerca de ..."));
	var separador2 = mnuEmergente.addItem(new air.NativeMenuItem("", true));
	var salir = mnuEmergente.addItem(new air.NativeMenuItem("Salir"));
	if (air.NativeWindow.supportsMenu) { // Windows
		salir.keyEquivalent="f4";
		salir.keyEquivalentModifiers=[air.Keyboard.ALTERNATE];
	} else if (air.NativeApplication.supportsMenu) { // Mac
		salir.keyEquivalent= "s";
		salir.keyEquivalentModifiers=[air.Keyboard.COMMAND];
		salir.label = "Salir";		
	}
	return mnuEmergente;
}

/**
* Función - gestionarElementoSeleccionado - Gestiona las selecciones en el menú principal de la aplicación.
**/
function gestionarElementoSeleccionado(event){
	event.preventDefault();
	var seleccionado = "";
	switch(event.target.label){
	case "Inicio" :
	seleccionado = "home";
	break;
	case "IBAN" :
	seleccionado = "iban";
	break;
	case "CCC" :
	seleccionado = "ccc";
	break;
	case "NTC" :
	seleccionado = "ntc";
	break;
	case "NIF" :
	seleccionado = "nif";
	break;
	case "DNI" :
	seleccionado = "dni";
	break;
	case "NIE" :
	seleccionado = "nie";
	break;
	case "NAF" :
	seleccionado = "naf";
	break;
	case "CCC (SS)" :
	seleccionado = "cccss";
	break;
	case "Actualizaciones" :
	seleccionado = "actualizaciones";
	break;
	case "Acerca de ..." :
	seleccionado = "about";
	break;
	case "Salir" :
	seleccionado = "salir";
	break;
	}
	if(seleccionado!== ""){
		if(seleccionado === "salir"){
			salir();
		}else if(seleccionado === "actualizaciones"){
			comprobarActualizaciones();
		}else{
			cargarFormulario(seleccionado);
		}
	} 
}

/**
* Función - visualizarMnuEmergente - Sitúa el objeto menú 'mnuEmergente' en la ventana principal de la aplicación.
**/
function visualizarMnuEmergente(event){
	event.preventDefault(); 
	if(document.getElementById("botones-mnu").className === "botones-inactivo") return;
	var mnuX = (propiedadesEquipo.sistemaOperativoAlias === "mac") ? 480 : 384; 
	mnuY = 30;	
	mnuEmergente.display(window.nativeWindow.stage, mnuX, mnuY);		
}

/**
* Función - desactivarElementoMnu - Inhabilita el ítem del menú correspondiente al formulario activo.
**/	
function desactivarElementoMnu(numElemento){
	for(var h = 0; h <  mnuEmergente.items.length; h++){
		if(!mnuEmergente.items[h].enabled) mnuEmergente.items[h].enabled = true;
		if(mnuEmergente.items[h].checked) mnuEmergente.items[h].checked = false;	
	}
	if(numElemento > -1){
		if(numElemento >= 9 ) numElemento = numElemento + 1;
		mnuEmergente.items[numElemento].checked = true;
		mnuEmergente.items[numElemento].enabled=false;
	}
}
/**
* Función - activarMnuIcono - Sitúa el logotipo de la aplicación en la bandeja de sistema con un pequeño
* menú contextual que permite la salida de la aplicación.
* Se encarga además de visualizar y activar la ventana inicial de la aplicación: iniciar().
**/
function activarMnuIcono(){
	var error = "ninguno";
	var iconoBandeja;
	try{
		var cargaIconosCompleta = function(event){ 
			air.NativeApplication.nativeApplication.icon.bitmaps = [event.target.content.bitmapData]; 
			iniciar();			
		};      
		//air.NativeApplication.nativeApplication.autoExit = false; 
		var cargarIcono = new air.Loader(); 
		var mnuIcono = new air.NativeMenu(); 
		var mnuIconoCabecera = mnuIcono.addItem(new air.NativeMenuItem("CDOCS " + propiedadesPrograma.versiones.larga)); 
		var mnuIconoSeparador = mnuIcono.addItem(new air.NativeMenuItem("", true));
		if(air.NativeApplication.supportsSystemTrayIcon){
			var mnuIconoSalir = mnuIcono.addItem(new air.NativeMenuItem("Salir"));
			mnuIconoSalir.addEventListener(air.Event.SELECT,function(event){ 
				air.NativeApplication.nativeApplication.icon.bitmaps = []; 
				salir(); 
			}); 
		}  
		mnuIcono.items[0].checked = true;
		mnuIcono.items[0].enabled = false;
		mnuIconoCabecera.addEventListener(air.Event.SELECT,function(event){		
			window.nativeWindow.restore(); 			
		}); 	
		
		mnuIcono.addEventListener("preparing", function(event){
			event.preventDefault();
			if(ventanaPrincipalMinimizada){
				mnuIcono.items[0].enabled = true;
			}else{
				mnuIcono.items[0].enabled = false;
			}			
		});
	 
		if (air.NativeApplication.supportsSystemTrayIcon) { 
			iconoBandeja = new air.URLRequest("images/icono_bandeja.png");
			//air.NativeApplication.nativeApplication.autoExit = false; 
			cargarIcono.contentLoaderInfo.addEventListener(air.Event.COMPLETE,cargaIconosCompleta); 
			cargarIcono.load(iconoBandeja); 
			air.NativeApplication.nativeApplication.icon.tooltip = "CDOCS"; 
			air.NativeApplication.nativeApplication.icon.menu = mnuIcono;			
			cargarIcono.contentLoaderInfo.addEventListener(air.IOErrorEvent.IO_ERROR, function(event){
				iniciar();
			});		
		} 
	 
		if (air.NativeApplication.supportsDockIcon) {
			iconoBandeja = new air.URLRequest("images/icono_muelle.png");		
			cargarIcono.contentLoaderInfo.addEventListener(air.Event.COMPLETE,cargaIconosCompleta); 
			cargarIcono.load(iconoBandeja); 
			air.NativeApplication.nativeApplication.icon.menu = mnuIcono; 
			cargarIcono.contentLoaderInfo.addEventListener(air.IOErrorEvent.IO_ERROR, function(event){
			iniciar();
			});				
		}
	}catch(err){
		error = err;		
	}finally{
		if(error !== "ninguno") iniciar();		
	}
}

/**
* Función - obtenerPropiedadesPrograma - Lee algunas propiedades (identificador y versiones) desde el archivo XML descriptor de la aplicación.
**/
function obtenerPropiedadesPrograma(){
	var descriptor = air.NativeApplication.nativeApplication.applicationDescriptor;	
	var traductor = new DOMParser();
	var xml = traductor.parseFromString(descriptor,"text/xml");
	propiedadesPrograma.identificador = xml.getElementsByTagName("id")[0].firstChild.nodeValue;
	propiedadesPrograma.versiones.larga = xml.getElementsByTagName("versionNumber")[0].firstChild.nodeValue;
	var entrega = propiedadesPrograma.versiones.larga.split("."); 
	propiedadesPrograma.versiones.corta = (entrega.length > 1) ? entrega[0] + "." + entrega[1] : entrega;
	propiedadesPrograma.versiones.tipo = xml.getElementsByTagName("versionLabel")[0].firstChild.nodeValue;	
}

/**
* Función - monitorizarInternet - Monitoriza el estado de disponibilidad de Internet, mediante peticiones a un
* servicio Web estable. Utilizar protocolo 'http://', elegimos, por ejemplo: http://www.google.com/. Siempre en los primeros puestos del ranking global  'Alexa'.
**/
function monitorizarInternet() {
	monitor = new air.URLMonitor(new air.URLRequest("http://www.google.com/"));
	monitor.addEventListener(air.StatusEvent.STATUS, function(){		
		internetDisponible = monitor.available;	
	});
	monitor.start();
	}



/**
* Función - abrirEnNavegador - Abre la página solicitada en el navegador del equipo.
**/
function abrirEnNavegador(url){
	if(internetDisponible){
		var enlace = new air.URLRequest(url);
		air.navigateToURL(enlace);
	}else{
		notificarConHumanJS("No fue posible conectarse a Internet", "normal", 5000);
	}
}

/**
* Función - abrirArchivoConProgramaDeterminado - Abre un archivo con el programa determinado
* por defecto en el sistema (con excepción de algunos tipos, por ejemplo EXE y BAT). El archivo tiene que estar
* situado en algún lugar de almacenamiento público (no se puede utilizar con archivos ubicados en el directorio de la aplicación).
* En CDOCS utilizamos esta función para abrir el archivo de documentación del
* programa 'documentation.pdf' copiado previamente, en el subdirectorio '/cdocs' del 'documentsDirectory'. 
**/
function abrirArchivoConProgramaDeterminado(){
	protector.abrir();
	cambiarEstadoBotones("procesando");
	var errorApertura = "ninguno";
	var espera;
	var capacidadPDF = comprobarCapacidadPDF();
	var capacidadPDFerror = [3201, 3202, 3203, 3204];
	var informe = "documentation_010.pdf";
	try{
		var origen = air.File.applicationDirectory.resolvePath("app:/pdf/" + informe);
		var destino = air.File.documentsDirectory.resolvePath("cdocs/" + informe); 
		var directorioDestino = air.File.documentsDirectory.resolvePath("cdocs");
		if (capacidadPDF === 0){
			if(!directorioDestino.exists) directorioDestino.createDirectory();
			if(!destino.exists) origen.copyTo(destino, true);	
			destino.openWithDefaultApplication();			
		}else{
			if(capacidadPDFerror.indexOf(parseInt(capacidadPDF,10),0) === -1) capacidadPDF = 3201;
			abrirNuevaVentanaNativa("html/print/errorPDF.html", capacidadPDF.toString() + "|", "applicationDirectory", "utilidad");
		}
	}catch(error){
		errorApertura = error;
	}finally{
		if(errorApertura !== "ninguno"){
			protector.cerrar();
			cambiarEstadoBotones("inicial");
			notificarConHumanJS("¡ATENCIÓN!<BR />" + errorApertura, "error");
		}else{
			clearTimeout(espera);
			espera = setTimeout(function(){protector.cerrar();cambiarEstadoBotones("inicial");},2000);				
		}
	}
}
	

/**
* Función - abrirNuevaVentanaNativa - Abre una nueva ventana de la aplicación.
**/
function abrirNuevaVentanaNativa(recurso, datos, almacenamiento, tipo){
	var ancho = 640;
	var alto = 394;
	var coordenadaX = window.nativeWindow.x + 28;
	var coordenadaY = window.nativeWindow.y + 40;
	var opciones = new air.NativeWindowInitOptions();
	var rutaRecurso = "";
	if (tipo === "utilidad"){
		opciones.type = air.NativeWindowType.UTILITY;
	}else{
		opciones.type = air.NativeWindowType.NORMAL;
	}
	if(almacenamiento === "applicationDirectory" ){
		rutaRecurso = air.File.applicationDirectory.resolvePath(recurso).url;
	}else if(almacenamiento === "applicationStorageDirectory"){
		rutaRecurso = air.File.applicationStorageDirectory.resolvePath(recurso).url;
	}
	if(datos !== null) rutaRecurso = rutaRecurso + "?" + datos;
	var cuadro = new air.Rectangle(coordenadaX,coordenadaY,ancho,alto);
	var nuevaVentana = air.HTMLLoader.createRootWindow(true, opciones, false, cuadro);
	nuevaVentana.load(new air.URLRequest(rutaRecurso));
}

/**
* Función - eliminarArchivosResiduales - Elimina archivos residuales. El argumento 'directorios' (string) puede ser uno
* o varios, separados por ',' (coma).
**/
function eliminarArchivosResiduales(directorios){
	var matrizDirectorios = [], carpeta, contenidoCarpeta;
	if(arguments.length === 0){
		return;
	}else{
		for(var i = 0; i < arguments.length; i++){
			matrizDirectorios.push(arguments[i]);
		}
		for(var j = 0; j < matrizDirectorios.length; j ++){
			carpeta = air.File.applicationStorageDirectory.resolvePath(matrizDirectorios[j]);
			if(carpeta.isDirectory){
				contenidoCarpeta = carpeta.getDirectoryListing();
				if(contenidoCarpeta.length > 0){
					carpeta.deleteDirectory(true);	
				}else{
					carpeta.deleteDirectory();	
				}			
			}						
		}	
	}	
}
/**
* Función - iniciar - Inicia la aplicación (Visualiza la pantalla principal y toma elfoco).
**/
function iniciar(){
	if(!window.nativeWindow.visible) window.nativeWindow.visible = true;
	window.nativeWindow.activate();
 
}
/**
* Función - salir - Cierra la aplicación.
**/
function salir(){
	if(procesandoActualizaciones) return;
	air.NativeApplication.nativeApplication.exit();
}
/**
* Función - cerrarTodasLasVentanas - Cierra todas las ventanas abiertas en la salida de la aplicación .
**/

function cerrarTodasLasVentanas(event){
	if(procesandoActualizaciones){
		event.preventDefault();
	}else{
		for (contador = 0; contador < air.NativeApplication.nativeApplication.openedWindows.length; contador++) {
		if(contador > 0) air.NativeApplication.nativeApplication.openedWindows[contador].close();
		}			
	} 	
}

/**
* Función - registrarVersiones - Lectura y escritura del archivo local XML versiones.xml (registra el número de versión instalada).
**/
function registrarVersiones(){
	var directorio = air.File.applicationStorageDirectory.resolvePath("xml");
	var original = air.File.applicationDirectory.resolvePath("xml/version.xml");
	var copia = air.File.applicationStorageDirectory.resolvePath("xml/version.xml"); 
	var saludoInicial = false;
	var registroVersiones = {
		actual : ((propiedadesPrograma.versiones.larga !== "") ? propiedadesPrograma.versiones.larga : "0.0.0"),
		registrada : ""
	};
	var escribirRegistroVersiones = function(){
		transferencia = new air.FileStream(); 
		transferencia.open(copia, air.FileMode.WRITE); 
		var salida = '<?xml version="1.0" encoding="utf-8"?>\n<version>\n<current>' + registroVersiones.actual + "</current>\n</version>"; 
		transferencia.writeUTFBytes(salida); 
		transferencia.close();
	};
	var leerRegistroVersiones = function(){
		transferencia = new air.FileStream(); 
		transferencia.open(copia, air.FileMode.READ); 
		var resultado = transferencia.readUTFBytes(transferencia.bytesAvailable); 
		transferencia.close();
		var documentoXML = new DOMParser().parseFromString(resultado, "text/xml");
		registroVersiones.registrada = documentoXML.getElementsByTagName("current")[0].firstChild.nodeValue;
		if(registroVersiones.registrada && registroVersiones.registrada !== ""){
			if(registroVersiones.actual > registroVersiones.registrada){
				escribirRegistroVersiones();
				saludoInicial = true;
			}
		}
	};
	if(!directorio.exists){
		directorio.createDirectory();
		original.copyTo(copia, true);
	}
	leerRegistroVersiones();
	if(saludoInicial){
		notificarConHumanJS("¡HOLA!<br />CDOCS " + propiedadesPrograma.versiones.larga,"normal",5000);
		saludoInicial = false;		
	}
	eliminarArchivosResiduales("update", "pdf");	
	
}

/**
 * Función - verRecursos - Visor de código fuente para AIR con HTML y Javascript 'airSourceWieber'.
 **/
function verRecursos(){
	var visor = air.SourceViewer.getDefault();
	visor.setup({ defaultFile:['index.html'] });
	visor.setup({exclude:
	['cdocs.exe',
	'Icon.icns',
	'mimetype',
	'alivePDF/alivepdflib',
	'alivePDF/assets',
	'swf',
	'db',
	'pdf',
	'css/font',
	'css/index-min.css',
	'css/humane-original-foog-min.css',	
	'META-INF/signatures.xml',
	'META-INF/AIR/hash',
	'META-INF/AIR/es.foog.cdocs.air.directory',
	'META-INF/AIR/es.foog.cdocs.air.desktop',
	'META-INF/AIR/image32x32',
	'META-INF/AIR/image128x128',
	'META-INF/AIR/image48x48',
	'META-INF/AIR/image16x16',
	'js/AIRAliases-min.js',
	'js/AIRSourceViewer-min.js',
	'js/alivePDFgenerator-min.js',
	'js/alivePDFWrapper-min.js',
	'js/humane-min.js',
	'js/iban-min.js',	
	'js/index-aux-min.js',
	'js/index-min.js',
	'js/iban-min.js']
	});
	visor.viewSource();
}

/******
* Sistema de actualizaciones.
******/
/**
* Función - comprobarActualizaciones - Comprueba si existe en el repositorio algún paquete instalador de una versión superior a la instalada.
**/
function comprobarActualizaciones(){
	if(!internetDisponible){
			notificarConHumanJS("No fue posible conectarse a Internet", "normal", 5000);
			return;
	}
	actualizacionesTarea = "";	
	propiedadesPrograma.versiones.actualizaciones = "";
	propiedadesPrograma.versiones.actualizacionesMensaje = "";
	propiedadesPrograma.versiones.actualizacionesError = "";
	propiedadesPrograma.versiones.actualizacionesDisponibles = false;
	propiedadesPrograma.versiones.actualizacionesAlmacenamiento = "";
	propiedadesPrograma.versiones.actualizacionesRepositorio = "";
	var espera, demora;
	protector.abrir();
	cambiarEstadoBotones("procesando");
	var errorConsulta = "ninguno";
	var resultado = [];
	clearTimeout(espera);
	espera = setTimeout(function(){
	solicitud = new XMLHttpRequest();
	solicitud.open("get", propiedadesPrograma.versiones.actualizacionesDescriptor, false);
	solicitud.onreadystatechange = function(){
		if (solicitud.readyState === 4) {
			if(solicitud.status === 200 && solicitud.responseXML !== null){
				resultado[0] = solicitud.responseXML.getElementsByTagName("versionNumber")[0].firstChild.nodeValue;
				resultado[1] = solicitud.responseXML.getElementsByTagName("url")[0].firstChild.nodeValue;			
				if(!/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/.test(resultado[0])){
					errorConsulta = "512";
				}
							
			}else{
				if(solicitud.responseXML === null){
					errorConsulta = "400";
				}else{
					errorConsulta =  solicitud.status;
				}	
			}
		}
	};
	
	try{
		solicitud.send(null);
	}catch(error){
		
		if(errorConsulta !== "ninguno") errorConsulta = error;
				
	}finally{
		if(errorConsulta !== "ninguno"){
			propiedadesPrograma.versiones.actualizaciones = "&#160;&#160;?";
			propiedadesPrograma.versiones.actualizacionesMensaje = "<p class='texto-centrado' style='margin-top:12px;'>No ha sido posible la búsqueda de actualizaciones ...<p>";
			propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + documentarErrorAJAX(errorConsulta) + "<span>";
		}else{
			propiedadesPrograma.versiones.actualizaciones = resultado[0];
			propiedadesPrograma.versiones.actualizacionesRepositorio = resultado[1];
			if(propiedadesPrograma.versiones.larga < propiedadesPrograma.versiones.actualizaciones){
				propiedadesPrograma.versiones.actualizacionesMensaje = "<p class='texto-centrado'>Hay una nueva versión disponible.</p><p class='texto-centrado'>Pulsa el botón &#171;<span class='texto-falsa-negrita'>DESCARGAR</span>&#187; para iniciar el proceso de instalación.</p>";
				propiedadesPrograma.versiones.actualizacionesDisponibles = true;
				
			}else if(propiedadesPrograma.versiones.larga >= propiedadesPrograma.versiones.actualizaciones){
				propiedadesPrograma.versiones.actualizacionesMensaje = "<p class='texto-centrado' style='margin-top:2px;'>No hay nuevas versiones disponibles.</p><p class='texto-centrado'>La aplicación está actualizada.</p>";
			}
			
		}
		clearTimeout(demora);
		demora = setTimeout(function(){cargarFormulario("update");},1000);		
	}
	},1000);
}


/**
* Función - descargarActualizaciones - Descarga un paquete instalador (.air) con una posible actualizacióna.
**/
function descargarActualizaciones(){
	actualizacionesTarea = "descarga";
	procesandoActualizaciones = true;	
	propiedadesPrograma.versiones.actualizacionesMensaje = "";
	propiedadesPrograma.versiones.actualizacionesError = "";
	propiedadesPrograma.versiones.actualizacionesAlmacenamiento = "";
	var errorDescarga = "ninguno";
		
	try{
		propiedadesPrograma.versiones.actualizacionesPaquete = propiedadesPrograma.versiones.actualizacionesRepositorio.substr(propiedadesPrograma.versiones.actualizacionesRepositorio.lastIndexOf("/") + 1, propiedadesPrograma.versiones.actualizacionesRepositorio.length); 
		document.getElementById("paquete-download").innerHTML = propiedadesPrograma.versiones.actualizacionesPaquete;
		var recurso = new air.URLRequest(propiedadesPrograma.versiones.actualizacionesRepositorio);
		transferencia = new air.URLStream();
		matrizBytes = new air.ByteArray();
		transferencia.addEventListener(air.ProgressEvent.PROGRESS, function(e){
			var cargado = Math.round(e.bytesLoaded);
			var total = Math.round(e.bytesTotal);
			propiedadesPrograma.versiones.actualizacionesPeso = total;
			document.getElementById("peso-download").innerHTML = " (" + (propiedadesPrograma.versiones.actualizacionesPeso / 1000000).toFixed(2) + " MB)";
			visualizarProgreso(cargado, total, false);
		});	
		transferencia.addEventListener(air.Event.COMPLETE,guardarActualizaciones);
		transferencia.load(recurso);	
		transferencia.addEventListener(air.IOErrorEvent.IO_ERROR, function(event){
			actualizacionesTarea = "";
			procesandoActualizaciones = false;
			propiedadesPrograma.versiones.actualizacionesMensaje = "<span>Se ha producido un error ...<span>";
			propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + documentarErrorAJAX(event.text) + "<span>";
			document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
			document.getElementById("alerta-download").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
		});
			
	}catch(error){
		errorDescarga = error;
	}finally{
		if(errorDescarga !== "ninguno"){
			actualizacionesTarea = "";
			procesandoActualizaciones = false;
			propiedadesPrograma.versiones.actualizacionesMensaje = "<span>Se ha producido un error ...<span>";
			propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + documentarErrorAJAX(errorDescarga) + "<span>";
			document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
			document.getElementById("alerta-download").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
		}
	}
}

/**
* Función - cancelarDescargaActualizaciones - Cancela la descarga un paquete instalador (.air) a petición del usuario.
**/
function cancelarDescargaActualizaciones(){
	cambiarEstadoBotones("procesando");
	actualizacionesTarea = "";
	procesandoActualizaciones = false;
	transferencia.close();
	propiedadesPrograma.versiones.actualizacionesMensaje = "&#160;";
	propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>Descarga cancelada. Pulsa el botón &#171;INICIO&#187; para continuar.";
	document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
	document.getElementById("alerta-download").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
	eliminarArchivosResiduales("update");
	var espera;
	clearTimeout(espera);
	espera = setTimeout(function(){cambiarEstadoBotones("descarga-cancelada");},500);	
}

/**
* Función - guardarActualizaciones - Guarda el archivo instalador (.air) previamente descargado en el almacén púbico de la aplicación.
**/
function guardarActualizaciones(e){
	if(ventanaPrincipalMinimizada) window.nativeWindow.restore();
	actualizacionesTarea = "";	
	cambiarEstadoBotones("procesando");
	window.nativeWindow.title = "CDOCS : ACTUALIZACIONES - ALMACENAMIENTO";	
	propiedadesPrograma.versiones.actualizacionesMensaje = "";
	propiedadesPrograma.versiones.actualizacionesError = "";
	var errorEscritura = "ninguno";
	try{
		document.getElementById("tarea-download").innerHTML = "Guardando";
		eliminarArchivosResiduales("update");
		var directorio = air.File.applicationStorageDirectory.resolvePath("update");
		if(!directorio.exists) directorio.createDirectory();
		transferencia.readBytes(matrizBytes,0,transferencia.bytesAvailable);
		propiedadesPrograma.versiones.actualizacionesAlmacenamiento = air.File.applicationStorageDirectory.resolvePath("update/" + propiedadesPrograma.versiones.actualizacionesPaquete);
		var flujo = new air.FileStream();
		flujo.open(propiedadesPrograma.versiones.actualizacionesAlmacenamiento,air.FileMode.WRITE);
		flujo.writeBytes(matrizBytes,0,matrizBytes.length);
		flujo.close();
		transferencia.addEventListener(air.IOErrorEvent.IO_ERROR, function(event){
			procesandoActualizaciones = false;
			cambiarEstadoBotones("inicial");
			propiedadesPrograma.versiones.actualizacionesMensaje = "<span>Se ha producido un error ...<span>";
			propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + documentarErrorAJAX(event.text) + "<span>";
			document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
			document.getElementById("alerta-download").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
		});
	}catch(error){
		errorEscritura = error;
	}finally{
		if(errorEscritura !== "ninguno"){
			procesandoActualizaciones = false;
			cambiarEstadoBotones("inicial");
			propiedadesPrograma.versiones.actualizacionesMensaje = "<span>Se ha producido un error ...<span>";
			propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + documentarErrorAJAX(errorEscritura) + "<span>";
			document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
			document.getElementById("alerta-download").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
		}else{
			visualizarProgreso(parseInt(document.getElementById("progreso-download").style.width, 10), 85, true, "comprobarInstalador" );
				
		}
	}	 
}

/**
* Función - comprobarInstalador - Comprueba la consistencia del archivo instalador (.air) previamente descargado y almacenado.
**/	
function comprobarInstalador(){
	if(ventanaPrincipalMinimizada) window.nativeWindow.restore();
	actualizacionesTarea = "";	
	cambiarEstadoBotones("procesando");
	window.nativeWindow.title = "CDOCS : ACTUALIZACIONES - TEST";
	propiedadesPrograma.versiones.actualizacionesMensaje = "";
	propiedadesPrograma.versiones.actualizacionesError = "";
	var errorVerificado = "ninguno";
	document.getElementById("tarea-download").innerHTML = "Verificando";
	try{
		if(propiedadesPrograma.versiones.actualizacionesAlmacenamiento.exists){
			if(propiedadesPrograma.versiones.actualizacionesAlmacenamiento.size !== propiedadesPrograma.versiones.actualizacionesPeso){
				errorVerificado = "Installer Package size different than expected";
			}  
		}else{
			errorVerificado = "There is no Installer Package in the specified path"; 
		}
	}catch(error){
		errorVerificado = error;		
	}finally{
		if(errorVerificado !== "ninguno"){
			procesandoActualizaciones = false;
			cambiarEstadoBotones("inicial");
			propiedadesPrograma.versiones.actualizacionesMensaje = "<span>Se ha producido un error ...<span>";
			propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + errorVerificado + "<span>";
			document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
			document.getElementById("alerta-download").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
		}else{
			visualizarProgreso(parseInt(document.getElementById("progreso-download").style.width, 10), 99, true, "instalarActualizaciones");
		}
	}
	
}

/**
* Función - instalarActualizaciones - Procesa el archivo instalador (.air) previamente descargado, almacenado y verificado para instalar una actualización.
**/	
function instalarActualizaciones(){
	if(ventanaPrincipalMinimizada) window.nativeWindow.restore();
	actualizacionesTarea = "";	
	cambiarEstadoBotones("procesando");
	window.nativeWindow.title = "CDOCS : ACTUALIZACIONES - INSTALACIÓN";
	propiedadesPrograma.versiones.actualizacionesMensaje = "Instalando <span class='texo-capital'>CDOCS</span> (nueva versión  <span class='texo-capital'>" + propiedadesPrograma.versiones.actualizaciones + "</span>)";
	propiedadesPrograma.versiones.actualizacionesError = "";
	document.getElementById("tarea-download").innerHTML = "";
	document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
	var errorInstalar = "ninguno";
	var demora, espera;
	clearTimeout(demora);
	setTimeout(function(){
		var elementoBarra = document.getElementById("progreso-download").style.width = "448px";
		var elementoPorcentaje = document.getElementById("porcentaje-download").innerHTML = "100";
		
		try{
			if(!air.Capabilities.isDebugger){
				var instalador = new air.Updater();
				instalador.update(propiedadesPrograma.versiones.actualizacionesAlmacenamiento,propiedadesPrograma.versiones.actualizaciones);
			}else{
				procesandoActualizaciones = false;
				errorInstalar = "Error: It is not allowed to install updates in debug mode";
			}
		}catch(error){
			errorInstalar = error;
		}finally{
			procesandoActualizaciones = false;
			if(errorInstalar !== "ninguno"){
				document.getElementById("progreso-download").style.width = "444px";
				document.getElementById("porcentaje-download").innerHTML = "99";
				propiedadesPrograma.versiones.actualizacionesMensaje = "<span>Se ha producido un error ...<span>";
				propiedadesPrograma.versiones.actualizacionesError = "<span><img src='images/alerta.png' alt='' title='' class='alerta-imagen-error'></span><span class='alerta-texto-error'>" + errorInstalar + "<span>";
				document.getElementById("tarea-download").innerHTML = "Instalando";
				document.getElementById("mensaje-download").innerHTML = propiedadesPrograma.versiones.actualizacionesMensaje;
				document.getElementById("alerta-download").innerHTML = propiedadesPrograma.versiones.actualizacionesError;
				cambiarEstadoBotones("inicial"); 
				if(errorInstalar === "Error: It is not allowed to install updates in debug mode") notificarConHumanJS("¡ATENCIÓN!<br />No está permitido instalar actualizaciones en modo depuración.<br />(lanzamiento desde ADL)", "error", 5000);
			}
		}
	},1000);	
}

/**
* Función - visualizarProgreso - Progreso visual (barra y porcentaje) de la descarga del paquete instalador (.air) solicitado.
* También funciona (modo simulado) en las tareas de almacenamiento y verificación.
**/	
function visualizarProgreso(cargado, total, simulado, cometido){
	cometido = cometido || null;
	var elementoBarra = document.getElementById("progreso-download");
	var elementoPorcentaje = document.getElementById("porcentaje-download");
	var largoBarra = 0;
	var mayorLargoBarra = 448; //Largo máximo de la barra de progreso : 448px
	var establecerIntervalo;
	var porcentaje = 0;
	var ejecutar = function(cometido){		
			if(cometido === "comprobarInstalador"){
				comprobarInstalador();
			}else if(cometido === "instalarActualizaciones"){
				instalarActualizaciones();
			}else{
				return;
			}		
	};
	if(!simulado){		
		// Dejamos el primer tramo en 69 (69%) que corresponde a la primera operación -Descarga-
		mayorLargoBarra = Math.round(mayorLargoBarra * 69 / 100);
		porcentaje = cargado / total * 69; 
		elementoPorcentaje.innerHTML = Math.round(porcentaje); 
		largoBarra = cargado / total * mayorLargoBarra; 
		elementoBarra.style.width = largoBarra +"px"; 
	}else{
		//cargado = desde (largo actual de la imagen barra de progreso) y total = hasta en %;
		largoBarra = cargado;
		elementoBarra.style.width = largoBarra + "px";
		porcentaje = parseInt(elementoPorcentaje.innerHTML,10);
		establecerIntervalo = setInterval(function(){
			porcentaje = porcentaje + 1;
			if(porcentaje <= total){
				largoBarra =  mayorLargoBarra * porcentaje / 100;
				elementoBarra.style.width = largoBarra + "px";
				elementoPorcentaje.innerHTML = Math.round(porcentaje); 				
			}else{
				clearInterval(establecerIntervalo);
				if(cometido !== null){
					ejecutar(cometido);
				}			
			}
		},200);		
	}
}

/********************************************************
* Función de carga de la aplicación. Tareas al inicio:
*********************************************************/

window.onload=function(){
/**
* antes de visualizar la ventana principal.
**/
	//Prevención del caché
	window.htmlLoader.cacheResponse = false;
	window.htmlLoader.useCache = false;
	//Precarga de imágenes:
	precargarImagen();
	//Ventana centrada en pantalla:
	window.nativeWindow.x = parseInt((air.Screen.mainScreen.bounds.width / 2) - (window.nativeWindow.width / 2), 10);
	window.nativeWindow.y = parseInt((air.Screen.mainScreen.bounds.height / 2) - (window.nativeWindow.height / 2),10);
	//Obtención de la fecha del sistema. 
	fechaSistema = new obtenerFecha(); 
	//Obtención de propiedades del programa.
	obtenerPropiedadesPrograma();
	//Obtención del nombre comercial del sistema operativo (Mac OS):
	obtenerNombreComercialSO();
	//Incorporación del menú general.
	mnuEmergente = construirMnuEmergente();
	//Carga del formulario 'home' (portada).
	cargarFormulario("home");
	//Situamos el logotipo (con menú contextual) en la bandeja del sistema (en el Dock en Mac).
	//Esta función también visualiza y activa la ventana principal;
	 activarMnuIcono();
	
	/**
	* Tareas al inicio, después de visualizar la ventana principal.
	**/
	//Iniciamos la monitorización del estado de conexión a Internet:
	monitorizarInternet();
	//Actualizamos el registro de versiones.
	registrarVersiones();
	//Eliminamos la pulsación del botón derecho del ratón (acceso a menú contextual):
	document.oncontextmenu = function(){return false;};

	//Asociación de Eventos generales:
	window.nativeWindow.addEventListener(air.Event.CLOSING, cerrarTodasLasVentanas);
	mnuEmergente.addEventListener("preparing", function(event){
	event.preventDefault();
	cambiarEstadoBotones("mnu-inactivo");
	}, false);

	document.getElementById("cabecera").addEventListener("click", function(){
	if(document.getElementById("botones-mnu").className === "botones-inactivo") cambiarEstadoBotones("mnu-activo");
	}, false);

	document.getElementById("continente").addEventListener("click", function(){
	if(document.getElementById("botones-mnu").className === "botones-inactivo") cambiarEstadoBotones("mnu-activo");
	}, false);

	document.addEventListener("keydown",capturarPulsacionesTeclado,false);

	window.nativeWindow.addEventListener(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGE, function(event){
		event.preventDefault(); 
		if(event.afterDisplayState === air.NativeWindowDisplayState.MINIMIZED){
			ventanaPrincipalMinimizada = true;			
		}else if(event.afterDisplayState === air.NativeWindowDisplayState.NORMAL){
			ventanaPrincipalMinimizada = false;			
		}			
	});	
};