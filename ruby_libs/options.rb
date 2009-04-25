module AzukiLib
  class Options
    @@project_name = nil
    
    class << self
      def image_path ; '/images/azuki/' ; end
      
      def project_name ; @@project_name ; end
      def project_name=(value)
        raise "Please specify a project with project=project_name" if value.nil? or value.empty?
        @@project_name = value
      end
    end
  end
end