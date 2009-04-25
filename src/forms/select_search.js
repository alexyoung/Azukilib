/* :boilerplate:
  This class allows a select box to be dynamically searched.
*/
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
