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
