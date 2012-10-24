
//何世孟 heshimeng1987@qq.com

function uploadPreview(options) {
    this.fileInput = options.fileInput;
    this.preview = options.preview;
    this.width = options.width;
    this.height = options.height;

    this.ext = options.ext || '.jpg,.png,.jpeg,.gif,.bmp';
    this.init();
};
uploadPreview.prototype = {
    init: function () {
        var that = this;
        if (this.checkExt()) {
            this.fileInput.onchange = function () {
                that.setPreview();
            }
            this.preview.style.width = this.width + 'px';
            this.preview.style.height = this.height + 'px';
			this.preview.style.overflow = 'hidden';			
			this.preview.onmouseover = function(){
				this.style.overflow = 'visible';
				this.style.position = 'relative';
			}
			this.preview.onmouseout = function(){
				this.style.overflow = 'hidden';	
				this.style.position = '';
			}		
        } else {
            alert("您上传的文件不是图片,请重新选择！");
        }
    },
    setPreview: function () {
        try {
            var img = new Image(),
                file;
            this.preview.innerHTML = '';
            this.preview.appendChild(img);

            if (typeof FileReader !== 'undefined') {
                //标准浏览器下，直接设img属性 
                file = this.fileInput.files[0]
                reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    img.src = this.result;
                }
            } else if (this.fileInput.files) {
                file = this.fileInput.files[0]
                img.src = file.getAsDataURL();
            } else {
                //IE下，使用滤镜
                this.fileInput.select();
                var imgSrc = document.selection.createRange().text;

                //图片异常的捕捉，防止用户修改后缀来伪造图片
                try {
                    img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    img.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
					img.src = imgSrc;
                } catch (e) {
                    alert("您上传的图片格式不正确，请重新选择!");
                    return false;
                }
                document.selection.empty();
            }

        } catch (e) {
            alert('您的浏览器版本太低，不支持预览功能！');
        }
    },
    checkExt: function () {
        var filePath = this.fileInput.value,
            fileExt = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
        return (this.ext.indexOf(fileExt) < -1) ? false : true;
    }
};