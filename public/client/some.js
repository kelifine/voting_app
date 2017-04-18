function checkField(){
        if (document.getElementById("title").value.length > 0 && document.getElementById("options").value.length > 0) {
          document.getElementById("submitchart").disabled=false;
      } else {document.getElementById("submitchart").disabled=true;}
}

function customVote() {
  var select = document.getElementById("myvote");
  var div = document.getElementById("newvote");
  if (select.options[select.selectedIndex].text==="create option") {
    div.style.display="inline";
  }
  else {
    div.style.display="none";
  }
}