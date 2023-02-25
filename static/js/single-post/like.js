window.onload = () => {
    let like = document.querySelector('.likeIcon');
    let totalLikes = document.querySelector('#totalLikes');
    let login_text = document.querySelector('#login-text');

    like.addEventListener("click", () => {
        if(like.dataset.user){
        let header = new Headers();
        header.append('Accept', 'application/json');
        let req = new Request(`/api/likes/${like.dataset.post}`, {
            method: 'GET',
            mode: 'cors',
            header
        });

        fetch(req)
            .then(res => res.json())
            .then(data => {
                if (data.liked) {
                    like.classList.remove('fa-regular');
                    like.classList.add('active');
                    like.classList.add('fa-solid');
                    like.style.color = '#ff0000';
                    totalLikes.innerText = data.totalLikes;
                } else {
                    like.classList.add('fa-regular');
                    like.classList.remove('fa-solid');
                    like.style.color = null;
                    totalLikes.innerText = data.totalLikes;
                }

            })
            .catch(err => console.log(err))
        }else{
            login_text.style.display='block';

        }
    })
}