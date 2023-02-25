window.onload = () => {
    const bookmarks = document.querySelectorAll('.bookmark');
    [...bookmarks].forEach(bookmark => {
        bookmark.addEventListener('click', (e) => {
            let target = e.target.parentElement;

            let headers = new Headers();
            headers.append('Accept', 'Application/JSON');

            let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method: `GET`,
                headers,
                mode: `cors`
            });
            console.log(req);
            fetch(req)
                .then(res => res.json())
                .then(data => {
                    if (data.bookmark) {
                        target.innerHTML = ` <i class="fa-solid fa-bookmark"></i>`
                    } else {
                        target.innerHTML = ` <i class="fa-regular fa-bookmark"></i>`
                    }
                })
                .catch(e => {
                    alert(e.response.data.error)
                })
        })
    })


    // addEventListener("scroll", e => {
    //     // console.log(e);
    // })
}



let card = document.querySelectorAll('.card')
document.addEventListener('scroll', (e) => {
    let top = window.scrollY;
    for (let i = 0; i < card.length; i++) {

        let rect = card[i].getBoundingClientRect();
        // console.log(rect);

        // console.log(top, cardtop);
    }
})




