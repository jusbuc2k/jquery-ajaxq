/// <reference path="http://code.jquery.com/qunit/qunit-1.14.0.js" />
/// <reference path="http://code.jquery.com/jquery-1.11.0.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.0.0.js" />
/// <reference path="../src/ajaxq.js" />

var origAjax = $.ajax;

function restoreAjax() {
    $.ajax = origAjax;
}

QUnit.test('jQuery.ajaxq passes same arguments to jQuery.ajax.', function (assert) {
    expect(3);

    $.ajax = function () {
        assert.strictEqual(arguments.length, 2);
        assert.strictEqual(arguments[0], 'http://www.example.com');
        assert.strictEqual(arguments[1], 'options');

        return new $.Deferred().resolve();
    };
    $.ajaxq('http://www.example.com', 'options');

    restoreAjax();    
});

QUnit.asyncTest('jQuery.ajaxq runs queries in the correct order.', function (assert) {
    expect(10);

    var i;
    var when;
    var calls = [];
    var requests = [1,3,7,9,5,6,2,0,1,8];    

    $.ajax = function () {
        var p = new $.Deferred();

        calls.push(arguments[0]);
        window.setTimeout(function () {
            p.resolve();
        }, Math.random() * 250);

        return p.promise();
    };
        
    for (i = 0; i < requests.length; i++) {
        when = $.ajaxq(requests[i]);
    }

    when.then(function () {
        var x;
        for (x = 0; x < calls.length; x++) {
            assert.strictEqual(requests[x], calls[x]);
        }
        QUnit.start();
        restoreAjax();
    });
});

QUnit.test('jQuery.ajaxq resolves with same arguments from jQuery.ajax.', function (assert) {
    expect(3);

    $.ajax = function () {
        return new $.Deferred().resolveWith(null,[1,2,3]);
    };

    $.ajaxq('http://www.example.com', 'options').then(function (a, b, c) {
        assert.strictEqual(a, 1);
        assert.strictEqual(b, 2);
        assert.strictEqual(c, 3);
    });

    restoreAjax();
});

QUnit.test('jQuery.ajaxq rejects with same arguments from jQuery.ajax.', function (assert) {
    expect(3);

    $.ajax = function () {
        return new $.Deferred().rejectWith(null, [1, 2, 3]);
    };

    $.ajaxq('http://www.example.com', 'options').then(null, function (a, b, c) {
        assert.strictEqual(a, 1);
        assert.strictEqual(b, 2);
        assert.strictEqual(c, 3);
    });

    restoreAjax();
});

QUnit.test('jQuery.ajaxq abort cancels request.', function (assert) {
    expect(1);

    var def = new $.Deferred();
    var abortCalled = false;

    def.abort = function () {
        abortCalled = true;
    };

    $.ajax = function() {
        return def;
    };

    $.ajaxq('http://www.example.com', 'options').abort();

    assert.strictEqual(abortCalled, true);

    restoreAjax();
});