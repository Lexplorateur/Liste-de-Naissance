
const firebaseConfig = {
    apiKey: "AIzaSyB3izdPmoxPUJtr_JTJ4IlPNi251g_qH5Y",
    authDomain: "liste-de-naissance-406e5.firebaseapp.com",
    projectId: "liste-de-naissance-406e5",
    storageBucket: "liste-de-naissance-406e5.appspot.com",
    messagingSenderId: "154708649767",
    appId: "1:154708649767:web:0b93aa394f009bb6416b02"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const ref =  firebaseApp.firestore().collection('naissance')

function getData(){ 
   ref.get().then((res) => {
        const checkboxesContainer = document.getElementById('checkboxes-container');
        const updateButton = document.getElementById('update-button');
        const output = document.getElementById('output');

        const data = {...res.docs[0].data()}
        data.liste.forEach((el) => {
            const element = document.getElementById(`${el.id}`)
            if(!element) {
                const container= document.createElement('div')
                container.classList.add('container')
                container.id = `${el.id}_container`
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${el.id}`;
                checkbox.name = `${el.id}`; 

                const label = document.createElement('label');
                label.htmlFor = `${el.id}`;
                label.innerHTML = `<div class="image image-${el.id}" style="background-image: url(${el.link_image});"></div><p>${el.name}</p>`;
                

                if (el.checked) {
                    const deja = document.createElement('div');
                    deja.classList.add('deja-pris');
                    deja.innerHTML = `Déjà pris`
                    container.appendChild(deja);
                    checkbox.checked = true; 
                    checkbox.addEventListener('click', (e) => e.preventDefault())
                }
                container.appendChild(checkbox)
                container.appendChild(label)
                checkboxesContainer.appendChild(container);
            } else {
                if(!element.checked && el.checked) {
                    const deja = document.createElement('div');
                    deja.classList.add('deja-pris');
                    deja.innerHTML = `Déjà pris`
                    document.getElementById(`${el.id}_container`).appendChild(deja);
                    element.checked = true; 
                    element.addEventListener('click', (e) => e.preventDefault())
                }
            }
        })

        updateButton.addEventListener('click', () => {
            updateButton.innerText = 'chargement ...';
            // Mettre à jour les données en fonction de l'état des cases à cocher
            data.liste.forEach((el, i) => {
                data.liste[i].checked = document.getElementById(`${el.id}`).checked ? true : data.liste[i].checked;
            })

            console.log(data)
            ref.doc(res.docs[0].id).set({...data}).then(() => {
                output.classList.add('success')
                output.innerHTML = 'Nice ! c\'est validé, merci beaucoup <span>&#9829; &#9829; &#9829;</span>'
            }).catch(() => {
                output.classList.add('error')
                output.innerHTML = '&#9888; Il y a eu une erreur, n\'hésitez pas à nous contacter'
            })

            updateButton.innerText = 'Valider mes choix';
        });
    }).catch((e) => {
        console.log(e)
        output.classList.add('error')
        output.innerHTML('&#9888; Il y a eu une erreur, n\'hésitez pas à nous contacter')
    })
}

getData()

const intervalID = setInterval('getData()', 10000)

