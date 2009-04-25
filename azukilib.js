var Azuki = {
  Version: '0.0.1',
  Forms: { },
  Helpers: { },
  Storage: { },
  Style: { },
  Windowing: { }
};


/* START popinfo.js */

Azuki.Windowing.PopInfo = {
  display: function(element, info, callback) {
    var delay = 2000;
    var popup_element_id = element.id + '_popup';

    this.remove(popup_element_id);
    new Insertion.Before(element, '<div style="display: none" id="' + popup_element_id + '" class="popinfo_frame"><div class="popinfo_inner">' + info + '</div><div class="popinfo_image"></div></div>');
    
    if (callback) callback(element);
    
    new Effect.Appear(popup_element_id, { duration: 0.2 });
    setTimeout((function() { this.fade_popup(popup_element_id); }.bind(this)), delay);
  },
  
  fade_popup: function(popup_element_id) {
    try {
      new Effect.Fade(popup_element_id);
      setTimeout((function() { this.remove(popup_element_id); }).bind(this), 1000);
    }
    catch (exception) {
    }
  },
  
  remove: function(popup_element_id) {
    try {
      if ($(popup_element_id)) Element.remove(popup_element_id);
    }
    catch (exception) {
      
    }
  }
};

/* END popinfo.js */

/* START lightbox.js */
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

/* END lightbox.js */

/* START fader.js */
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

/* END fader.js */

/* START contextual_help.js */
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

/* END contextual_help.js */

/* START busybox.js */
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

/* END busybox.js */

/* START table_ruler.js */
/* Not implemented yet */
/* END table_ruler.js */

/* START color.js */
Azuki.Style.Color = {};
Azuki.Style.Color.RGB = Class.create();
Azuki.Style.Color.RGB.prototype = {
  initialize: function(value) {
    this.colors = Array(0, 0, 0);
    
    switch (typeof(value)) {
      case 'string':
        this.set_from_rgb_string(value);
      break;
      
      case 'object':
        this.colors = value;
      break;

      default:
      break;
    }
  },
  
  red: function() { return this.colors[0]; },
  green: function() { return this.colors[1]; },
  blue: function() { return this.colors[2]; },

  set_red: function(red) { this.colors[0] = red; },
  set_green: function(green) { this.colors[1] = green; },
  set_blue: function(blue) { this.colors[2] = blue; },

  /* Assumes rgb(1, 2, 3) */
  set_from_rgb_string: function(value) {
    this.colors = $A(value.replace(/rgb\(/, '').replace(/\)/, '').split(',')).collect(function(value) {
      return parseInt(value, 10);
    });
  },

  to_s: function() {
    return 'rgb(' + this.red() + ',' + this.green() + ',' + this.blue() + ')';
  },

  to_hex: function() {
    var hex = '';
  
    $A(this.colors).each(function(colour) {
      var value = this._hex_value(colour);
      if (value.length == 1) { value = '0' + value; }
      hex = hex + value;
    }.bind(this));
  
    return hex;
  },

  _hex_value: function(d) {
    var hex_map = '0123456789ABCDEF';
    var h = hex_map.substr(d&15, 1);
  
    while (d > 15) { d >>= 4; h = hex_map.substr(d&15, 1) + h; }
    return h;
  }
};

Azuki.Style.Color.Hex = Class.create();
Azuki.Style.Color.Hex.prototype = {
  /* Create with values like this: '#000000' */
  initialize: function(value) {
    this.value = value;
  },
  
  to_rgb: function() {
    this._set_rgb_values();
    var rgb_array = $A([this.red, this.green, this.blue]).collect(function(color) {
      return this._rgb_value(color);
    }.bind(this));
    
    return new Azuki.Style.Color.RGB(rgb_array);
  },
  
  _rgb_value: function(hex) {
    return parseInt(hex, 16) || 0;
  },
  
  _set_rgb_values: function() {
    this.red   = this.value.charAt(1) + this.value.charAt(2);
    this.green = this.value.charAt(3) + this.value.charAt(4);
    this.blue  = this.value.charAt(5) + this.value.charAt(6);
  }
};

Azuki.Style.Color.Methods = {
  invert: function(value) {
    var color = new Azuki.Style.Color.RGB(value);
    color.set_red(255 - parseInt(color.red(), 10));
    color.set_green(255 - parseInt(color.green(), 10));
    color.set_blue(255 - parseInt(color.blue(), 10));
    return color.to_s();
  },
  
  random: function() {
    var color = new Azuki.Style.Color.RGB(Array(Math.round((Math.random() * 255)), Math.round((Math.random() * 255)), Math.round((Math.random() * 255))));
    return color.to_s();
  }
};

Azuki.Style.Color.ElementMethods = {
  invertColor: function(element, property) {
    try {
      element.style[property] = Azuki.Style.Color.invert(element.getStyle(property));
      return true;
    }
    catch (exception) {
      return false;
    }
  },
  
  randomColor: function(element, property)
  {
    try {
      element.style[property] = Azuki.Style.Color.random();
      return true;
    }
    catch (exception) {
      return false;
    }
  }
};

Object.extend(Azuki.Style.Color, Azuki.Style.Color.Methods);
Element.addMethods(Azuki.Style.Color.ElementMethods);

/* END color.js */

/* START cookie.js */
Azuki.Storage.Cookie = {
  create: function(name, value, days, path) {
    var expires = '';
    path = typeof path == 'undefined' ? '/' : path;
    
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }

    if (name && value) {
      document.cookie = name + '=' + escape(value) + expires + '; path=' + path;
    }
  },
  
  find: function(name) {
    var matches = document.cookie.match(name + '=([^;]*)');
    if (matches && matches.length == 2) {
      return unescape(matches[1]);
    }
  },
  
  destroy: function(name) {
    this.create(name, ' ', -1);
  }
};

/* END cookie.js */

/* START window_helper.js */
Azuki.Helpers.Window = {
  size: function() {
    var width, height;
    
    if (self.innerHeight) {
      width  = self.innerWidth;
      height = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
      // IE 6 Strict Mode
      width  = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
    } else if (document.body) {
      // IE
      width  = document.body.clientWidth;
      height = document.body.clientHeight;
    }
    
    return {width: width, height: height};
  },
  
  page_size: function() {
    var x_scroll, y_scroll;
    var width, height;
    var window_size = Azuki.Helpers.Window.size();

    if (window.innerHeight && window.scrollMaxY) {
      x_scroll = document.body.scrollWidth;
      y_scroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
      x_scroll = document.body.scrollWidth;
      y_scroll = document.body.scrollHeight;
    } else {
      x_scroll = document.body.offsetWidth;
      y_scroll = document.body.offsetHeight;
    }

    width  = x_scroll < window_size.width  ? window_size.width  : x_scroll;
    height = y_scroll < window_size.height ? window_size.height : y_scroll;

    return {width: width, height: height};
  },
  
  /* Centres absolute positions elements */
  center: function(element) {
    var options = Object.extend({update: false}, arguments[1] || {});
    element = $(element);

    Position.prepare();

    var offset_x = (Position.deltaX + Math.floor((Azuki.Helpers.Window.size().width - element.getDimensions().width) / 2))   || '0';
    var offset_y = (Position.deltaY + Math.floor((Azuki.Helpers.Window.size().height - element.getDimensions().height) / 2)) || '0';

    element.setStyle({ left: offset_x + 'px' });
    element.setStyle({ top:  offset_y + 'px' });

    if (options.update) {
      Event.observe(window, 'resize', function() { Position.center(element); });
      Event.observe(window, 'scroll', function() { Position.center(element); });
    }
  },
  
  center_with_margin: function(element) {
    element = $(element);
    var container = element.up();
    var margin = (container.getWidth() - element.getWidth()) / 2;
    element.setStyle({ marginLeft: margin + 'px', marginRight: margin + 'px'});
  }
};

/* END window_helper.js */

/* START keyboard_helper.js */
Azuki.Helpers.Keyboard = {
  which_meta_key: function() {
    var key = '';
  
    if (navigator.platform.match(/win/i)) {
      key = 'alt';
    } else if (navigator.platform.match(/mac/i)) {
      key = 'ctrl';
    } else {
      key = 'ctrl or alt';
    }
  
    return key;
  },

  underline_accesskey: function(element) {
    element = $(element);
    var key = this.which_meta_key();
    var regex = new RegExp(element.accessKey, 'i');
    var match = '';

    if (element.accessKey.length === 0 || element.hasClassName('noaccesskey') > 0) return;

    if (element.tagName == 'A' && !element.innerHTML.match(/class=.?accesskey/)) {
      match = element.innerHTML.match(regex);
      element.innerHTML = element.innerHTML.replace(regex, '<span class="accesskey" title="Press ' + key + '-' + String(match).toLowerCase() + ' to access this link using the keyboard">' + match + '</span>');
    } else if (element.tagName == 'INPUT') {
      element.value = element.value + ' [' + key + '+' + String(element.accessKey).toLowerCase() + ']';
    } else if (element.tagName == 'BUTTON') {
      var text = '';
      
      /* Remove text nodes from the button, this assumes the button has a format like: image text */
      $A(element.childNodes).each(function(child) {
        if (child.nodeName == '#text') {
          text = text + child.data;
          element.removeChild(child);
        }
      });
      
      match = text.match(regex);
      new Insertion.Bottom(element, text.replace(regex, '<span class="accesskey" title="Press ' + key + '-' + String(match).toLowerCase() + ' to access this link using the keyboard">' + match + '</span>'));
    }
  },

  underline_accesskeys: function() {
    this.underline_tag_accesskeys('a');
    this.underline_tag_accesskeys('button');
    this.underline_tag_accesskeys('input');
  },

  underline_tag_accesskeys: function(tag_name) {
    var key = this.which_meta_key();
    $A(document.getElementsByTagName(tag_name)).each(function(element) {
      this.underline_accesskey(element);
    }.bind(this));
  }
};

/* END keyboard_helper.js */

/* START forms_helper.js */
Azuki.Helpers.Forms = {
  /* Text helpers */
  set_caret_position: function(element, pos) {
    if (element.setSelectionRange) {
      element.focus();
      element.setSelectionRange(pos, pos);
    } else if (element.createTextRange) {
      var range = element.createTextRange();

      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  },
  
  get_caret_position: function(element) {
    if (element.setSelectionRange) {
      return element.selectionStart;
    } else if (element.createTextRange) {
      // The current selection
      var range = document.selection.createRange();
      // We'll use this as a 'dummy'
      var stored_range = range.duplicate();
      // Select all text
      stored_range.moveToElementText(element);
      // Now move 'dummy' end point to end point of original range
      stored_range.setEndPoint('EndToEnd', range);

      return stored_range.text.length - range.text.length;
    }
  },

  activate_controls: function(names) {
    $A(document.getElementsByTagName('input')).each(function(element) {
      $A(names).each(function(name) {
        if (element.name == name) {
          element.disabled = false;
        }
      });
    });
  },
  
  disable_on_submit: function() {
    $$('form').each(function(form) {
      var submit = $A(form.getElementsByTagName('input')).find(function(input) { return input.type == 'submit'; } );
      if (!submit) return;
      
      Event.observe(form, 'submit', function(e) {
        submit = $(submit);
        if (submit && !submit.hasClassName('nodisable')) submit.disable();
      });
    });
  }
};

/* END forms_helper.js */

/* START compatibility_helper.js */
Azuki.Helpers.Compatibility = {
  /* Rather than hacking IE's png transparency, we currently use this to switch between gif and png. */
  suitable_image_format: function()
  {
    if (!navigator.appVersion.match(/MSIE/)) return 'png';
    
    try {
      var version = parseFloat(navigator.appVersion.split('MSIE')[1]);
      return (version < 7.0) ? 'gif' : 'png';
    }
    catch (exception) {
      return 'png';
    }
  }
};

/* END compatibility_helper.js */

/* START textarea_extensions.js */
Azuki.Forms.TextAreaExtensions = Class.create();
Azuki.Forms.TextAreaExtensions.prototype = {
  initialize: function() {
    this._add_images();
    
    this.bigger = $$('.bigger');
    this.smaller = $$('.smaller');
  
    // Add event observer to all more buttons
    this.bigger.each(function(item) {
      Event.observe(item, 'click', this.increase_rows.bindAsEventListener(this));
    }.bind(this));
  
    // Add event observer to all less buttons
    this.smaller.each(function(item) {
      Event.observe(item, 'click', this.decrease_rows.bindAsEventListener(this));
    }.bind(this));
  },

  increase_rows: function(e) {
    var element = $(Event.element(e));
    var textarea = this._get_next_textarea(element);
    textarea.rows += 5;
  },

  decrease_rows: function(e) {
    var element = $(Event.element(e));
    var textarea = this._get_next_textarea(element);
    
    if (textarea.rows >= 5) {
      textarea.rows -= 4;
    }
  },
  
  /** Private methods **/
  _get_next_textarea: function(element) {
    var children = $A(element.parentNode.parentNode.childNodes);

    return children.find(function(child) { return child.nodeName == 'TEXTAREA'; });
  },
  
  _add_images: function() {
    $$('textarea').each(function(textarea) {
      new Insertion.Before(textarea, '<span class="resizer"><img class="bigger" alt="Increase the size of this text box" src="/images/azuki/open.png"/><img class="smaller" alt="Decrease the size of this text box" src="/images/azuki/close_small.png"/></span><br/>');
    });
  }
};

/* END textarea_extensions.js */

/* START select_search.js */
Azuki.Forms.SelectSearch = Class.create();
Azuki.Forms.SelectSearch.prototype = {
  initialize: function(search_input, search_results) {
    this.search_input = $(search_input);
    this.search_results = $(search_results);
    this.items = this.read_values();
    
    new Event.observe(this.search_input, 'click', this.clear_search_field.bindAsEventListener(this));
    new Event.observe(this.search_input, 'keydown', this.search.bindAsEventListener(this));
  },
  
  clear_search_field: function() {
    this.search_input.value = '';
    this.items.each(function(option, i) {
      this.search_results.options[i] = new Option(option.text, option.value);
    }.bind(this));
  },
  
  read_values: function() {
    return $A(this.search_results.options).collect(function(option) {
      return {value: option.value, text: option.innerHTML};
    });
  },
  
  search: function() {
    var query = this.search_input.value;
    var results = this.items.findAll(function(value) {
      return value.text.toLowerCase().match(query.toLowerCase());
    });
    
    this.search_results.options.length = 0;

    results.each(function(option, i) {
      this.search_results.options[i] = new Option(option.text, option.value);
    }.bind(this));
  }
};

/* END select_search.js */

/* START remote.js */

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

/* END remote.js */

/* START controller.js */
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

/* END controller.js */
