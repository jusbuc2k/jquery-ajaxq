# jquery-ajaxq
Simple message queue for jQuery.ajax()

## Usage
Same options as jQuery.ajax().

```html

<script src="ajaxq.js"></script>
<script>
    // Req 1 should run immediately
    $.ajaxq({
        url: 'http://www.example.com/1',
        type: 'GET'
    }).then(function(response){
        console.log(response);
    });

    // Req 2 should not run until req 1 is done
    $.ajaxq({
        url: 'http://www.example.com/2',
        type: 'GET'
    }).then(function(response){
        console.log(response);
    });

    // Req 3 should not run until Req 2 is done.
    $.ajaxq({
        url: 'http://www.example.com/3',
        type: 'GET'
    }).then(function(response){
        console.log(response);
    });
</script>

```