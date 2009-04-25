module AzukiLib
  class Installer
    class << self
      def install
        installer = Installer.new
        installer.run
      end
    end
    
    def initialize
    end
    
    def run
      [:install_css, :install_js, :install_images].each do |method|
        send(method) if respond_to? method
      end
    end
    
    def install_css
      return unless AzukiLib::Config['css_target']

      css_target = File.join(AzukiLib::Config['project_path'], AzukiLib::Config['css_target'])
      css = File.read('css/azuki.css')
      css =<<-CSS
/* START AzukiLib */
#{css}
/* END AzukiLib */
      CSS
      
      # Change the relative URLs in the scripts
      if AzukiLib::Config['image_relative']
        compiler = Compiler.new
        compiler.source = css
        css = compiler.replace_image_urls
      end
      
      if AzukiLib::Config['insert_css']
        original_css = File.read css_target
        in_library = false
        vanilla_css = ''
        
        original_css.split("\n").each do |line|
          in_library = true if line.match %r{/\* START AzukiLib \*/}
          vanilla_css << line + "\n" unless in_library
          in_library = false if line.match %r{/\* END AzukiLib \*/}
        end
        
        target_file = File.open(css_target, 'w+')
        target_file << vanilla_css + css
        target_file.close
      else
        File.copy 'css/azuki.css', File.join(css_target, 'azuki.css')
      end
    end
    
    def install_js
      return unless AzukiLib::Config['javascript_target']
      File.copy 'azukilib.js', File.join(AzukiLib::Config['project_path'], AzukiLib::Config['javascript_target'])
    end
    
    def install_images
      return unless AzukiLib::Config['image_target']
      
      Find.find('images/') do |path|
        # Ignore dot files
        if path == ?.
          Find.prune
        elsif path.match /\.(png|gif)$/
          target_directory = File.join(AzukiLib::Config['project_path'], AzukiLib::Config['image_target'])
          Dir.mkdir target_directory unless File.directory?(target_directory)
          File.copy path, File.join(target_directory, File.basename(path))
        end
      end
    end
  end
end
