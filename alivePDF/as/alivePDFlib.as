package {
	import flash.display.*;
    import flash.events.Event;
	import flash.events.IEventDispatcher;
	import flash.filesystem.FileStream;
    import flash.filesystem.File;
    import flash.filesystem.FileMode;
	import flash.geom.*;
	import flash.net.URLRequest;
	import flash.utils.ByteArray;
	
	import mx.utils.UIDUtil;
	import org.alivepdf.pdf.PDF;
	
	import org.alivepdf.colors.*;
	import org.alivepdf.display.Display;
	import org.alivepdf.drawing.*;
	import org.alivepdf.events.ProcessingEvent;
	import org.alivepdf.fonts.* ;
	import org.alivepdf.images.*;
	import org.alivepdf.layout.* ;
    import org.alivepdf.links.* ;
	import org.alivepdf.pages.Page;    
    import org.alivepdf.saving.Method;
	
 	
    public class alivePDFlib extends Sprite {
	
        private var pdf: PDF;
        private var file: File;
		
		// Imágenes incrustadas:
		[Embed( source="/assets/images/logo_64.jpg", mimeType="application/octet-stream" )]
		private var imgLogo_64:Class;
		[Embed( source="/assets/images/cc_64.jpg", mimeType="application/octet-stream" )]
		private var imgCC_64:Class;		
		[Embed( source="/assets/images/cc_88x31.jpg", mimeType="application/octet-stream" )]
		private var imgCC_88x31:Class;		
		[Embed( source="/assets/images/copyleft_12.jpg", mimeType="application/octet-stream" )]
		private var imgCopyleft_12:Class;		
		[Embed( source="/assets/images/copyleft_64.jpg", mimeType="application/octet-stream" )]
		private var imgCopyleft_64:Class;
		[Embed( source="/assets/images/gato_32.jpg", mimeType="application/octet-stream" )]
		private var imgGato_32:Class;
		
		
		// Fuentes de letra incrustadas - DejaVu Sans y Verdana:
		[Embed( source="assets/fonts/dejavusans.ttf", mimeType="application/octet-stream" )]
		private var normal_ttf:Class;
		[Embed( source="assets/fonts/dejavusans.afm", mimeType="application/octet-stream" )]
		private var normal_afm:Class;
		[Embed( source="assets/fonts/dejavusansoblique.ttf", mimeType="application/octet-stream" )]
		private var normal_oblique_ttf:Class;
		[Embed( source="assets/fonts/dejavusansoblique.afm", mimeType="application/octet-stream" )]
		private var normal_oblique_afm:Class;
		[Embed( source="assets/fonts/dejavusansbold.ttf", mimeType="application/octet-stream" )]
		private var bold_ttf:Class;
		[Embed( source="assets/fonts/dejavusansbold.afm", mimeType="application/octet-stream" )]
		private var bold_afm:Class;
		[Embed( source="assets/fonts/dejavusansboldoblique.ttf", mimeType="application/octet-stream" )]
		private var bold_oblique_ttf:Class;
		[Embed( source="assets/fonts/dejavusansboldoblique.afm", mimeType="application/octet-stream" )]
		private var bold_oblique_afm:Class;		
		[Embed( source="assets/fonts/verdana.ttf", mimeType="application/octet-stream" )]
		private var verdana_ttf:Class;
		[Embed( source="assets/fonts/verdana.afm", mimeType="application/octet-stream" )]
		private var verdana_afm:Class;
		
		
	    public function alivePDFlib() {}
		
		// Los siguientes métodos 'translate ..' convierten los números enteros pasados desde 
		// JavaScript al tipo de dato correcto usado por AlivePDF, cuando es necesario.
			
        private function translateSize(size: int): Size {
            var s: Size = Size.A4;
            switch (size) {
            case 0:
                s = Size.A3;
                break;
            case 1:
                s = Size.A4;
                break;
            case 2:
                s = Size.A5;
                break;
            case 3:
                s = Size.LEGAL;
                break;
            case 4:
                s = Size.LETTER;
                break;
            case 5:
                s = Size.TABLOID;
                break;
            }
            return s;
        }

        private function translateOrientation(orientation: int): String {
            var o: String = Orientation.PORTRAIT;
            switch (orientation) {
            case 0:
                o = Orientation.PORTRAIT;
                break;
            case 1:
                o = Orientation.LANDSCAPE;
                break;
            }
            return o;
        }

        private function translateUnit(unit: int): String {
            var u: String = Unit.MM;
            switch (unit) {
            case 0:
                u = Unit.MM;
                break;
            case 1:
                u = Unit.CM;
                break;
            case 2:
                u = Unit.INCHES;
                break;
            case 3:
                u = Unit.POINT;
                break;
            }
            return u;
        }

        private function translateDisplayZoom(dzoom: int): String {
            var dz: String = Display.FULL_PAGE;
            switch (dzoom) {
            case 0:
                dz = Display.DEFAULT;
                break;
            case 1:
                dz = Display.FULL_PAGE;
                break;
            case 2:
                dz = Display.FULL_WIDTH;
                break;
            case 3:
                dz = Display.REAL;
                break;
            }
            return dz;
        }

        private function translateDisplayLayout(dlayout: int): String {
            var dl: String = Layout.SINGLE_PAGE;
            switch (dlayout) {
            case 0:
                dl = Layout.SINGLE_PAGE;
                break;
            case 1:
                dl = Layout.ONE_COLUMN;
                break;
            case 2:
                dl = Layout.TWO_COLUMN_LEFT;
                break;
            case 3:
                dl = Layout.TWO_COLUMN_RIGHT;
                break;
            }
            return dl;
        }
		
		// Métodos para la construcción y formato de la página:

        public function newPDF(size: int, orientation: int, unit: int): void {
            var s: Size = translateSize(size);
            var o: String = translateOrientation(orientation);
            var u: String = translateUnit(unit);
            pdf = new PDF(o, u, s);
        }

        public function setDisplayMode(displayZoom: int, displayLayout: int): void {
            var dz: String = translateDisplayZoom(displayZoom);
            var dl: String = translateDisplayLayout(displayLayout);
            pdf.setDisplayMode(dz, dl);
        }

        public function newPage(size: int, orientation: int,unit: int): void {
            var s: Size = translateSize(size);
            var o: String = translateOrientation(orientation);
            var u: String = translateUnit(unit);
            var newPage: Page = new Page(o, u, s);
            pdf.addPage(newPage);
        }

        public function addPage(): void {
            pdf.addPage();
        }
		
				
		
		public function getTotalPages():int{
			var total_pages:int = pdf.totalPages;
			return total_pages;
		}
		
		//
			
		public function setX(x:Number):void{
			pdf.setX(x);
		}
		
		public function setY(y:Number):void{
			pdf.setY(y);
		}
		public function setXY(x:Number, y:Number):void{
			pdf.setXY(x,y);
		}
		
		public function setMargins(left:Number, top:Number, right:Number = -1, bottom:Number = 20): void{
			pdf.setMargins(left,top,right,bottom);
		}
		
						
		public function setAutoPageBreak(auto:Boolean, margin:Number):void{
			pdf.setAutoPageBreak(auto,margin);
		}
		
		public function newLine(pHeight:*):void{
			pdf.newLine(pHeight);
		}
		
		public function skew(ax:Number, ay:Number, x:Number = -1, y:Number = -1):void{
			pdf.skew(ax,ay,x,y);
		}
		
		public function setViewerPreferences(toolbar:String = "false", menubar:String = "false", windowUI:String = "false", fitWindow:String = "false", centeredWindow:String = "false", displayTitle:String = "false"):void{
			pdf.setViewerPreferences(toolbar,menubar,windowUI,fitWindow,centeredWindow,displayTitle);
		}
		
		public function infoPDF(title:String,subject:String,author:String,keywords:String,creator:String):void{
			pdf.setTitle(title);
			pdf.setSubject(subject);
			pdf.setAuthor(author);
			pdf.setKeywords(keywords);
			pdf.setCreator(creator);
		}
		
		// Métodos de escritura y formato de texto:
		
		
        public function writeText(lineHeight: Number, text: String, link:ILink = null): void {
            pdf.writeText(lineHeight, text, link);
        }
		
       	public function addText(text:String, pX:Number,pY:Number): void{
			pdf.addText(text,pX,pY);
		}
		
		public function setFontSize(size:int):void{
			pdf.setFontSize(size);
		}
		
		public function setFont(font:String="Helvetica", size:int = 12, underlined:Boolean = false):void{
			pdf.setFont(new CoreFont(font), size, underlined);
		}

		public function setEmbeddedFont(tipo:String,size:int=12,underlined:Boolean=false):void{
			var myEmbeddedFont:EmbeddedFont;
				switch(tipo){
				case "normal":
					myEmbeddedFont = new EmbeddedFont(new normal_ttf() as ByteArray, new normal_afm() as ByteArray, CodePage.CP1252);
				break;
				case "normal-oblique":
					myEmbeddedFont = new EmbeddedFont(new normal_oblique_ttf() as ByteArray, new normal_oblique_afm() as ByteArray, CodePage.CP1252);
				break;
				case "bold":
					myEmbeddedFont = new EmbeddedFont(new bold_ttf() as ByteArray, new bold_afm() as ByteArray, CodePage.CP1252);
				break;
				case "bold-oblique":
					myEmbeddedFont = new EmbeddedFont(new bold_oblique_ttf() as ByteArray, new bold_oblique_afm() as ByteArray, CodePage.CP1252);
				break;
				case "verdana":
					myEmbeddedFont = new EmbeddedFont(new verdana_ttf() as ByteArray, new verdana_afm() as ByteArray, CodePage.CP1252);
				break;
				default:
					myEmbeddedFont = new EmbeddedFont(new normal_ttf() as ByteArray, new normal_afm() as ByteArray, CodePage.CP1252);
				}	
			pdf.setFont(myEmbeddedFont,size,underlined);
		}	
		
		
				
				
		public function textStyle(colorRGB:Number, alpha:Number = 1, rendering:int = 0, wordSpace:Number = 0, characterSpace:Number = 0, scale:Number = 100, leading:Number = 0):void{
			pdf.textStyle(new RGBColor (colorRGB),alpha,rendering,wordSpace,characterSpace,scale,leading);
		}

						
		public function addLink(pX:Number, pY:Number, pWidth:Number, pHeight:Number, pLink:String, pHighlight:* = "I"):void{
			pdf.addLink(pX, pY, pWidth, pHeight, new HTTPLink ( pLink ), pHighlight);
		}
		
		public function writeFlashHtmlText(pHeight:Number, pText:String, pLink:ILink = null):void{
			pdf.writeFlashHtmlText(pHeight,pText,pLink);
		}
		
		public function addMultiCell(width:Number, height:Number, text:String, border:* = 0, align:String = "J", filled:int = 0):void{
			pdf.addMultiCell(width,height,text,border,align,filled);
		}
		
			
			
		//Métodos para el dibujo de formas geométricas:
		
		
		public function lineStyle(colorRGB:Number, thickness:Number = 1, alpha:Number = 1, isDashed:Boolean = false, caps:String = null, joints:String = null):void{
			if(!isDashed){		
			pdf.lineStyle(new RGBColor (colorRGB), thickness,0, alpha, "NonZeroWinding", "Normal", null, caps, joints,3);
			}else{
			pdf.lineStyle ( new RGBColor ( colorRGB ),thickness,0,alpha,"NonZeroWinding","Normal",new DashedLine ([0, 1, 2, 6]), "0 J", "1j", 3);
			}	
		}
		
		public function lineTo(x:Number, y:Number):void{
			pdf.lineTo(x,y);
		}
		
		public function moveTo(x:Number, y:Number):void{
			pdf.moveTo(x,y);
		}
		public function end(closePath:Boolean = true):void{
			pdf.end();
		}
		
		public function beginFill(color:Number, tint:Number = 100):void{
			pdf.beginFill(new RGBColor(color),tint);
		}
		
		public function endFill():void{
			pdf.endFill();
		}
				
		public function drawLine(x1:Number, y1:Number, x2:Number, y2:Number):void{
			pdf.moveTo ( x2,y2);
			pdf.lineTo(x1,y1);
			pdf.end();
		}
		
		public function drawPolygone(points:Array):void{
			pdf.drawPolygone(points);
		}
		
			
		public function drawRect(x:Number,y:Number,width:Number,height:Number,radius:Number=0): void {
		pdf.drawRoundRect( new Rectangle ( x,y,width,height),radius);
		pdf.end();
		}
		
		public function drawRoundRect(rect:Rectangle, ellipseWidth:Number):void{
			pdf.drawRoundRect(rect, ellipseWidth);
		}
		
		public function drawCircle(x:Number, y:Number, radius:Number):void{
			pdf.drawCircle(x, y, radius);
		}
		
		
		
		// Método para incoporar las imágenes previamente incustadas. 
	
		public function addImageEmbedded(img:String,x:Number = 0, y:Number = 0, width:Number=0, height:Number=0, rotation:Number=0,alpha:Number = 1):void{
			var ImageBytes:ByteArray;
			
			switch(img){
			case "logo_64.jpg": 
			ImageBytes=new imgLogo_64() as ByteArray;
			break;
			case "cc_64.jpg":
			ImageBytes=new imgCC_64() as ByteArray;
			break;
			case "cc_88x31.jpg":
			ImageBytes=new imgCC_88x31() as ByteArray;
			break;
			case "copyleft_12.jpg":
			ImageBytes=new imgCopyleft_12() as ByteArray;
			break;
			case "copyleft_64.jpg":
			ImageBytes=new imgCopyleft_64() as ByteArray;
			break;
			case "gato_32.jpg":
			ImageBytes=new imgGato_32() as ByteArray;
			break;
			}
			pdf.addImageStream( ImageBytes,ColorSpace.DEVICE_RGB,null,x,y,width,height,rotation,alpha,"Normal",null);
		
		}
			
				
		// Método para exportación LOCAL del archivo PDF:	


		public function saveToFileAIR(fname: String): void {
            var fs: FileStream = new FileStream();
            file = new File(fname);
            fs.open(file, FileMode.WRITE);
            var bytes: ByteArray = pdf.save(Method.LOCAL);
            fs.writeBytes(bytes);
            fs.close();
        }

					
    }
}
 

 		
