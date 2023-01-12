AppBuilder.register("textarea", function (exports) {
  exports.group = "objects";
  exports.name = "Textarea";
  exports.author = "Total.js"; // Author
  exports.icon = "far fa-credit-card-blank";
  exports.config = { LabelSpace: 2, Rows: 4, WordWrap: false };
  exports.import = []; // 3rd party dependencies
  exports.settings = ""; // HTML settings
  exports.css = `
		.CLASS > .AB_textarea { width: 100%; height: 72px; background-color: var(--ab-color); border: var(--ab-border); padding: 10px; border-radius: var(--ab-radius); }
		.CLASS > .AB_textarea { display: flex; justify-content: space-between; align-items: center; }
		.CLASS > .AB_textarea .icon i:hover { color: red; cursor: pointer; }
		.CLASS > .AB_textarea.selected.dragover { background-color: #ff6f70 !important; }
		.CLASS > .AB_textarea.dragover { background-color: #ff6f70 !important; }
		.CLASS.ab_hidden { opacity: 0.5; }
		.CLASS > .AB_textarea .ab_name.blurred { color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5);}
		.CLASS > .ab_label.ab_required { position: relative; left: 10px; font-weight: bold; }
		.CLASS > .ab_label.ab_required:before { content: '*'; position: absolute; left: -10px; font-size: 15px; top: -2px; color: red; }
		.CLASS > .AB_textarea.ab_disabled { background-color: #f0f0f0 !important; color: #a0a0a0 !important; }`;

  exports.states = [
    { id: "value", name: "Value", type: "any" },
    { id: "valid", name: "Valid", type: "boolean", readonly: true },
    { id: "disabled", name: "Disabled", default: false, type: "boolean" },
    {
      id: "modified",
      name: "Modified",
      default: false,
      type: "boolean",
      readonly: true,
    },
    { id: "hidden", name: "Hidden", default: false, type: "boolean" },
  ];
  exports.events = [
    { id: "enter", name: "Enter" },
    { id: "leave", name: "Leave" },
    { id: "keypress", name: "Keypress" },
  ];

  exports.focusable = true;
  exports.type = "field";

  exports.make = function (instance, config, element) {
    element.append(`
			<span class="ab_label">
				<span class="label_name">Label</span>
				<span class="label_trans">---</span>
			</span>
			<div class="AB_textarea drop_disable">
				<div class="ab_name">Textarea</div>
				<div class="icon">
					<i class="far fa-trash-alt exec" data-exec="common/object_remove" data-prevent="true" title="Remove object"></i>
				</div>
			</div>
		`);

    var el = element.find(".AB_textarea");
    var label = element.find(".ab_label");
    var name = el.find(".ab_name");
    var cls = "AB_textarea_";

    instance.on("configure", function () {
      // configuration is changed

      config.Label = config.Label ? config.Label : config.CtrlName;
      config.Label && label.find(".label_name").html(config.Label);
      config.CtrlName && name.html(config.CtrlName + " <b>- Textarea</b>");
      config.Mandatory
        ? label.aclass("ab_required")
        : label.rclass("ab_required");
      config.ReadOnly ? el.aclass("ab_disabled") : el.rclass("ab_disabled");
      config.Hidden ? element.aclass("ab_hidden") : element.rclass("ab_hidden");
      config.Blurred ? name.aclass("blurred") : name.rclass("blurred");

      config.LabelParams && label.find(".label_trans").html(config.LabelParams);

      config.NoLabel
        ? label.css("visibility", "hidden")
        : label.css("visibility", "visible");

      if (config.NoLabel)
        config.LabelSpace ? label.rclass("hidden") : label.aclass("hidden");
      else label.rclass("hidden");

      //config.Height !== '' ? el.css('height', config.Height + 'px') : el.css('height', '36px');
      if (config.Width) {
        element.aclass("float-left");
        element.css("width", config.Width + "px");
      } else el.css("width", "100%");

      config.CustomClass &&
        el
          .parent()
          .rclass2(cls + "custom_")
          .aclass(cls + "custom_" + config.CustomClass);
      config.CtrlFont && element.aclass("O_font_" + config.CtrlFont);
      config.FontSize && name.css("font-size", config.FontSize);
      config.Bold
        ? name.css("font-weight", "bold")
        : name.css("font-weight", "normal");
      config.Italic
        ? name.css("font-style", "italic")
        : name.css("font-style", "normal");
      config.TextColor && name.css("color", config.TextColor);
      config.FillColor !== ""
        ? el.css("background-color", config.FillColor)
        : el.css("background-color", "#fff");

      config.LabelFontSize && label.css("font-size", config.LabelFontSize);
      config.LabelBold
        ? label.css("font-weight", "bold")
        : label.css("font-weight", "normal");
      config.LabelItalic
        ? label.css("font-style", "italic")
        : label.css("font-style", "normal");
      config.LabelTextColor && label.css("color", config.LabelTextColor);

      if (!config.DataFormat && instance.form().formfields) {
        config.DataFormat = instance
          .form()
          .formfields.findItem("FieldName", config.CtrlName);
      }

      if (config.imported) {
        setTimeout(function () {
          var field = instance
            .form()
            .formfields.findItem("name", config.CtrlName);
          if (field) {
            config.DataSource = instance.formdata();
            config.DataSourceField = field.name;
          }
        }, 100);
        config.imported = false;
      } else {
        config.DataSource = instance.formdata();
      }
    });

    instance.emit("configure");

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
});
