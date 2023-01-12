AppBuilder.register("button", function (exports) {
  exports.group = "objects";
  exports.name = "Button";
  exports.author = "Total.js"; // Author
  exports.icon = "fas fa-rectangle-wide";
  exports.config = {
    Enabled: "always",
    KeepLabelSpace: true,
    IconType: "default",
    IconAlign: "left",
    BorderWidth: "1",
    BorderType: "solid",
    BorderColor: "#e73323",
  }; // a default configuration
  exports.import = []; // 3rd party dependencies
  exports.settings = ""; // HTML settings
  exports.css = `
		.CLASS > .AB_button { width: 100%; height: 36px; background-color: var(--ab-color); border: var(--ab-border); border-radius: var(--ab-radius); padding: 10px; }
		.CLASS > .AB_button { display: flex; justify-content: space-between; align-items: center; }
		.CLASS > .AB_button .icon i:hover { color: red; cursor: pointer; }
		.CLASS > .AB_button.selected.dragover { background-color: #ff6f70 !important; }
		.CLASS > .AB_button.dragover { background-color: #ff6f70 !important; }
		.CLASS > .AB_button.ab_disabled { background-color: #f0f0f0 !important; color: #a0a0a0 !important; }
		.CLASS.ab_hidden { opacity: 0.5; }
	`; // A custom CSS
  exports.type = "button";

  // Editor implementation
  exports.make = function (instance, config, element) {
    // instance for the editor

    // instance.app {Object}
    // instance.id {String}
    // instance.object {Object} --> {exports}
    // instance.element {jQuery}
    // instance.dom {HTMLElement}
    // instance.config {Object} === config

    element.append(`
			<div class="AB_button drop_disable">
				<div class="name">Button</div>
				<div class="icon">
					<i class="far fa-trash-alt exec" data-exec="common/object_remove" title="Remove object"></i>
				</div>
			</div>
		`);

    instance.on("destroy", function () {
      // removed from the editor
    });

    function configure() {
      // configuration is changed

      var el = element.find(".AB_button");
      var label = element.find("label");
      var name = el.find(".name");

      config.CtrlName && name.html(config.CtrlName + " - <b>Button</b>");
      config.ReadOnly ? el.aclass("ab_disabled") : el.rclass("ab_disabled");
      config.Hidden ? element.aclass("ab_hidden") : element.rclass("ab_hidden");
      config.NoLabel ? label.aclass("hidden") : label.rclass("hidden");
      config.Height && el.css("height", config.Height + "px");
      config.Width && el.css("width", config.Width + "%");
      config.Class && el.aclass(config.Class);
      // config.Font
      config.FontSize && name.css("font-size", config.FontSize);
      config.Bold
        ? name.css("font-weight", "bold")
        : name.css("font-weight", "normal");
      config.Italic
        ? name.css("font-style", "italic")
        : name.css("font-style", "normal");
      config.TextColor && name.css("color", config.TextColor);
      config.FillColor && el.css("background-color", config.FillColor);
      config.KeepLabelSpace
        ? element.css("margin-top", "17px")
        : element.css("margin-top", 0);

      if (config.IconAlign === "center") config.NoLabel = true;

      // console.log(config);
    }

    instance.on("configure", configure);
    configure();

    instance.translate = function () {
      if (!config.CtrlName) return [];
      return [
        {
          Name: config.CtrlName,
          LabelParams: config.LabelParams,
          Descr: config.Label,
        },
      ];
    };
  };

  exports.uninstall = function () {
    // do something
  };
});
