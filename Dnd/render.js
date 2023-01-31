AppBuilder.register("uploadfile", function (exports) {
  exports.group = "objects";
  exports.name = "Uploadfile";
  exports.author = "Total.js"; // Author
  exports.icon = "ti ti-file-import";
  exports.config = {}; // a default configuration
  exports.import = []; // 3rd party dependencies
  exports.settings = ""; // HTML settings
  exports.css = `
.O_uploadfile .upload-on-click[type="file"] { display: none; }
.O_uploadfile .upload-box { display: flex; gap: 10px }
.O_uploadfile .custom-file-upload { padding: 6px 12px 6px 12px; margin: 0 0 0 0; display: flex; jastify-content: center; align-content: center; border-radius: var(--radius); background-color: grey; color: white; cursor: pointer; }
.O_uploadfile .buttons-box { display: flex; align-self: center; gap: 12px}
.O_uploadfile .upload-btn { margin: 0 0 0 0; padding: 6px 12px 6px 12px; display: flex; jastify-content: center; align-content: center;  background-color: grey; width: 30px; height: 30px; }
	`;
  exports.type = "uploadfile";

  // Editor implementation

  exports.make = function (instance, config, element) {
    let text = "Drop to upload your file(s) or:";
    if (config.TextValue) text = config.TextValue;

    element.append(`

			<label class="control-label"></label>
			<div class="uploadfile">
				<div class="uploadfile-area" >
					<p class="text">${text}</p>
					<div class="upload-box">
						<label class="custom-file-upload">
							<input type="file" class="upload-on-click upload-btn" multiple />
							<i class="far fa-upload"></i>
						</label>
						<button class="dropbox-button upload-btn">
							<i class="fab fa-dropbox"></i>
						</button>
						<button class="google-button upload-btn">
							<i class="fab fa-google-drive"></i>
						</button>
					</div>
				</div>
				<ul class="files"></ul>
			</div>
		`);

    var uploadArea = element.find(".uploadfile-area");
    var wrap = element.find(".uploadfile");
    var label = element.find(".control-label");
    var button = element.find(".upload-btn");
    var uploadButton = element.find(".custom-file-upload");
    var uploadClick = element.find(".upload-on-click");
    var googleButton = element.find(".google-button");
    var listitem = element.find(".item");
    var del = element.find(".delete");

    config.FillColor
      ? uploadArea.css("background-color", config.FillColor)
      : uploadArea.css("background-color", "#fff");
    config.FontSize && element.find(".text").css("font-size", config.FontSize);
    config.Height && uploadArea.css("height", config.Height + "px");
    config.Bold
      ? uploadArea.css("font-weight", "bold")
      : uploadArea.css("font-weight", "normal");
    config.Italic
      ? uploadArea.css("font-style", "italic")
      : uploadArea.css("font-style", "normal");
    config.TextColor && element.find(".text").css("color", config.TextColor);

    if (config.Mandatory) label.aclass("required");

    config.BtnHeight && button.css("height", config.BtnHeight + "px");
    config.BtnWidth && button.css("width", config.BtnWidth + "px");
    config.BtnFillColor && button.css("background", config.BtnFillColor);
    config.BtnFillColor && uploadButton.css("background", config.BtnFillColor);
    config.BtnHeight && uploadButton.css("height", config.BtnHeight + "px");
    config.BtnWidth && uploadButton.css("width", config.BtnWidth + "px");
    config.BtnFillColor && button.css("background", config.BtnFillColor);
    if (config.BtnBorder)
      button.css(
        "border",
        `${config.BtnBorderWidth === "" ? "1" : config.BtnBorderWidth}px ${
          config.BtnBorderType
        } ${config.BtnBorderColor}`
      );
    config.BtnTextColor && button.css("color", config.BtnTextColor);

    config.Label = instance.translate(config.CtrlName);
    config.Label && label.html(config.Label);
    config.NoLabel && label.aclass("novisible");
    if (config.NoLabel)
      config.LabelSpace ? label.rclass("hidden") : label.aclass("hidden");
    else label.rclass("hidden");
    config.LabelFontSize && label.css("font-size", config.LabelFontSize);
    config.LabelBold
      ? label.css("font-weight", "bold")
      : label.css("font-weight", "normal");
    config.LabelItalic
      ? label.css("font-style", "italic")
      : label.css("font-style", "normal");
    config.LabelTextColor && label.css("color", config.LabelTextColor);

    if (config.Width === "custom") wrap.css("width", config.WidthCustom + "px");
    else if (config.Width === "full") uploadArea.aclass("btn-block");

    if (config.Border)
      uploadArea.css(
        "border",
        `${config.BorderWidth === "" ? "1" : config.BorderWidth}px ${
          config.BorderType
        } ${config.BorderColor}`
      );

    config.FilesFontSize && listitem.css("font-size", config.FilesFontSize);
    config.FilesFontColor && listitem.css("color", config.FilesFontColor);
    config.FilesFontSize && del.css("font-size", config.FilesFontSize);

    // file upload

    uploadArea.on("dragenter", function (e) {
      console.log("dragenter");
      e.preventDefault();
      e.stopPropagation();
    });

    uploadArea.on("dragleave", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    uploadArea.on("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    const fileData = {};
    const dataSource = [];
    let filesSize = 0;
    uploadArea.on("drop", function (e) {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();
      var files = e.originalEvent.dataTransfer.files;
      console.log(files);
      for (let key in files) {
        console.log(files);
        if (
          dataSource.length < config.MaxFilesAmount &&
          filesSize + files[key].size < config.MaxFilesWeight * 1024 * 1024
        ) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = function (e) {
            var content = e.target.result;
            fileData.name = files[key].name;
            fileData.ID = Math.random();
            fileData.size = files[key].size;
            fileData.data = `<FileEnvelope><FileName>${fileData.name}</FileName><FileContent>${content}</FileContent></FileEnvelope>`;

            dataSource.push(fileData);
            console.log(dataSource);

            instance.datasources.push(fileData.data);
            console.log(instance.datasources);

            filesSize += fileData.size;
            console.log(filesSize);
            element.find(".files")
              .append(`<li class="list-item"title="${fileData.ID}">
							<p class="item" >${fileData.name}</p>
							<p class="delete">&#128937;</p>
						</li>`);

            let listElement = document.querySelectorAll(".list-item");
            removeFile(listElement);
          };
          reader.readAsBinaryString(file);
        }
      }
    });

    function removeFile(listElement) {
      function removeElement() {
        console.log(dataSource);

        var p = $(this).parent();
        console.log(p);

        var a = p.attr("title");
        console.log(a);

        try {
          for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i].ID == $(this).parent().attr("title")) {
              console.log($(this).parent());

              console.log(dataSource[i].size);
              filesSize -= dataSource[i].size;
              console.log(filesSize);

              dataSource.splice(i, 1);
              console.log(dataSource);

              instance.datasources.splice(i, 1);
              console.log(instance.datasources);
            }
          }
        } catch (error) {
          console.error(error);
        }
        $(this).parent().remove();
        console.log($(this).parent());
      }

      listElement.forEach(function (el) {
        el.querySelector(".delete").onclick = removeElement;
        console.log(el);
      });
    }

    // Lile upload button

    console.log(uploadClick);
    uploadClick.on("change", (e) => {
      var files = e.target.files;
      console.log(files);
      for (let key in files) {
        console.log(files);
        console.log(dataSource);
        if (
          dataSource.length < config.MaxFilesAmount &&
          filesSize + files[key].size < config.MaxFilesWeight * 1024 * 1024
        ) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = function (e) {
            var content = e.target.result;
            fileData.name = files[key].name;
            fileData.ID = Math.random();
            fileData.size = files[key].size;
            fileData.data = `<FileEnvelope><FileName>${fileData.name}</FileName><FileContent>${content}</FileContent></FileEnvelope>`;

            dataSource.push(fileData);
            console.log(dataSource);
            instance.datasources.push(fileData.data);
            console.log(instance.datasources);

            filesSize += fileData.size;
            console.log(filesSize);
            element.find(".files")
              .append(`<li class="list-item"title="${fileData.ID}">
							<p class="item" >${fileData.name}</p>
							<p class="delete">&#128937;</p>
						</li>`);

            let listElement = document.querySelectorAll(".list-item");
            removeFile(listElement);
          };
          reader.readAsBinaryString(file);
        }
      }
    });

    // Dropbox

    var loadDropJS = function (url, appkey, implementationCode, location) {
      var scriptTag = document.createElement("script");
      scriptTag.src = url;
      scriptTag.setAttribute("data-app-key", appkey);
      scriptTag.setAttribute("id", "dropboxjs");

      scriptTag.onload = implementationCode;
      scriptTag.onreadystatechange = implementationCode;

      location.appendChild(scriptTag);
    };

    var dropCodeToBeCalled = function () {
      element.find(".dropbox-button").on("click", function () {
        Dropbox.choose({
          multiselect: true,
          folderselect: false,
          linkType: "direct",

          success: function (files) {
            console.log(files);
            for (let file of files) {
              if (
                dataSource.length < config.MaxFilesAmount &&
                filesSize + file.bytes < config.MaxFilesWeight * 1024 * 1024
              ) {
                fileData.name = file.name;
                fileData.ID = Math.random();
                fileData.size = file.bytes;
                console.log(fileData);
                element.find(".files")
                  .append(`<li class="list-item"title="${fileData.ID}">
									<p class="item" >${fileData.name}</p>
									<p class="delete">&#128937;</p>
								</li>`);

                fetch(file.link)
                  .then((response) => response.arrayBuffer())
                  .then((data) => {
                    fileData.data = data;
                    dataSource.push(fileData);
                    console.log(file);
                    console.log(data);
                    console.log(dataSource);

                    let listElement = document.querySelectorAll(".list-item");
                    removeFile(listElement);
                  });
              }
            }
          },
        });
      });
    };
    loadDropJS(
      "https://www.dropbox.com/static/api/2/dropins.js",
      "pbb4e0p1acw88or",
      dropCodeToBeCalled,
      document.body
    );

    // Google Drive

    var loadGoogleJS = function (url, implementationCode, location) {
      var scriptTag = document.createElement("script");
      scriptTag.src = url;

      scriptTag.onload = implementationCode;
      scriptTag.onreadystatechange = implementationCode;

      location.appendChild(scriptTag);
    };

    var googleCodeToBeCalled = function () {
      function authenticate() {
        console.log("Google");
        return gapi.auth2
          .getAuthInstance()
          .signIn({
            scope:
              "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly",
          })
          .then(
            function () {
              console.log("Sign-in successful");
            },
            function (err) {
              console.error("Error signing in", err);
            }
          );
      }
      function loadClient() {
        gapi.client.setApiKey("AIzaSyDthIiy1vMquT6zV-XqMox5vskZ6QnoxVI");
        return gapi.client
          .load(
            "https://content.googleapis.com/discovery/v1/apis/drive/v3/rest"
          )
          .then(
            function () {
              console.log("GAPI client loaded for API");
            },
            function (err) {
              console.error("Error loading GAPI client for API", err);
            }
          );
      }
      gapi.load("client:auth2", function () {
        gapi.auth2.init({
          client_id:
            "903907170385-rim71tdktoi5ei260cr0pkcvde6eh7r0.apps.googleusercontent.com",
        });
      });
      googleButton.on("click", authenticate);
    };
    loadGoogleJS(
      "https://apis.google.com/js/api.js",
      googleCodeToBeCalled,
      document.body
    );

    instance.on("ready", function () {});
  };
});
