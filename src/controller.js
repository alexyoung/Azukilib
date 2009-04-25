/* :boilerplate:
  This class provides tools for treating sections within your site as "Controllers".
  
  1. For each section, set a body ID.  For example, Account for the account management pages.
     Then define a JavaScript class called AccountController.  AccountController.run will
     automatically be called when people visit that page, OR a class will be instantiated.
  
  2. Define a controller called ApplicationController.  This gets run before the current
     controller, a good place to run anything you need on every page.
*/
Azuki.Controller = {
  run: function() {
    if (document.body.id) Azuki.Controller.run_controller(document.body.id);
    Azuki.Controller.run_controller('Application');
  },
  
  run_controller: function(id) {
    var controller_class = id + 'Controller';
    if (!window[controller_class]) return;

    if (eval(controller_class + '.run')) {
      eval(controller_class + '.run()');
    } else {
      controller = new window[controller_class];
    }
  }
};

function init() {
  // quit if this function has already been called
  if (arguments.callee.done) return;

  // flag this function so we don't do the same thing twice
  arguments.callee.done = true;

  // kill the timer
  if (_timer) clearInterval(_timer);

  // do stuff
  Azuki.Controller.run();
}

/* for Mozilla/Opera9 */
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", init, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>")
  var script = document.getElementById("__ie_onload")
  
  script.onreadystatechange = function()
  {
    if (this.readyState == "complete")
    {
      init() // call the onload handler
    }
  }
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent))
{
  var _timer = setInterval(function() {
    if (/loaded|complete/.test(document.readyState)) {
      init(); // call the onload handler
    }
  }, 10);
}

/* for other browsers */
window.onload = init;
