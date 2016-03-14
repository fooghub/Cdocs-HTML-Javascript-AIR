/********************************************************
* Cdocs // alivePDFWrapper.js 
* Versión 0.1.0
* Fecha de edición/revisión: 31/01/2016
* Foog.Software
* Licencia MIT.
* Dependencias: alivePDFlib.swf
*********************************************************/

/**
* Función constructora - jsPDF - Interfaz Javascript para AlivePDF.
**/
function jsPDF() {
    // Definición de constantes:
    this.size = {
        A3: 0,
        A4: 1,
        A5: 2,
        LEGAL: 3,
        LETTER: 4,
        TABLOID: 5
    };
    this.unit = {
        MM: 0,
        CM: 1,
        INCHES: 2,
        POINT: 3
    };
    this.orientation = {
        PORTRAIT: 0,
        LANDSCAPE: 1
    };
    this.displayZoom = {
        DEFAULT: 0,
        FULL_PAGE: 1,
        FULL_WIDTH: 2,
        REAL: 3
    };
    this.displayLayout = {
        SINGLE_PAGE: 0,
        ONE_COLUMN: 1,
        TWO_COLUMN_LEFT: 2,
        TWO_COLUMN_RIGHT: 3
    };

    // Carga de la librería ActionScript:
	
    this.ASlib = new window.runtime.alivePDFlib();

	// Construcción y formato de la página:
			
    this.newPDF = function (size, orientation, unit) {
        this.ASlib.newPDF(size, orientation, unit);
    };
    
	this.setDisplayMode = function (displayZoom, displayLayout) {
        this.ASlib.setDisplayMode(displayZoom, displayLayout);
    };
    
	this.newPage = function (size, orientation, unit) {
        this.ASlib.newPage(size, orientation, unit);
    };

    this.addPage = function () {
        this.ASlib.addPage();
    };
	
			
	this.setMargins=function(left, top, right, bottom){
		this.ASlib.setMargins(left,top,right,bottom);
	};
	
	this.setAutoPageBreak=function(auto, margin){
		this.ASlib.setAutoPageBreak(auto, margin);
	};
	
	this.skew=function(ax, ay, x, y){
		this.ASlib.skew(ax, ay, x, y);
	};
	
	this.infoPDF=function(title,subject,author,keywords,creator){
		this.ASlib.infoPDF(title,subject,author,keywords,creator);
	};
	
	
	this.setViewerPreferences=function(toolbar, menubar, windowUI, fitWindow, centeredWindow, displayTitle){
			this.ASlib.setViewerPreferences(toolbar, menubar, windowUI, fitWindow, centeredWindow, displayTitle);
	};
	
		
	// Escritura y formato de texto:
	
	this.addText=function (text,pX,pY){
		this.ASlib.addText(text,pX,pY);
	};
	
    this.writeText = function (lineHeight, text, link) {
        this.ASlib.writeText(lineHeight, text, link);
    };
	
	this.addLink=function(pX, pY, pWidth, pHeight, pLink, pHighlight){
		this.ASlib.addLink(pX, pY, pWidth, pHeight, pLink, pHighlight);
	};

	this.writeFlashHtmlText=function(pHeight, pText, pLink){
		this.ASlib.writeFlashHtmlText(pHeight, pText, pLink);
	};
	
	this.addMultiCell=function(width, height, text, border, align, filled){
		this.ASlib.addMultiCell(width, height, text, border, align, filled);
	};
	
	this.newLine=function(pHeight){
		this.ASlib.newLine(pHeight);
	};
	
	
	this.getX=function(){
		this.ASlib.getX();
	};

	this.getY=function(){
		this.ASlib.getY();
	};		
	
	this.setX=function(x){
		this.ASlib.setX(x);
	};
	this.setY=function(y){
		this.ASlib.setY(y);
	};
	
	this.setXY= function(x, y){
		this.ASlib.setXY(x,y);
	};
	
	
	this.setFontSize=function(size){
		this.ASlib.setFontSize(size);
	};
	
	this.setFont=function(font,size,underlined){
		
		/* Nombre de Fuentes incorporadas:
		
		ARIAL : String = Helvetica

 	 	COURIER : String = Courier

 	 	COURIER_BOLD : String = Courier-Bold
	
 	 	COURIER_BOLDOBLIQUE : String = Courier-BoldOblique

 	 	COURIER_OBLIQUE : String = Courier-Oblique

 	 	HELVETICA : String = Helvetica

 	 	HELVETICA_BOLD : String = Helvetica-Bold

 	 	HELVETICA_BOLDOBLIQUE : String = Helvetica-BoldOblique

 	 	HELVETICA_OBLIQUE : String = Helvetica-Oblique

 	 	SYMBOL : String = Symbol

 	 	TIMES : String = Times-Roman

 	 	TIMES_BOLD : String = Times-Bold

 	 	TIMES_BOLDITALIC : String = Times-BoldItalic

 	 	TIMES_ITALIC : String = Times-Italic

 	 	ZAPFDINGBATS : String = ZapfDingbats

		*/
	
						
	this.ASlib.setFont(font, size, underlined);
	};
	
	this.setEmbeddedFont=function(tipo,underlined,size){
	
		/*Tipos:
		normal
		normal-oblique
		bold
		bold-oblique
		verdana
		*/
		
		this.ASlib.setEmbeddedFont(tipo,size,underlined);
	};
	
	this.textStyle=function(colorRGB,alpha,rendering,wordSpace,characterSpace,scale,leading){
	colorRGB=colorRGB || 0x000000;
	alpha=alpha || 1;
	rendering=rendering || 0;
	wordSpace=wordSpace || 0;
	characterSpace=characterSpace || 0;
	scale=scale || 100;
	leading=leading || 0;
		this.ASlib.textStyle(colorRGB,alpha,rendering,wordSpace,characterSpace,scale,leading);
	};
	
	this.setAlpha=function(alpha, blendMode){
		this.ASlib.setAlpha(alpha, blendMode);
	};
	
	// Dibujo de formas geométricas:
	
	this.lineStyle=function(color,thickness,alpha,isDashed,caps,joints){
	color=color || 0x000000;
	thickness=thickness || 1;
	alpha=alpha || 1;
	isDashed=isDashed || false;
	caps=caps || null;
	joints=joints || null;
	
		/*Valores del parámetro 'caps':
		caps="0 J"; // none
		caps="1 J"; // round
		caps="2 J"; //square
		
		Valores para el parámetro 'joints':
		joints="2J"; // bevel
		joints="0J"; //miter
		joints="1J"; //round
		*/
		
		this.ASlib.lineStyle(color, thickness,alpha,isDashed,caps,joints);
	};
	
	this.lineTo=function(x,y){
		this.ASlib.lineTo(x,y);
	};
	this.moveTo=function(x,y){
		this.ASlib.moveTo(x,y);
	};
	this.end=function(){
		this.ASlib.end();
	};
	
	this.beginFill=function(color,tint){
		this.ASlib.beginFill(color,tint);
	};

	this.endFill=function(){
		this.ASlib.endFill();
	};
	
	
	this.drawLine=function(x1, y1, x2, y2){
			this.ASlib.drawLine(x1, y1, x2, y2);
	};
	
	this.drawRect=function(x,y,width,height,radius){
		this.ASlib.drawRect(x,y,width,height,radius);	
	};
		
	this.drawCircle=function(x, y, radius){
		this.ASlib.drawCircle(x, y, radius);
	};
	
	// Incorporación de imágenes incustadas:

	this.addImageEmbedded=function(image,x,y,width,height,rotation,alpha){
	x=x || 0;
	y=y || 0;
	width=width || 0;
	height=height || 0;
	rotation=rotation || 0;
	alpha=alpha || 1;
		this.ASlib.addImageEmbedded(image,x,y,width,height,rotation,alpha);
	};
		
	// Exportación LOCAL del archivo PDF:	
	
	this.saveToFileAIR=function(filePDF) {
	this.ASlib.saveToFileAIR(filePDF);
	};
	
}
		

