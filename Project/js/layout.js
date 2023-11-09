
/*
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
*/

//General utilities.
const Utils = {
    //Defines acceptable file formats.
    fileTypes: [
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
    validFileType(file) {  
        return this.fileTypes.includes(file.type);
    },

    //Takes 2 indexes and places the element at the first index before or after - defined by "insertAfter" -  the element at the second index on teh received list.
    rearrangeList(list = [], source = 0, target = 0, insertAfter = false){
        if(source != target){
            source = Number(source);
            target = Number(target);

            const sourceElement = list[source];
    
            if(insertAfter){
                list.splice(target + 1, 0, sourceElement);
            }else{
                list.splice(target, 0, sourceElement);
            }
            if(source > target){
                list.splice(source + 1, 1);
            }else{
                list.splice(source, 1);  
            }
        }
    },
};

//Handles code output creation.
const Output = {
    //Generates output in code format with appropriate coloring on each segment.
    generateOutput(){  
        const output = document.createElement("div");
        let codeOutput = '<span class="atribute-color">filter:</span>'

        let test = [];

        if(Filter.imageFiltersList.length != 0){
            Filter.imageFiltersList.forEach(function(filter){
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
        return output;

        //Example: 
        //filter: blur(34%) sepia(23%) drop-shadow(10px 20px 30px #343434);
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
      
        //Triggers if there are no files selected, or if file is invalid.
        if (curFiles.length === 0 || !Utils.validFileType(curFiles[0])) {
            const defaultImage = document.createElement('img');
            defaultImage.src = "assets/images/coala.jpg";
            defaultImage.alt = "Coala Image";
            defaultImage.classList.add("target-image");
            preview.appendChild(defaultImage);
        } else {
            const newImage = document.createElement('img');
            newImage.alt = "Your Image";
            newImage.classList.add("target-image");
            newImage.src = URL.createObjectURL(curFiles[0]);
            preview.appendChild(newImage);            
        }

        //curFiles represents a list of selected files, in this case we msut use a single one,
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
    updateInputPlaceholder(index){
        let placeholderText = '';
        const selectedValue = document.querySelector('.filter[data-index="' + index + '"] .filter-type').value;

        switch(selectedValue){
            case 'blur': placeholderText = '5px'; break;
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

    copyCssToClipboard(){
        var targetCode = document.querySelectorAll(".code span");
        var outputText = '';

        targetCode.forEach(function(span){
            outputText += span.textContent;
        })
        console.log(outputText);

        navigator.clipboard.writeText(outputText.toString());
        this.displayCopyMessage();
    },

    displayCopyMessage(){
        const messageElement = document.querySelector(".copy-message-container");

        messageElement.classList.remove("hidden");
        setTimeout(() => {messageElement.classList.add("hidden");} ,3000)
    },
};

//Handles filter list maintenance.
const Filter = {
    //Main filters list. Everything is centered around this.
    //After every change on this list, we msut call App.reload() to update GUI.
    imageFiltersList: [],

    addNewFilter(filter){
        this.imageFiltersList.push(filter);
        App.reload();
    },

    removeFilter(index){
        this.imageFiltersList.splice(index, 1);
        App.reload();
    },

    updateFiltersListName(value, index){
        this.imageFiltersList[index].filterName = value;
        App.reload();        
    },

    updateFiltersListValue(value, index){
        this.imageFiltersList[index].value = value;
        App.reload();
    },

    swapFilters(source, target){
        const temp = Filter.imageFiltersList[target];
        
        Filter.imageFiltersList[target] = Filter.imageFiltersList[source];
        Filter.imageFiltersList[source] = temp;
        App.reload();
    },

    rearrangeFiltersList(source, target, insertAfter){
        Utils.rearrangeList(Filter.imageFiltersList, source, target, insertAfter);
        App.reload();
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
        //console.log("Dragged index: " + index);
    },

    //When we release an element, we swap it with the one below on a list, based on their index refferences
    //Then, we re-render the list.
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
        //console.log("Dragged over index: " + index);
    },
};

//Handles all event listeners.
const EventListeners = {
    //Subscribes elements that wont change. 
    //MUST be called only once at the start to avoid listener duplicity.
    subscribeEventListeners(){
        document.getElementById("input-target-image").addEventListener('change', function(){
            DOM.updateImageDisplay();
        });

        document.getElementById("new-filter").addEventListener('click', function(){
            const imageFilterTemplate = {filterName: 'blur', value: ''};
            Filter.addNewFilter(imageFilterTemplate);
        });

        document.getElementById("copy-btn").addEventListener("click", function(){
            DOM.copyCssToClipboard();
        });
    },

    //Subscribes all elements that change over time, such as filters.
    //MUST be called on every interface redraw.
    subscribeDynamicEventListeners(){
        const elementFiltersList = document.querySelectorAll(".filter");
        elementFiltersList.forEach(elementFilter => {

            const index = elementFilter.dataset.index;

            elementFilter.querySelector("select").addEventListener('change', function(event){
                Filter.updateFiltersListName(event.target.value, index);
                Filter.updateFiltersListValue('', index);
                DOM.updateInputPlaceholder(index);
                DOM.updateFiltersOntarget();
            });

            elementFilter.querySelector("input").addEventListener('change', function(event){
                Filter.updateFiltersListValue(event.target.value, index);
                DOM.updateFiltersOntarget();
            });

            elementFilter.querySelector(".delete-button").addEventListener('click', function(){
                Filter.removeFilter(index);
            });

            //Drag listeners
            elementFilter.addEventListener('dragstart', () =>{
                Drag.onDragStart(index);
            })

            elementFilter.addEventListener('dragend', () =>{
                Drag.onDragEnd();
            })

            elementFilter.addEventListener('dragover', (event) =>{
                if(event.clientY > elementFilter.offsetTop + (elementFilter.offsetHeight / 2)){
                    Drag.onDragOver(index, true);
                }else{
                    Drag.onDragOver(index, false);
                }
            })
        }); 
    },
};

//Handles order of updates and GUI maintenance.
const App = {
    //Checks filters list and creates a filter visual element for each of them, 
    //then does GUI maintenance.
    init(){
        if(Filter.imageFiltersList.length > 0){
            Filter.imageFiltersList.forEach(function(filter, index){
                DOM.createFilter(filter, index);
            })
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

App.init();
EventListeners.subscribeEventListeners();
