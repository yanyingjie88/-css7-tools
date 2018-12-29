module.exports = {
  timeFormat(time) {
    let hours, minutes, seconds;
    let intTime = Math.floor(time);
    hours = Math.floor(intTime / 3600);
    minutes = Math.floor((intTime / 60) % 60);
    seconds = intTime % 60;
    return {
      hours: hours,
      minutes: minutes > 9 ? minutes : "0" + minutes,
      seconds: seconds > 9 ? seconds : "0" + seconds
    };
  },

  getSizeByByte(size) {
    if (typeof size != "number") {
      throw Error("Argument Must Be A Number");
    }
    const KBUNIT = "KB",
      MBUNIT = "MB",
      UNITSIZE = 1024;
    let kb = size / UNITSIZE,
      mb = size / (UNITSIZE * UNITSIZE);
    return mb > 0.01
      ? parseFloat(mb).toFixed(2) + MBUNIT
      : parseFloat(kb).toFixed(2) + KBUNIT;
    //return parseFloat(mb).toFixed(2) + MBUNIT;
  },

  cutString(str = "", len, type = "...") {
    if (str.length > len) {
      return str.slice(0, len) + type;
    } else return str;
  },

  toFixed(num = 0, len = 0) {
    let result = "",
      level = 3,
      [tempNum, tail] = `${num}`.split("."),
      showText = false;
    if (num >= 1000000) {
      showText = true;
      let tempCount = (num / 10000).toFixed(2);
      [tempNum, tail] = `${tempCount}`.split(".");
    }
    const padEnd = (str, len = 2, padString = 0) => {
      str = str.slice(0, len);
      while (str.length < len) {
        str += padString;
      }
      return str;
    };
    if (!len) {
      tail = tail ? padEnd(tail) : "00";
      tempNum = (tempNum || 0).toString();
      while (tempNum.length > level) {
        result = "," + tempNum.slice(-level) + result;
        tempNum = tempNum.slice(0, tempNum.length - level);
      }
      if (tempNum) {
        result = tempNum + result;
      }
      return `${result}.${tail}${showText ? "万" : ""}`;
    } else {
      if (typeof num !== "number") {
        num = Number(num);
      }
      return num.toFixed(len);
    }
  },
  
  client() {
    const u = navigator.userAgent;
    return {
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      ie: window.ActiveXObject || "ActiveXObject" in window,
      wechat: u.indexOf("MicroMessenger") > -1 //是否微信 （2015-01-22新增）
    };
  },

  greetings() {
    const H = new Date().getHours();
    if (H <= 6) {
      return "凌晨了！";
    } else if (H <= 8) {
      return "早上好！";
    } else if (H <= 11) {
      return "上午好！";
    } else if (H <= 14) {
      return "中午好！";
    } else if (H <= 18) {
      return "下午好！";
    } else if (H <= 24) {
      return "晚上好！";
    }
  },

  getDate(time) {
    const d = time ? new Date(time) : new Date();
    const year = d.getFullYear(),
      month = d.getMonth(),
      day = d.getDate(),
      week = d.getDay(),
      hours = d.getHours(),
      minutes = d.getMinutes(),
      seconds = d.getSeconds(),
      ms = d.getMilliseconds();
    return {
      Y: year,
      M: month,
      W: week,
      D: day,
      h: hours,
      min: minutes,
      s: seconds,
      ms: ms
    };
  },

  date2string(date, gap = "-", time = false) {
    if (date) {
      let tempObj = Utils.getDate(date);
      for (let key in tempObj) {
        if (key == "M") {
          tempObj[key]++;
        }
        tempObj[key] = `${tempObj[key]}`.padStart(2, "0");
      }
      const { Y, M, D, h, min, s } = tempObj;
      const Dd = `${Y}${gap}${M}${gap}${D}`,
        T = `${h}:${min}:${s}`;
      return time ? `${Dd} ${T}` : T;
    }
    return "--";
  },

  randArr(max, min, num) {
    let arr = [];
    while (arr.length < num) {
      arr.push(Math.round(Math.random() * (max - min) + min));
    }
    return arr;
  },

  searchAssign(origin = {}, values = {}) {
    if (Object.keys(values).length) {
      for (let key in values) {
        if (isNotEmpty(values[key]) && isNotEmpty(String(values[key]).trim())) {
          origin[key] = values[key];
        } else {
          delete origin[key];
        }
      }
    } else {
      for (let key in origin) {
        if (!isNotEmpty(origin[key])) {
          delete origin[key];
        }
      }
    }
    return origin;
  },

  getFileName: (fileName = "") => {
    const index = fileName.lastIndexOf(".");
    if (index > 0) {
      fileName = fileName.toLowerCase();
      return fileName.substring(0, index).trim();
    }
    return fileName.trim();
  },

  params2json(params = "", slice = "&") {
    const result = {};
    params.split(slice).forEach(item => {
      let arr = item.split("=");
      const key = arr[0] || "",
        value = arr[1] || "";
      if (item && key) {
        result[key] = value;
      }
    });
    return result;
  },

  json2params(json, slice = "&") {
    return Object.keys(json)
      .reduce((acc, item) => {
        return acc + "" + item + "=" + json[item] + slice;
      }, "")
      .slice(0, -1);
  },

  calcTime(sd) {
    if (!sd) {
      return "";
    }
    let now = Number(new Date()),
      createTime = Number(new Date(sd));
    const s = Math.floor((now - createTime) / 1000),
      m = Math.floor(s / 60),
      h = Math.floor(m / 60),
      d = Math.floor(h / 24),
      w = Math.floor(d / 7);
    if (s <= 0) {
      return "1秒前";
    }
    if (m < 1) {
      return `${s}秒前`;
    } else if (h < 1) {
      return `${m}分钟前`;
    } else if (d < 1) {
      return `${h}小时前`;
    } else if (d < 2) {
      return "昨天";
    } else if (w < 1) {
      return `${d}天前`;
    } else if (w < 10) {
      return `${w}周前`;
    } else {
      return new Date(sd).toLocaleDateString().replace("///g", "-");
    }
  },

  // 色彩选择
  colorRgb(color) {
    // 十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = color.toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      // 处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2), 16));
      }
      return sColorChange;
    } else {
      return sColor;
    }
  },

  // 色彩值转换成字符串
  colorRgbToString(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  },

  padQuery(url = "", params = {}) {
    const [pathname, queryStr] = url.split("?");
    let tempQuery = Utils.searchAssign(
      Object.assign(
        {},
        Utils.params2json(queryStr),
        Utils.searchAssign(Object.assign({}, params))
      )
    );
    let searchQuery = Utils.formatQuery2QueryStr(tempQuery);
    return `${pathname}${searchQuery}`;
  },

  isEmptyObject(value) {
    for (let p in value) {
      return !1;
    }
    return !0;
  },

  isEmpty(value) {
    return (value === undefined || value === null || value === '');
  },

  previewImage({urls = [], idx = 0, current = ''}) {
    let showUrl = current || urls[idx];
    //莫删除
    if (wx) {
      wx.previewImage({
        current: Utils.getOriginFile(showUrl),
        urls: urls.map(v => Utils.getOriginFile(v))
      });
    }
  },

  clearCookie() {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--;)
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toGMTString() + ';path=/';
    }
  },

  //浮点数相加
  accAdd: (arg1, arg2) => {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return Math.round(arg1 * m + arg2 * m) / m;
  },

  //浮点数相减
  accSub: (arg1, arg2) => {
    return Utils.accAdd(arg1, -arg2);
  },

  //解析url中的查询参数
  parseUrl(url) {
    const pattern = /(\w+)=(\w+)/gi;
    const params = {};
    url.replace(pattern, function(a, b, c) {
      params[b] = c;
    });
    return params;
  },
}
