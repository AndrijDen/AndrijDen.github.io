$(document).ready(function(){
    $('.menu-mobile').on('click',function(){
        var prog = ["#prog_0","#prog_1","#prog_2","#prog_3"];
        $(this).addClass('active_border_bottom');
        if($(this).next().hasClass('active')){
            $(this).removeClass('active_border_bottom');
            $(this).next().removeClass('active');
        }
        else{
            prog.forEach(function(p){
                if($(p).hasClass('active_border_bottom')){
                    $(p).removeClass('active_border_bottom');
                };
            });
            $(this).addClass('active_border_bottom');
            $('.menu_item').removeClass('active');
            $(this).next().addClass('active');
        }
    });
});

