const fileInput = document.querySelector('.file-input'),
filterOptions = document.querySelectorAll('.filter button'),
filterName = document.querySelector('.filter-info .name'),
filterValue = document.querySelector('.filter-info .value'),
filterSlider = document.querySelector('.slider input'),
rotateOptions = document.querySelectorAll('.rotate button'),
previewImage = document.querySelector('.preview-img img'),
resetFilterBtn = document.querySelector('.reset-filter'),
chooseImgBtn = document.querySelector('.choose-img'),
saveImgBtn = document.querySelector('save-img');

let brightness = 100;
let saturation = 100;
let inversion = 0;
let grayscale = 0;

let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

const applyFilters = () => {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0]; //get file
    if(!file) return;
    
    previewImage.src = URL.createObjectURL(file); // pass the URL as a preview to image tag
    previewImage.addEventListener('load', () => {
        resetFilterBtn.click();
        document.querySelector('.container').classList.remove('disable')
    });
}

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.filter .active').classList.remove('active');
        option.classList.add('active');
        filterName.innerText = option.innerText;

        if(option.id == 'brightness'){
            filterSlider.max = '200';
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }
        else if(option.id == 'saturation'){
            filterSlider.max = '200';
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }
        else if(option.id == 'inversion'){
            filterSlider.max = '100';
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }else{
            filterSlider.max = '100';
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    })
})

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectFilter = document.querySelector('.filter .active');

    if(selectFilter.id == 'brightness'){
        brightness = filterSlider.value;
    }
    else if(selectFilter.id == 'saturation'){
        saturation = filterSlider.value;
    }
    else if(selectFilter.id == 'inversion'){
        inversion = filterSlider.value;
    }else{
        grayscale = filterSlider.value
    }
    applyFilters();
}

rotateOptions.forEach(option => { //adding a click event to all the rotate buttons
    option.addEventListener('click', () => {
        if(option.id === 'left'){
            rotate -= 90;
        }
        else if(option.id === 'right'){
            rotate += 90;
        }
        else if(option.id === 'horizontal'){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        else if(option.id === 'vertical'){
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
})

const resetFilter = () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;

    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;

    filterOptions[0].click();
    applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height /2)
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 2);
    }

    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    //document.body.appendChild(canvas);

    const link = document.createElement('a');
    link.download = 'image.jpg';
    link.href = canvas.toDataURL();
    link.click();
}

fileInput.addEventListener('change', loadImage);
filterSlider.addEventListener('input', updateFilter);
resetFilterBtn.addEventListener('click', resetFilter);
saveImgBtn.addEventListener('click', saveImage);
chooseImgBtn.addEventListener('click', () => fileInput.click());