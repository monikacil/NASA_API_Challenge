$(function() {

    let apiKey = "W06J9d3rAgBT8TLiCSzd0gCiU13QpRJ5yfVblXII";
    let nasaPictureOfTheDayDate = "https://cors-anywhere.herokuapp.com/https://api.nasa.gov/EPIC/api/enhanced/all?api_key="+apiKey;
    let mainFoto = "https://api.nasa.gov/planetary/apod?api_key="+apiKey;

    let imagesCounter = 0;

    let newTooltip = $("<span>");
    let tooltipText = $(".tooltip").data("text");

    $(".tooltip").hover(
        function(){
            newTooltip.addClass("tooltipText");
            newTooltip.text(tooltipText);
            $(this).prepend(newTooltip);},
        function () {
            $(this).find("span").remove();
    });

    jQuery(function($)
        {
            $.scrollTo(0);

            $('#link1').click(function() { var height = $(".nav").outerHeight(true); $.scrollTo($('#start'), 500, {offset:-height}); });
            $('.scrollup').click(function() { $.scrollTo($('body'), 1000); });
        }
    );

    function randomDate(objectsArr, dateCount){
        let dateArr = [];
        for(let i = 0; i < dateCount; i++){
            let randomIndex = Math.floor(Math.random()*objectsArr.length);
            dateArr.push(objectsArr[randomIndex].date);
        }
        return dateArr;
    }
    function createHTMLElements(url, title, type){
        let container = $("<div>");
        let element;
        if(type === "image") {
            element = $("<img>").attr("src", url);
        } else if(type === "video"){
            element = $("<iframe>").attr("src", url)
        }
        let paragraph = $("<p>").text(title);
        container.append(paragraph).append(element);
        $(element).on("load", function(){
            imagesCounter++;
            let rightColHeight = $("#colRight").height();
            let leftColHeight = $("#colLeft").height();
            if(rightColHeight > leftColHeight){
                $("#colLeft").append(container);
            } else {
                $("#colRight").append(container);
            }
            if(imagesCounter === 6){
                $('html, body').animate({
                    scrollTop: $("#gallery").offset().top
                }, 1000);
            }
        });
    }

    function createImagesArray(datesArr){
        let linksArray = datesArr.map((el)=>{
            return `https://cors-anywhere.herokuapp.com/https://api.nasa.gov/planetary/apod?date=${el}&api_key=${apiKey}`
        });

        linksArray.forEach((el)=>{
            $.ajax({
                url: el
            }).done(function (res) {
                let type = res.media_type;
                let url = res.url;
                let title = res.title;
                createHTMLElements(url, title, type);
            }).fail(function (error) {
                console.log(error);
            })
        });
    }

    function insertMainImg(img){
        let main = $(".main");
        if (img.type === "image") {
            main.css("backgroundImage", `url(${img.url})`);
        } else {
            let video = $("<iframe>").attr("src", img.url+"?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=W0LHTWG-UmQ").addClass("video-background");
            main.append(video);
        }

        let container = $("<div>");
        let header = $("<h1>").text("NASA API Challenge");
        container.append(header);
        main.append(container);
    }

    function loadMainImg() {
        $.ajax({
            url: mainFoto
        }).done(function (response) {
            insertMainImg(response)
        }).fail(function (error) {
            console.log(error);
        })
    }

    function loadDates(){
        $.ajax({
            url: nasaPictureOfTheDayDate
        }).done(function (response) {
            loadGallery(response);
        }).fail(function (error) {
            console.log(error);
        })
    }

    function loadGallery(fotos) {
        $.ajax({
            url: nasaPictureOfTheDayDate
        }).done(function () {
            createImagesArray(randomDate(fotos, 6));
        }).fail(function (error) {
            console.log(error);
        })
    }

    $(".loadMore").on("click", function(){
        loadDates();
        tooltipText = "Show more amazing photos!";
    });

    loadMainImg();
});