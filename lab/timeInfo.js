var timeInfo = function(goalFPS){
	var oldTime, paused = true,
		interCount = 0,
		totalFPS = 0,
		totalCoeff = 0;
	return{
		getInfo: function(){
			if(paused === true){
				paused = false;
				oldTime = +new Date();//等价于new Data().getTime();
				return {
					elapsed: 0,
					coeff: 0,
					FPS: 0,
					averageFPS: 0,
					averageCoeff: 0
				};
			}
			var newTime = +new Date(),
				elapsed = newTime - oldTime;
			oldTime = newTime;
			var FPS = 1000 / elapsed;
			interCount++;
			totalFPS += FPS;
			var coeff = goalFPS / FPS;
			totalCoeff += coeff;

			return {
				elapsed: elapsed,
				coeff: goalFPS / FPS,
				FPS: FPS,
				averageFPS: totalFPS / interCount,
				averageCoeff: totalCoeff / interCount
			};
		},
		pause: function(){
			pause = true;
		}
	};
};