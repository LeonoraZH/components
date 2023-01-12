AppBuilder.register("button", function (exports) {
  exports.group = "objects";
  exports.name = "Button";
  exports.author = "Total.js"; // Author
  exports.icon = "fas fa-rectangle-wide";
  exports.config = {}; // a default configuration
  exports.import = []; // 3rd party dependencies
  exports.settings = ""; // HTML settings
  exports.css = "";
  exports.type = "button";

  // Editor implementation
  exports.make = function (instance, config, element) {
    !config.NoLabel &&
      config.Label &&
      (config.Label = instance.translate(config.Label));
    var label = config.NoLabel ? "" : config.Label || "";
    var icon = "";
    var image = "";
    if (config.IconType === "default")
      icon = config.Icon
        ? `<i class="far ${config.Icon} ${
            config.Label && !config.NoLabel ? "mr5" : ""
          }"></i>`
        : "";
    else if (config.IconType === "custom")
      image = config.CustomIcon
        ? `<img src="${config.ImageUrl}" class=""/>`
        : "";

    config.KeepLabelSpace && element.aclass("label-margin");

    if (!icon && !label) label = " ";

    element.append(`
			<button class="" title="${config.Label}">${
      image || icon
    }<span>${label}</span></div>
		`);

    var button = element.find("button");

    config.ReadOnly
      ? button.attr("disabled", true)
      : button.attr("disabled", false);
    config.Hidden ? element.aclass("ab_hidden") : element.rclass("ab_hidden");
    config.Height && button.css("height", config.Height + "px");
    config.Class && button.aclass(config.Class);
    config.Padding && element.css("padding", config.Padding);
    config.FontSize && button.css("font-size", config.FontSize);
    config.Bold
      ? button.css("font-weight", "bold")
      : button.css("font-weight", "normal");
    config.Italic
      ? button.css("font-style", "italic")
      : button.css("font-style", "normal");
    config.TextColor && button.css("color", config.TextColor);
    config.FillColor && button.css("background-color", config.FillColor);
    config.Width !== "full" && element.aclass("align-" + config.Align);
    config.Height && button.css("height", config.Height + "px");
    config.FillColor === "" && button.css("background-color", "transparent");
    button.aclass("btn-" + config.Size);
    config.PresetStyle &&
      config.PresetStyle !== "none" &&
      button.aclass("btn-" + config.PresetStyle);

    if (config.Width === "custom") {
      // element.aclass('float-left');
      button.css("width", config.WidthCustom + "px");
    } else if (config.Width === "full") button.aclass("btn-block");

    // Button icon/label alignments
    if (config.IconAlign === "left" && config.TextAlign === "right") {
      button.aclass("align-icon-left align-text-right");
    }

    if (config.IconAlign === "right" && config.TextAlign === "left") {
      button.aclass("align-icon-right align-text-left");
    }

    if (
      config.IconAlign === "centerRight" ||
      config.IconAlign === "centerLeft"
    ) {
      config.TextAlign = "center";

      if (config.IconAlign === "centerRight")
        button.aclass("align-icon-center-right");

      if (config.IconAlign === "centerLeft")
        button.aclass("align-icon-center-left");
    }

    if (config.IconAlign === "left" && config.TextAlign === "center") {
      button.aclass("align-icon-left align-text-center");
    }

    if (config.IconAlign === "right" && config.TextAlign === "center") {
      button.aclass("align-icon-right align-text-center");
    }

    if (config.IconAlign === "center") {
      button.aclass("align-icon-center");
    }

    if (config.IconAlign === "left" && config.TextAlign === "left") {
      button.aclass("align-icon-left align-text-left");
    }

    if (config.IconAlign === "right" && config.TextAlign === "right") {
      button.aclass("align-icon-right align-text-right");
    }
    // Button icon/label alignments end

    if (config.Border)
      button.css(
        "border",
        `${config.BorderWidth === "" ? "1" : config.BorderWidth}px ${
          config.BorderType
        } ${config.BorderColor}`
      );

    var val = config.DataSourceValue || "";
    var type = config.DataSourceValueType || "string";
    switch (type) {
      case "string":
        val = "" + val;
        break;
      case "number":
        val = isNaN(val) ? 0 : +val;
        break;
      case "boolean":
        val = val === "true" ? true : false;
        break;
      case "date":
        try {
          val = new Date(val);
        } catch (e) {}
        try {
          if (!val) val = val.parseDate();
        } catch (e) {}
        if (!val) val = new Date();
        break;
    }

    button.on("click", () => {
      if (config.Type === "trigger" && config.Trigger) {
        var args = {};
        if (config.Trigger === "PORTAL_OpenProgram") {
          args.AppName = config.Program;
          args.Arguments = instance.getArguments(config.ProgramArguments);
          args.ParentAppId = instance.app.id;
          if (config.ProgramAsModal) args.Modal = true;
          args.ModalOptions = { width: 100, height: 100 };
          if (config.ModalWidth) args.ModalOptions.width = config.ModalWidth;
          if (config.ModalHeight) args.ModalOptions.height = config.ModalHeight;
        }
        instance.trigger(config.Trigger, args);
      } else if (config.Type === "set" && config.DataSource) {
        instance.getDatasource(config.DataSource, (ds) => {
          if (config.DataSourceProperty)
            ds.updateProp(config.DataSourceProperty, val);
          else ds.set(val);
        });
      } else if (config.Type === "endpoint" && config.Endpoint) {
        var data = instance.getArguments(config.Data);
        console.log("ENDPOINT", data);
        var form = instance.form();
        var fields = [];
        if (form) {
          fields = form
            .family()
            .filter(
              (f) =>
                f.object.type === "field" &&
                f.config.DataSource === form.id + "_data"
            )
            .map((f) => ({
              FieldId: f.id,
              FieldName: f.config.CtrlName,
              PropertyName: f.config.DataSourceField,
              PropertyValue: f.state.value,
            }));
        }
        console.log("FIELDS", fields);
        DS.postData(
          config.Endpoint,
          data,
          {} /*querystring params*/,
          function (err, data) {
            console.log("Button Clicked, got data", err, data);
            if (err) {
              return;
            }

            // process ttRules if provided
            instance.ttRules(data.ttRules);
          }
        );
      }
    });

    // rewrite this using RuleEngine
    /*if (config.Enabled && config.Enabled !== 'always')
			instance.watch(config.Enabled, (data, reset, prop, isstate, val) => {
				console.log('watcher', val, isstate, prop, data);
				button.attr('disabled', isstate ? !(val ? data[prop] === val : data[prop]) : !!data);
			});

		if (config.Visible && config.Visible !== 'always')
			instance.watch(config.Visible, (data, reset, prop, isstate, val) => { // val is "new" in @state_3_mode_new
				element.tclass('hidden', isstate ? !(val ? data[prop] === val : data[prop]) : !!data);
			});*/
  };
});
