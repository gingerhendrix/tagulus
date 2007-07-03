class CloudSourceGenerator < Rails::Generator::NamedBase
  def manifest
    record do |m|
      #model
      m.template "models/cloud.rb", "app/models/#{file_name}_cloud.rb"
      
      
    end
  end
  
end