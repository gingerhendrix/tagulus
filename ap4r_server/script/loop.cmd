@ECHO OFF

ruby %~dp0loop.rb manager start -c queues%1.cfg
