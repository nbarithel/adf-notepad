import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
   selector: 'app-atol-viewer',
   templateUrl: './atol-viewer.component.html',
   styleUrls: ['./atol-viewer.component.scss']
 })
 export class AtolViewerComponent implements OnInit, OnChanges {

   constructor() { }

     @Input()
     urlFile: string;

     ngOnInit() {
     console.warn(this.urlFile);
     if (typeof this.urlFile === 'undefined') {
       this.urlFile = 'assets/example.pdf';
     }
     this.executePdf(this.urlFile);
   }

   executePdf(url) {
     console.warn(url);
     const options = {
       pdf: url, // you should use this property or pageCallback and pages to specify your book
       height: 100,
       pages: 100, // amount of pages
       controlsProps: { // set of optional properties that allow to customize 3D FlipBook control
         downloadURL: url
       }, // you should use this property or pageCallback and pages to specify your book
       pageCallback: function(n) { // this function has to return source description for FlipBook page
         // for image sources
         const imageDescription = {
           type: 'image',
           src: 'example/' + n + '.jpg',
           interactive: false
         };
        // for html sources
         const htmlDescription = {
           type: 'html',
          src: 'example/' + n + '.html',
           interactive: true // or false - if your page interact with the user then use true
         };
        // for blank page
       const blankDescription = {
          type: 'blank'
         };
        return htmlDescription; // or imageDescription or blankDescription
       },
       propertiesCallback: function (props) { // optional function - it lets to customize 3D FlipBook
         props.page.depth /= 2;
         props.cssLayersLoader = function (n, clb) {// n - page number
           clb([{
             js: function (jContainer) { // jContainer - jQuery element that contains HTML Layer content
               return { // set of callbacks
                 hide: function () { console.log('hide'); },
                 hidden: function () { console.log('hidden'); },
                 show: function () { console.log('show'); },
                 shown: function () { console.log('shown'); },
                 dispose: function () { console.log('dispose'); }
               };
             }
           }]);
         };
         return props;
       },
       template: { // by means this property you can choose appropriate skin
         html: 'node_modules/flip-book/templates/default-book-view.html',
         styles: [
           'node_modules/flip-book/css/black-book-view.css'
           // or one of white-book-view.css, short-white-book-view.css, shart-black-book-view.css
         ],
         links: [{
           rel: 'stylesheet',
           href: 'node_modules/flip-book/css/font-awesome.min.css'
         }],
         script: 'node_modules/flip-book/js/default-book-view.js',
         printStyle: undefined, // or you can set your stylesheet for printing ('print-style.css')
         sounds: {
           startFlip: 'node_modules/flip-book/sounds/start-flip.mp3',
           endFlip: 'node_modules/flip-book/sounds/end-flip.mp3'
         },
         pdfLinks: {
           handler: function (type, destination) { // type: 'internal' (destination - page number), 'external' (destination - url)
             return true; // true - prevent default handler, false - call default handler
           }
         },
         autoNavigation: {
           urlParam: 'fb3d-page', // query param for deep linking
           navigates: 1 // number of instances that will be navigated automatically
         }
       },
       ready: function () { // optional function - this function executes when loading is complete

       }
     };
     (<any>window).PDFJS_LOCALE = {
       pdfJsWorker: 'node_modules/flip-book/js/pdf.worker.js'
     };
     console.log((<any>window).PDFJS_LOCALE);
     (<any>jQuery('.container-selector')).FlipBook(options);
   }

   ngOnChanges(changes) {
     const urlFile = changes['urlFile'];
     if (urlFile && urlFile.currentValue) {
         this.executePdf(urlFile.currentValue);
     }

     if (!urlFile) {
         throw new Error('Attribute urlFile or blobFile is required');
     }
   }
}
