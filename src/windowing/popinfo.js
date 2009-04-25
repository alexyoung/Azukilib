/* :boilerplate:
  Tooltip help.

  Examples:

  Azuki.Windowing.PopInfo.display(element, 'Saved')
*/

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
