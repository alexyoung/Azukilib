/* :boilerplate:
 Displays a Loading message when control needs to be taken away from the user.
*/
Azuki.Windowing.Busybox = {
  /* operation can be 'loading', 'saving', etc. depending on the images you've got. */
  busy: function(operation) {
    this.remove();
    var image_format = Azuki.Helpers.Compatibility.suitable_image_format();

    new Insertion.Top(document.body, '<div id="Busybox" style="display: none"><img width="138" height="81" src="/images/azuki/' + operation + '.' + image_format + '" /></div>');
    Azuki.Helpers.Window.center('Busybox');
    $('Busybox').show();
  },
  
  remove: function() {
    if ($('Busybox')) $('Busybox').remove();
  },
  
  done: function() {
    new Effect.Fade($('Busybox'), { afterFinish: function() { Azuki.Windowing.Busybox.remove(); }});
  },
  
  active: function() {
    return $('Busybox') ? true : false;
  }
};
