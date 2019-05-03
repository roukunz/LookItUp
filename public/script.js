

function openPostTab(evt, postType) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  $(".tablink").removeClass("active");
  document.getElementById(postType).style.display = "block";
  evt.currentTarget.className += " active";
}

function timeDifference(fromdate, id) {	
  var date = new Date(fromdate);
  var diff = new Date().getTime() - date.getTime();	
  console.log("ToDate : " + new Date());
  console.log("From Date: " + date);
  console.log("difference : " + diff );
  var divideBy;
  var textDisplay;
  if(diff > 1000){
    if(diff >60000){
      if(diff > 3600000){
        if(diff > 86400000){
          if(diff > 604800000){
            if(diff > 2628000000){
              divideBy = 2628000000;
              textDisplay = " months";
            } else {
              divideBy = 604800000;
              textDisplay = " weeks";
            }
          } else {
            divideBy = 86400000;
            textDisplay = " days";
          }
        } else {
          divideBy = 3600000;
          textDisplay = " hours";
        }
      } else {
        divideBy = 60000;
        textDisplay = " minutes";
      }
    } else {
      divideBy = 1000;
      textDisplay = " seconds";
    }
  } else {
    return  $("#date"+id).text("0 seconds")
  }
  $("#date"+id).text(Math.floor( Math.floor(parseFloat(diff)/ parseFloat(divideBy))) + textDisplay);
}

