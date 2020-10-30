$(document).ready(function() {

    let tabs = $('.btn-tab-js')
    let header = document.querySelector('.header')

    tabs.each((idx, el) => {
        $(el).hover(function() {
            let hex = $(this).attr("data-hex")
            $(header).css('background', `${hex}`)
        })
    })

}); 