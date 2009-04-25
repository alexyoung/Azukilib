/* :boilerplate:
  Disables and activates form controls.
  Form controls can be set as disbled in your HTML, then enabled when the DOM is ready here
  This prevents people from accessing forms that require JavaScript that aren't ready yet.
*/
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
