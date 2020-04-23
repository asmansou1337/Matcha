
	// multiple handled with value 
    var ageSlider = document.getElementById('pmd-slider-age');
    var ratingSlider = document.getElementById('pmd-slider-rating');
	var ageMinStart = document.getElementById('age-min').innerHTML || 18;
	var ageMaxStart = document.getElementById('age-max').innerHTML || 120;
	var ratingMinStart = document.getElementById('rating-min').innerHTML || 0;
	var ratingMaxStart = document.getElementById('rating-max').innerHTML || 5;
	
	noUiSlider.create(ageSlider, {
		start: [ ageMinStart, ageMaxStart ], // Handle start position
		connect: true, // Display a colored bar between the handles
		tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
		format: wNumb({
			decimals: 0,
			thousand: '',
			postfix: '',
		}),
		range: { // Slider can select '0' to '100'
			'min': 18,
			'max': 120
		}
	});
	
	var ageMax = document.getElementById('age-max'),
		ageMin = document.getElementById('age-min');
		ageMaxValue = document.getElementById('age-max-value'),
		ageMinValue = document.getElementById('age-min-value');
	
	// When the slider value changes, update the input and span
	ageSlider.noUiSlider.on('update', function( values, handle ) {
		if ( handle ) {
			ageMax.innerHTML = values[handle];
			ageMaxValue.value = values[handle];
		} else {
			ageMin.innerHTML = values[handle];
			ageMinValue.value = values[handle];
		}
    });	
    
    // second slider
    noUiSlider.create(ratingSlider, {
		start: [ ratingMinStart, ratingMaxStart ], // Handle start position
		connect: true, // Display a colored bar between the handles
		tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
		format: wNumb({
			decimals: 0,
			thousand: '',
			postfix: '',
		}),
		range: { // Slider can select '0' to '100'
			'min': 0,
			'max': 5
		}
	});
	
	var ratingMax = document.getElementById('rating-max'),
		ratingMin = document.getElementById('rating-min');
		ratingMaxValue = document.getElementById('rating-max-value'),
		ratingMinValue = document.getElementById('rating-min-value');
	
	// When the slider value changes, update the input and span
	ratingSlider.noUiSlider.on('update', function( values, handle ) {
		if ( handle ) {
			ratingMax.innerHTML = values[handle];
			ratingMaxValue.value = values[handle];
		} else {
			ratingMin.innerHTML = values[handle];
			ratingMinValue.value = values[handle];
		}
    });	
    