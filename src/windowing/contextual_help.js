/* :boilerplate:
  Sets up an event that waits for clicks on links with a particular class ('help' is the default.)

  Windows are displayed containing help information using Ajax to load a remote page,
  derived from the URL in the link.
*/
Azuki.Windowing.ContextualHelp = Class.create();
Azuki.Windowing.ContextualHelp.prototype = {
  initialize: function(help_class) {
    this.help_class = help_class ? help_class : 'help';
    
    Event.observe(document, 'click', function(e) {
      var element = $(Event.element(e));
      if (!element.hasClassName(this.help_class)) return true;
      if (element.nodeName != 'A') return true;
      
      this.display_help(element.href);
      
      Event.stop(e);
      return false;
    }.bind(this));
  },
  
  display_help: function(url) {
    var image_format = Azuki.Helpers.Compatibility.suitable_image_format();
    var faded = Azuki.Windowing.Fader.active();

    if (Azuki.Windowing.Busybox.active()) return;
    if ($('HelpContainer')) $('HelpContainer').remove();
    
    Azuki.Windowing.Busybox.busy('loading');
    new Insertion.Top(document.body, '<div id="HelpContainer" class="popinfo_container" style="display: none"><div id="HelpClose" style="position: absolute; left: -15px; top: -15px; cursor: pointer"><img width="36" height="36" border="0" src="/images/azuki/close.' + image_format + '"/></div><div id="HelpContent"></div></div>');
    
    Event.observe($('HelpClose'), 'click', function() { $('HelpContainer').remove(); if (!faded) { Azuki.Windowing.Fader.remove(); } });
    
    new Ajax.Updater('HelpContent', url, { insertion: Insertion.Bottom, onComplete: function() {
      Azuki.Windowing.Busybox.done();
      Azuki.Helpers.Window.center('HelpContainer');
      if (!faded) Azuki.Windowing.Fader.fade();
      new Effect.Appear($('HelpContainer'), {duration: 0.3});
    }});
  }
};
