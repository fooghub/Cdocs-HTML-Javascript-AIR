/*Cdocs // alivePDFWrapper-min.js (Comprimido con Google Closure Compiler). Versión 0.1.0. Fecha de edición/revisión: 31/01/2016. Foog.Software. Licencia MIT. Dependencias: alivePDFlib.swf */
function jsPDF(){this.size={A3:0,A4:1,A5:2,LEGAL:3,LETTER:4,TABLOID:5};this.unit={MM:0,CM:1,INCHES:2,POINT:3};this.orientation={PORTRAIT:0,LANDSCAPE:1};this.displayZoom={DEFAULT:0,FULL_PAGE:1,FULL_WIDTH:2,REAL:3};this.displayLayout={SINGLE_PAGE:0,ONE_COLUMN:1,TWO_COLUMN_LEFT:2,TWO_COLUMN_RIGHT:3};this.ASlib=new window.runtime.alivePDFlib;this.newPDF=function(a,b,c){this.ASlib.newPDF(a,b,c)};this.setDisplayMode=function(a,b){this.ASlib.setDisplayMode(a,b)};this.newPage=function(a,b,c){this.ASlib.newPage(a,
b,c)};this.addPage=function(){this.ASlib.addPage()};this.setMargins=function(a,b,c,d){this.ASlib.setMargins(a,b,c,d)};this.setAutoPageBreak=function(a,b){this.ASlib.setAutoPageBreak(a,b)};this.skew=function(a,b,c,d){this.ASlib.skew(a,b,c,d)};this.infoPDF=function(a,b,c,d,e){this.ASlib.infoPDF(a,b,c,d,e)};this.setViewerPreferences=function(a,b,c,d,e,f){this.ASlib.setViewerPreferences(a,b,c,d,e,f)};this.addText=function(a,b,c){this.ASlib.addText(a,b,c)};this.writeText=function(a,b,c){this.ASlib.writeText(a,
b,c)};this.addLink=function(a,b,c,d,e,f){this.ASlib.addLink(a,b,c,d,e,f)};this.writeFlashHtmlText=function(a,b,c){this.ASlib.writeFlashHtmlText(a,b,c)};this.addMultiCell=function(a,b,c,d,e,f){this.ASlib.addMultiCell(a,b,c,d,e,f)};this.newLine=function(a){this.ASlib.newLine(a)};this.getX=function(){this.ASlib.getX()};this.getY=function(){this.ASlib.getY()};this.setX=function(a){this.ASlib.setX(a)};this.setY=function(a){this.ASlib.setY(a)};this.setXY=function(a,b){this.ASlib.setXY(a,b)};this.setFontSize=
function(a){this.ASlib.setFontSize(a)};this.setFont=function(a,b,c){this.ASlib.setFont(a,b,c)};this.setEmbeddedFont=function(a,b,c){this.ASlib.setEmbeddedFont(a,c,b)};this.textStyle=function(a,b,c,d,e,f,g){this.ASlib.textStyle(a||0,b||1,c||0,d||0,e||0,f||100,g||0)};this.setAlpha=function(a,b){this.ASlib.setAlpha(a,b)};this.lineStyle=function(a,b,c,d,e,f){this.ASlib.lineStyle(a||0,b||1,c||1,d||!1,e||null,f||null)};this.lineTo=function(a,b){this.ASlib.lineTo(a,b)};this.moveTo=function(a,b){this.ASlib.moveTo(a,
b)};this.end=function(){this.ASlib.end()};this.beginFill=function(a,b){this.ASlib.beginFill(a,b)};this.endFill=function(){this.ASlib.endFill()};this.drawLine=function(a,b,c,d){this.ASlib.drawLine(a,b,c,d)};this.drawRect=function(a,b,c,d,e){this.ASlib.drawRect(a,b,c,d,e)};this.drawCircle=function(a,b,c){this.ASlib.drawCircle(a,b,c)};this.addImageEmbedded=function(a,b,c,d,e,f,g){this.ASlib.addImageEmbedded(a,b||0,c||0,d||0,e||0,f||0,g||1)};this.saveToFileAIR=function(a){this.ASlib.saveToFileAIR(a)}}
;