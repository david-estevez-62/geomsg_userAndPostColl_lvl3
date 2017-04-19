var y = document.querySelector("#addMsgForm [name=imgdescrip]");
            if(y){
              var x = document.querySelector("#addMsgForm img");
            
            x.parentNode.removeChild(x);
            y.parentNode.removeChild(y);
            }
            
document.onkeydown = function(e){
      if(e.keyCode ===  13 && window.location.href.substr(-12)=="modalOverlay"){      
        $("#addMsgForm").trigger("submit")
      }

    }


$('#addMsgForm')[0].reset();
            var x = document.querySelector("#addMsgForm img");
            var y = document.querySelector("#addMsgForm [imgdescrip]");
            x.parentNode.removeChild(x);
            y.parentNode.removeChild(y);