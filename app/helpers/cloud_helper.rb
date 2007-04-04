module CloudHelper
  def makeCloud(cloud)
    jsonUrl = url_for :action => 'json', :id => cloud.id
    script = "<script src=\"#{jsonUrl}\"></script>"
    tagcloud = <<-END
      <div id='tagCloud'>
      <script>
        var tc = new TagCloud();
       document.write(tc.makeCloud(cloud.tag_frequencies));
      </script>
      </div>
    END
    return script + tagcloud
  end
end
