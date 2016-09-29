(function($) {
    var apiURL = "https://coldbrew.cloud";
    
    function randomWord(fn) {
        $.ajax("http://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5").then(function(data) {
            fn(data.word || "foo");
        }, function(err) {
            console.error("Error retrieving random word.");
            console.error(err);
            fn("foo");
        });
    }

    $(document).ready(function() {
        var testAPIToken = "564b53e66c6639017737e2ee77da971da123bcd2e79b46a6516c8e62c60bb357";
        var testKVKey = "foo";
        var testKVValue = "bar"

        function updateTestAPIToken(token) {
            testAPIToken = token;
            $("span.api-token").text(token);
        }
        function updateTestKVKey(key) {
            testKVKey = key;
            $("span.kv-key").text(key);
            $(".run-curl-kv").attr("data-path", "/kv/" + key)
        }
        function updateTestKVValue(value) {
            testKVValue = value;
            $("span.kv-value").text(value);
            $(".run-curl-kv-set").attr("data-body", value);
        }

        if(window.localStorage) {
            var s = window.localStorage.getItem("coldbrew-cloud-api-token-" + apiURL);
            if(s) {
                updateTestAPIToken(s);
            } else {
                $.ajax({
                    url: apiURL + "/register",
                    method: "POST"
                }).then(function(data) {
                    updateTestAPIToken(data);
                    window.localStorage.setItem("coldbrew-cloud-api-token-" + apiURL, data);
                });
            }
        } else {
            updateTestAPIToken(testAPIToken);
        }

        randomWord(updateTestKVKey);
        randomWord(updateTestKVValue);

        $(".run-curl").click(function(e) {
            e.preventDefault();

            var method = $(this).data("method");
            var path = $(this).data("path");
            var reqBody = $(this).data("body");
            var resultDiv = $("#" + $(this).attr("id") + "-result");

            var ajaxOpts = {
                url: apiURL + path,
                method: method,
                data: reqBody,
                dataType: "text",
                headers: { "Authorization": "Basic " + btoa(testAPIToken+":") }
            };

            console.log("HTTP request:");
            console.log(ajaxOpts);

            $.ajax(ajaxOpts).then(function(data, _, xhr) {
                resultDiv.show();
                resultDiv.empty();
                resultDiv.append('<div class="status">status: ' + xhr.status + '</div>')
                resultDiv.append('<div class="response">' + xhr.responseText + '</div>');
            }, function(xhr) {
                resultDiv.show();
                resultDiv.empty();
                resultDiv.append('<div class="status">status: ' + xhr.status + '</div>')
                resultDiv.append('<div class="response">' + xhr.responseText + '</div>');
            });
        });
    });

})(jQuery);
