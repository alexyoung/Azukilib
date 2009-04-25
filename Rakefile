require 'ruby_libs/init'

include AzukiLib

namespace :azukilib do
  desc "Compiles all of the source files into azukilib.js, removing any extraneous boilerplate comments."
  task :compile do
    Compiler.generate 'azukilib.js'
  end
  
  desc "Installs the JavaScript, CSS and images into your project"
  task :install do
    Options.project_name = ENV['project']
    
    Compiler.generate 'azukilib.js'
    Installer.install
  end
  
  desc "Runs the tests"
  task :test do
  end
end