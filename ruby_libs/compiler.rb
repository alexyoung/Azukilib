module AzukiLib
  class Compiler
    class << self
      def generate(file_name, options = {})
        compiler = Compiler.new file_name, options
        compiler.read 'src/'
        compiler.parse
        compiler.save
      end
    end
    
    attr_accessor :source
    
    def initialize(file_name = nil, options = {})
      @file_name = file_name
      @options = options
    end
    
    def read(directory)
      @source = File.open(directory + '/azuki.js').read
      
      Find.find(directory) do |path|
        # Ignore dot files
        if path == ?.
          Find.prune
        elsif File.basename(path) != 'azuki.js' and path.match /\.js$/
          @source << "\n/* START #{File.basename(path)} */\n"
          @source << File.open(path, 'r').read
          @source << "\n/* END #{File.basename(path)} */\n"
        end
      end
    end

    def save
      file = File.open(@file_name, 'w')
      file << @source
      file.close
    end
      
    def parse
      remove_boilerplates
      replace_image_urls
    end

    def remove_boilerplates
      # Remove /* :boilerplate: */
      inside_boilerplate = false
      source = ''
      
      @source.split("\n").each do |line|
        inside_boilerplate = true if line.match %r{/\*} and line.match /:boilerplate:/
        source << line + "\n" unless inside_boilerplate
        inside_boilerplate = false if line.match %r{\*/}
      end
      
      @source = source
    end
    
    def replace_image_urls
      return unless Config['image_relative']
      @source.gsub! Options.image_path, Config['image_relative']
    end
  end
end