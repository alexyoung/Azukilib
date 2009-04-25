/* :boilerplate:
  This class provides tools for making textareas more friendly.
*/
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
