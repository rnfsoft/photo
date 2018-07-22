$(function () {
    /* 1. OPEN THE FILE EXPLORER WINDOW */
    $(".js-upload-photos").click(function () {
      $("#fileupload").click();
    });
  
    /* 2. INITIALIZE THE FILE UPLOAD COMPONENT */
    $("#fileupload").fileupload({
      dataType: 'json',
      seqentialUploads: true,
      start: function (e){
        $("#modal-photo").modal("show");
        $("#modal-photo .modal-content").html("<div class='modal-header'><h4 class='modal-title'>Uploading...</h4> </div>\
        <div class='modal-body'><div class='progress'><div class='progress-bar' role='progressbar' style='width: 0%;'>0%</div></div></div>");
      },
      stop: function(e){
        $("#modal-progress").modal("hide");
      },
      progressall: function(e, data){
        var progress = parseInt(data.loaded/data.total*100, 10);
        var strProgress = progress + "%";
        $(".progress-bar").css({"width":strProgress});
        $(".progress-bar").text(strProgress);
      },
      done: function (e, data) {  /* 3. PROCESS THE RESPONSE FROM THE SERVER */
        if (data.result.is_valid) {
          // $("#photo-table tbody").prepend(
          //   "<tr><td><a href='" + data.result.url + "'>" + "<img src='" + data.result.url + "' class='img-thumbnail'>" + "</a></td></tr>"
          // )

          // $("#photo-table tbody").html(data.html_photo_list);
          
          location.reload()
        }
      }
    });


    $("#photo-table").on("click", ".js-delete-photo",   function (){
      var btn = $(this);  // <-- HERE
      $.ajax({
        url: btn.attr("data-url"),  // <-- AND HERE
        type: 'get',
        dataType: 'json',
        beforeSend: function () {
          $("#modal-photo").modal("show");
        },
        success: function (data) {
          $("#modal-photo .modal-content").html(data.html_form);
        } 
      });
    });

    $("#modal-photo").on("submit", ".js-photo-delete-form", function () {
      var form = $(this);
      $.ajax({
        url: form.attr("action"),
        data: form.serialize(),
        type: form.attr("method"),
        dataType: 'json',
        success: function (data) {
          if (data.form_is_valid) {
            $("#photo-table tbody").html(data.html_photo_list);  // <-- Replace the table body
            $("#modal-photo").modal("hide");  // <-- Close the modal
          }
          else {
            $("#modal-photo .modal-content").html(data.html_form);
          }
        }
      });
      return false;
    });
  
  });