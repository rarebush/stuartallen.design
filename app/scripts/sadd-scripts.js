//// Enable tooltips and popovers for 
$('.bs-component [data-toggle="popover"]').popover();
$('.bs-component [data-toggle="tooltip"]').tooltip();

//// Inject svg sprite into DOM
// Elements to inject
var mySVGsToInject = document.querySelectorAll('.svg-inject');

// Do the injection
SVGInjector(mySVGsToInject);
//// END inject svg sprite into dom