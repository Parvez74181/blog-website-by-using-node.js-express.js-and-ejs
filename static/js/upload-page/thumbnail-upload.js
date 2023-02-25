// modal script for uploading thumbnail image
let thumbnail_input = document.querySelector('#thumbnail-input');
let upload = document.querySelector('.upload');
let modal = document.querySelector('.crop-modal');
let close_icon = document.querySelector('.close_icon');
let cancel = document.querySelector('#cancel');
let thumbnail_done = document.querySelector('#thumbnail-done');
let container = document.querySelector('#thumbnail-details');
let modal_content = document.querySelector('.modal-content');
let preview_image = document.querySelector('.preview-image');
let icon = document.querySelector('.fa-cloud-arrow-up');
let containerPreviewImage = document.querySelector('#containerPreviewImage');
let text = document.querySelector('#text');
let preview_image_remove_btn = document.querySelector('#preview-image-remove-btn');


upload.addEventListener('click', () => {
    thumbnail_input.click();
});

function closeModal() {
    modal.style.transform = 'scale(0)';
    modal_content.style.transform = 'scale(0)';

};

thumbnail_input.addEventListener('change', e => {

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
            thumbnail_done.addEventListener('click', (e) => {
                closeModal();
                containerPreviewImage.style.display = 'block';
                preview_image_remove_btn.style.display = 'block';
                icon.style.display = 'none';
                text.style.display = 'none';
                container.style.border = 'none'
                container.style.height = 'auto'
                container.style.width = '80%'
                preview_image.removeChild(image);
                containerPreviewImage.src = image_url;

            });

            cancel.addEventListener('click', () => {
                closeModal();
                preview_image.removeChild(image);
            });

            close_icon.addEventListener('click', () => {
                closeModal();
                preview_image.removeChild(image);
            });

            // remove the slected thumbnail image
            preview_image_remove_btn.addEventListener('click', () => {
                containerPreviewImage.style.display = 'none';
                preview_image_remove_btn.style.display = 'none';
                icon.style.display = '';
                text.style.display = '';
                container.style.border = null;
                container.style.height = null;
                container.style.width = null;

                containerPreviewImage.src = '';
            })

        }

    }
    else {
        closeModal();
    }
});


