module CloudHelper
  def makeCloud(cloud)
    jsonUrl = url_for :action => 'json', :id => cloud.id
    script = "<script src=\"#{jsonUrl}\"></script>"
    tagcloud = <<-END
      <div id='tagCloud'>
      </div>
      <script>
       var tc = new TagCloud(cloud.tag_frequencies, document.getElementById('tagCloud'));
      </script>
    END
    return script + tagcloud
  end
end
