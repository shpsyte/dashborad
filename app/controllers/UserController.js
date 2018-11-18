 class UserController {
     constructor(formIdCreate, formIdUpdate, tableId) {
         this.formEl = document.getElementById(formIdCreate);
         this.formUpdateEl = document.getElementById(formIdUpdate);
         this.tableEl = document.getElementById(tableId);
         this.init();
     }

     init() {
         this.addEventToButton();
         this.selectAll();
         console.clear();

     }

     addEventToButton() {

         //button save
         this.formEl.addEventListener("submit", (e) => {
             e.preventDefault();
             const values = this.getValues(this.formEl);

             if (!values) return false;

             var btn = this.formEl.querySelector("[type=submit]");
             btn.disabled = true;


             this.getPhoto().then((response) => {
                 values.photo = response;
                 btn.disabled = false;
                 this.formEl.reset();

                 values.save();

                 this.addLine(values);
             }, (error) => {
                 console.error(error);
             }).catch((error) => {
                 console.error(error);
             });
         });

         this.formUpdateEl.addEventListener("submit", e => {

             e.preventDefault();
             var btn = this.formUpdateEl.querySelector("[type=submit]");
             btn.disabled = true;

             const values = this.getValues(this.formUpdateEl);

             let index = this.formUpdateEl.dataset.trIndex;
             let tr = this.tableEl.rows[index];
             let userOld = JSON.parse(tr.dataset.user);
             let result = Object.assign({}, userOld, values);

             if (!values._photo) {
                 result._photo = userOld._photo;
             }

             let user = new User();
             user.loadFromJSON(result);

             user.save();

             tr = this.getTr(user, tr);
             this.updateCount();
             btn.disabled = false;
             this.showPanelCreate();


         });

         //button cancel edit
         document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
             this.showPanelCreate();
         });

     }



     showPanelCreate() {
         document.querySelector("#box-user-create").style.display = "block";
         document.querySelector("#box-user-update").style.display = "none";
     }

     showPanelEdit() {
         document.querySelector("#box-user-create").style.display = "none";
         document.querySelector("#box-user-update").style.display = "block";

     }

     getPhoto() {
         return new Promise((resolve, reject) => {
             const fileReader = new FileReader();
             const photo = [...this.formEl.elements].filter(item => item.name === "photo");
             const file = photo[0].files[0];


             fileReader.onload = () => {
                 resolve(fileReader.result);
             };

             fileReader.onerror = e => reject(e);

             if (file) {
                 fileReader.readAsDataURL(file);
             } else {
                 resolve("dist/img/boxed-bg.jpg");
             };
         });
     }


     // /leitura de arquivos
     // getPhoto(callback) {
     //     const fileReader = new FileReader();
     //     const photo = [...this.formEl.elements].filter(item => item.name === "photo");
     //     const file = photo[0].files[0];


     //     fileReader.onload = () => {
     //         callback(fileReader.result);
     //     };


     //     fileReader.readAsDataURL(file);
     // }

     getValues(formEl) {
         const user = {};
         let isValid = true;

         [...formEl.elements].forEach((field) => {

             if (["name", "email", "password"].indexOf(field.name) > -1) {
                 //pegar o pai

                 if (!field.value) {
                     field.parentElement.classList.add("has-error");
                     isValid = false;
                 } else {
                     field.parentElement.classList.remove("has-error");
                 }
             }

             if (field.name === "gender") {
                 if (field.checked) {
                     user[field.name] = field.value;
                 }
             } else if (field.name === "admin") {
                 user[field.name] = field.checked;
             } else {
                 user[field.name] = field.value;
             }
         });

         if (!isValid) {
             return false;
         }

         return new User(user.name, user.gender,
             user.birth, user.country,
             user.email, user.password,
             user.photo, user.admin);
     }


     selectAll() {
         let users = User.getUsersStorage();

         users.forEach(dataUser => {

             let user = new User();
             user.loadFromJSON(dataUser);

             this.addLine(user);

         });
     }



     addLine(dataUser) {
         let tr = this.getTr(dataUser);
         this.tableEl.appendChild(tr);
         this.updateCount();
     }


     getTr(dataUser, tr = null) {

        if (tr === null){
          tr = document.createElement("tr");
        }

        tr.dataset.user = JSON.stringify(dataUser);

         tr.innerHTML =
             `
           <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
           <td>${dataUser.name}</td>
           <td>${dataUser.email}</td>
           <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
           <td>${Utils.dateFormat(dataUser.createAt)}</td>
           <td>
           <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
           <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
           </td>
       `;

         tr.querySelector(".btn-delete").addEventListener("click", e => {
             if (confirm("Deseja realmente excluir ?")) {

                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();



                 this.updateCount();
             }
         });

         tr.querySelector(".btn-edit").addEventListener("click", e => {
             this.loadValues(JSON.parse(tr.dataset.user), tr.sectionRowIndex);
             this.showPanelEdit();

         });


         return tr;
     }

     loadValues(dataUser, rowIndex) {

         this.formUpdateEl.dataset.trIndex = rowIndex;



         for (let name in dataUser) {
             let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");


             if (field) {

                 switch (field.type) {
                     case "file":
                         continue;
                         break;
                     case "radio":
                         field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + dataUser[name] + "]");
                         field.checked = true;

                         break;
                     case "checkbox":
                         field.checked = dataUser[name];
                         break;
                     default:
                         field.value = dataUser[name];
                 }

             }

         }

         this.formUpdateEl.querySelector(".photo").src = dataUser._photo;
     }

     updateCount() {

         let numberUsers = 0;
         let numberAdmin = 0;
         [...this.tableEl.children].forEach(tr => {
             numberUsers++;

             let user = JSON.parse(tr.dataset.user);

             if (user._admin) {
                 numberAdmin++;
             }


         });

         document.querySelector("#number-user-admin").textContent = numberAdmin;
         document.querySelector("#number-user").textContent = numberUsers;
     }
 }
