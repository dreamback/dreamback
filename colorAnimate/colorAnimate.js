dream.extend({
    parseColor: function (val) {
        var r, g, b;
        // 参数为RGB模式时不做进制转换，直接截取字符串即可
        if (/rgb/.test(val)) {
            var arr = val.match(/\d+/g);
            r = parseInt(arr[0]);
            g = parseInt(arr[1]);
            b = parseInt(arr[2]);
        }
        // 参数为十六进制时需要做进制转换
        else if (/#/.test(val)) {
            var len = val.length;
            // 非简写模式 #0066cc
            if (len === 7) {
                r = parseInt(val.slice(1, 3), 16);
                g = parseInt(val.slice(3, 5), 16);
                b = parseInt(val.slice(5), 16);
            }
            // 简写模式 #06c
            else if (len === 4) {
                r = parseInt(val.charAt(1) + val.charAt(1), 16);
                g = parseInt(val.charAt(2) + val.charAt(2), 16);
                b = parseInt(val.charAt(3) + val.charAt(3), 16);
            }
        } else {
            return val;
        }

        return {
            r: r,
            g: g,
            b: b
        }
    },
    colorAnimate: function (elem, style, startColor, endColor, duration, callBack, tween) {
        var startColor = dream.parseColor(startColor),
            endColor = dream.parseColor(endColor),

            curTime = 0,
            timeout = null,
            r,
            g,
            b;
        tween = tween || function(t,b,c,d){ return c*t/d + b; };
        callBack = callBack || function () {};
        duration = duration - (duration % 10);

        function frame() {
            if (curTime < duration) {
                curTime += 25;
                r = tween(curTime, startColor.r, endColor.r - startColor.r, duration);
                g = tween(curTime, startColor.g, endColor.g - startColor.g, duration);
                b = tween(curTime, startColor.b, endColor.b - startColor.b, duration);

                dream.setStyle(elem, style, 'rgb(' + parseInt(r) + ',' + parseInt(g) + ',' + parseInt(b) + ')');

                timeout = setTimeout(frame, 25);
            } else {
                callBack();
            }
        };
        frame();
        return function () {
            clearTimeout(timeout);
        };

    }
});