/* :boilerplate:
  Instantiate this class with your required options, then bind the add/edit/destroy events as needed.
*/

Azuki.Forms.Remote = Class.create();
Azuki.Forms.Remote.prototype = {
  initialize: function(options) {
    this.options = {
      form_id:                'RemoteForm',
      controller_name:        '',
      item_name:              '',
      method:                 'post',
      enctype:                null,
      ajax:                   false,
      add_close_button:       true,
      form_visible:           false,
      form_display_callback:  false,
      add_completed_callback: null
    };

    Object.extend(this.options, options || { });
    
    this.options.edit_url    = '/' + this.options.controller_name + '/edit/';
    this.options.new_url     = '/' + this.options.controller_name + '/new';
    this.options.create_url  = '/' + this.options.controller_name + '/create';
    this.options.update_url  = '/' + this.options.controller_name + '/update/';
    this.options.destroy_url = '/' + this.options.controller_name + '/destroy/';
  },
  
  edit: function(e) {
    var element = Event.element(e);
    
    if (element.nodeName == 'IMG') {
      element = element.up('.edit_' + this.options.item_name);
    }
    
    if (!element) return true;
    
    if ((element.nodeName == 'A' || element.nodeName == 'BUTTON') && element.hasClassName('edit_' + this.options.item_name)) {
      var item_id = element.id.match(/\d+$/);
      
      this.show_form(this.options.form_id, this.options.edit_url + item_id, this.options.update_url + item_id, this.options.form_display_callback);
      Event.stop(e);
      return false;
    }

    return true;
  },
  
  add: function(e)
  {
    var element = Event.element(e);

    if (element.nodeName == 'IMG') {
      element = element.up('.add_' + this.options.item_name);
    }

    if (!element) return true;

    if ((element.nodeName == 'A' || element.nodeName == 'BUTTON') && element.hasClassName('add_' + this.options.item_name)) {
      if (this.options.add_callback) this.options.add_callback();
      this.show_form(this.options.form_id, this.options.new_url, this.options.create_url, this.options.form_display_callback);
      Event.stop(e);
      return false;
    }

    return true;
  },
  
  destroy: function(e)
  {
    var element = Event.element(e);
    if ((element.nodeName == 'A' || element.nodeName == 'IMG') && element.hasClassName('destroy_' + this.options.item_name)) {
      var item_id = element.id.match(/\d+$/);
      
      if (confirm('Are you sure you want to delete that item?')) {
        window.location = this.options.destroy_url + item_id;
      }

      Event.stop(e);
      return false;
    }
  },

  show_form: function(id, url, save_url, callback) {
    if (this.options.form_visible) {
      return;
    } else {
      this.options.form_visible = true;
    }
    
    Azuki.Windowing.Busybox.busy('loading');
    
    function close_form() {
      if ($(id)) {
        $(id).remove();
        Azuki.Windowing.Fader.remove();
      }
    }
    
    function focus_field() {
      try {
        if ($(id)) $(id).focusFirstElement();
      } catch (exception) {
      }
    }

    var fields_id = id + 'FormFields';
    var cancel_id = 'Cancel' + id;
    var editor_html = '';
    var image_format = Azuki.Helpers.Compatibility.suitable_image_format();
    var enctype = typeof this.options.enctype == 'undefined' ? '' : 'enctype="multipart/form-data"';
    
    close_form();

    editor_html += '<form style="display: none"' + this.ajax_form_html(save_url, id) + ' method="' + this.options.method + '" ' + enctype + ' action="' + save_url + '" class="edit standard" id="' + id + '">';
    if (this.options.add_close_button) editor_html += '  <div id="' + cancel_id + '" style="position: absolute; left: -15px; top: -25px; cursor: pointer"><img alt="Cancel without saving" style="cursor: pointer" width="36" height="36" border="0" src="/images/close.' + image_format + '"/></div>';
    editor_html += '  <div id="' + fields_id + '"></div>';
    editor_html += '</form>';
    
    // Insert the editor HTML
    new Insertion.Top(document.body, editor_html);
    
    // Get the form fields from the server
    new Ajax.Updater($(fields_id), url, {
      evalScripts: true,
      method: 'get',
      onComplete: function() {
        Azuki.Helpers.Window.center(id);
        new Effect.Appear($(id), { duration: 0.3, afterFinish: function() { Azuki.Windowing.Fader.alter_selects('visible'); focus_field(); } });
        Azuki.Windowing.Fader.fade();
        Azuki.Windowing.Busybox.done();
        
        if (this.options.ajax) {
          try {
            Event.observe(id, 'submit', this.ajax_submit.bindAsEventListener(this));
          } catch(e) {
            console.log(e);
          }
        }
        
        Event.observe(cancel_id, 'click', function(e) { close_form(id); this.options.form_visible = false; Event.stop(e); return false; }.bind(this));

        if (callback) callback();
      }.bind(this)
    });
  },
  
  ajax_form_html: function() {
    if (!this.options.ajax) return '';
    return ' onsubmit="return false" ';
  },
  
  ajax_submit: function() {
    this.options.form_visible = false;
    new Ajax.Request(this.options.create_url, { onSuccess: this.options.ajax_on_succes, postBody: Form.serialize(this.options.form_id), onFailure: this.options.ajax_on_failure });
    $(this.options.form_id).remove();
    Azuki.Windowing.Fader.remove();
    return false;
  }
};
