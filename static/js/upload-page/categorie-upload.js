// categories entering script

let addCategorieBtn = document.querySelector('#addCategorie');
let newCategorieInput = document.querySelector('#newCategorie');
let categorie = document.querySelector('#categorie');

addCategorieBtn.addEventListener('click', () => {
    let value = newCategorieInput.value;
    if (value.length > 0) {

        let option = `
                         <option value="${value}">${value}</option>     
                    `;
        categorie.insertAdjacentHTML('afterbegin', option);
        newCategorieInput.value = '';
    }
})


