import {DataTypes, Model} from 'sequelize'

class UserProfile extends Model {}

const UserProfileModel = UserProfile.init({
    profileId: {

    },
    address: {

    },
    mobileNumber:{

    },
    chosenDiet: {

    },
    chosenBreed: {

    },
    chosenLifeStage: {

    }


})

export default UserProfileModel;