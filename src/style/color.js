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
