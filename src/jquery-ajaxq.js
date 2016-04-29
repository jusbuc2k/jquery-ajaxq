/*
 * jQuery simple ajax queue
 * 
 * Copyright (c) 2016 Justin Buchanan
 * Licensed under The MIT License
 * 
 */

; (function ($) {

    var _lastRequest = new $.Deferred().resolve();
   
    $.ajaxq = function (url, options) {
        var thisRequest = new $.Deferred();
        var thisPromise = thisRequest.promise();

        thisRequest.isAborted = false;

        thisPromise.abort = function () {
            thisRequest.isAborted = true;
            if (thisRequest._pendingRequest) {
                thisRequest._pendingRequest.abort();
            }
            thisRequest.rejectWith(null, ['aborted']);
        };
        
        var exec = function () {
            if (thisRequest.isAborted) {
                return;
            }

            thisRequest._pendingRequest = $.ajax.call($, url, options);
            thisRequest._pendingRequest.then(function () {
                thisRequest.resolveWith(null, arguments);
            }, function(){
                thisRequest.rejectWith(null, arguments);
            });
        };

        _lastRequest.then(exec, exec);
        _lastRequest = thisRequest;
        
        return thisPromise;
    };

})(jQuery);