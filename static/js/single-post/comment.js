let comment_send_btn = document.querySelector('#comment-send');
let comments = document.querySelector('.comments');
let comment = document.querySelector('#comment');
// let reply_toggol = document.querySelectorAll('#reply-toggol');
let comment_container = document.querySelector('.comment-container');
// let reply_content = document.querySelectorAll('.reply-content');





comment.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        comment_submit();
    }
});

comment_send_btn.addEventListener('click', () => {
    comment_submit();
});

function comment_submit() {
    let body = comment.value

    let url = `/api/comments/${comment_send_btn.dataset.post}`
    let comment_req = getData(url, body);

    // comment fecth api
    fetch(comment_req)
        .then(res => res.json())
        .then(data => {
            let userName = data.user.userName;
            let profilePic = data.user.profilePic;

            let html = `
                <!-- comment-content -->
                <div class="comment-content">
                    <div class='comment-reply-container'>
                        <!-- user-data -->
                        <div  class="user-data">
                            <img id="user-img" src="${profilePic}" />
                            </div>
                            
                            <!-- comment -->
                        <div class="comment">
                            
                            <span id="user-name">${userName}</span>

                            <p>${data.body}</p>
                           
                        </div>
                        <button type="button" id="reply-toggol">reply (5)</button>
                    </div>

                    <!-- reply input box -->
                    <div class="reply-input-box">
                        
                        <input id="reply" name="reply" placeholder="reply..." data-comment="${data._id}">

                        <i class="fa-solid fa-paper-plane" id="reply-send" data-comment="${data._id}"></i>

                    </div>
                </div>
                `;

            comments.innerHTML += html
            comment.value = '';



            // reply script
            let reply = document.querySelectorAll('#reply');
            let reply_send_btn = document.querySelectorAll('#reply-send');

            for (let i = 0; i < reply_send_btn.length; i++) {
                reply_send_btn[i].addEventListener('click', () => {
                    let url = `/api/comments/replies/${reply_send_btn[i].dataset.comment}`;
                    let body = reply[i].value;
                    reply_submit(url, body, i);
                    reply[i].value = ''
                })

                reply[i].addEventListener('keypress', (e) => {
                    if (e.keyCode === 13) {
                        let url = `/api/comments/replies/${reply_send_btn[i].dataset.comment}`;
                        let body = reply[i].value;
                        reply_submit(url, body, i);
                        reply[i].value = ''
                    }
                })
            }

        })
        .catch(err => console.log(err))  // comment error

}



// reply script
let reply = document.querySelectorAll('#reply');
let reply_send_btn = document.querySelectorAll('#reply-send');



for (let i = 0; i < reply_send_btn.length; i++) {
    reply_send_btn[i].addEventListener('click', () => {
        let url = `/api/comments/replies/${reply_send_btn[i].dataset.comment}`;
        let body = reply[i].value;
        reply_submit(url, body, i);
        reply[i].value = '';
    })
    reply[i].addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            let url = `/api/comments/replies/${reply_send_btn[i].dataset.comment}`;
            let body = reply[i].value;
            reply_submit(url, body, i);
            reply[i].value = '';
        }
    })
}


function reply_submit(url, body, i) {

    // reply fetch api
    let reply_req = getData(url, body);
    fetch(reply_req)
        .then(res => res.json())
        .then(data => {
            let comment_content = document.querySelectorAll('.comment-content')
            let html = `
                        <div class="reply-content">
                            <!-- user-data -->
                            <div class="user-data">
                                <img id="user-img" src="${data.profilePic}" />
                                </div>
                                
                            <div class="comment">
                                <span id="user-name">${data.userName}</span>
                                <p>
                                ${data.body}
                                </p>
                            </div>
                        </div>
                        `;

            comment_content[i].insertAdjacentHTML('beforeend', html);


        }).catch(err => console.log(err)) // reply error
}



















function getData(url, body) {

    let headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    headers.append('Content-Type', 'Application/JSON');

    let req = new Request(url, {
        method: 'POST',
        headers,
        mode: 'cors',
        body: JSON.stringify({ body })
    });
    return req;
}
