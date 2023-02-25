
// tags entering script
let tag_box = document.querySelector('.tag-box');
let tag_input = document.querySelector('#tag-input');
let tags_container = document.querySelector('#tags-container');
let postSubminBtn = document.querySelector('#postSubmitBtn');
let tags_arr = [];

tag_input.addEventListener('keyup', e => {
    if (e.key === ' ') {

        tags_arr.push(tag_input.value.trim()); // push value into the array 

        document.querySelectorAll('.tag').forEach(div => div.remove()); // first you need to remove all the div from the parentNode so that it cann't be overwrite

        tags_arr.forEach(tag => {
            let html = `
                        <div class="tag">
                            <span> 
                                 ${tag} 
                                 <i 
                                 class="fa-solid fa-x" 
                                 onclick="removeElement(this, '${tag}')"
                                 >
                                 </i> 
                            </span>
                        </div>
                        `;
            tag_box.insertAdjacentHTML('afterbegin', html); // adding html before all of the element of this tag
            e.target.value = ''; // clear input value 
        });
    };

});


postSubminBtn.onclick = () => tags_container.value = tags_arr; //add value to the textarea to send the data into the database


function removeElement(element, tag) {
    let div = element.parentNode.parentNode; // select the main parentNode
    let index = tags_arr.indexOf(tag); // getting the selected index

    div.remove(); // remove the selected div
    tags_arr.splice(index, 1); // remove the element form the array
}

