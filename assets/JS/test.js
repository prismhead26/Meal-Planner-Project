$(document).ready(function() {
    //set initial state.
    $('#textbox1').val(this.checked);

    $('#checkbox1').change(function() {
        if(this.checked) {
            var returnVal = confirm("Are you sure?");
            $(this).prop("checked", returnVal);
        }
        $('#textbox1').val(this.checked);        
    });
});