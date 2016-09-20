(function($) {
    var apiURL = "https://coldbrew.cloud";
    //var apiURL = "http://localhost:9000";

    $(document).ready(function() {
        var apiStatus = $("#api-status");
        var apiTokenCount = $("#api-token-count");

        function reloadAPIStatus() {
            $.ajax(apiURL + "/ping").then(function(data) {
                apiStatus.text("HEALTHY");
            }, function(err) {
                console.error("Failed to load API status");
                console.error(err);
                apiStatus.text("DOWN");
            })
        }

        function reloadAPITokenCount() {
            $.ajax(apiURL + "/tokens").then(function(data) {
                apiTokenCount.text(data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            }, function(err) {
                console.error("Failed to load API tokens count");
                console.error(err);
            })
        }

        reloadAPIStatus();
        window.setInterval(reloadAPIStatus, 10000);
        reloadAPITokenCount();
        window.setInterval(reloadAPITokenCount, 2500);
    });
})(jQuery);
