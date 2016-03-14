/********************************************************
* Cdocs // alivePDFgenerator.js - Javascript. 
* Versión 0.1.0
* Fecha de edición/revisión: 31/01/2016
* Foog.Software
* Licencia MIT.
* Dependencias: alivePDFWrapper.js
*********************************************************/

/**
* Función - crearArchivoPDF - Genera un documento PDF con AlivePDF. 
**/
function crearArchivoPDF(formulario){
	var errorPDF = false;
	var errorPDFnum ="";
	var errorPDFmensaje= "";
	var fechaPDF = new obtenerFecha();
	var nombrePDF = formulario + "_" + parseInt(fechaPDF.marcaTemporal / 1000,10) + ".pdf";
	var documentoFecha = fechaPDF.dd + "/" + fechaPDF.mm + "/" + fechaPDF.aaaa + " " + fechaPDF.horas + ":" + fechaPDF.minutos + ":" + fechaPDF.segundos;
	var documentoAutor = "Foog.Software";
	var documentoWeb = "www.foog.es";
	var documentoAsunto = "Oficina: Gestión de documentos";
	var documentoPrograma = "CDOCS (Comprueba Documentos) ";
	var titular = "", abreviatura = "", abreviatura2 = "" ,  numVerificado = "", numVerificado2 = "", entidad = "", entidadClase ="L", observaciones = "", definiciones = "", datos = "";
	var directorioPDFs, rutaArchivoPDF, objetoArchivoPDF, objetoArchivoPDFurl;
	switch(formulario){
	case "iban" :
		datos = (document.forms.iban.elements["oculto-iban"].value).split("|");
		titular = "INTERNATIONAL BANK ACCOUNT NUMBER";
		abreviatura = "IBAN  :";
		numVerificado = datos[0];
		abreviatura2 = "BBAN :";
		numVerificado2 = datos[1];
		if(datos[0].substr(0,2) === "ES"){
			if(datos[2] === "DESCONOCIDA"){
				entidad = "País : España";
				observaciones = "La entidad con número " +  datos[1].substr(0,4) + " NO está registrada en la base de datos de la aplicación, que contiene información sobre el Registro de Entidades del B.E.";	
			}else{
				entidad = datos[2];
				observaciones = (datos[3]) ? "La entidad " + datos[1].substr(0,4)  + " causó BAJA con fecha " + datos[3] + " en el Registro de Entidades del Banco de España, (" + datos[4] + ")." : "" ;	
			} 
		}else{
			entidad = "País : " + datos[2];
		}
		definiciones = "El International Bank Account Number  –Código Internacional de Cuenta Bancaria, en español – es un código alfanumérico que identifica una cuenta bancaria determinada en una entidad financiera en cualquier lugar del mundo (si el país está adherido al sistema IBAN). consta de un máximo de 34 caracteres alfanuméricos. Los dos primeros identifican el país. Los dos siguientes son dígitos de control. Los restantes son el número de cuenta o  BBAN (Basic Bank Account Number).";
	break;
	case "ccc" :
		datos = (document.forms.ccc.elements["oculto-ccc"].value).split("|");
		titular = "CÓDIGO CUENTA CLIENTE";
		abreviatura = "CCC  :";
		numVerificado = document.forms.ccc.elements[0].value + " " + document.forms.ccc.elements[1].value + " " + document.forms.ccc.elements[2].value + " " + document.forms.ccc.elements[3].value;
		abreviatura2 = "IBAN :";
		numVerificado2 = datos[0] + " " + numVerificado;
		if (datos[1] === "DESCONOCIDA"){
			observaciones = "La entidad con número " + document.forms.ccc.elements[0].value + " NO está registrada en la base de datos de la aplicación, que contiene información sobre el Registro de Entidades del B.E.";	
		}else{
			entidad = datos[1];
			if(datos[3] && /\sA$/i.test(datos[3])) datos[3] = datos[3].substr(0,datos[3].length -2);
			if(datos[3] && /\sPOR$/i.test(datos[3])) datos[3] = datos[3].substr(0,datos[3].length -4);
			observaciones = (datos[2]) ? "La entidad " + document.forms.ccc.elements[0].value + " causó BAJA con fecha " + datos[2] + " en el Registro de Entidades del Banco de España, (" + datos[3] + ")." : "" ;	
		}	
		definiciones =  "El Código Cuenta Cliente (CCC) es un código utilizado en España por las entidades financieras para la identificación de las cuentas de sus clientes. Consta de veinte dígitos. Los cuatro primeros son el Código de la Entidad, que coincide con el Número de Registro de Entidades del Banco de España. Los cuatro siguientes identifican la oficina. Los siguientes dos dígitos son los llamados dígitos de control, que sirven para validar el CCC. Los diez últimos dígitos identifican unívocamente la cuenta.";
	break;
		case "ntc": 
			titular = "NÚMERO DE TARJETA DE CRÉDITO O DÉBITO";
			abreviatura = "NTC :";
			numVerificado = document.forms.ntc.elements[0].value.substr(0,6)  + " " + document.forms.ntc.elements[0].value.substr(6,document.forms.ntc.elements[0].value.length - 7)+ " " + document.forms.ntc.elements[0].value.substr(-1);
			datos = document.forms.ntc.elements["oculto-ntc"].value;
			if(datos){
				entidad = "TARJETA : " + datos;
				observaciones = 'Es posible que el dato "TARJETA", no coincida con el del documento examinado.';
			}
			definiciones = "La tarjeta de crédito (o débito) es un instrumento material de identificación. Puede ser una tarjeta de plástico con una banda magnética, un microchip y un número en relieve, que es un caso especial de la norma ISO/IEC 7812. Los seis primeros dígitos conforman el Número de Identificación del Emisor (IIN) que contiene el identificador principal de la industria (MII), primer dígito de los seis. Un número de cuenta, serie de extensión variable, y un último dígito (de control) que cumple el algoritmo de Luhn con respecto a todos los números anteriores.";
	break;
	case 'nif' :
		titular = "NÚMERO DE IDENTIFICACIÓN FISCAL";
		abreviatura = "NIF :";
		datos = document.forms.nif.elements["oculto-nif"].value.split("|");
		var tipo = document.forms.nif.elements[0].value;
		var valor = document.forms.nif.elements[1].value + " " + document.forms.nif.elements[2].value;
		if(tipo === "I"){
			//DNI
			numVerificado = valor;
			abreviatura2 = "DNI :";
			numVerificado2 = valor;	
			entidad = datos[0];	
		}else if(/^[XYZ]/i.test(tipo)){
			numVerificado = tipo + " " + valor;
			abreviatura2 = "NIE :";
			numVerificado2 = numVerificado;	
			entidad = 'Tipo "' + tipo + '" - ' + datos[0];
		}else{
			numVerificado = tipo + " " + valor;
			entidad = 'Tipo "' + tipo + '" - ' + datos[0];
		}
		if(!/^[IKLMXYZ]/i.test(tipo)){
			if(datos[1] && datos[1] !== "" && datos[1] !== "DESCONOCIDA"){
			observaciones = "Con sede en la provincia de " + datos[1].toUpperCase() + " si el NIF fue asignado con anterioridad a enero del 2008."; 
			}
		}
		definiciones = "El Número de Identificación Fiscal (NIF) es la manera de identificación tributaria utilizada en España para las personas físicas y jurídicas. El antecedente del NIF es el Código de Identificación Fiscal (CIF), utilizado sólo en personas jurídicas hasta enero de 2008. Está formado generalmente por una letra inicial seguida de siete u ocho números más un dígito de control, que puede ser un número o una letra.";
	break;
	case 'dni' :
		titular = "DOCUMENTO NACIONAL DE IDENTIDAD";
		abreviatura = "DNI :";
		numVerificado = document.forms.dni.elements[1].value + " " + document.forms.dni.elements[2].value;
		abreviatura2 = "NIF :";
		numVerificado2 = numVerificado;	
		definiciones = "El DNI es un documento público, personal e intransferible, emitido por el Ministerio del Interior, que acredita la identidad y los datos personales de su titular, así como la nacionalidad española del mismo. Esta formado por un máximo de ocho números y una letra final (de control). El NIF (Número de Identificación Fiscal) para los nacionales con DNI coincide con este último.";
	break;
	case 'nie' :
		titular = "NÚMERO DE IDENTIDAD DE EXTRANJERO";
		abreviatura = "NIE :";
		numVerificado = document.forms.nie.elements[0].value + " " + document.forms.nie.elements[1].value + " " + document.forms.nie.elements[2].value;
		abreviatura2 = "NIF :";
		numVerificado2 = numVerificado;	
		if(document.forms.nie.elements[0].value === "X"){
			observaciones = "NIE asignado antes del mes de julio de 2008.";
		}else{
			observaciones = "NIE asignado después del mes de julio de 2008.";
		}
		definiciones = 'El número de identidad de extranjero, más conocido por sus siglas NIE es, en España, un código que sirve para la identificación de los no nacionales. Está compuesto por una letra inicial, siete dígitos y un carácter de verificación alfabético. La letra inicial es una "X" para los asignados antes de julio de 2008 y una "Y" para los asignados a partir de dicha fecha. Una vez agotada la serie numérica de la "Y" la norma prevé que se utilice la "Z". El NIF (Número de Identificación Fiscal) para los extranjeros con NIE coincide con este último.';
	break;
	case 'naf' :
		titular = "NÚMERO DE AFILIACIÓN A LA SEGURIDAD SOCIAL";
		datos = document.forms.naf.elements["oculto-naf"].value;
		abreviatura = "NAF :";
		numVerificado = document.forms.naf.elements[0].value.substr(0,2) + " " + document.forms.naf.elements[0].value.substr(2,document.forms.naf.elements[0].value.length -4) + " " + document.forms.naf.elements[0].value.substr(document.forms.naf.elements[0].value.length -2, document.forms.naf.elements[0].value.length);
		entidad = "Provincia de afiliación: " + datos;
		definiciones = "El Número de afiliación (acto administrativo mediante el cual la Tesorería General de la Seguridad Social reconoce la condición de incluida en el Sistema a la persona física que por primera vez realiza una actividad) a la Seguridad Social identifica al ciudadano en sus relaciones con la Seguridad Social. Está formado por doce números, los dos primeros coinciden con el código de la provincia de afiliación y los dos últimos son dígitos de control.";
	break;
	case 'cccss' :
		titular = "CÓDIGO DE CUENTA DE COTIZACIÓN";
		datos = document.forms.ccss.elements["oculto-cccss"].value;
		abreviatura = "CCC :";
		numVerificado = document.forms.ccss.elements[0].value.substr(0,2) + " " + document.forms.ccss.elements[0].value.substr(2,document.forms.ccss.elements[0].value.length -4) + " " + document.forms.ccss.elements[0].value.substr(document.forms.ccss.elements[0].value.length -2, document.forms.ccss.elements[0].value.length);
		entidad = "Provincia de actividad: " + datos;
		definiciones =  "La inscripción es el acto administrativo por el que la Tesorería General de la Seguridad Social asigna al empresario un número para su identificación y control de sus obligaciones en el respectivo Régimen del Sistema de la Seguridad Social. Dicho número es considerado como primero y principal Código de Cuenta de Cotización. El empresario debe solicitar un Código de Cuenta de Cotización en cada una de las provincias donde ejerza actividad. Está formado por once números donde los dos primeros indican la provincia de inscripción y los dos últimos los dígitos de control.";
	break;
	}
	try{
		var documentoPDF = new jsPDF();
		//Estructura de documentoPDF,una sola página con orientación "LANDSCAPE" (apaisado).
		documentoPDF.newPDF(documentoPDF.size.A5, documentoPDF.orientation.LANDSCAPE, documentoPDF.unit.MM);
		documentoPDF.setDisplayMode(documentoPDF.displayZoom.FULL_PAGE,documentoPDF.displayLayout.SINGLE_PAGE);
		documentoPDF.newPage(documentoPDF.size.A5, documentoPDF.orientation.LANDSCAPE, documentoPDF.unit.MM);
		documentoPDF.setViewerPreferences(false,false,false,false,false,false);
		documentoPDF.setMargins(10,10,6);
		//Cabecera: Imagen y título:
		documentoPDF.addImageEmbedded("logo_64.jpg",0,0,0,0,0,0.6);
		documentoPDF.lineStyle(0xD4D4D4);
		documentoPDF.beginFill(0xD4D4D4,100);
		documentoPDF.drawRect(34,14,166,12,0);
		documentoPDF.end();
		documentoPDF.endFill();
		documentoPDF.textStyle();
		documentoPDF.setEmbeddedFont("bold",false,14);
		documentoPDF.addText(titular,40,22); // Cabecera
		//Cuerpo del documento con contenido variable:
		documentoPDF.setXY(34,30);
		documentoPDF.setEmbeddedFont("bold",false,12);
		documentoPDF.addMultiCell(20,10,abreviatura,0,'L',0); // Código Verificado
		documentoPDF.setXY(56,30);
		documentoPDF.setEmbeddedFont("bold",false,14);
		documentoPDF.addMultiCell(144,10,numVerificado,0,'L',0);
		documentoPDF.setXY(34,42);
		documentoPDF.setEmbeddedFont("bold",false,12);
		documentoPDF.addMultiCell(20,10,abreviatura2,0,'L',0); // Código Verificado
		documentoPDF.setXY(56,42);
		documentoPDF.setEmbeddedFont("bold",false,14);
		documentoPDF.addMultiCell(144,10,numVerificado2,0,'L',0);
		documentoPDF.setXY(34,56);
		documentoPDF.setEmbeddedFont("bold",false,12);
		documentoPDF.addMultiCell(166,6,entidad,0,entidadClase,0);
		documentoPDF.setXY(34,70);
		documentoPDF.setEmbeddedFont("normal-oblique",false,9);
		documentoPDF.addMultiCell(166,4,observaciones,0,'L',0);
		documentoPDF.setXY(34,84);
		documentoPDF.textStyle(0x666666);
		documentoPDF.setEmbeddedFont("normal",false,10);
		documentoPDF.addMultiCell(166,4,definiciones,0,'J',0);
		//Pie del documento con contenido variable (fecha de edición).
		documentoPDF.lineStyle(0xD4D4D4);
		documentoPDF.drawLine(34, 116, 198, 116);
		documentoPDF.setXY(10,119);
		documentoPDF.setEmbeddedFont('normal',false,8);
		documentoPDF.textStyle(0x969696);
		documentoPDF.addMultiCell(188,2,documentoPrograma + " - " + documentoFecha,0,'R',0);
		documentoPDF.newLine(1);
		documentoPDF.addMultiCell(188,2,documentoAutor,0,'R',0);
		documentoPDF.newLine(1);
		documentoPDF.addMultiCell(188,2,documentoWeb,0,'R',0);
		//Información sobre características del archivo PDF generado:
		documentoPDF.infoPDF(titular,documentoAsunto,documentoAutor,documentoWeb,documentoPrograma);
		//Guarda el archivo PDF creado en el directorio de "almacenamiento" de la aplicación (con permisos de lectura y escritura).
		
		directorioPDFs = air.File.applicationStorageDirectory.resolvePath("pdf"); 
		if(!directorioPDFs.exists) directorioPDFs.createDirectory(); //Crea el subdirectorio PDF, si no existe.
		
		rutaArchivoPDF = air.File.applicationStorageDirectory.nativePath + air.File.separator + "pdf" + air.File.separator + nombrePDF;
		
		documentoPDF.saveToFileAIR(rutaArchivoPDF); //Guarda el archivo PDF en la ruta determinada en la línea anterior.
		
		objetoArchivoPDF = new air.File(); 
		objetoArchivoPDF.nativePath = air.File.applicationStorageDirectory.resolvePath("pdf" + air.File.separator + nombrePDF).nativePath;
		objetoArchivoPDFurl = objetoArchivoPDF.url;
		//air.trace(objetoArchivoPDFurl);
	}catch(errorCapturado){
		errorPDF = true;
		errorPDFnum = "3200";
		errorPDFmensaje = errorCapturado;
	}finally{
		
		if(errorPDF){
			var infoError = errorPDFnum + "|" + nombrePDF + "|" + errorPDFmensaje;
			abrirNuevaVentanaNativa("html/print/errorPDF.html", infoError, "applicationDirectory", "utilidad");
		}else{
			abrirNuevaVentanaNativa("html/print/containerPDF.html",objetoArchivoPDFurl, "applicationDirectory", "normal");	
		}		
		borrarAlertaVoluntario(formulario);
		document.getElementById("alerta-" + formulario).innerHTML =plantillaAlertaInfo;	
		cambiarEstadoBotones("acierto");			
	}
}