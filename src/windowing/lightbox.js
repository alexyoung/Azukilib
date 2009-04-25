/* :boilerplate:
  This class will load an image inside a box that takes the current visual context.
*/
Azuki.Windowing.Lightbox = Class.create();
Azuki.Windowing.Lightbox.prototype = {
  initialize: function(class_name) {
    this.class_name = typeof class_name == 'undefined' ? 'lightbox' : class_name;
    
    this.container_id = 'LightboxContainer';
    this.close_id = 'LightboxClose';
    this.remote_type = 'image';
    
    this.remove_event = this.remove.bindAsEventListener(this);
    Event.observe(document, 'click', this.events.bind(this));
  },
  
  events: function(e) {
    var element = Event.element(e);
    this.image = null;
    this.link = null;
    
    if (element.nodeName == 'A' && element.down('img') && element.down('img').hasClassName(this.class_name)) {
      this.image = element.down('img');
      this.link = element;
    }
    
    if (element.nodeName == 'IMG' && element.hasClassName(this.class_name)) {
      this.link = element.up('a');
      this.image = element;
    }
    
    if (this.link && this.image) {
      this.display(e);
    }
  },
  
  remove: function(e) {
    Event.stopObserving($(this.close_id), 'click', this.remove_event);
    $(this.container_id).remove();
    Azuki.Windowing.Fader.remove();
    Event.stop(e);
    return false;
  },
  
  display: function(e) {
    var image_format = Azuki.Helpers.Compatibility.suitable_image_format();
    
    if (Azuki.Windowing.Busybox.active()) {
      Event.stop(e);
      return false;
    }
    
    if ($(this.container_id)) $(this.container_id).remove();
    Azuki.Windowing.Busybox.busy('loading');
    new Insertion.Top(document.body, '<div id="' + this.container_id + '" class="popinfo_container" style="display: none"><div id="' + this.close_id + '" style="position: absolute; left: -15px; top: -15px; cursor: pointer"><img width="36" height="36" border="0" src="/images/azuki/close.' + image_format + '"/></div></div>');

    Event.observe($(this.close_id), 'click', this.remove_event);

    switch(this.remote_type) {
      case 'image':
        var image = document.createElement('img');
        
        image.onload = function() {
          $(this.container_id).appendChild(image);
      
          Azuki.Windowing.Busybox.done();
          Azuki.Helpers.Window.center(this.container_id);
          Azuki.Windowing.Fader.fade();
          new Effect.Appear(this.container_id, {duration: 0.3});

          return false;
        }.bind(this);

        image.src = this.link.href;
      break;
      
      case 'html':
        new Ajax.Updater(this.container_id, this.link.href, { method: 'get', evalScripts: true, onComplete: function() {
          Azuki.Windowing.Busybox.done();
          Azuki.Windowing.Fader.fade();
          Azuki.Helpers.Window.center($(this.container_id));
          
          $(this.container_id).show();
        }.bind(this)});
      break;

      default:
      break;
    }
    
    if (e) Event.stop(e);
    return false;
  }
};
