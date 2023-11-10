
//General utilities.
const Utils = {
    //Defines acceptable file formats.
    imgFileTypes: [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
    ],

    //Checks if provided file is of an acceptable file format.
    isValidFileType(file) {  
        return this.imgFileTypes.includes(file.type);
    },

    //Takes 2 indexes and places the element at the first index before or after - defined by "insertAfter" -  the element at the second index on the received list.
    rearrangeList(list = [], source = 0, target = 0, insertAfter = false) {
        source = this.notNaNNumber(source);
        target = this.notNaNNumber(target);
    
        if (source !== target) {
            insertAfter = Boolean(insertAfter);
    
            const sourceElement = list.splice(source, 1)[0];
    
            if (insertAfter) {
                list.splice(target + 1, 0, sourceElement);
            } else {
                list.splice(target, 0, sourceElement);
            }
        }
    },
    

    notNaNNumber(number = 0){
        number = Number(number);
        return isNaN(number) ? 0 : number;
    }
};

//Handles code output creation.
const Output = {
    //Generates output in code format with appropriate coloring on each segment.
    generateOutput(){
        const output = document.createElement("div");
        let codeOutput = '<span class="atribute-color">filter:</span>'

        if(Filter.imageFiltersList.length > 0){
            Filter.imageFiltersList.forEach((filter) => {
                codeOutput += 
                '<span class="text-color">&nbsp' + filter.filterName + '</span>' +
                '<span class="parentheses-color">(</span>' + 
                '<span class="number-color">' + filter.value + '</span>' +
                '<span class="parentheses-color">)</span>';
                
            });
        }else{
            codeOutput += '<span class="text-color">&nbspnone</span>';
        }

        codeOutput += '<span class="text-color">;</span>';

        output.innerHTML = codeOutput;
        output.classList.add("code");

        //Example: 
        //filter: blur(34%) sepia(23%) drop-shadow(10px 20px 30px #343434);
        return output;

    },

    //Resets code display and then outputs formated code.
    updateOutputDisplay(){
        const output = document.querySelector(".output-code");
        output.innerHTML = '';
        output.appendChild(this.generateOutput());
    }
};

//Handles every major interaction with document.
const DOM = {
    newFilterButton: document.getElementById("new-filter"),

    //Creates a filter by making a div with "filter" class, using the filter template and then sets it's internal values
    createFilter(filter, index){
        const filterElement = document.createElement('div');

        filterElement.classList.add('filter');
        filterElement.innerHTML = this.innerFilter();
        filterElement.dataset.index = index;
        filterElement.draggable = true;

        filterElement.querySelector('select').value = filter.filterName;
        filterElement.querySelector('input').value = filter.value;

        document.querySelector('.filters').appendChild(filterElement);
        this.updateInputPlaceholder(index);
    },

    clearFilters(){
        document.querySelector('.filters').innerHTML = '';
    },
    

    //Sets a filter template.
    innerFilter(){
        const filter = `
        <img class="drag-icon" src="assets/images/drag-icon.svg" alt="drag icon" draggable="false">
        <label for="filter-type" class="hidden-no-width">Select filter</label>
        <select name="select-filter" class="filter-type" id="filter-type">
            <option value="blur">Blur</option>
            <option value="brightness">Brightness</option>
            <option value="contrast">Contrast</option>
            <option value="drop-shadow">Drop Shadow</option>
            <option value="grayscale">Grayscale</option>
            <option value="hue-rotate">Hue Rotation</option>
            <option value="invert">Invert</option>
            <option value="opacity">Opacity</option>
            <option value="saturate">Saturate</option>
            <option value="sepia">Sepia</option>
        </select>
        <label for="filter-input" class="hidden-no-width">Filter value</label>
        <input type="text" id="filter-input" class="filter-input" placeholder="11px">
        <button class="delete-button" id="delete-button">X</button>
        `;
        
        return filter;
    },

    //Gets an image from user, validates it and then creates the appropriate image element.
    //Default image element is a coala.
    updateImageDisplay() {
        const input = document.getElementById('input-target-image');
        const preview = document.querySelector('.preview');
        const curFiles = input.files;
    
        while(preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
      
        const image = document.createElement('img');
        image.classList.add("target-image");

        //Triggers if there are no files selected, or if file is invalid.
        if (curFiles.length === 0 || !Utils.isValidFileType(curFiles[0])) {
            image.src = "assets/images/coala.jpg";
            image.alt = "Coala Image";
        } else {
            image.src = URL.createObjectURL(curFiles[0]); 
            image.alt = "Your Image";
        }
        preview.appendChild(image);            

        //curFiles represents a list of selected files, in this case we must use a single one,
        //so curFiles[0] gets the first one and ignores the rest.

        this.updateFiltersOntarget();
    },

    //Iterates through filters list and appends filter atribute to both image and logo.
    updateFiltersOntarget(){
        let filtersString = "";
        Filter.imageFiltersList.forEach(filter => {
            filtersString += filter.filterName + "(" + filter.value + ") ";
        });

        document.querySelector(".target-image").style.filter = filtersString;
        document.querySelector(".logo").style.filter = filtersString;
    },

    //Selects an example of how to use each filter.
    //TODO: Create Filter class that contains filter name, placeholderText, inputType and input value handling.
    updateInputPlaceholder(index){
        let placeholderText = '';
        const selectedValue = document.querySelector('.filter[data-index="' + index + '"] .filter-type').value;

        switch(selectedValue){
            case 'blur': placeholderText = '5px or 1rem'; break;
            case 'brightness': placeholderText = '0.35 or 35%'; break;
            case 'contrast': placeholderText = '0.5 or 50%'; break;
            case 'drop-shadow': placeholderText = '10px 30px 20px #2D2D2D'; break;
            case 'grayscale': placeholderText = '0.8 or 80%'; break;
            case 'hue-rotate': placeholderText = '90deg'; break;
            case 'invert': placeholderText = '0.9 or 90%'; break;
            case 'opacity': placeholderText = '0.5 or 50%'; break;
            case 'saturate': placeholderText = '0.3 or 30%'; break;
            case 'sepia': placeholderText = '0.7 or 70%'; break;
        }
        document.querySelector('.filter[data-index="' + index + '"] .filter-input').placeholder = placeholderText;
    },
    
    displayCopyMessage(){
        const messageElement = document.querySelector('.copy-message-container');

        messageElement.classList.remove('hidden');
        setTimeout(() => {messageElement.classList.add('hidden')}, 3000);
    },

    copyCssToClipboard(){
        var outputText = document.querySelector(".output-code").textContent;
        outputText = outputText.replaceAll('\u00A0', '\u0020');

        navigator.clipboard.writeText(outputText);
        DOM.displayCopyMessage();
    },
};

//Handles filter list maintenance.
const Filter = {
    //Main filters list. Everything is centered around this.
    //A list that after every set operation calls App.reload() to update GUI.
    imageFiltersList: null,

    init() {
        // Initialize the imageFiltersList property with the result of listAutoUpdate
        this.imageFiltersList = this.listAutoUpdate();
    },

    addNewFilter(filter){
        this.imageFiltersList.push(filter);
    },

    removeFilter(index){
        this.imageFiltersList.splice(index, 1);
    },

    updateFiltersListName(value, index){
        this.imageFiltersList[index].filterName = value;
    },

    updateFiltersListValue(value, index){
        this.imageFiltersList[index].value = value;
    },

    swapFilters(source, target){
        const temp = this.imageFiltersList[target];
        
        this.imageFiltersList[target] = this.imageFiltersList[source];
        this.imageFiltersList[source] = temp;
    },

    rearrangeFiltersList(source, target, insertAfter){
        Utils.rearrangeList(this.imageFiltersList, source, target, insertAfter);
    },

    //Defiens a Proxy for an array that calls "App.reload()" on each set operation.
    listAutoUpdate(){
        const list = [];
    
        const handler = {
            set(target, prop, value){
                target[prop] = value;
                App.reload();
                return true;
            },
        };
    
        return new Proxy(list, handler);
    }
};

//Handles all drag events.
const Drag = {
    draggedElementIndex: undefined,
    draggedOverElementIndex: undefined,
    draggedAfter: true,

    //When an elements is being dragged, we get a refference to that element index.
    onDragStart(index){
        Drag.draggedElementIndex = index;
    },

    //When we release an element, we place it near the one below it, based on where you are hovering over the element - bottom or top half
    onDragEnd(){
        if(Drag.draggedOverElementIndex != undefined){
            //Filter.swapFilters(Drag.draggedElementIndex, Drag.draggedOverElementIndex);
            Filter.rearrangeFiltersList(Drag.draggedElementIndex, Drag.draggedOverElementIndex, Drag.draggedAfter);
        }
    },

    //When an element is being dragged of the this element, we get a refference to this element index.
    onDragOver(index, draggedAfter){
        Drag.draggedOverElementIndex = index;
        Drag.draggedAfter = draggedAfter;
    },
};

//Handles all event listeners.
const EventListeners = {
    //Subscribes elements that wont change. 
    //MUST be called only once at the start to avoid listener duplicity.
    subscribeEventListeners(){
        document.getElementById("input-target-image").addEventListener('change', DOM.updateImageDisplay);

        document.getElementById("new-filter").addEventListener('click', () => {
            const imageFilterTemplate = {filterName: 'blur', value: ''};
            Filter.addNewFilter(imageFilterTemplate);
        });

        document.getElementById("copy-btn").addEventListener("click", DOM.copyCssToClipboard);
    },

    //Subscribes all elements that change over time, such as filters.
    //MUST be called on every interface redraw.
    subscribeDynamicEventListeners(){
        const elementFiltersList = document.querySelectorAll(".filter");
        elementFiltersList.forEach(elementFilter => {

            const index = elementFilter.dataset.index;

            elementFilter.querySelector("select").addEventListener('change', (event) => {
                Filter.updateFiltersListName(event.target.value, index);
                Filter.updateFiltersListValue('', index);
                DOM.updateInputPlaceholder(index);
                DOM.updateFiltersOntarget();
            });

            elementFilter.querySelector("input").addEventListener('change', (event) => {
                Filter.updateFiltersListValue(event.target.value, index);
                DOM.updateFiltersOntarget();
            });

            elementFilter.querySelector(".delete-button").addEventListener('click', () => Filter.removeFilter(index));

            //Drag listeners
            elementFilter.addEventListener('dragstart', () => Drag.onDragStart(index));

            elementFilter.addEventListener('dragend', Drag.onDragEnd);

            elementFilter.addEventListener('dragover', (event) => 
                Drag.onDragOver(index, event.clientY > elementFilter.offsetTop + (elementFilter.offsetHeight / 2)));
        }); 
    },
};

//Handles order of updates and GUI maintenance.
const App = {
    //Checks filters list and creates a filter visual element for each of them, 
    //then does GUI maintenance.
    init(){
        if(Filter.imageFiltersList.length > 0){
            Filter.imageFiltersList.forEach((filter, index) => DOM.createFilter(filter, index));
        }
        Output.updateOutputDisplay();
        EventListeners.subscribeDynamicEventListeners();
    },

    reload(){
        DOM.clearFilters();
        this.init();
        DOM.updateFiltersOntarget();
    },
}

Filter.init();
App.init();
EventListeners.subscribeEventListeners();
