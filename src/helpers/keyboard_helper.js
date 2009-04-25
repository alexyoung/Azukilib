/* :boilerplate:
  These methods provide tools for dealing with access keys and the caret in textareas.
*/
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
