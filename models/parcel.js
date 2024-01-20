class Parcel {
    id = '';
    userName = '';
    ethereumAddress = '';
    latitude = 0;
    longitude = 0;

    constructor(id, userName, ethereumAddress, latitude, longitude) {
        this.id = id;
        this.userName = userName;
        this.ethereumAddress = ethereumAddress;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

module.exports = Parcel;