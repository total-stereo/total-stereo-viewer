$(document).on('turbolinks:load', function() {
  $(".container.start").each(function(){
    
    $(".entrypoint-animation-col").each(function(){
      
      setInterval(Animate, 400);
      var x = 0;
      var imgElement = $(this).find("img");

      var paths = []
      $(this).find("div").each(function(){ paths.push($(this).data("src")); });
      
      function Animate() {
        imgElement.attr("src",paths[x]);
         x++;
         if (paths.length == x) {
             x = 0;
         }
      }
      
    });
    
    
  });
});