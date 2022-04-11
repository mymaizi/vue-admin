(function () {
  try {
    if (window.parent.dlg !== undefined) {
      let win = window.parent;
      window.dlg = getDialog(win);
      window.msg = getMessageBox(win);
      return;
    }
  } catch (ex) {
    ;;; console.log("global", ex);
  }
  let _dialogContainer = [];
  function getMessageBox(win) {
    return {
      pop: function (s, t) {
        win.layer.msg(s, t);
      },
      alert: function (s, options) {
        win.msg.alert(s, options);
      },
      confirm: function (s, options) {
        win.msg.confirm(s, options);
      }
    }
  }
  function getDialog(win) {
    return {
      open: function (e) {
        win.dlg.open(e);
      },
      close: function (data) {
        win.dlg.close(data);
      },
      fetchArgs: function () {
        return win.dlg.fetchArgs();
      }
    }
  }
  function iconConvert(icoName) {
    //icon:0info, 1ok, 2err, 3ask, 4lock, 5cry, 6smile
    icoName = icoName || 'info';
    var icoInt = 0;
    switch (icoName.toLowerCase()) {
      case "ok":
        icoInt = 1;
        break;
      case "err":
        icoInt = 2;
        break;
      case "ask":
        icoInt = 3;
        break;
      case "lock":
        icoInt = 4;
        break;
      case "cry":
        icoInt = 5;
        break;
      case "smile":
        icoInt = 6;
        break;
    }
    return icoInt;
  }
  function animConvert(animName) {
    //anim:0淡出, 1从天而降, 2底部出现, 3左侧滑入, 4翻转, 5跟0差不多效果, 6振动，
    animName = animName || 'fade';
    var animInt = 0;
    switch (animName.toLowerCase()) {
      case "slide-top":
        animInt = 1;
        break;
      case "slide-bottom":
        animInt = 2;
        break;
      case "slide-left":
        animInt = 3;
        break;
      case "spin":
        animInt = 4;
        break;
      case "vibrate":
        animInt = 6;
        break;
    }
    return animInt;
  }

  window.dlg = {
    open(e) {
      if (e.url === undefined || e.url === "") {
        layer.msg('链接地址无效', { time: 1000 });
        return;
      }
      e.max = e.max === undefined ? false : e.max;
      e.resize = e.resize === undefined ? false : e.resize;
      e.scroll = e.scroll || 'yes';
      e.width = e.width || 800;
      e.height = e.height || 600;
      e.title = e.title || '新窗口' + (_dialogContainer.length + 1);
      _dialogContainer.push({
        idx: 0,
        callback: e.callback,
        owndata: e.data,
        sondata: undefined
      });
      layer.open({
        type: 2, resize: e.resize, maxmin: e.max, title: e.title,
        content: [e.url, e.scroll],
        area: [e.width + 'px', e.height + 'px'],
        success: function (e, i) {
          _dialogContainer[_dialogContainer.length - 1].idx = i;
        },
        end: function () {
          let dialog = _dialogContainer[_dialogContainer.length - 1];
          if (dialog.callback) {
            dialog.callback(_dialogContainer[_dialogContainer.length - 1].sondata)
          }
          _dialogContainer.pop();
        }
      });
    },
    close(data) {
      _dialogContainer[_dialogContainer.length - 1].sondata = data;
      layer.close(_dialogContainer[_dialogContainer.length - 1].idx);
    },
    fetchArgs() {
      return _dialogContainer[_dialogContainer.length - 1].owndata;
    },
  }
  window.msg = {
    pop(s, t) {
      t = t || 2000;
      if (typeof (t) !== 'number') t = 2000;
      layer.msg(s, { time: t });
    },
    alert(s, options) {
      //icon:0info, 1ok, 2err, 3ask, 4lock, 5cry, 6smile
      //anim:0淡出, 1从天而降, 2底部出现, 3左侧滑入, 4翻转, 5跟0差不多效果, 6振动，
      options = options || {};
      options.btn = [];
      options.btn.push(options.btntxt || "确定");
      options.title = options.title || "提示";
      options.icon = IconConvert(options.icon);
      options.anim = AnimConvert(options.anim);
      layer.alert(s, options, (i, e) => {
        layer.close(i);
      });
    },
    confirm(s, options) {
      let btns = ['确定', '取消'];
      options.btn = options.btn || 'CK';
      options.title = options.title || '提醒';
      if (options.btn !== "CK") btns = ['是(Y)', '否(N)'];
      layer.confirm(s, {
        btn: btns, title: options.title, icon: 3
      }, (i, e) => {
        if (options.tcback) {
          options.tcback();
        }
        layer.close(i);
      }, (i, e) => {
        if (options.fcback) {
          options.fcback();
        }
        layer.close(i);
      });
    }
  };
})();
window.my = {
  setStorage(key, value, type = 'session') {
    switch (type) {
      case "session":
        sessionStorage.setItem(key, value)
        break;
      case "local":
        localStorage.setItem(key, value)
        break;
    }
  },
  getStorage(key, type = 'session') {
    let value = "";
    switch (type) {
      case "session":
        value = sessionStorage.getItem(key)
        break;
      case "local":
        value = localStorage.getItem(key)
        break;
    }
    return value;
  },
  getTree(data, pid, ids = "") {
    return data.filter(item => {
      return item.pid == pid
    }).map(item => {
      let _ids = `${ids}${ids == "" ? "" : ","}${item.id}`;
      item = Object.assign({}, item, { children: []/**, ids: _ids */ })
      if (item.children) {
        item.children = my.getTree(data, item.id, _ids)
      }
      return item
    })
  },
  resetiframeHeight(iframeId, height = 0) {
    var ifm = document.getElementById(iframeId);
    if (ifm) {
      ifm.height = document.documentElement.clientHeight - height;
    }
  }
}