require 'mt-capistrano'

set :site,         "14"
set :application,  "app1"
set :webpath,      "app1.example.com"
set :domain,       "example.com"
set :user,         "serveradmin@example.com"
set :password,     "xxxxxxxx"

# repository on (gs)
set :repository, "svn+ssh://#{user}@#{domain}/home/#{site}/data/repo/app1/trunk"

# repository elsewhere
#set :repository, "svn+ssh://user@other.com/usr/local/svn/repo/app1/trunk"
#set :repository, "https://other.com/usr/local/svn/repo/app1/trunk"
#set :svn_password, "xxxxxxx"

# these shouldn't be changed
role :web, "#{domain}"
role :app, "#{domain}"
role :db,  "#{domain}", :primary => true
set :deploy_to,    "/home/#{site}/containers/rails/#{application}"

#set :migrate_env, "VERSION=0"

#task :after_update_code, :roles => :app do
#  put(File.read('deploy/database.yml.mt'), "#{release_path}/config/database.yml", :mode => 0444)
#end

task :after_symlink, :roles => :app do
  run "#{mtr} -u #{user} -p #{password} generate_htaccess #{application}"
end
