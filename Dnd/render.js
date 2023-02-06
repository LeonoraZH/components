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

    console.log(config.FileExtension);
    var extensions = config.FileExtension.split(",");
    console.log(config.TextValue);
    uploadClick.attr("accept", config.FileExtension);
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
      e.preventDefault();
      e.stopPropagation();
      const files = e.originalEvent.dataTransfer.files;

      for (let key in files) {
        if (files[key].name && files[key].lastModified) {
          const fileExtension = "." + files[key].name.split(".").pop();
          if (extensions.includes(fileExtension)) {
            if (dataSource.length < config.MaxFilesCount) {
              if (files[key].size < config.MaxFileWeight * 1024 * 1024) {
                const file = files[key];
                const fileAlreadyExists = (string, array) => {
                  return array.some((obj) =>
                    Object.values(obj).includes(string)
                  );
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

                  const reader = new FileReader();
                  reader.onload = function (e) {
                    var content = e.target.result;
                    instance.datasources.push(content);
                    console.log(instance.datasources);
                  };
                  reader.readAsBinaryString(file);
                } else SETTER("message/warning", config.RepeatWarning);

                let listElement = document.querySelectorAll(".list-item");
                removeFile(listElement);
              } else {
                SETTER("message/warning", config.WeightWarning);
              }
            } else {
              SETTER("message/warning", config.CountWarning);
            }
          } else {
            console.log(extensions);
            SETTER("message/warning", config.ExtWarning);
          }
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
        if (files[key].name && files[key].lastModified) {
          if (dataSource.length < config.MaxFilesCount) {
            if (files[key].size <= config.MaxFileWeight * 1024 * 1024) {
              const file = files[key];
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

                const reader = new FileReader();
                reader.onload = function (e) {
                  var content = e.target.result;
                  instance.datasources.push(content);
                  console.log(instance.datasources);
                };
                reader.readAsBinaryString(file);
              } else SETTER("message/warning", config.RepeatWarning);

              let listElement = document.querySelectorAll(".list-item");
              removeFile(listElement);
            } else {
              SETTER("message/warning", config.WeightWarning);
            }
          } else {
            SETTER("message/warning", config.CountWarning);
          }
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

      location.appendChild(scriptTag);
    };

    var dropCodeToBeCalled = function () {
      dropBoxButton.on("click", function () {
        Dropbox.choose({
          multiselect: true,
          folderselect: false,
          linkType: "direct",
          sizeLimit: config.MaxFileWeight * 1024 * 1024,
          extensions: extensions,

          success: function (files) {
            console.log(files);
            for (let file of files) {
              if (dataSource.length < config.MaxFilesCount) {
                console.log(dataSource);
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
                  dataSource.push(fileData);
                  console.log(dataSource);

                  element.find(".files")
                    .append(`<li class="list-item"title="${fileData.ID}">
										<p class="item" >${fileData.name}</p>
										<span class="delete">&#128937;</span>
									</li>`);
                  fetch(file.link)
                    .then((response) => response.arrayBuffer())
                    .then((data) => {
                      console.log(data);

                      fileData.data = data;
                      instance.datasources.push(data);
                      console.log(instance.datasources);

                      let listElement = document.querySelectorAll(".list-item");
                      removeFile(listElement);
                    });
                } else SETTER("message/warning", config.RepeatWarning);
              } else {
                SETTER("message/warning", config.CountWarning);
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

    var loadGoogleJS = function () {
      // window.addEventListener("load", function () {
      var scriptTag1 = document.createElement("script");
      scriptTag1.src = "https://apis.google.com/js/api.js?onload=onApiLoad";
      scriptTag1.setAttribute("type", "text/javascript");
      scriptTag1.setAttribute("id", "googlepickjs");

      var scriptTag2 = document.createElement("script");
      scriptTag2.src = "https://accounts.google.com/gsi/client";
      scriptTag2.setAttribute("type", "text/javascript");
      scriptTag2.setAttribute("id", "googlepickjs");

      document.body.appendChild(scriptTag1);
      document.body.appendChild(scriptTag2);
      // });
    };
    function gaccLoaded() {
      setTimeout(function () {
        loadGoogleJS();
      }, 1000);
    }
    gaccLoaded();

    // var googleCodeToBeCalled = function(){

    function onApiLoad() {
      gapi.load("client:picker", onPickerApiLoad);
      alert("!!!!!!!!!!!!!!!!!");
    }

    async function onPickerApiLoad() {
      await gapi.client.load(
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
      ),
        (pickerInited = !0);
    }
    function gaccLoaded() {
      setTimeout(function () {
        gaccInited = !0;
      }, 200);
    }
    function createPicker() {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id:
          "903907170385-rim71tdktoi5ei260cr0pkcvde6eh7r0.apps.googleusercontent.com",
        scope:
          "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly",
        callback: "",
      });
      const e = () => {
        new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .addView(google.picker.ViewId.DOCS)
          .setOAuthToken(accessToken)
          //.setDeveloperKey("AIzaSyArjLBoYN0w9ExNSFfFBWcKX63WmLVSHAo")
          .setMaxItems(10)
          .setCallback(pickerCallback)
          .build()
          .setVisible(true);
      };
      (tokenClient.callback = async (o) => {
        o.error !== undefined
          ? console.log(
              "There was an error connecting to your Google Drive, please try again."
            )
          : o.scope.includes("https://www.googleapis.com/auth/drive.readonly")
          ? ((accessToken = o.access_token), e())
          : console.log(
              "You must confirm additional permissions to upload to Google Drive, please try again."
            );
      }),
        null === accessToken
          ? tokenClient.requestAccessToken({ prompt: "consent" })
          : tokenClient.requestAccessToken({ prompt: "" });
    }
    function pickerCallback(e) {
      console.log(e);
      e.action == google.picker.Action.PICKED &&
        ((cancelled = !1),
        $.each(e[google.picker.Response.DOCUMENTS], function (e, o) {
          var i = Math.random();
          (allFilesFinished[i] = !1), (o.randomId = i);
        }),
        $.each(e[google.picker.Response.DOCUMENTS], function (e, o) {
          // checkWhiteList(o.name, filetypes)
          //   ? gdriveUpload(e, o)
          //   : (postFailedUpload(o.name, 0, "unsupported filetype"),
          console.log("callback");
        }));
    }
    const filetypes = ".pdf";
    function postFailedUpload(e, o, i) {
      (extension = e.split(".").pop()),
        $.ajax({
          url: "/failed_uploads",
          type: "POST",
          data: {
            failed_upload: { name: e, extension: extension, size: o, error: i },
          },
          dataType: "json",
        });
    }
    var cancelled = !1,
      allFilesFinished = {},
      percentage = 0;
    let tokenClient,
      accessToken = null,
      pickerInited = !1,
      gaccInited = !1;

    googleButton.on("click", function (e) {
      e.preventDefault(), createPicker();
    });
    // checkWhiteList = function (e, o) {
    // var i = e.toLowerCase();
    // return new RegExp("(" + o.join("|").replace(/\./g, "\\.") + ")$").test(i);
    // };

    // };
    // loadGoogleJS(googleCodeToBeCalled, document.body);

    instance.on("ready", function () {});
  };
});
