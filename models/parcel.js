class Parcel {
    id = '';
    owner = '';
    latitude = 0;
    longitude = 0;

    constructor(id, owner, latitude, longitude) {
        this.id = id;
        this.owner = owner;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

module.exports = Parcel;