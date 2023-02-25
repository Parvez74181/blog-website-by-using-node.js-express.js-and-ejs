let edit_image = document.querySelector('.fa-pen');
let profilePic = document.querySelector('#profilePic');
let profile_image_upload_form = document.querySelector('#profile-image-upload-form');

let modal = document.querySelector('.crop-modal');
let close_icon = document.querySelector('.close_icon');
let cancel = document.querySelector('#cancel');
let done = document.querySelector('#done');
let modal_content = document.querySelector('.modal-content');
let preview_image = document.querySelector('.preview-image');
let profile = document.querySelector('#profile');


edit_image.addEventListener('click', () => {
    profilePic.click();
});

function closeModal() {
    modal.style.transform = 'scale(0)';
    modal_content.style.transform = 'scale(0)';


};

profilePic.addEventListener('change', e => {
    let image_file = e.target.files[0];
    if (image_file) {
        modal.style.transform = 'scale(1)';
        modal_content.style.transform = 'scale(1)';


        let reader = new FileReader();
        reader.readAsDataURL(image_file);

        reader.onload = e => {
            let image_url = e.target.result;

            let image = document.createElement('img');
            image.setAttribute('id', 'image');
            image.src = image_url;

            image.onload = e => {
                preview_image.appendChild(image);
            }
            done.addEventListener('click', () => {
                preview_image.removeChild(image);
                profile.src = image_url;

                closeModal();

                let outputImageUrl = document.querySelector('#outputImageUrl');
                outputImageUrl.value = image_url;

            })

            cancel.addEventListener('click', () => {
                closeModal();
                preview_image.removeChild(image);
            });

            close_icon.addEventListener('click', () => {
                closeModal();
                preview_image.removeChild(image);
            });

        }
    }
    else {
        closeModal();
    }
});
