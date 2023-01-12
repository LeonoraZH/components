AppBuilder.register("textarea", function (exports) {
  exports.group = "objects";
  exports.name = "Textarea";
  exports.author = "Total.js"; // Author
  exports.icon = "far fa-credit-card-blank";
  exports.config = {
    CtrlName: "Input",
    ReadOnly: false,
    Hidden: false,
    Blurred: false,
    UpdateOnNewOnly: false,
    LabelParams: false,
    NoLabel: false,
    LabelSpace: 1,
    Rows: 4,
  }; // a default configuration
  exports.import = []; // 3rd party dependencies
  exports.settings = ""; // HTML settings
  exports.css = ``;
  exports.type = "field";

  exports.make = function (instance, config, element) {
    element.aclass("formfield");

    config.Height = config.Height || "4";

    var height = "";
    if (config.Height.includes("%") || config.Height.includes("px")) {
      element.css("height", config.Height);
      if (config.Height.includes("%"))
        height = `style="height:calc(${config.Height}${
          config.NoLabel ? " - 23px" : ""
        })"`;
      else height = `style="height:${config.Height}"`;
    } else height = `rows="${config.Height || "4"}"`;

    element.append(`
			<label>Textarea label</label>
			<textarea ${height}></textarea>
		`);

    var label = element.find("label");
    var textarea = element.find("textarea");
    // var maskInput = element.find('.mask-textarea')
    var cls = "AB_textarea_";
    var formdata;
    var timeout;

    const ruler = instance.app.RuleEngine;
    textarea.on("focus", () => ruler.run(instance.id + "-enter"));
    textarea.on("blur", () => ruler.run(instance.id + "-leave"));

    instance.focus = () => {
      var can = !element.is(":hidden") && !instance.state.disabled;
      can && textarea.focus().select();
      return can;
    };

    config.Label = instance.translate(config.CtrlName);

    config.Label && label.html(config.Label);
    config.NoLabel && label.aclass("novisible");

    if (config.NoLabel)
      config.LabelSpace ? label.rclass("hidden") : label.aclass("hidden");
    else label.rclass("hidden");

    if (config.Width) {
      element.aclass("float-left");
      element.css("width", config.Width + "px");
    }

    config.Mandatory && label.aclass("required");
    config.Value && textarea.val(config.Value);
    config.Hidden && element.aclass("el_hidden");
    config.Blurred && textarea.aclass("el_blured");

    config.CustomClass &&
      textarea
        .parent()
        .rclass2(cls + "custom_")
        .aclass(cls + "custom_" + config.CustomClass);

    //config.Height && textarea.css('height', config.Height + 'px');
    config.FontSize && textarea.css("font-size", config.FontSize);
    config.Italic && textarea.css("font-style", "italic");
    config.Bold && textarea.css("font-weight", "bold");
    config.TextColor && textarea.css("color", config.TextColor);

    config.CtrlFont && element.aclass("O_font_" + config.CtrlFont);
    config.LabelFontSize && label.css("font-size", config.LabelFontSize);
    config.LabelBold && label.css("font-weight", "bold");
    config.LabelItalic && label.css("font-style", "italic");
    config.LabelTextColor && label.css("color", config.LabelTextColor);

    //console.log(config);

    config.ScrollbarV && textarea.css("overflow-y", "hidden");
    config.ScrollbarH && textarea.css("overflow-x", "hidden");
    config.WordWrap && textarea.css("white-space", "normal");

    const toggleEnabled = (is) => {
      textarea.attr("disabled", !is);
      instance.setState("disabled", !is);
    };

    if (config.ReadOnly) toggleEnabled(false);

    if (config.UpdateOnNewOnly)
      instance.watchState(instance.form().id + ":mode", function (value) {
        var is = value === "new" || value === "copy";
        toggleEnabled(is);
      });

    const isValid = (val) => {
      // if not mandatory and no value then no need to validate
      if (!config.Mandatory && (val == undefined || val == null || val == ""))
        return true;

      // validate even if not mandatory

      /*switch (config.DataType) {
				case 'number':
					var { MinValue, MaxValue } = config;
					return Validators.number(val, { MinValue, MaxValue });
				  //  return val < (MaxValue).format(2) && val > (MinValue).format(2);
				case 'string':
					var { MinLength, MaxLength, StringType } = config;
					return Validators.string(val, { MinLength, MaxLength, StringType });
				case 'date':
				case 'time':
				case 'datetime':
					return Validators.datetime(val, config.DataType);
				case 'email':
					return Validators.email(val);
			};*/
      return true;
    };

    var validate = () => {
      //console.log(config.DataSourceField, instance.state.valid);

      return instance.state.valid;
    };

    textarea.on("input", (e) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => onInput(e), 300); // prevent update after every keypress
    });

    function onInput(e) {
      var val = e.target.value;
      if (instance.state.value === val) return;
      formdata &&
        formdata.update(
          (value) => {
            instance.deepSet(value, config.DataSourceField, val);
            return value;
          },
          null,
          config.DataSourceField
        );
    }

    instance.on("ready", function () {
      // instance.watch uses config.DataSource and config.DataSourceField
      formdata = instance.watch(
        config,
        (data, reset, prop) => {
          var val = data[config.DataSourceField];
          if (val === instance.state.value) return;

          reset && instance.reset(val);
          instance.setState("value", val);
          textarea.val(val);
          var valid = isValid(val);
          !valid && console.log("INVALID::" + config.DataSourceField, val);
          instance.setState("valid", valid);
        },
        null,
        validate
      );
    });
  };
});
