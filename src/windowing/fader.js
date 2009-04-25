/* :boilerplate:
  This class provides tools for fading out the page.  Use Azuki.Windowing.Fader.fade() to fade out, and
  Azuki.Windowing.Fader.remove() to remote it.  Azuki.Windowing.Fader.active() returns true when currently faded.
  
  This is usually used when a dialog box requires the current context.
*/
Azuki.Windowing.Fader = {
  active: function() {
    return $('Fader') ? true : false;
  },
  
  set_height: function() {
    $('Fader').setStyle({height: Azuki.Helpers.Window.page_size().height + 'px'});
  },
  
  fade: function() {
    new Insertion.Top(document.body, '<div id="Fader" style="display: none; position: absolute; z-index: 120; width: 100%; height: 100%; top: 0; left: 0; background-color: #000000"></div>');
    Position.prepare();
    Azuki.Windowing.Fader.set_height();
    $('Fader').setOpacity(0);
    $('Fader').show(0);
    Azuki.Windowing.Fader.alter_selects('hidden');
    Azuki.Windowing.Fader.alter_overflows('hidden');
    new Effect.Opacity('Fader', {duration: 0, from: 0.7, to: 0.7});
  },
  
  alter_selects: function(visible, selector) {
    if (!(/MSIE/.test(navigator.userAgent) && !window.opera)) return;
    if (!selector) selector = 'select';
    
    $$(selector).each(function(element) {
      element.setStyle({ visibility: visible });
    });
  },
  
  alter_overflows: function(overflow_setting) {
    $$('.overflow').each(function(element) {
      element.setStyle({ overflow: overflow_setting });
    });
  },
  
  remove: function()
  {
    if (!$('Fader')) return;
    
    new Effect.Opacity('Fader', {duration: 0.2, from: 0.7, to: 0.0, afterFinish: function() {
      if ($('Fader')) $('Fader').remove();
      Azuki.Windowing.Fader.alter_selects('visible');
      Azuki.Windowing.Fader.alter_overflows('auto');
    }});
  }
};

Event.observe(window, 'resize', function() {
  if (!$('Fader')) return;
  Azuki.Windowing.Fader.set_height();
});
