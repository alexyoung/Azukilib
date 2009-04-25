require 'rubygems'
require 'find'
require 'yaml'
require 'ftools'

[:options, :base, :compiler, :installer, :config].each do |name|
  require File.expand_path(File.dirname(__FILE__) + "/#{name}")
end
