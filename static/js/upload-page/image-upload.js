let text_editor_input = document.querySelector('#text-editor-input');

// upload image in the text editor
image.addEventListener('click', () => {
    text_editor_input.click();
});

text_editor_input.addEventListener('change', () => {
    const image_upload_form = document.querySelector('#image-upload-form');
    const formData = new FormData(image_upload_form);

    let headers = new Headers();
    headers.append('Accept', "Application/JSON");

    let req = new Request(`/api/imageUpload`, {
        method: "POST",
        headers,
        mode: 'cors',
        body: formData
    })

    fetch(req)
        .then(res => res.json())
        .then(data => {
            // text_input.innerHTML += `<br><img src="${data.image_uri}"><br>`;
            // text_output.value+= `<br><img src="${data.image_uri}"><br>`;

            modifyText('insertimage',true, data.image_uri)
        })
        .catch(err => {
            console.log(err);
        })

    text_editor_input.value = null
});