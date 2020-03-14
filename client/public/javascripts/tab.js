$(document).ready(function () {
    $(".nav-item").bind("click", function (event) {
        event.preventDefault();
        var clickedItem = $(this);
        $(".nav-item").each(function () {
            $(this).removeClass("active");
        });
        clickedItem.addClass("active");
    });
});

//<![CDATA[
jQuery(document).ready(function ($) {
    $(".multitab-widget-content-widget-id").hide();
    $("ul.multitab-widget-content-tabs-id li:first a").addClass("multitab-widget-current").show(); 
    $(".multitab-widget-content-widget-id:first").show(); $("ul.multitab-widget-content-tabs-id li a").click(function () {
    $("ul.multitab-widget-content-tabs-id li a").removeClass("multitab-widget-current a"); 
    $(this).addClass("multitab-widget-current"); $(".multitab-widget-content-widget-id").hide(); 
    var activeTab = $(this).attr("href"); $(activeTab).fadeIn(); return false; }); });
    //]]>
