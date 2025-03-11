import bcrypt from "bcrypt";

const hasher = async (unhashedWord) => {
	try {
		const hashed = await bcrypt.hash(unhashedWord, 10);
		return hashed;
	} catch (error) {
		console.error("error hashing password:", error);
		throw error; 
	}
};

export default hasher;
