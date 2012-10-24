/**
 * 动画函数，只支持单位为px或透明度的动画
 * @param  {[type]} oElem  [description]
 * @param  {[type]} oStyle [description]
 * @param  {[type]} time   [description]
 * @return {[type]}        [description]
 */
function fnMove(oElem,oStyle,time){
	var oldStyle = {};
	for(var style in oStyle){
		oldStyle[style] = dream.getStyle(oElem,style);
	}
};