AppBuilder.register("dropdown", function (exports) {
  exports.group = "objects";
  exports.name = "Dropdown";
  exports.icon = "fas fa-caret-down";

  exports.author = "Total.js";
  exports.config = { CtrlName: "Dropdown", DisableSearch: false };
  exports.import = [];
  exports.css = ``; // css je v portálu /css/objects.css
  exports.settings = "";
  exports.type = "field";

  exports.make = function (instance, config, element) {
    var items = [];
    var scroller,
      icon,
      skipmouse = false,
      resultscount = 0,
      issearch = false,
      selectedindex = 0;
    var clssel = "selected";
    var Filter = {};
    var rendered = false;
    var itemsLoaded = () => {};
    var showDropdown = false;
    var icon = "";
    var image = "";
    var liHeight = "";
    var liFontSize = "";
    var ruler = instance.app.RuleEngine;

    if (config.IconType === "default")
      icon = config.Icon ? `<i class="far ${config.Icon}"></i>` : "";
    else if (config.IconType === "custom")
      image = config.CustomIcon
        ? `<img src="${config.ImageUrl}" class="img-responsive"/>`
        : "";

    element.append(`
			<label></label>
			<input type="text" readonly="readonly"/>
			<div class="floatingbox" data-id="dropdown_${instance.guid}">
				<div class="O_drop_container dropdownbox">
					<div class="dropdown_search">
					</div>
					<div class="scrollbar">
						<ul></ul>
					</div>
				</div>
			</div>
			<i class="far fa-angle-down"></i>
		`);

    element.aclass("formfield");

    var li =
      '<li data-value="{0}" data-search="{3}" data-label="{2}" data-index="{1}" style="height:{5};font-size:{6}">{4}{3}</li>';
    var searchbox =
      '<div class="O_searchbox"><i class="far fa-search"></i><input type="text" class="search_input" placeholder="Search..." /></div>';
    var ul = element.find("ul");
    var container = element.find(".O_drop_container");
    scroller = element.find(".scrollbar");
    scroller.css("height", "180px");
    scroller.css("overflow-y", "scroll");

    const equals = (val1, val2) =>
      val1 === val2 ||
      (typeof val1 === "string" &&
        typeof val2 === "string" &&
        val1.toUpperCase() === val2.toUpperCase());

    const getTextFor = (id, cb) => {
      if (!config.ItemsDataSource /* || !id*/) return cb("");

      var params = {
        AppName: instance.app.schema.name,
        Id: id,
        FldName: config.DataSourceField,
        Mandatory: config.Mandatory,
        Action: instance.form().state.mode,
        ...Filter,
      };

      DS.getAutocompleteData(
        config.ItemsDataSource,
        params,
        function (err, data) {
          if (err) return;
          cb(data.items && data.items[0]);
        }
      );
    };

    function redraw(cb) {
      ul.empty();

      if (config.CtrlFontSize && config.imagesize) {
        if (config.CtrlFontSize > config.imagesize) {
          liHeight = config.CtrlFontSize + 10 + "px";
        } else {
          liHeight = config.imagesize + 10 + "px";
        }

        liFontSize = config.CtrlFontSize + "px";
      } else if (config.imagesize) {
        liHeight = config.imagesize + 10 + "px";
      }

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var image;

        if (item.image !== null)
          image =
            '<img src="{0}" style="border-radius:{1};height:{2}px"/>'.format(
              item.image,
              config.imageround ? "50%" : "0",
              config.imagesize
            );

        if (equals(item.id, instance.state.value)) dropdown.val(item.label);

        ul.append(
          li.format(
            item.id,
            i,
            item.label,
            item.label,
            image,
            liHeight,
            liFontSize
          )
        );
      }
      rendered = true;
      cb && cb();
      showDropdown && dropdown_click();
    }

    var label = element.find("label");
    var dropdown = element.find("input");
    var cls = ".AB_dropdown_";

    instance.focus = () => {
      var can = !element.is(":hidden") && !instance.state.disabled;
      can && dropdown.focus();
      return can;
    };

    if (config.CtrlFontSize) {
      dropdown.css("font-size", config.CtrlFontSize);
      dropdown.css("line-height", config.CtrlFontSize + "px");
      element
        .find(".fa-angle-down")
        .css("line-height", config.CtrlFontSize + "px");
    }

    config.CtrlFontSize > 18 && dropdown.css("padding", "2px 26px 2px 6px");
    config.CtrlBold
      ? dropdown.css("font-weight", "bold")
      : dropdown.css("font-weight", "normal");
    config.CtrlItalic
      ? dropdown.css("font-style", "italic")
      : dropdown.css("font-style", "normal");
    config.CtrlTextColor && dropdown.css("color", config.CtrlTextColor);
    config.LabelFontSize && label.css("font-size", config.LabelFontSize);
    config.LabelBold
      ? label.css("font-weight", "bold")
      : label.css("font-weight", "normal");
    config.LabelItalic
      ? label.css("font-style", "italic")
      : label.css("font-style", "normal");
    config.LabelTextColor && label.css("color", config.LabelTextColor);
    config.CustomClass &&
      element
        .parent()
        .rclass2(cls + "custom_")
        .aclass(cls + "custom_" + config.CustomClass);

    if (config.IconAlign === "left") element.aclass("align-icon-left");

    if (!config.DisableSearch)
      container.find(".dropdown_search").append(searchbox);

    const toggleEnabled = (is) => {
      dropdown.attr("disabled", !is);
      instance.setState("disabled", !is);
    };

    if (config.ReadOnly) toggleEnabled(false);

    if (config.UpdateOnNewOnly)
      instance.watchState(instance.form().id + ":mode", function (value) {
        var is = value === "new" || value === "copy";
        toggleEnabled(is);
      });

    var searchinput = container.find(".search_input");

    function search(value) {
      ul.find("li").rclass("selected");
      value.toLowerCase();
      value = value.split(" ");
      var arr = ul.find("li");

      if (!value.length) scroller[0].scrollTop = 0;

      for (var i = 0; i < arr.length; i++) {
        var el = $(arr[i]);
        var val = el.attrd("search").toLowerCase();
        var is = false;

        for (var j = 0; j < value.length; j++) {
          if (val.indexOf(value[j]) === -1) {
            is = true;
            break;
          }
        }

        el.tclass("hidden", is);

        selectedindex = 0;
        setTimeout(function () {
          ul.find("li:visible:first").aclass("selected");
        }, 200);
      }
    }

    function move() {
      var counter = 0;
      var li = container.find("li:not(.hidden)");
      var last = -1;
      var hli = 0;
      var lastselected = 0;
      var was = false;
      var plus = 0;

      for (var i = 0; i < li.length; i++) {
        var el = $(li[i]);

        var is = selectedindex === counter;
        el.tclass("selected", is);

        if (is) {
          hli = el.innerHeight() + 2 || 30;
          was = true;
          var t = hli * (counter || 1);
          scroller[0].scrollTop = t - hli;
        }

        counter++;
        last = i;
        lastselected++;
      }

      if (!was && last >= 0) {
        selectedindex = lastselected;
        li.eq(last).aclass("selected");
      }

      skipmouseforce();
    }

    function keydown(e) {
      if (!e) return;

      var c = e.which;

      var current = container.find("." + clssel);
      resultscount = ul.find("li").length;

      switch (c) {
        case 13:
          var value = items[+current.attrd("index")];
          instance.updateValue(value.id);
          SETTER("floatingbox/hide");
          dropdown.focus();
          break;
        case 40: // down
          if (container.parent().hclass("floatingbox-visible")) {
            selectedindex++;
            if (selectedindex >= resultscount) selectedindex = resultscount;
            move();
          } else {
            dropdown_click();
          }
          break;
        case 38: // up
          selectedindex--;
          if (selectedindex < 0) selectedindex = 0;
          move();
          break;
        case 46: // DELETE
          if (items && items.length) {
            var item = items[0];
            instance.updateValue(value.id);
          } else if (itemsLoading) {
            itemsLoaded = () => {
              var item = items[0];
              instance.updateValue(value.id);

              itemsLoaded = () => {};
            };
          } else {
            LoadDropdown(() => {
              var item = items[0];
              instance.updateValue(value.id);
            });
          }
          break;
        case 27: // ESC
          SETTER("floatingbox/hide");
          dropdown.focus();
          break;
        case 9: // TAB
          SETTER("floatingbox/hide", true);
          break;
      }

      if (c !== 9) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    dropdown.on("keydown", keydown);

    var skipmousedelay;
    var skipmousefalse = function () {
      skipmousedelay = null;
      skipmouse = false;
    };

    var skipmouseforce = function () {
      skipmouse = true;
      skipmousedelay && clearTimeout(skipmousedelay);
      skipmousedelay = setTimeout(skipmousefalse, 500);
    };

    searchinput.on("keyup", function (e) {
      var c = e.which;

      if (c === 38 || c === 40 || c === 13 || c === 27) {
        keydown(e);
      } else if (c === 46) {
        searchinput.val("");
        search(searchinput.val());
      } else {
        search(searchinput.val());
      }

      if (c !== 9) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    searchinput.on("keydown", function (e) {
      var c = e.which;

      if (c === 9) {
        SETTER("floatingbox/hide");
        dropdown.focus();
      }
    });

    if (config.Mandatory) label.aclass("required");
    if (config.NoLabel) {
      label.remove();
      element.find("i").css("top", "16px");
    } else label.html(instance.translate(config.CtrlName));

    if (config.ItemsSource === "manual") {
      items = [];
      var arr = (config.Items || "").split(",");
      arr.forEach((o) => {
        var [id, label] = o.split("|");
        items.push({ id, label: label || id });
      });
      redraw();
    }

    container.on("click", "li", function (e) {
      var el = $(this);
      var val = el.attrd("value");
      if (config.DataType === "number") val = Number(val);
      dropdown.val(el.attrd("label"));
      SETTER("floatingbox/hide");

      if (val === instance.state.value) return;
      dropdown.blur();
      instance.updateValue(val);

      dropdown.focus();
    });

    function dropdown_click() {
      if (instance.state.disabled) return;

      var maxwidth = config.ListWidth
        ? config.ListWidth
        : dropdown.outerWidth();
      container.css({ "max-width": maxwidth + "px" });
      config.ListWidth && container.css({ width: maxwidth + "px" });

      container.parent().css("width", maxwidth + "px");

      showDropdown = false;
      var opt = {};
      // opt.x = window.innerWidth - element.offset().left < 600 ? opt.x = window.innerWidth - 620 : element.offset().left;
      opt.x = element.offset().left;
      opt.y = element.offset().top + element.height();
      opt.offsetY = 8;
      opt.offsetX = 8;
      opt.position = "bottom";
      opt.id = "dropdown_" + instance.guid;
      opt.hide = () => instance.triggerEvent("leave");

      SETTER("floatingbox/show", opt);

      searchinput.val("");
      ul.find("li").rclass("hidden").rclass("selected");
      ul.find("li:first-child").aclass("selected");
      selectedindex = 0;
      scroller[0].scrollTop = 0;

      if (!config.DisableSearch) {
        setTimeout(function () {
          searchinput.focus();
        }, 800);
      }

      instance.triggerEvent("enter");
    }

    dropdown.on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!rendered) {
        showDropdown = true;
        loadDropdown();
      } else dropdown_click();
    });

    element.on("click", (e) => {
      dropdown.click();

      e.preventDefault();
      e.stopPropagation();
    });

    dropdown.on("focus", (e) => {
      if (!rendered) loadDropdown();
      keydown();
    });

    container.on("mouseenter mouseleave", "li", function (e) {
      if (!issearch && !skipmouse) {
        container.find("li.selected").rclass("selected");
        $(this).aclass("selected");
        var arr = container.find("li:visible");
        for (var i = 0; i < arr.length; i++) {
          if ($(arr[i]).hclass("selected")) {
            selectedindex = i;
            break;
          }
        }
      }

      e.preventDefault();
      e.stopPropagation();
    });

    instance.setState("hidden", element.is(":hidden"));
    instance.on("visibility", function (conf) {
      instance.setState("hidden", element.is(":hidden"));
    });

    instance.on("ready", function () {
      if (
        config.ItemsSource === "datasource" &&
        config.ItemsDataSource &&
        config.ItemsDataSourceFilter
      )
        instance.filters(config.ItemsDataSourceFilter, function (filter) {
          Filter = filter;
          instance.formdata();
        });
      else instance.formdata();

      if (config.Rules && config.Rules.events)
        ruler.addEvents(config.Rules.events, instance);
    });

    instance.on("state", function (name, val) {
      switch (name) {
        case "value":
          if (!items.length) {
            if (!val) dropdown.val("[blank]");
            else
              getTextFor(val, (data) => {
                dropdown.val((data && data.label) || val || "[blank]");
              });
          } else {
            var text = "[blank]";
            var item = (items || []).find((t) => equals(t.id, val));
            if (item && item.label) text = item.label;
            dropdown.val(text || "[blank]");
          }
          break;
      }
    });

    instance.validate = function () {
      return !(config.Mandatory && !instance.state.value);
    };

    var itemsLoading = false;
    function loadDropdown(cb) {
      if (itemsLoading) return;
      itemsLoading = true;
      var params = {
        AppName: instance.app.schema.name,
        FldName: config.DataSourceField,
        Mandatory: config.Mandatory,
        Action: instance.form().state.mode,
        ...Filter,
      };

      DS.getAutocompleteData(
        config.ItemsDataSource,
        params,
        function (err, data) {
          if (err) return;
          if (!config.DataType && data.items[0])
            config.DataType = typeof data.items[0].id;

          config.imageround = data.imageround === "true" ? true : false;
          config.imagesize = +data.imagesize;
          items = data.items;
          items.quicksort("sortId");
          redraw(cb);
          itemsLoading = false;
          itemsLoaded();
        }
      );
    }
  };
});
