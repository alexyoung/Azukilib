/* :boilerplate:
  These methods provide nifty cross browser window handling code.
*/
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
