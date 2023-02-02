AppBuilder.register("uploadfile", function (exports) {
  exports.group = "objects";
  exports.name = "Uploadfile";
  exports.author = "Total.js"; // Author
  exports.icon = "ti ti-file-import";
  exports.config = {}; // a default configuration
  exports.import = []; // 3rd party dependencies
  exports.settings = ""; // HTML settings
  exports.css = ``;
  exports.type = "uploadfile";
  exports.class = "formfield";

  // Editor implementation

  exports.make = function (instance, config, element) {
    element.append(`

			<label class="control-label"></label>
			<div class="uploadfile">
				<div class="uploadfile-area" >
					<p class="text"></p>
					<div class="upload-box">
						<label class="custom-file-upload  upload-btn">
							<input type="file" class="upload-on-click upload-btn" multiple />
							<i class="far fa-upload icons"></i>
						</label>
						<button class="dropbox-button upload-btn">
							<i class="fab fa-dropbox icons"></i>
						</button>
						<button class="google-button upload-btn">
							<i class="fab fa-google-drive icons"></i>
						</button>
					</div>
				</div>
				<ul class="files"></ul>
			</div>
		`);

    var text = element.find(".text");
    var uploadArea = element.find(".uploadfile-area");
    var wrap = element.find(".uploadfile");
    var label = element.find(".control-label");
    var uploadClick = element.find(".upload-on-click");
    var listitem = element.find(".list-item");
    var del = element.find(".delete");
    var icons = element.find(".icons");
    var buttons = element.find(".upload-btn");
    var browseButton = element.find(".custom-file-upload");
    var dropBoxButton = element.find(".dropbox-button");
    var googleButton = element.find(".google-button");

    config.TextValue && text.html(config.TextValue);
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

    config.BtnIconSize && icons.css("font-size", config.BtnIconSize + "px");
    config.BtnHeight && buttons.css("height", config.BtnHeight + "px");
    config.BtnWidth && buttons.css("width", config.BtnWidth + "px");
    config.BtnFillColor && buttons.css("background", config.BtnFillColor);
    config.BtnFillColor && buttons.css("background", config.BtnFillColor);
    if (config.BtnBorder)
      buttons.css(
        "border",
        `${config.BtnBorderWidth === "" ? "1" : config.BtnBorderWidth}px ${
          config.BtnBorderType
        } ${config.BtnBorderColor}`
      );
    config.BtnIconColor && buttons.css("color", config.BtnIconColor);
    if (config.BtnHideBrowse) browseButton.css("display", "none");
    if (config.BtnHideDropBox) dropBoxButton.css("display", "none");
    if (config.BtnHideGoogle) googleButton.css("display", "none");

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

    uploadArea.css(
      "border",
      `${config.BorderWidth === "" ? "1" : config.BorderWidth}px ${
        config.BorderType
      } ${config.BorderColor}`
    );

    config.FilesFontSize && listitem.css("font-size", config.FilesFontSize);
    config.FilesFontColor && listitem.css("color", config.FilesFontColor);
    config.FilesFontSize && del.css("font-size", config.FilesFontSize);
    console.log(config.FilesFontSize);

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

    const dataSource = [];
    uploadArea.on("drop", function (e) {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();
      const files = e.originalEvent.dataTransfer.files;
      console.log(files);

      for (let key in files) {
        if (
          dataSource.length < config.MaxFilesAmount &&
          files[key].size < config.MaxFilesWeight * 1024 * 1024
        ) {
          const file = files[0];
          const fileAlreadyExists = (string, array) => {
            return array.some((obj) => Object.values(obj).includes(string));
          };

          if (!fileAlreadyExists(files[key].name, dataSource)) {
            const fileData = {};
            fileData.name = files[key].name;
            fileData.ID = Math.random();
            fileData.size = files[key].size;
            element.find(".files")
              .append(`<li class="list-item"title="${fileData.ID}">
								<p class="item" >${fileData.name}</p>
								<span class="delete">&#128937;</span>
							</li>`);
            dataSource.push(fileData);
            console.log(dataSource);
            instance.datasources.push(fileData.data);
            console.log(instance.datasources);

            const reader = new FileReader();
            reader.onload = function (e) {
              var content = e.target.result;
              fileData.data = content;
              // instance.datasources.push(content);
              // console.log(instance.datasources);
            };
            reader.readAsBinaryString(file);
          }

          let listElement = document.querySelectorAll(".list-item");
          removeFile(listElement);
        }
        if (dataSource.length >= config.MaxFilesAmount) {
          console.log("Count");
        }
        if (files[key].size >= config.MaxFilesWeight * 1024 * 1024) {
          console.log("Weight");
        }
      }
    });

    function removeFile(listElement) {
      function removeElement() {
        for (let i = 0; i < dataSource.length; i++) {
          if (dataSource[i].ID == $(this).parent().attr("title")) {
            console.log($(this).parent());

            console.log(dataSource[i].size);

            dataSource.splice(i, 1);
            console.log(dataSource);

            instance.datasources.splice(i, 1);
            console.log(instance.datasources);
          }
        }
        $(this).parent().remove();
      }
      listElement.forEach(function (el) {
        el.querySelector(".delete").onclick = removeElement;
      });
    }

    // Lile upload button

    console.log(uploadClick);
    uploadClick.on("change", (e) => {
      var files = e.target.files;
      console.log(files);
      const fileData = {};
      for (let key in files) {
        if (
          dataSource.length < config.MaxFilesAmount &&
          files[key].size < config.MaxFilesWeight * 1024 * 1024
        ) {
          const file = files[0];
          const fileAlreadyExists = (string, array) => {
            return array.some((obj) => Object.values(obj).includes(string));
          };

          if (!fileAlreadyExists(files[key].name, dataSource)) {
            const fileData = {};
            fileData.name = files[key].name;
            fileData.ID = Math.random();
            fileData.size = files[key].size;
            element.find(".files")
              .append(`<li class="list-item"title="${fileData.ID}">
								<p class="item" >${fileData.name}</p>
								<span class="delete">&#128937;</span>
							</li>`);
            dataSource.push(fileData);
            console.log(dataSource);
            instance.datasources.push(fileData.data);
            console.log(instance.datasources);

            const reader = new FileReader();
            reader.onload = function (e) {
              var content = e.target.result;
              fileData.data = content;
              // instance.datasources.push(content);
              // console.log(instance.datasources);
            };
            reader.readAsBinaryString(file);
          }

          let listElement = document.querySelectorAll(".list-item");
          removeFile(listElement);
        }
        if (dataSource.length >= config.MaxFilesAmount) {
          console.log("Count");
        }
        if (files[key].size >= config.MaxFilesWeight * 1024 * 1024) {
          console.log("Weight");
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
      dropBoxButton.on("click", function () {
        Dropbox.choose({
          multiselect: true,
          folderselect: false,
          linkType: "direct",

          success: function (files) {
            console.log(files);
            for (let file of files) {
              if (
                dataSource.length < config.MaxFilesAmount &&
                file.bytes < config.MaxFilesWeight * 1024 * 1024
              ) {
                const fileData = {};
                const fileAlreadyExists = (string, array) => {
                  return array.some((obj) =>
                    Object.values(obj).includes(string)
                  );
                };

                if (!fileAlreadyExists(file.name, dataSource)) {
                  fileData.name = file.name;
                  fileData.ID = Math.random();
                  fileData.size = file.bytes;
                  console.log(fileData);
                  element.find(".files")
                    .append(`<li class="list-item"title="${fileData.ID}">
										<p class="item" >${fileData.name}</p>
										<span class="delete">&#128937;</span>
									</li>`);
                }
                fetch(file.link)
                  .then((response) => response.arrayBuffer())
                  .then((data) => {
                    const fileAlreadyExists = (string, array) => {
                      return array.some((obj) =>
                        Object.values(obj).includes(string)
                      );
                    };

                    if (!fileAlreadyExists(file.name, dataSource)) {
                      fileData.data = data;
                      dataSource.push(fileData);
                      console.log(dataSource);
                      instance.datasources.push(fileData);
                    }
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

      function authenticateLoadClient() {
        authenticate().then(loadClient);
      }

      gapi.load("client:auth2", function () {
        gapi.auth2.init({
          client_id:
            "903907170385-rim71tdktoi5ei260cr0pkcvde6eh7r0.apps.googleusercontent.com",
        });
      });
      googleButton.on("click", authenticateLoadClient);
    };
    loadGoogleJS(
      "https://apis.google.com/js/api.js",
      googleCodeToBeCalled,
      document.body
    );

    instance.on("ready", function () {});
  };
});
