module AzukiLib
  class Config
    class << self
      def [](key)
        load_config
        @@config[key]
      end

      def []=(key, value)
        load_config
        @@config[key] = value
      end

      private

        def load_config
          if Options.project_name
            @@config ||= YAML.load(File.open('config.yml'))[Options.project_name]
          else
            @@config = {}
          end
        rescue Errno::ENOENT
          raise Errno::ENOENT, "Please create a config.yml file"
        end
    end
  end
end