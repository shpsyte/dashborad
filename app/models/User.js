// eslint-disable-next-line no-unused-vars
class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._createAt = new Date();
    }



    get id() {
        return this._id;
    }

    get createAt() {
        return this._createAt;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get gender() {
        return this._gender;
    }
    get birth() {
        return this._birth;
    }
    get country() {
        return this._country;
    }
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    get admin() {
        return this._admin;
    }

    get photo() {
        return this._photo;
    }

    set photo(value) {
        this._photo = value;
    }

    loadFromJSON(json) {

        for (let name in json) {

            switch (name) {
                case "createAt":
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }

        }
    }

    static getUsersStorage() {
        let users = [];
        //if (sessionStorage.getItem("users"))
        if (localStorage.getItem("users")) {
            users = JSON.parse(localStorage.getItem("users"));
        }
        return users;
    }

    getNewID() {

        let usersID = parseInt(localStorage.getItem("usersID"));

        if (!usersID > 0) {
            usersID = 0;
        }

        usersID++;

        localStorage.setItem("usersID", usersID);

        return usersID;
    }

    save() {
        let users = User.getUsersStorage();


        if (this.id > 0) {

            users.map(u => {
                if (u._id == this.id)
                {
                    Object.assign(u, this);

                }
                return u;
            });

        } else {
            this._id = this.getNewID();

            users.push(this);
            //sessionStorage.setItem("users", JSON.stringify(users));
        }



        localStorage.setItem("users", JSON.stringify(users));

    }

    remove(){
        let users = User.getUsersStorage();
        users.forEach( (user, index) => {

            if (user._id == this.id){
                users.splice(index, 1);
            }
        });
        localStorage.setItem("users", JSON.stringify(users));

    }





}
