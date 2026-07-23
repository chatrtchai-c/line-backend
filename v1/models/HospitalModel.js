class Hospital {
    constructor(id, name, address, district, province, phone, lat, lng) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.district = district;
        this.province = province;
        this.phone = phone;
        this.lat = lat;
        this.lng = lng;
    }
}

module.exports = {
    Hospital
}